# LCAP rebuild — test report

## Scope
Static review of the updated portal and documentation on branch feat/lcap-portal-rebuild-2026-11.

## Reviewed
- [x] Five separate form flows are present: application, discovery, opportunity, weekly and feedback.
- [x] Client-side required fields and native validity checks are present.
- [x] Required consent checkboxes remain unchecked by default.
- [x] Application form has no CV upload or CV URL field.
- [x] Source/UTM metadata is collected.
- [x] All five forms are wired to the FormSubmit AJAX endpoint for the owner's inbox.
- [x] The client explicitly compares the provider's `success` value to the string `"true"`; it does not treat HTTP 200 alone as success.
- [x] Activation-required and transport/provider errors are shown without false success messaging.
- [x] Privacy notice discloses the external provider, destination email and provider's stated 30-day retention.
- [x] Required consent to external processing is requested on every form.
- [x] No provider API key or secret is committed.

## Not run / not verified
- [ ] Live submission from a published page.
- [ ] Email verification/activation by the inbox owner.
- [ ] Actual email delivery and spam-folder behavior.
- [ ] End-to-end tests for all five forms.
- [ ] Mobile, keyboard-only and WCAG 2.2 AA testing.
- [ ] Lighthouse / axe scores (not measured; no scores claimed).
- [ ] Provider abuse/rate-limit behavior and long-term deliverability.

## Release state
The front end is wired to the owner's email destination via FormSubmit, but public receipt is **not verified** until the inbox owner activates the address and completes the test submission. Do not claim successful operational intake until that test passes.

## Known limitations
- FormSubmit is a third-party processor. Its documentation says submissions are retained for 30 days.
- No Google Sheet/CRM is configured. Email is the current intake channel only.
- Automatic applicant confirmation is not enabled in the AJAX flow.
- Privacy review and an explicit internal retention/deletion process remain outstanding.
- The recipient email is referenced by the public front-end endpoint.
