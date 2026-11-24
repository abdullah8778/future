# Owner guide — LCAP portal

## What each route does
- application: prospective founding-cohort application.
- discovery: request a conversation before choosing a community/program path.
- opportunity: participant report of interview invitation, offer, rejection, withdrawal or stalled process.
- weekly: participant progress, blockers, time and confidence.
- feedback: satisfaction and improvement feedback.

## Operational flow
1. Keep the portal in preview until the activation checklist is complete.
2. Restrict the response spreadsheet to named operators only.
3. Review new application submissions and assign internal review ownership.
4. Contact applicants only within the scope of their consent.
5. Share participant opportunity reports with the assigned coach only through an approved restricted workflow.
6. Keep decisions and participant identifiers in the restricted operations system, never in public GitHub.
7. Do not reuse testimonial consent as permission to share data with employers.
8. Review retention and deletion requests under the approved privacy policy.

## Team-owned values
- Admin notification email: [SET BY TEAM]
- Privacy contact and retention period: [SET BY TEAM]
- Apps Script URL and Turnstile Site Key: [SET BY TEAM]
- Skool URL, calendar URL, program prices and start dates: [SET BY TEAM]
- Secure post-acceptance CV collection channel: [SET BY TEAM]

## Troubleshooting
- No submit action: check endpoint and Site Key placeholders.
- Turnstile fails: check widget hostname, Site Key/Secret pair and ALLOWED_HOSTNAME.
- No sheet row: inspect Apps Script execution logs and SPREADSHEET_ID permissions.
- No admin email: verify ADMIN_EMAIL, MailApp authorization and quotas.
- Browser reports CORS/JSON error: do not tell applicant it succeeded; test deployed Web App and use an endpoint with explicit CORS support if needed.

## Rollback
Hide/remove the public portal link, revert the branch changes through a reviewed PR or deploy the previous known-good revision, disable the Apps Script Web App if abuse is suspected, and preserve existing records according to retention policy.
