# Production Launch Plan — Terrible Coaching

Most of the foundation already exists from the First-Client Beta Lane work: `is_demo` / `environment` / `client_type` flags on all client-data tables, `coach_message_drafts` approval flow, `commitment_breaches.auto_charge_disabled = true`, `accept-application` edge function, `RealClientDashboard`, `ClientTypeToggle`, `CoachActionQueuePage`, and the 20-step go-live report. This plan **extends** that work to meet the new production requirements without rebuilding what already works.

## 1. Tenants (multi-tenant data safety)

Today there is no `tenant_id`. For a single-coach business, the implicit tenant = the coaching practice itself, but we add an explicit model so the next coach onboarded does not break isolation.

Migration:
- New table `tenants (id, name, slug, is_demo, created_at)`.
- Seed two rows: `production` (is_demo=false) and `demo` (is_demo=true).
- Add nullable `tenant_id uuid` to: `profiles`, `goals`, `weekly_checkins`, `coach_message_drafts`, `commitment_breaches`, `help_radar_items`, `coaching_events`, `direct_access_messages`, `community_posts`, `community_comments`, `client_points`, `coach_activity`, `client_timeline_events`, `action_queue_items`, `goal_proof_submissions`, `content_assignments`, `conversations`, `messages`.
- Backfill: rows with `is_demo=true` → demo tenant; everything else → production tenant.
- Add `current_tenant(_user uuid)` SECURITY DEFINER helper that reads `profiles.tenant_id`.
- Tighten RLS: for every above table, non-staff SELECT requires `tenant_id = current_tenant(auth.uid())` AND existing user/pod checks. Staff retain full visibility.
- Index `(tenant_id)` on each table.

## 2. Demo isolation hardening

- `process-commitment-breaches` edge function: short-circuit when `is_demo=true OR auto_charge_disabled=true`. Log skip reason.
- `auto-send-eligible-drafts`: skip when `is_demo=true` AND when global flag `messaging_auto_send_enabled=false` (new `system_settings` table — see §8).
- `ClientTypeToggle` already exists; wire it into `CoachClientsPage`, `CoachActionQueuePage`, `CoachReviewQueuePage`, `CoachBreachesPage`. Default = "Real Clients" in production.

## 3. Real user onboarding

Add a single missing piece: post-application self-signup flow.
- New page `/signup` (email/password + Google) — only enabled after application is `approved`.
- `accept-application` edge function (exists) sets `profiles.client_type='real'`, `tenant_id=production`, `is_demo=false`, HITL 14-day window.
- New `/onboarding/legal` page: 4 required checkboxes (ToS, Privacy, Coaching Disclaimer, Payment Authorization) → writes `legal_acceptances` table (user_id, doc, version, accepted_at).
- Existing `/onboarding/assessment` runs next, then `/dashboard/goals` for initial goals, then `/dashboard/billing` for payment.
- `RealClientDashboard` already shows the live state.

## 4. Goal → check-in → draft connectivity

Already wired via `create-coaching-event` + `generate-coach-draft`. Verify and add what's missing:
- DB trigger `trg_goal_status_to_event` on `goals`: when status flips to `at_risk` or `missed` AND `is_demo=false`, insert into `coaching_events` (event_type='goal_at_risk' or 'goal_missed', priority=2 or 1).
- DB trigger `trg_weekly_checkin_to_event` on `weekly_checkins`: on insert, evaluate against linked goal and emit event if behind target.
- DB trigger `trg_help_radar_to_event` on `help_radar_items`: on insert emit `help_radar_signal` event.
- Edge function `on-coaching-event` (new) invoked by webhook → calls `generate-coach-draft` → inserts row in `coach_message_drafts` with `automation_eligible=false`, `status='pending'`, `source_event_id` set. (Cron fallback every 5 min for missed webhooks.)
- Every draft carries `event_id` so review queue can show source.

## 5. Human-in-the-loop messaging

Already implemented in `CoachReviewQueuePage`. Add:
- Global kill switch: `system_settings.messaging_auto_send_enabled` (default false). `auto-send-eligible-drafts` respects it.
- "Regenerate" button on each draft → calls `generate-coach-draft` again, replaces `ai_draft`, sets `status='pending'`, increments `regeneration_count` (new column).
- On approve+send: write `audit_log` row (action='message_sent', actor=coach, before=ai_draft, after=final_message). Already partially done; ensure consistent.
- `analyze-coach-edit` already feeds `coach_style_learning`.

## 6. Breach fee safety

