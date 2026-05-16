## Human-in-the-Loop Coaching Intelligence System

Build a consequence-backed accountability engine where user events generate AI coaching drafts that require coach approval before sending, and the system learns from every edit.

### 1. Database schema (one migration)

Six new tables:

- `coaching_events` — every signal (goal status changes, check-ins, breaches, help-radar)
- `coach_message_drafts` — AI drafts with status `pending | approved | edited | rejected | sent | needs_human_review`, stores both `ai_draft` and `final_message`
- `coach_style_learning` — per-edit deltas (phrases added/removed, tone/pressure/encouragement/directness/humor scores)
- `user_coaching_profiles` — one row per user: preferred tone, blockers, reply rate, completion rate, breach/at-risk/missed counts, last engagement
- `message_learning_outcomes` — did user reply, did next action complete, status after
- `breach_review_queue` (extends existing `commitment_breaches` workflow) — `pending_review` flag added; nothing auto-charges

RLS: clients see only their own events/profiles; coaches see all. Standard `updated_at` triggers.

### 2. Edge functions

- `generate-coach-draft` — input: `{ user_id, goal_id?, event_type, payload }`. Loads user profile + recent coach style learnings + last 5 approved messages, calls Lovable AI (`google/gemini-3-flash-preview`) with a system prompt that encodes the Terrible Coaching voice + the tone framework for the given event type. Returns `{ draft, suggested_tone, confidence_score, requires_human_approval: true }`. Inserts a row into `coach_message_drafts` with status `pending`.
- `analyze-coach-edit` — input: `{ draft_id }`. Diffs `ai_draft` vs `final_message`, calls AI to score tone shifts and extract added/removed phrases, writes to `coach_style_learning`.
- `evaluate-help-radar` — runs on a schedule or on-demand per user: applies the trigger rules (at-risk, missed×2, 72h silence, repeated blocker, engagement drop) and emits `help_radar_triggered` events + drafts.
- `record-message-outcome` — called when a user replies or completes the next action; updates `message_learning_outcomes` and rolls up into `user_coaching_profiles`.

All gated by `verify_jwt = true` except outcome-recording which the client triggers.

### 3. Client changes

**Weekly check-in (`WeeklyCheckInPage.tsx`)**
- Replace the mock `goals` import with the user's real active goals.
- Each goal row gets a status select: `On Track | At Risk | Missed | Completed | Needs Help`.
- On submit: emit one `coaching_event` per goal + one `weekly_goals_submitted` event, then call `generate-coach-draft` for each non-trivial signal.

**$75 breach badge** — small reusable `<BreachFeeBadge />` component with tooltip ("Potential $75 breach fee applies…"). Drop into: missed check-in card, missed goal, missed commitment, breach review screen.

**Consent copy** — add the privacy paragraph to `OnboardingAssessmentPage`.

### 4. Coach screens

- **`/coach/review-queue`** (new) — list of pending drafts with: user, trigger, related goal, prior status, blocker, AI draft, confidence, suggested tone, engagement history. Buttons: Approve & Send · Edit · Reject · Save as Template · Mark Needs Human Review. Editing opens a textarea; on approve, calls `analyze-coach-edit` then marks `sent`.
- **`/coach/breaches`** (existing) — add the explicit "Breach Review Queue" framing; nothing charges without approval (already true).
- **`/coach/clients/:clientId`** — add a Coaching Profile tab: blockers, engagement trend, message history, preferred tone, AI-vs-coach diff samples.
- **`/coach/style-learning`** (new) — dashboard of common added/removed phrases and average tone scores; best/worst performing message types.

Add sidebar links: Review Queue, Style Learning.

### 5. Verification

After build, manually run through the 6 verification scenarios in the prompt (goal+check-in → events; at-risk → draft appears, doesn't auto-send; edit → learning row written; reply → outcome updates profile; missed check-in → $75 badge + breach queue; help radar → trigger fires).

### Out of scope for this pass

- Auto-sending any coaching message (explicitly forbidden by spec).
- Stripe charge wiring for breach fees (queue only).
- Scheduled cron for `evaluate-help-radar` — will expose as edge function the coach can trigger from the queue page; cron can come later.
- Crisis-detection NLP — will add a simple keyword guard that flags to `needs_human_review` and surfaces a crisis-resources note.

### Technical notes

- Reuses existing `goals`, `commitment_breaches`, `help_radar_items` tables — does not duplicate.
- All AI calls server-side via Lovable AI Gateway with `LOVABLE_API_KEY`.
- Style learning is coach-scoped (single coach for now, but `coach_id` column is there for future).
- Drafts store `confidence_score` from the model's self-report; low confidence auto-flags `needs_human_review`.

This is ~1 migration, 4 edge functions, ~6 new/modified pages, and ~3 new components. Ready to execute on your approval.