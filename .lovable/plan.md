# Coach/Admin Operating System — Full Install Plan

This is a large multi-surface build. Below is the grouped plan. End state: a coaching operating system with a single Action Queue, unified Client Command Center, response workspace, stakes review, style learning, team roles + audit, and a reliability audit script that verifies every item before rollout. No client-facing language changes break the forbidden-words rule.

---

## 1. Database (single consolidated migration)

New tables:
- `coaching_events` — already exists; extend with `risk_level`, `priority`, `assigned_owner`, `internal_due_at`, `status`, `suggested_action`, `admin_notes`, `client_visible` bool.
- `action_queue_items` — unified queue. Columns: id, client_id, source_type (goal/checkin/help_radar/direct_access/proof/stake/application/message/onboarding), source_id, trigger, risk_level (low/medium/high), priority (1–5), assigned_owner, internal_due_at, status (open/in_progress/resolved/escalated), suggested_response_draft_id, context_summary jsonb, resolved_at, created_at.
- `client_timeline_events` — id, client_id, kind, source_type, source_id, owner_id, internal_note, client_facing_note, occurred_at.
- `client_pattern_profiles` — extends `user_coaching_profiles` w/ best/worst messages jsonb, avoidance_patterns, sensitive_topics, proof_quality_history, words_that_work, words_that_disengage.
- `team_members` + `app_role` enum (owner, lead_coach, assistant_coach, client_success, billing_admin, viewer) + `has_role()` security definer fn.
- `team_permissions` — role -> permission map (view_clients, send_messages, approve_responses, edit_responses, view_billing, approve_charges, waive_charges, edit_goals, review_proof, change_automation, access_style_learning, manage_applications, manage_programs, view_metrics).
- `audit_log` — actor_id, action, entity_type, entity_id, before jsonb, after jsonb, occurred_at.
- `style_phrase_bank` — coach_id, kind (use_more/avoid/signature/opening/closing/banned), phrase, client_id nullable.
- `response_target_settings` — track, message_type, priority, internal_target_minutes.
- `client_send_status` — extends `client_automation_settings` w/ status enum (human_review_required, first_14_days, low_risk_sending, pattern_sending, mature_automation, paused, high_risk_manual_only), per-message-type overrides.

Extensions:
- `goal_proof_submissions.status` — add: submitted, verified, weak_proof, incomplete, late, needs_revision, rejected.
- `commitment_breaches` — add: decision (pending/approved/waived/disputed), evidence jsonb, charge_scheduled_at, charge_completed_at, suggested_decision.
- `help_radar_items.assigned_owner`, `follow_up_at`.

Replace `USING (true)` policies on coach/admin tables with `has_role()` checks. Keep client policies on `auth.uid()`.

Cron:
- `populate-action-queue` every 2 min — sweeps overdue check-ins, due proofs, inactive clients, first-14-day items, stake candidates, and inserts queue rows.
- `auto-send-eligible-drafts` (already exists) — keep; respect new `client_send_status`.

## 2. Backend / Edge Functions

- `create-coaching-event` — single entry point. Every client write (check-in, goal status change, help radar, direct access, proof, message, stake trigger, application, program submission) calls this. Writes coaching_events + timeline + queue + triggers `generate-coach-draft` when response needed.
- Update `generate-coach-draft` — write `action_queue_items` row with `suggested_response_draft_id`. Respect `client_send_status` + `response_target_settings` for `internal_due_at`.
- `resolve-queue-item` — approve/edit/send/assign/escalate/schedule. Writes audit_log.
- `proof-decision` — verify/revision/reject; sends coach-facing client message.
- `stake-decision` — approve/waive/dispute; writes audit_log; never charges without `team_permissions.approve_charges`.
- `assign-queue-item` — owner reassignment + audit.
- `import-coaching-messages` — paste/upload past messages, extract phrases, write to `style_phrase_bank` and `coach_style_learning`.
- `client-pattern-update` — recompute pattern profile on every event (debounced).

## 3. Coach Navigation (CoachLayout.tsx)

Grouped sections:
- Command: Overview, Action Queue, Messages, Clients
- Programs: Direct Access, Operator Call, Achievement Group, Weekly Q&A
- Operations: Applications, Commitment Stakes, Metrics, Style Learning, Team & Settings

Rename `Review Queue` → `Action Queue`. Rename `Breach Fees` → `Commitment Stakes`. Add `Team & Settings` route.

## 4. Coach Action Queue (CoachActionQueuePage)

Replaces `CoachReviewQueuePage`. Reads from `action_queue_items` joined w/ client, draft, source. Columns: Client, Track, Trigger, Priority, Risk, Time since, Internal target countdown, Owner, Suggested action, Suggested response preview, Send status, Actions (Approve / Edit / Send / Assign / Schedule / Resolve / Escalate). Filters: All / Due soon / Overdue / High Risk / First 14 Days / Needs Review / Ready to Send / Waiting on Client / Waiting on Proof / Waiting on Coach / Assigned to Me / Unassigned / Resolved. Sort: high-risk → first-14-day → at-risk → overdue → others.

## 5. Client Command Center (CoachClientDetailPage rewrite)

Tabs: Snapshot, Goals, Check-Ins, Messages, Help Radar, Direct Access, Proof, Notes, Pattern Profile, Commitment Stakes, Timeline.
Snapshot card shows all 20 required fields incl. send status, first-14-day badge, risk score, next best action, owner.
Timeline tab reads `client_timeline_events` chronological.
Pattern Profile reads `client_pattern_profiles` (admin-only).

