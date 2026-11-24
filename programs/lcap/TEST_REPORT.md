# LCAP rebuild — test report

## Scope
Static review of the updated HTML, Apps Script source and documentation on branch feat/lcap-portal-rebuild-2026-11.

## Reviewed
- [x] Five distinct form definitions are present in portal.html.
- [x] Client-side required fields and native validity checks are present.
- [x] Consent checkboxes are unchecked by default and independent where applicable.
- [x] Application has no CV upload or CV URL field.
- [x] UTM/source metadata is collected.
- [x] Backend allow-lists five form types and validates required fields/consent.
- [x] Turnstile verification and optional hostname allow-list are implemented.
- [x] Response sheet stores timestamp, reference, type, email, JSON payload, source, consent and language.
- [x] Privacy draft and activation checklist exist.
- [x] No secrets or real endpoint values are committed.

## Not run / not verified
- [ ] Browser execution, mobile device test, keyboard-only test, WCAG 2.2 AA audit.
- [ ] HTML/JS automated linting and Google Apps Script runtime test.
- [ ] Turnstile verification against a real widget and production hostname.
- [ ] Google Sheet write and restricted-access verification.
- [ ] Admin and applicant email delivery.
- [ ] End-to-end CORS behavior from GitHub Pages to Apps Script.
- [ ] Lighthouse / axe scores (not measured; no scores claimed).
- [ ] Real spam/rate-limit behavior.

## Known deployment blocker
The endpoint and Site Key remain placeholders. Apps Script Script Properties, private spreadsheet, hostname allow-list, admin email, and deployment are not configured. The portal must not be advertised as accepting submissions until all activation checks pass.

## Technical caveat
Apps Script Web Apps can involve redirects and browser CORS behavior. The front end intentionally requires a readable JSON response and does not fall back to no-cors or display success on an opaque response. If cross-origin JSON cannot be read in the actual deployment, use a managed form/backend endpoint with explicit CORS support rather than claiming successful submission.
