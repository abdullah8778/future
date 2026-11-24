# Changelog — PMC LCAP portal rebuild

## 2026-11-24 — Feature branch
- Rebuilt portal visual system around PMC navy/red/paper palette, Tajawal and IBM Plex Mono, RTL and responsive layout.
- Replaced legacy seven-form tabs with five distinct journeys: application, discovery, opportunity, weekly, feedback.
- Added independent consent flags, source/UTM metadata, no-CV-first-stage warning, and privacy navigation.
- Added Arabic privacy notice draft with explicit team placeholders.
- Reworked Apps Script intake around allow-listed form schemas, required-field checks, consent checks, Turnstile validation and normalized sheet rows.
- Added activation notes, deployment tradeoffs, test checklist and rollback notes.
- No secrets, credentials, live endpoint, Skool URL, calendar URL, admin email, pricing or legal claims were added.
- No live form submission or Apps Script deployment was performed.


## 2026-11-24 — Email intake wiring
- Routed all five portal forms to the specified PMC administration inbox through FormSubmit AJAX.
- Added explicit user consent for external email processing and disclosed the service's 30-day stated submission retention in the privacy notice.
- Added provider activation instructions and truthful AJAX success/error handling; no success is shown for a provider rejection or activation request.
- Google Sheets and Apps Script are retained as future alternatives, not active in the current portal.
- Static JavaScript syntax check passed; live provider activation and inbox delivery remain unverified.
