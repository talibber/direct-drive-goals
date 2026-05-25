# Production Launch Hardening

Strip demo/mock data, lock the app to real tenants only, and ensure every AI draft routes through the coach approval queue before reaching a client.

## 1. Database cleanup (migration)

Delete demo rows from every `is_demo` / demo-tenant scoped table:

- `profiles`, `goals`, `weekly_checkins`, `coach_message_drafts`, `coaching_events`, `help_radar_items`, `commitment_breaches`, `community_posts/comments/replies/likes`, `direct_access_messages`, `client_points`, `achievements`, `client_timeline_events`, `action_queue_items`.
- Delete the demo `tenants` row (`slug = 'demo'`) after children are cleared.
- Set `system_settings`:
  - `messaging_auto_send_enabled = false`
  - `breach_auto_charge_enabled = false`
- Add/confirm DB guard: trigger on `coach_message_drafts` blocking `status -> 'sent'` unless `approved_by IS NOT NULL` and `approved_at IS NOT NULL` (during launch).
- Disable the pg_cron job for `auto-send-eligible-drafts` (or make it a no-op via system setting check).

## 2. Backend / edge function changes

- `auto-send-eligible-drafts`: short-circuit when `system_settings.messaging_auto_send_enabled = false`. Always skip during launch.
- `generate-coach-draft`: force `status = 'pending'` (or `needs_human_review` for high/medium risk), never `automation_eligible = true` while the global kill switch is off. Refuse to run for `is_demo = true` users.
- Add coach-assignment scoping: ensure drafts/queries filter by `goals.coach_id = auth.uid()` (or staff super-admin).

## 3. Frontend purge

- Remove demo toggles: `ClientTypeToggle`, any "Demo / Sample / Mock" UI in dashboards, command center, coach pages.
- Strip `mockData.ts` usage from production routes; keep file only if used by tests, otherwise delete.
- Replace placeholder dashboards with real queries + clean empty states ("No clients yet", "No check-ins yet", "No pending approvals").
- Pages to audit: `ClientDashboard`, `CoachDashboard`, `CoachClientsPage`, `CoachReviewQueuePage`, `CoachActionQueuePage`, `CoachBreachesPage`, `HelpRadarPage`, `CommunityPage`, `GoalsPage`, `CommandCenter`.

## 4. Coach dashboard (real data only)

`CoachDashboard` shows live counts for the logged-in coach (or all if super-admin):

- Active clients, new clients (last 7d)
- Recent check-ins
- At-risk + missed goals
- Help Radar open items
- Pending AI approvals (`coach_message_drafts` where `status in ('pending','needs_human_review')`)
- Unread direct messages
- Breach fee candidates
- Payment issues

All queries scoped via `coach_id` / `is_staff` checks.

## 5. RLS / data safety audit

- Verify every client-data table has `auth.uid() = client_id/user_id` on SELECT.
- Add coach-assignment policy where missing: coach can read client rows only when `goals.coach_id = auth.uid()` or `is_staff(auth.uid())`.
- Confirm no policy uses `USING (true)` on PII tables.
- Run `supabase--linter` after migration.

## 6. Acceptance smoke test

After deploy, run a scripted check:
1. Create real client → assert appears in coach dashboard.
2. Add goal + check-in → assert counts update.
3. Mark goal `at_risk` → assert draft created with `status != 'sent'`.
4. Approve draft → assert it appears in client message history.
5. Sign in as Client B → assert cannot read Client A's goals.

## Technical notes

- Keep `is_demo` columns + demo tenant schema (don't drop) so we can re-enable internal staging later — just purge rows and hide UI.
- `staff_allowlist` for `tyronerayallen@gmail.com` stays as super-admin.
- No design changes. Functional + data-layer only.

## Out of scope

- Payment processor activation (Stripe/Paddle stay disabled).
- Adding new features beyond connecting existing ones to real data.
- Redesigning any UI.

Approve to proceed.