## 6. Coach Messages Workspace (CoachMessagesPage rewrite)

3-pane: thread (center) | client context sidebar (right) | composer (bottom). Sidebar shows all required context fields. Composer actions: Suggested response, Rewrite stronger/shorter/more direct, Add tough love/plan/encouragement, Voice note, Save as style example, Save as client-specific pattern, Schedule send, Send now, Assign for review. None of sidebar/composer metadata reaches the client message payload.

## 7. Proof, Stakes, Help Radar, Direct Access, Programs

- Proof review modal supports 7 statuses + revision message + stake review trigger + internal note.
- CoachBreachesPage → Commitment Stakes with full lifecycle UI (Pending review/Pending $/Approved/Waived/Disputed/Resolved/Failed/Scheduled/Completed). Approval gated by `team_permissions.approve_charges`.
- HelpRadarPage admin view adds owner, follow-up date, suggested response link to queue.
- Direct Access, Operator Call, Achievement Group, Weekly Q&A — each submission triggers `create-coaching-event` and adds timeline + queue entries where needed.

## 8. Style Learning (CoachStyleLearningPage upgrade)

Sections: Voice Profile sliders, Phrase Bank (use_more/avoid/signature/openings/closings/banned), Draft Learning diff viewer (save global / client-specific / reusable), Training Import paste/upload, Quality Scoring panel (admin-only confidence/tone/risk/eligibility).

## 9. Team & Settings (new page)

Members table w/ role assignment, permission matrix viewer, response target settings (per track/message type/priority), audit log viewer w/ filters.

## 10. Overview Dashboard (CoachDashboard rewrite)

Top cards (real queries): Items needing attention, Rapid-response items, Overdue internal, High risk, First 14 days, At risk, Proof pending, Stakes pending, Applications pending, Eligible for higher automation. Sections: Urgent Action Queue (top 10), Clients Needing Attention, New Clients Onboarding, Pending Proof, Pending Stakes, Recent Wins, System Performance.

## 11. Metrics Page upgrade

Add: avg response time, internal target hit rate, human approval rate, eligible send rate, escalation rate, check-in/goal/proof completion rates, missed commitment rate, stake $ + waiver rate, risk distribution, 7-day inactive count, track comparison, per-team-member perf, churn risk.

## 12. Client-facing scrub + language

- Sweep all `src/pages/{Client*,Home,Goals,WeeklyCheckIn,HelpRadar,DirectAccess,ResetSession,Billing,Community,Library,Profile}.tsx` and `src/components/home/*`, `GoalCard`, `BreachFeeBadge`, `OnboardingChecklist`, `YourNextMove`, `MissedGoalReportModal`, `CoachActivityStrip` for forbidden words: AI, bot, automated, generated, model, LLM, machine learning, algorithm, assistant, auto-response, system-generated, draft, confidence score, tone match.
- Replace with: Your Coach / Terrible Coaching / Assigned coach / Coach response / Your next move / Feedback / Coach note / Follow-up.
- Remove any "10-minute response" client-facing copy. Replace with "Your coach will review this." / "We'll follow up." / "Your response has been received."
- Help Radar client statuses: Received / Reviewed / Response Sent / Follow-Up Scheduled / Resolved.
- Proof client messages set to required phrasing.

## 13. Empty states

Set required copy for Action Queue, Applications, Stakes, Style Learning, Messages empty states.

## 14. Audit log

Every approve/edit/send/assign/waive/charge/reassign/permission-change call writes to `audit_log` w/ before/after. Surfaced in Team & Settings.

## 15. Reliability audit (final step)

`scripts/reliability-audit.ts` runs:
1. Grep client-facing folders for forbidden words → must be 0.
2. Verify tables: action_queue_items, client_timeline_events, team_members, team_permissions, audit_log, style_phrase_bank, response_target_settings, client_send_status. Verify columns added to goal_proof_submissions, commitment_breaches, help_radar_items, coaching_events.
3. Verify cron jobs: `populate-action-queue`, `auto-send-eligible-drafts`.
4. Verify edge functions deployed: create-coaching-event, resolve-queue-item, proof-decision, stake-decision, assign-queue-item, import-coaching-messages, client-pattern-update, generate-coach-draft, auto-send-eligible-drafts, evaluate-help-radar, record-message-outcome, analyze-coach-edit, process-commitment-breaches.
5. Execute the 22 acceptance tests (synthetic events → assert queue + timeline + draft + status + permission + audit row).
6. Verify no RLS policy on coach/admin tables still uses `USING (true)` for write actions; must use `has_role()`.
7. Output a 0–100 score broken down by: Schema (15), Edge Functions (15), Action Queue (10), Client Command Center (10), Messages workspace (10), Stakes/Proof (10), Style Learning (5), Team/Audit (10), Language scrub (10), Acceptance tests (5). Print PASS/FAIL per item.

Target ≥ 95/100 = ready to rollout. Below 95 = list blockers and stop.

---

## Scope estimate

- 1 consolidated migration (large)
- ~10 edge functions (3 new, 4 updated)
- ~18 frontend files (1 new nav, 1 new page CoachActionQueuePage, 1 new TeamSettingsPage, rewrites of CoachClientDetailPage / CoachMessagesPage / CoachDashboard / CoachBreachesPage / CoachStyleLearningPage / CoachMetricsPage, scrub across ~12 client files)
- 1 reliability audit script

I'll batch by layer (migration → functions → admin UI → client scrub → audit) and run the reliability audit at the end before declaring rollout-ready.
