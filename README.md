# AtomQuest Goal Portal

Dark, dependency-free demo portal for the AtomQuest Hackathon 1.0 problem statement: in-house goal setting, L1 approval, quarterly check-ins, reports, audit trail, shared KPIs and HR cycle control.

## Live Demo

- App: https://tanishka0509.github.io/atomquest-goal-portal/
- Source: https://github.com/TANISHKA0509/atomquest-goal-portal

## Run

Open `index.html` in a browser. The app stores demo data in browser `localStorage`; use **Reset demo** in the top bar to return to seeded data.

## Demo Users

Use the role cards on launch or the switcher in the top bar:

- Employee: Aarav Mehta, Mira Kapoor, Rohan Iyer
- Manager: Neha Rao
- Admin / HR: Isha Sen

## Judge Walkthrough

1. Open the live demo and choose **Employee**.
2. Submit Aarav Mehta's goal sheet after showing the validation summary.
3. Switch to **Manager L1**, open **Approvals**, edit a target or weightage, then approve.
4. Switch to **Admin / HR**, open Q1 from cycle settings or use **Demo progress** on the dashboard.
5. Show completion dashboard, report export, audit trail, escalation generation and unlock exception.

## Implemented BRD Coverage

- Employee goal sheet with thrust area, title, description, UoM, target and weightage
- Validation for total weightage = 100%, minimum goal weightage = 10%, maximum goals = 8
- L1 manager approval workflow with inline target and weightage edits
- Goal locking after approval and HR unlock exception flow
- Shared KPI push by manager with recipient weightage-only editing
- Primary owner achievement sync for linked shared KPIs
- Quarterly achievement capture with status and progress formula handling
- Manager check-in comments with focus, blockers and next steps
- Admin cycle window control for goal setting and quarterly check-ins
- Completion dashboard, analytics-style heatmap, manager effectiveness view
- Exportable CSV achievement report
- Audit trail and rule-based escalation log
- Interactive quarter tabs, searchable tables, sheet preview modal and toast feedback
- Demo progress generator for a quick presentation walkthrough

## Tech Stack and Cost

- Static HTML, CSS and JavaScript
- Browser `localStorage` for demo persistence
- GitHub Pages for free static hosting
- No paid APIs, no backend server, no external database and no secret keys

## Architecture

See `docs/architecture.svg` for the project diagram.

The solution is intentionally static to minimize storage and hosting cost. For production, the same client workflows can sit on top of a low-cost API and relational database with SSO integration.
