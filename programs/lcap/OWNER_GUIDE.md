# Owner guide — LCAP portal

## What each route does
- application: prospective founding-cohort application.
- discovery: request a conversation before choosing a community/program path.
- opportunity: participant report of interview invitation, offer, rejection, withdrawal or stalled process.
- weekly: participant progress, blockers, time and confidence.
- feedback: satisfaction and improvement feedback.

## Operational flow
1. Keep the portal in preview until the inbox owner activates the email endpoint and completes the test checklist.
2. The five forms currently route to FormSubmit, which forwards submissions to the program inbox.
3. Review new application submissions in the inbox and assign internal review ownership.
4. Contact applicants only within the scope of their consent.
5. Share participant opportunity reports with the assigned coach only through an approved restricted workflow.
6. Do not forward participant submissions to employers without separate explicit consent.
7. Review access, correction and deletion requests under the privacy notice.

## Current owner settings
- Admin inbox: Abdullah87a87@gmail.com
- Submission provider: FormSubmit (formsubmit.co)
- Provider-stated submission retention: 30 days
- Google Sheets / Apps Script: not active in this version
- Privacy contact: Abdullah87a87@gmail.com

## First activation
1. Submit one dummy test from the published page.
2. Open the verification message in the admin inbox.
3. Click **Activate Form**.
4. Submit a new dummy test and verify the full message arrives.
5. Check spam if the message is not in the inbox.

## Troubleshooting
- Activation requested: verify the address using the FormSubmit email.
- "Unable to submit" or provider error: review the visible form error, confirm page is served over HTTPS, and retry.
- No email after activation: inspect Spam, confirm the endpoint address in portal.html and check the provider's current status/docs.
- Do not claim the submission succeeded unless the AJAX reply explicitly reports success=true.

## Rollback
Disable the public portal link or revert the PR branch. The Apps Script backend is retained as an unused future option; it is not currently handling live submissions.
