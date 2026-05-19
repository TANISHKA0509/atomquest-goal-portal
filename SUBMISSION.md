# AtomQuest Hackathon Submission Notes

## Project

AtomQuest Goal Portal: a web-based in-house goal setting and tracking portal for employees, managers and Admin / HR.

## Links

- Live demo: https://tanishka0509.github.io/atomquest-goal-portal/
- Source code: https://github.com/TANISHKA0509/atomquest-goal-portal
- Architecture diagram: `docs/architecture.svg`

## Demo Credentials

No password is required for the hackathon demo. Use the role cards or top role switcher:

- Employee: Aarav Mehta
- Manager L1: Neha Rao
- Admin / HR: Isha Sen

## Recommended Demo Flow

1. Employee creates and submits a goal sheet.
2. Manager reviews the submitted sheet, edits target or weightage inline and approves it.
3. Employee enters quarterly actual achievement and status.
4. Manager saves structured check-in notes.
5. Admin reviews completion dashboard, generates escalations, exports CSV and checks the audit trail.

## Requirement Mapping

- Phase 1: goal creation, validation, submission, approval, locking and shared goals.
- Phase 2: quarterly achievement capture, statuses, manager check-ins and progress scoring.
- Roles: employee, manager and Admin / HR are separated by views and actions.
- Governance: CSV report, completion dashboard, audit trail and HR unlock.
- Bonus: analytics-style heatmap, escalation log, searchable reports and guided demo mode.

## Safety and Cost

This is a static app hosted on GitHub Pages. It does not use paid APIs, cloud databases, server-side code, tracking scripts or secret credentials. Demo data is stored only in the visitor's own browser `localStorage`.
