# First-Client Beta Lane — Implementation Plan

## Goal
Safely accept Client #1 without removing demo data. Demo and real records coexist; clients only ever see their own real data; admins can toggle views.

## Phase 1 — Schema separation (migration)
Add to each relevant table:
- `is_demo boolean NOT NULL DEFAULT false`
- `environment text NOT NULL DEFAULT 'production'`
- `client_type text` on profiles only ('real' | 'demo')

Tables: `profiles`, `goals`, `weekly_checkins` (create if missing), `community_posts`, `community_comments`, `coach_message_drafts`, `commitment_breaches`, `help_radar_items`, `client_points`, `direct_access_messages`, `coaching_events`.

Add `pod_id uuid` to `profiles`, `community_posts`, `community_comments` (nullable; null = no pod yet).

## Phase 2 — RLS hardening
- `applications`: drop "Authenticated users can view/update"; replace with `is_staff(auth.uid())` only. Keep public INSERT.
- `community_posts` / `community_comments`: SELECT only if owner OR same pod OR staff. Comments inherit via parent post lookup (security definer fn `can_view_post(post_id)`).
- `assessment_results`: any `true` SELECT → `is_staff(auth.uid())` or `auth.uid() = client_id`.
- `audit_log`: already staff-only read; verify INSERT requires staff or service role.
- `coach_message_drafts`: clients only see `status = 'sent'` AND `is_demo = false`.
- All "real client" SELECT policies filter `is_demo = false` for non-staff.

## Phase 3 — Real client onboarding lane
- Extend `client_automation_settings` with `human_in_loop boolean`, `human_in_loop_start_date`, `human_in_loop_end_date`.
- Edge function `accept-application`: given application id, mark approved, create profile (`client_type='real'`, `is_demo=false`), seed automation settings with HITL 14 days.

## Phase 4 — Real Client Dashboard
Rewrite `ClientDashboard.tsx` to:
- Detect authenticated user.
- If `profile.client_type = 'demo'` OR no auth → keep current mock view (demo mode).
- If `client_type = 'real'`: query live goals, check-ins, breaches, help radar, latest approved message. Render empty states per spec. No mock imports in real path.
- Add `RecentCoachMessage` widget.

## Phase 5 — Coach admin toggle
Add filter on `CoachClientsPage` and `CoachActionQueuePage`: Real / Demo / All (default All). Filter applies `is_demo` on queries.

## Phase 6 — Goals / check-ins / Help Radar / breach for real client
- `weekly_checkins` table (create if not exists) with `client_id, goal_id, completion_status, notes, confidence_score, needs_help, submitted_at, is_demo`.
- `WeeklyCheckInPage` writes live for real clients.
- `HelpRadarPage` writes live signal + calls `create-coaching-event` (which already drafts message).
- Breach: `commitment_breaches.auto_charge_disabled` flag; `process-commitment-breaches` skips auto-charge when `is_demo=false AND first_client_beta=true` (settings row).

## Phase 7 — Message draft & approval
Already exists via `coach_message_drafts` + `CoachReviewQueuePage`. Verify:
- All triggers route through `create-coaching-event`.
- High-risk triggers force `automation_eligible=false`.
- On approve: insert into `messages`/`conversations`, write `audit_log`.

## Phase 8 — Payment path
Out of scope for code-gen now: document Stripe Payment Link option in report; add `profiles.subscription_status text`, `subscription_tier text`, `paid_at timestamptz`.

## Phase 9 — Verification
- `scripts/first-client-rls-tests.ts`: programmatic checks using two test JWTs (client A, client B, staff) hitting Supabase REST and asserting visibility.
- `scripts/reliability-audit.ts`: extend with demo-isolation checks (count of demo rows visible to non-staff = 0 expected via simulated query).
- Output reliability score (target ≥ 95).

## Phase 10 — Report
Create `first-client-go-live-report.md` with the 20-step test script template, pre-filled with what passed automatically.

## Technical notes
- Single migration file for all schema + RLS changes.
- `is_staff()` already exists.
- New SECURITY DEFINER fn `same_pod(_user uuid, _pod uuid)`.
- No removal of mock data; `src/lib/mockData.ts` remains but `ClientDashboard` branches on `client_type`.
- No changes to coach pages beyond admin toggle filter prop.

## Out of scope
- Actual Stripe checkout build (only schema fields + doc).
- Redesign of any page.
- Removing demo users.