- Add `commitment_breaches.status text` enum-checked to: `candidate | approved | waived | charged | disputed`. Backfill from `decision`/`charged`/`waived`.
- New page `CoachBreachesPage` (exists) — extend with Approve / Waive / Mark Disputed buttons; approve flips `status='approved'` but does NOT charge. Separate "Charge Approved Breaches" button (admin-only, disabled until Stripe wired) flips to `charged`.
- `$75` indicator already in `BreachFeeBadge.tsx`; ensure surfaced on goal cards with stake>0.
- Demo + auto_charge_disabled both block charge path.
- Application form already collects `breach_terms_agreed` etc.

## 7. Admin Command Center

Extend existing `CoachDashboard` into a single command center grid with these widgets (queries already feasible from current schema):
- New Clients (last 7d, client_type='real')
- Active Clients count + Demo Clients count (toggle)
- Pending Message Approvals (`coach_message_drafts` status in pending/needs_human_review)
- At-Risk Goals / Missed Goals
- Help Radar Alerts (open)
- Breach Candidates (status='candidate')
- Unread Client Messages (`messages` where sender_role='client' AND read_at null)
- Failed Payments (placeholder until Stripe — empty state)
- Inactive Clients (no `coaching_events` in 7d)
- Recent Check-Ins (last 10)
- Manual override quick links to Action Queue, Review Queue, Breaches, Team Settings.

## 8. Production readiness diagnostics

New page `/admin/diagnostics` + edge function `production-readiness-check`:
- Checks: auth session present, DB ping, can create test profile (rolled back), tenant isolation query returns 0 cross-tenant rows, demo isolation (no real user has is_demo rows), messaging queue accessible, approval flow writable, goal trigger fires (synthetic), payment provider configured (will report "Not Configured" — acceptable for beta), legal docs present in `legal_pages`, required env vars set, no orphaned routes.
- Returns JSON {check, status: pass|warn|fail, detail}. Page renders as checklist with score.
- `system_settings` table holds: `messaging_auto_send_enabled`, `breach_auto_charge_enabled`, `payments_live_enabled`, `environment_label`.

## 9. Environment & domain readiness

Code-side only (DNS is user's job, already documented):
- `src/lib/env.ts`: helper `isAppHost()` returning true if hostname starts with `app.`. Marketing routes redirect to root domain when on app host; app routes redirect to app subdomain when on root. Behind feature flag (default off until DNS ready).
- README section: DNS for `@`, `www`, `app` per Lovable custom-domain docs.
- Audit `<a>` and `<Link>` for hardcoded preview URLs (search `lovableproject.com`, `lovable.app`).
- Mobile sanity: `CoachLayout` and `DashboardLayout` already responsive; verify viewport meta + no fixed-px overflow on `/admin/diagnostics`.

## 10. Acceptance tests

Add `scripts/acceptance-tests.ts` (Deno + service role) covering Tests A–F from the prompt. Each test creates an isolated user via admin API, runs the flow, asserts DB state, then deletes the user. Output: pass/fail table + reliability score. Extend `reliability-audit.ts` to invoke it.

## Files to create / change

**Migrations (one file):**
- `tenants`, `legal_acceptances`, `system_settings` tables; `tenant_id` columns + backfill; `regeneration_count` on drafts; `status` text on breaches; `current_tenant()` fn; goal/check-in/help-radar triggers; tightened RLS.

**Edge functions:**
- `on-coaching-event` (new) — webhook to draft generator
- `production-readiness-check` (new)
- `accept-application` (extend: set tenant_id)
- `process-commitment-breaches` (extend: respect status='approved' only)
- `auto-send-eligible-drafts` (extend: respect kill switch)

**Pages:**
- `/signup` (new)
- `/onboarding/legal` (new)
- `/admin/diagnostics` (new)
- `CoachDashboard` (extend with command-center grid)
- `CoachBreachesPage` (extend status workflow)
- Wire `ClientTypeToggle` into clients/action-queue/review-queue/breaches

**Scripts:**
- `scripts/acceptance-tests.ts` (new)
- `scripts/reliability-audit.ts` (extend)

**Misc:**
- `src/lib/env.ts` host helpers
- README DNS section
- Replace any `lovableproject.com` links found

## Out of scope (call out explicitly)

- Stripe checkout & subscription — payment provider not yet enabled. Diagnostics will report `payments_live_enabled=false`. Recommend running `payments--recommend_payment_provider` as the immediate next step after this plan ships.
- True multi-coach tenant per-subdomain routing — `tenant_id` is in place but resolver is single-tenant.
- Email infra (transactional sends) — not requested.

## Reliability target

After implementation, `scripts/reliability-audit.ts` + acceptance tests must report ≥ 95/100 with all of Tests A–F passing for the build to be considered launch-ready.
