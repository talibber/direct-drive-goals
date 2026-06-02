
# Phase 1 Production Hardening Plan

Minimum-safe set of changes to onboard a real paying client. No UI redesign. No removal of demo data.

---

## 1. Signup Gating (block dashboard until approved + paid)

**Problem:** `handle_new_user()` creates a `profiles` row with `coaching_track='life'` for every Google/email signup. Anyone who signs up lands in `/dashboard` and `useRealClient` treats them as a real client.

**Fix:**
- DB migration: alter `handle_new_user()` so new rows default to `subscription_status='unprovisioned'` and `client_type='real'` but **without** assuming approval. Match the auth email against `applications` table; if no `status='accepted'` application exists, set `subscription_status='unprovisioned'`. If accepted, set `pending_payment`.
- Add `ProtectedClientRoute` wrapper component that requires `profile.subscription_status IN ('active','trial')` OR `is_staff`. Otherwise redirect to `/onboarding/pending` (new lightweight page reusing existing "Almost there" copy) or `/apply` if no application.
- Wrap these routes in `App.tsx`: `/dashboard`, `/dashboard/*`, `/onboarding/assessment`.
- Add `ProtectedCoachRoute` requiring `is_staff(auth.uid())`. Wrap all `/coach/*` routes.
- Update `useRealClient.isReal` to also require `subscription_status IN ('active','trial')`.

## 2. Coach ↔ Client Assignment

**Problem:** `profiles` has no `coach_id`. `goals` has no `coach_id` (column exists actually — verified — but unenforced). Coach dashboard counts ALL real clients globally.

**Fix:**
- DB migration:
  - Add `profiles.coach_id uuid REFERENCES auth.users(id)` (nullable).
  - Backfill `coach_id` to `tyronerayallen@gmail.com`'s `user_id` for any existing real clients (single-coach launch).
  - Add SQL function `public.is_coach_of(_coach uuid, _client uuid)` SECURITY DEFINER.
  - Add trigger `tg_assign_default_coach` on profiles INSERT: if `coach_id` is null and exactly one staff coach exists, assign that coach.
  - Add trigger `tg_goal_inherit_coach` on goals INSERT: if `coach_id` null, copy from `profiles.coach_id`.
- Rewrite `CoachDashboard` queries to filter by `coach_id = auth.uid()` unless super-admin (`is_staff` with role='admin'). Use a subquery: `client_id IN (SELECT user_id FROM profiles WHERE coach_id = auth.uid())` for counts on goals/checkins/etc.

## 3. RLS Hardening

**Fix (single migration):**
- Replace `is_staff(auth.uid())` SELECT/UPDATE policies on client-data tables with `is_staff(auth.uid()) OR is_coach_of(auth.uid(), <client_id_col>)` so a coach only sees their own clients (super-admin keeps full access via `staff_members.role='admin'`).
  - Tables: `goals`, `weekly_checkins`, `help_radar_items`, `commitment_breaches`, `coach_message_drafts`, `direct_access_messages`, `coaching_events`, `goal_proof_submissions`, `client_points`, `achievements`, `client_timeline_events`, `action_queue_items`, `client_automation_settings`, `assessment_results`.
  - Update `has_role` to actually check `role` column (currently ignores `_role` arg — bug).
  - Add `super_admin` helper: `is_super_admin(uid) = has_role(uid, 'admin')`.
- Remove client INSERT on `coaching_events` (only service role + staff may write). Keep `commitment_breaches` and `help_radar_items` as-is (clients legitimately self-report help_radar; breaches stay staff-only — already are).
- `community_posts`: keep — already pod-scoped.
- `applications` INSERT by anon: keep but add minimal rate-limit note (TODO, no infra change).
- `community-photos` storage bucket: keep public for read but… (out of scope, log warning).

## 4. Password Reset

**Add:**
- `/login` page: "Forgot password?" link → opens dialog → `supabase.auth.resetPasswordForEmail(email, {redirectTo: origin+'/reset-password'})`.
- New `src/pages/ResetPasswordPage.tsx` + route `/reset-password`. Detects recovery session, lets user set new password via `supabase.auth.updateUser({password})`.

## 5. Payment Placeholder Path

**Problem:** `accept-application` already sets `pending_payment`. No checkout URL.

**Fix:**
- DB: add CHECK constraint on `profiles.subscription_status IN ('unprovisioned','pending_payment','active','trial','past_due','canceled')`.
- `BillingPage`: if `subscription_status='pending_payment'`, render a "Complete payment" panel with disabled "Pay now" button + TODO message ("Payment processor not yet activated — your coach will contact you with a checkout link"). No mock charging.
- `accept-application` edge function: ensure it never sets `active`. Leave existing `pending_payment` behavior.
- Add a clear `// TODO(payments)` block where Stripe webhook would flip `pending_payment → active`.

## 6. Mock Data Fence

**Fix:**
- Add `src/lib/env.ts` flag `IS_DEV_MOCK_ENABLED = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true'`.
- Add a runtime guard in `src/lib/mockData.ts` exports: wrap them with `if (!IS_DEV_MOCK_ENABLED && import.meta.env.PROD) throw new Error("mockData used in production")`. (Soft: console.error + return empty arrays, to avoid white-screening production.)
- Do not rewrite the 20 pages now — just neutralize mock data in production builds so a real client never sees fake content.

---

## Files / tables / functions / routes to be modified

**Migrations (single combined):**
- `handle_new_user()` rewrite
- new `is_coach_of()`, `is_super_admin()`; fix `has_role()`
- `profiles`: add `coach_id`, CHECK on `subscription_status`, default trigger
- `goals`: trigger to inherit `coach_id`
- RLS replacements on 14 tables listed above
- Remove client INSERT policy on `coaching_events`
- Backfill `coach_id` for existing real clients to admin

**New files:**
- `src/components/ProtectedClientRoute.tsx`
- `src/components/ProtectedCoachRoute.tsx`
- `src/pages/ResetPasswordPage.tsx`
- `src/pages/OnboardingPendingPage.tsx`

**Modified:**
- `src/App.tsx` (wrap routes + add /reset-password)
- `src/hooks/useRealClient.ts` (require active/trial)
- `src/pages/LoginPage.tsx` (Forgot password)
- `src/pages/CoachDashboard.tsx` (scope to coach_id)
- `src/pages/BillingPage.tsx` (pending_payment panel)
- `src/lib/mockData.ts` (production guard)
- `supabase/functions/accept-application/index.ts` (verify only `pending_payment`)

**Not changing:** UI design, demo tenant, mockData call sites (just gated), Stripe integration code (placeholder only), the 20 pages still importing mockData (out of scope per user).

## Acceptance tests I will run after coding

1. Manual SQL: insert fake auth user → profile gets `unprovisioned` → `useRealClient.isReal=false`.
2. `ProtectedClientRoute` redirects unapproved to `/onboarding/pending`.
3. `ProtectedCoachRoute` redirects non-staff to `/login`.
4. Run `supabase--linter` and confirm no new criticals.
5. Confirm `is_coach_of` scopes goals SELECT correctly via SQL.
6. /reset-password renders and updates password (smoke).
