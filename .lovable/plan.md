# Terrible Coaching — Client-Facing Coaching Experience + Admin Automation Layer

This is a large multi-surface change. Below is the build plan grouped by area, with a final reliability/readiness score at the end.

---

## 1. Client-facing language scrub (CRITICAL)

Remove every client-visible occurrence of: AI, bot, automated, generated, assistant, model, machine learning, LLM, algorithm, draft, confidence score, tone match, system-generated.

Files to scrub:
- `src/components/home/PersonalizedFeedbackSection.tsx` (heading/body copy)
- `src/pages/HomePage.tsx`, `src/components/home/*` (audit)
- `src/pages/ClientMessagesPage.tsx`, `ClientDashboard.tsx`, `WeeklyCheckInPage.tsx`, `HelpRadarPage.tsx`, `GoalsPage.tsx`, `ResetSessionPage.tsx`, `BillingPage.tsx`
- `src/components/GoalCard.tsx`, `OnboardingChecklist.tsx`, `CoachActivityStrip.tsx`, `MissedGoalReportModal.tsx`

Replace with: Coach response / Your Coach / Terrible Coaching / Your next move / Coach note / Feedback / Follow-up.

Add a regression test (`src/test/no-ai-language.test.ts`) that greps the built client-facing folders for forbidden words.

## 2. Dashboard — "Your Next Move" module

New component `src/components/YourNextMove.tsx`:
- Computes top priority client action from: overdue proof, due check-in, unread coach reply, at-risk goal, revision-requested proof.
- Single card at top of `ClientDashboard.tsx` above StatCards.
- CTA: Submit Proof / Complete Check-In / Reply to Coach / Fix Goal / Review Feedback.
- Shows $75 stake badge when applicable.
- Rename `StatCard` "Breach Fees" → "Commitment Stakes" with tooltip.
- Add Performance Score explanation tooltip.

## 3. Goals — statuses + badge

- Extend goal `status` to support: active, on_track, at_risk, proof_due, pending_review, revision_requested, missed, verified (migration: alter enum / add CHECK).
- `GoalCard.tsx`: show category, due date, target metric, progress, proof status, status pill, `<BreachFeeBadge label="$75 at stake" />` whenever stake-eligible.

## 4. Weekly Check-In — per-goal connection

Rewrite `WeeklyCheckInPage.tsx` so for each active goal:
- progress %, proof submitted Y/N, what moved it, what blocked it, status (On Track/At Risk/Missed), help needed.
- Persist into `weekly_checkins.goal_statuses` JSONB.
- On At Risk / Missed: fire `generate-coach-draft` (already exists). All copy stays client-facing.

## 5. Help Radar — intervention engine

`HelpRadarPage.tsx`:
- Form fields: category, what's happening, urgency (L/M/H), response type (Direct Answer / Tough Love / Plan / Resource / Voice Note), tried, avoiding.
- Client statuses: Received / Reviewed / Response Sent / Follow-Up Scheduled / Resolved.
- Add `client_status` column to `help_radar_items` (separate from internal `coach_status`).
- On submit → call `evaluate-help-radar` (already creates draft).

## 6. Messages — sender identity scrub

`ClientMessagesPage.tsx`: render sender as "Your Coach" / coach display_name / "Terrible Coaching" only. Strip any draft/confidence metadata.

## 7. Admin Coach Approval Queue

Expand `src/pages/CoachReviewQueuePage.tsx` columns: Client, Trigger, Source, Drafted Response, Risk Level, Confidence %, Tone Match %, Suggested Follow-Up, Automation Eligibility, Approve / Edit / Reject / Send Now / Schedule Send / Learn From Edit / Save Template / Mark Reusable. Add "Response needed by" countdown + filters (Due in 10 min, Overdue, High risk, Ready, Needs edit).

## 8. Automation tiers + 14-day human-in-the-loop

New table `client_automation_settings` (migration):
- client_id, automation_level (0–4), per-message-type overrides JSONB, onboarded_at.

Edge function `auto-send-eligible-drafts`:
- Cron every minute.
- Picks drafts where status='pending', confidence ≥ threshold, not crisis_flag, client past 14-day HITL window, automation level allows trigger_type.
- Sends, marks `sent_at`, records outcome.

Update `generate-coach-draft` to set `automation_eligible` boolean + `risk_level` + `tone_match_score` (compare to coach_style_learning).

## 9. Safety escalation

In `generate-coach-draft`, regex/keyword scan input + AI output for: self-harm, abuse, medical, legal, substance, threats, distress, refund/chargeback/harassment/discrimination. If detected → status='needs_human_review', `risk_level='high'`, block auto-send. No client-visible flag.

## 10. Reset Session, Community, Content, Proof, Admin Analytics, Navigation

- `ResetSessionPage.tsx`: pattern_detected, likely_cause, reset_assignment, reflection, next_commitment fields (already mostly there — relabel + tighten copy).
- `CommunityPage.tsx`: post privacy (Public / Anonymous / Team) + post types (Win/Question/Reflection/Challenge/Perspective Request).
- `LibraryPage.tsx`: per-recommendation "Assigned because…" line tied to goal/help-radar/checkin.
- Proof statuses extended in `goal_proof_submissions.status` enum + client copy.
- `CoachMetricsPage.tsx`: add SLA tiles (avg response, % under 10min, % auto-send, % escalated, clients ready for higher tier).
- `DashboardLayout` nav: Dashboard / Goals / Check-In / Messages / Help Radar / Community / Content / Profile. Move Sessions/Reset/Operator/Direct Access/Billing into contextual cards.

## 11. Reliability score (final step)

After implementation run an automated audit script (`scripts/reliability-audit.ts`):
- Greps client folders for forbidden words (must be 0).
- Verifies all new tables/columns exist.
- Verifies edge functions deployed.
- Verifies cron jobs present.
- Verifies acceptance tests 1–15.
Outputs a 0–100 reliability score with category breakdown.

---

## Technical notes

- Migration consolidates: goal status enum extension, `help_radar_items.client_status`, `client_automation_settings` table, `coach_message_drafts.risk_level / tone_match_score / automation_eligible / scheduled_send_at / response_due_at` columns, `coach_message_templates.is_reusable / client_specific_for`, `community_posts.privacy / post_kind`.
- Cron: `auto-send-eligible-drafts` every minute via `pg_cron`.
- No client-visible mention of automation anywhere — enforced by test.

## Scope guard

This is ~25 files + 1 migration + 1 new edge function + 1 audit script. I'll batch by surface and run the reliability audit at the end before declaring rollout-ready.