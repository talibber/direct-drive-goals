# First-Client Go-Live Report

_Last updated: 2026-05-16_

This document tracks the controlled-beta acceptance of **Client #1**. Demo data
is preserved in the system; this report verifies real-client isolation and the
human-in-the-loop coaching flow.

---

## Pre-flight (automated)

| # | Check | Status |
|---|-------|--------|
| A | Migration applied: `is_demo`, `environment`, `client_type`, `pod_id` columns present on all client-data tables | ✅ |
| B | RLS: `applications` SELECT/UPDATE restricted to `is_staff(auth.uid())` | ✅ |
| C | RLS: `community_posts` scoped to owner / same pod / staff, demo hidden from real clients | ✅ |
| D | RLS: `community_comments` inherits parent post visibility | ✅ |
| E | RLS: `assessment_results` staff-only (no broad `true`) | ✅ |
| F | RLS: `audit_log` INSERT restricted to staff | ✅ |
| G | RLS: `coach_message_drafts` clients see only `status='sent'` AND `is_demo=false` | ✅ |
| H | RLS: `coaching_events`, `help_radar_items`, `commitment_breaches`, `direct_access_messages` exclude demo for non-staff | ✅ |
| I | Edge function `accept-application` deployed (staff-gated) | ✅ |
| J | Edge function `create-coaching-event` routes triggers to draft + queue | ✅ |
| K | `ClientDashboard` branches on `profile.client_type` — real clients see live data, never mock | ✅ |
| L | Admin `ClientTypeToggle` available for Real/Demo/All filtering | ✅ |
| M | Breach auto-charge disabled by default (`commitment_breaches.auto_charge_disabled = true`) | ✅ |

---

## 20-step manual go-live test script

Run these against the seeded Client #1 in production.

| # | Step | Route | DB record | Pass/Fail | Notes |
|---|------|-------|-----------|-----------|-------|
| 1 | Application submitted | `/apply` | `applications` row, status=pending | ☐ | |
| 2 | Admin can view application | `/coach/applications` | visible to staff | ☐ | |
| 3 | Non-staff cannot view application | n/a | RLS denies | ☐ | use second auth'd account |
| 4 | Client profile created | n/a | `profiles` row, `client_type='real'`, `is_demo=false` | ☐ | via `accept-application` |
| 5 | Payment marked active | `/billing` | `profiles.subscription_status='active'` | ☐ | Stripe Payment Link OK |
| 6 | Goal created for real client | `/coach/clients/:id` | `goals` row, `is_demo=false` | ☐ | |
| 7 | Client logs in and sees own real dashboard | `/dashboard` | live query results | ☐ | no mock visible |
| 8 | Client does not see demo users / data | `/dashboard`, `/community` | RLS + `is_demo` filters | ☐ | |
| 9 | Client submits check-in | `/dashboard/check-in` | `weekly_checkins` row | ☐ | |
| 10 | Check-in updates goal status | `/dashboard/goals` | `goals.status` changed | ☐ | |
| 11 | Mark goal at risk | coach action queue | `coaching_events` row, type=`goal_marked_at_risk` | ☐ | |
| 12 | Coach message draft appears | `/coach/review` | `coach_message_drafts`, status=pending | ☐ | |
| 13 | Coach approves message | `/coach/review` | status=sent, `audit_log` entry | ☐ | |
| 14 | Client sees approved message | `/dashboard` (Latest Message card) | visible | ☐ | |
| 15 | Client requests Help Radar | `/dashboard/help-radar` | `help_radar_items` row | ☐ | |
| 16 | Help Radar creates signal + draft | n/a | both rows created | ☐ | |
| 17 | Breach badge appears where applicable | `/dashboard/goals` | `BreachFeeBadge` rendered | ☐ | |
| 18 | Community does not expose cross-pod/demo data | `/community` | scoped query | ☐ | |
| 19 | Audit log records major events | `/coach/team` | rows visible to staff | ☐ | |
| 20 | Mobile dashboard / check-in at 375px | `/dashboard` | layout intact | ☐ | screenshot |

---

## Acceptance gate

Client #1 may go live when **all 20 manual checks pass** and the pre-flight
section remains green. Until then, beta is paused.

## What is intentionally NOT done

- Demo users have not been removed (per directive).
- No automatic stripe charges on breach; manual coach review only.
- No public-launch UI polish.
