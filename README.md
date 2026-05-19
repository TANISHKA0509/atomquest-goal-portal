# AtomQuest Goal Portal

AtomQuest Goal Portal is a browser-based goal setting and tracking system for employees, managers, and Admin / HR teams. It supports the complete goal lifecycle: goal creation, approval, locking, quarterly achievement updates, check-ins, reporting, and audit tracking.

## Live Demo

- Live app: https://tanishka0509.github.io/atomquest-goal-portal/
- Source code: https://github.com/TANISHKA0509/atomquest-goal-portal

## Overview

Many teams track goals through spreadsheets, emails, and manual review cycles. This portal brings the process into one structured interface so that employees can submit goals, managers can review progress, and HR can monitor completion and governance.

The project is built as a lightweight static web app, which makes it easy to run, host, and present without any backend setup.

## Features

- Employee goal sheet creation
- Thrust area, goal title, description, UoM, target, and weightage fields
- Validation for total weightage, minimum individual weightage, and maximum goal count
- Manager approval workflow with inline target and weightage editing
- Goal locking after approval
- Admin / HR unlock flow for exception handling
- Shared KPI creation for multiple employees
- Primary owner achievement sync for shared goals
- Quarterly achievement capture for Q1, Q2, Q3, and Q4
- Goal status tracking: Not Started, On Track, Completed
- Progress score calculation based on UoM type
- Manager check-in comments with focus, blockers, and next steps
- Admin completion dashboard
- Escalation log
- Audit trail for important changes
- CSV achievement report export
- Searchable team and report screens
- Role-based demo entry for Employee, Manager, and Admin / HR

## Roles

### Employee

Employees can create goal sheets, update goals before submission, submit goals for approval, and add quarterly achievement updates after approval.

### Manager

Managers can view team goal sheets, edit target or weightage during review, approve goals, return sheets for rework, create shared KPIs, and record quarterly check-in notes.

### Admin / HR

Admin / HR users can manage active cycles, monitor completion, generate escalations, unlock approved goal sheets when needed, review audit logs, and export reports.

## Demo Users

Use the role cards on the first screen or the role switcher in the top bar.

| Role | Demo User |
| --- | --- |
| Employee | Aarav Mehta |
| Employee | Mira Kapoor |
| Employee | Rohan Iyer |
| Manager | Neha Rao |
| Admin / HR | Isha Sen |

## Suggested Demo Flow

1. Open the app and choose **Employee**.
2. Review the goal sheet and submit it for manager approval.
3. Switch to **Manager** and open the approval screen.
4. Edit a target or weightage, then approve or return the sheet.
5. Switch to **Admin / HR** and review the completion dashboard.
6. Use **Demo progress** to populate quarterly progress for presentation.
7. Open reports, export CSV, review audit logs, and check escalation records.

## Validation Rules

The goal sheet applies these rules:

- Total weightage across all goals must be exactly `100%`
- Each goal must have at least `10%` weightage
- Each employee can have a maximum of `8` goals
- Approved goal sheets are locked from normal editing
- Shared KPI recipients can adjust weightage only

## Progress Score Logic

| UoM Type | Rule |
| --- | --- |
| Numeric / % higher is better | Achievement divided by target |
| Numeric / % lower is better | Target divided by achievement |
| Timeline | Completed on or before deadline gives full progress |
| Zero-based | `0` achievement gives full progress, any other value gives `0%` |

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser localStorage
- GitHub Pages

## Cost and Safety

This project does not use paid APIs, cloud databases, backend servers, analytics scripts, or secret keys.

All demo data is stored in the visitor's own browser using `localStorage`. Data entered by one visitor is not sent to a server and is not visible to other visitors.

## Project Structure

```text
AtomQuest_GoalPortal/
├── index.html
├── styles.css
├── app.js
├── README.md
├── SUBMISSION.md
└── docs/
    └── architecture.svg
```

## Run Locally

Open `index.html` directly in a browser.

No installation is required.

## Architecture

The architecture diagram is available at:

```text
docs/architecture.svg
```

The current version is intentionally static for simple hosting and low cost. A production version can extend the same workflows with authentication, a backend API, a relational database, email notifications, and organization hierarchy sync.
