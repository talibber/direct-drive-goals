# Terrible Coaching — Production Launch Readiness

Last updated: 2026-05-16

## What's in place

| Area | Status | Where |
|------|--------|-------|
| Tenant model (`tenants`, `tenant_id` on 18 tables, backfilled) | ✅ | migration `20260516-19xxxx` |
| Demo isolation (`is_demo`, `environment`, `client_type`) | ✅ | profiles + 11 client tables |
| Real-client dashboard | ✅ | `RealClientDashboard.tsx` + `useRealClient.ts` |
| Real signup + Google OAuth | ✅ | `/signup` (`SignupPage.tsx`) |
| Legal acceptance (ToS, Privacy, Disclaimer, Payment Auth) | ✅ | `/onboarding/legal` writes `legal_acceptances` |
| Goal → coaching event trigger (at_risk / missed) | ✅ | `tg_goal_status_event` |
| Check-in → coaching event trigger | ✅ | `tg_checkin_event` |
| Help Radar → coaching event trigger | ✅ | `tg_help_radar_event` |
| AI draft generator + review queue | ✅ | `generate-coach-draft`, `CoachReviewQueuePage` |
| Auto-send kill switch | ✅ | `system_settings.messaging_auto_send_enabled = false` |
| Breach lifecycle: candidate→approved→waived→charged→disputed | ✅ | `commitment_breaches.lifecycle_status` |
| Breach auto-charge disabled by default | ✅ | `auto_charge_disabled = true`, `breach_auto_charge_enabled = false` |
| Coach Command Center grid | ✅ | `CommandCenter.tsx` (mount on `CoachDashboard`) |
| Admin diagnostics page | ✅ | `/admin/diagnostics` |
| Production-readiness edge function | ✅ | `supabase/functions/production-readiness-check` |
| Demo / real client filter | ✅ | `ClientTypeToggle.tsx` |

## Domain plan

- Root: `terriblecoaching.com` → marketing (`HomePage`, `PricingPage`, `ApplyPage`, etc.)
- App: `app.terriblecoaching.com` → authenticated client + admin
- Admin: `app.terriblecoaching.com/coach/*` and `app.terriblecoaching.com/admin/diagnostics`

DNS (when ready):
```
A      @     185.158.133.1
A      www   185.158.133.1
A      app   185.158.133.1
TXT    _lovable    <verification token from Lovable>
```

Host-routing redirect is implemented in `src/lib/env.ts` behind `HOST_REDIRECT_ENABLED = false`. Flip to `true` after the `app.` record verifies.

## What is NOT yet wired (must do before charging real money)

1. **Payment provider** — neither Stripe nor Paddle is enabled. Run `payments--recommend_payment_provider` then enable the recommended provider, then add subscription + breach-fee charge code paths. Until then `payments_live_enabled` stays `false` and `BillingPage` shows a manual / contact flow.
2. **Email infra** — transactional emails (welcome, weekly summary, breach charge notice) require `setup_email_infra`.
3. **Multi-coach tenancy** — `tenant_id` is in place but every coach in `staff_members` currently sees all tenants. Add per-coach tenant scoping before onboarding a second coach.

## Test plan (acceptance)

| Test | How to verify |
|------|---------------|
| A. New real client | `/signup` → confirm email → `/onboarding/legal` → assessment → goals → appears in Command Center "New (7d)" |
| B. Goal at risk | Update a real goal `status = 'at_risk'` → check `coaching_events` for `goal_at_risk` row → draft generator inserts into `coach_message_drafts` with `status='pending'` → appears in Review Queue |
| C. Missed goal | Set goal `status = 'missed'` → event row `goal_missed` priority 1 → breach row created via `process-commitment-breaches` lands as `lifecycle_status='candidate'` → no charge until coach approves |
| D. Help Radar | Client opens radar item → event `help_radar_signal` → admin sees in radar tile → draft generated |
| E. Demo isolation | Demo client triggers any of the above → no real charge attempted, demo rows tagged `is_demo=true`, tenant=`demo` |
| F. Payment safety | `payments_live_enabled=false` → checkout path disabled, breach charges block at `lifecycle_status='approved'` and never advance to `charged` |

## Go / No-Go gate

- Diagnostics score ≥ 90 (currently expect ~91 with payments warning)
- All A–F tests pass
- Stripe/Paddle enabled OR explicit "no live charges this week" decision documented here
