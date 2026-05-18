(function () {
  "use strict";

  const STORAGE_KEY = "atomquest-goal-portal-v1";
  const app = document.getElementById("app");

  const periods = [
    {
      id: "goal",
      label: "Phase 1 - Goal Setting",
      window: "Opens 1 May",
      action: "Goal creation, submission and approval",
      type: "goal",
    },
    {
      id: "Q1",
      label: "Q1 Check-in",
      window: "July",
      action: "Progress update - planned vs actual",
      type: "checkin",
    },
    {
      id: "Q2",
      label: "Q2 Check-in",
      window: "October",
      action: "Progress update - planned vs actual",
      type: "checkin",
    },
    {
      id: "Q3",
      label: "Q3 Check-in",
      window: "January",
      action: "Progress update - planned vs actual",
      type: "checkin",
    },
    {
      id: "Q4",
      label: "Q4 / Annual",
      window: "March / April",
      action: "Final achievement capture",
      type: "checkin",
    },
  ];

  const thrustAreas = [
    "Customer Delivery",
    "Operational Excellence",
    "People Development",
    "Quality and Compliance",
    "Cost Optimisation",
    "Innovation",
  ];

  const uomTypes = {
    minNumber: {
      label: "Numeric - higher is better",
      inputType: "number",
      short: "Min numeric",
    },
    maxNumber: {
      label: "Numeric - lower is better",
      inputType: "number",
      short: "Max numeric",
    },
    minPercent: {
      label: "% - higher is better",
      inputType: "number",
      short: "Min %",
    },
    maxPercent: {
      label: "% - lower is better",
      inputType: "number",
      short: "Max %",
    },
    timeline: {
      label: "Timeline",
      inputType: "date",
      short: "Timeline",
    },
    zero: {
      label: "Zero-based",
      inputType: "number",
      short: "Zero",
    },
  };

  const navByRole = {
    Employee: [
      ["goals", "Goal Sheet"],
      ["checkins", "Quarterly Updates"],
      ["activity", "Activity"],
    ],
    Manager: [
      ["team", "Team Dashboard"],
      ["approvals", "Approvals"],
      ["managerCheckins", "Check-ins"],
      ["shared", "Shared KPIs"],
    ],
    Admin: [
      ["adminDashboard", "Completion"],
      ["cycles", "Cycles"],
      ["reports", "Reports"],
      ["audit", "Audit Trail"],
    ],
  };

  let state = loadState();
  let currentUserId = state.currentUserId || "emp1";
  let currentView = state.currentView || defaultViewForRole(currentUser().role);
  const ui = {
    selectedQuarter: "Q1",
    teamFilter: "",
    reportFilter: "",
    toast: null,
    modal: null,
  };

  function createSeedState() {
    const now = new Date().toISOString();
    const users = [
      {
        id: "emp1",
        name: "Aarav Mehta",
        role: "Employee",
        department: "Operations",
        managerId: "mgr1",
        email: "aarav.mehta@example.com",
      },
      {
        id: "emp2",
        name: "Mira Kapoor",
        role: "Employee",
        department: "Operations",
        managerId: "mgr1",
        email: "mira.kapoor@example.com",
      },
      {
        id: "emp3",
        name: "Rohan Iyer",
        role: "Employee",
        department: "Quality",
        managerId: "mgr1",
        email: "rohan.iyer@example.com",
      },
      {
        id: "mgr1",
        name: "Neha Rao",
        role: "Manager",
        department: "Operations",
        email: "neha.rao@example.com",
      },
      {
        id: "admin1",
        name: "Isha Sen",
        role: "Admin",
        department: "HR",
        email: "isha.sen@example.com",
      },
    ];

    return {
      currentUserId: "emp1",
      currentView: "goals",
      users,
      cycle: {
        activePeriod: "goal",
        periodOpen: {
          goal: true,
          Q1: false,
          Q2: false,
          Q3: false,
          Q4: false,
        },
      },
      goalSheets: {
        emp1: {
          employeeId: "emp1",
          status: "draft",
          locked: false,
          submittedAt: null,
          approvedAt: null,
          returnedNote: "",
          unlockReason: "",
          goals: [
            goal({
              thrustArea: "Customer Delivery",
              title: "Improve customer turnaround compliance",
              description: "Raise on-time closure across priority requests.",
              uom: "minPercent",
              target: "92",
              weightage: 35,
            }),
            goal({
              thrustArea: "Operational Excellence",
              title: "Reduce average ticket handling time",
              description: "Bring average handling time down without breaching quality checks.",
              uom: "maxNumber",
              target: "18",
              weightage: 30,
            }),
            goal({
              thrustArea: "People Development",
              title: "Complete process mentoring plan",
              description: "Mentor two new associates and close their readiness checklist.",
              uom: "timeline",
              target: "2026-12-15",
              weightage: 35,
            }),
          ],
        },
        emp2: {
          employeeId: "emp2",
          status: "submitted",
          locked: false,
          submittedAt: now,
          approvedAt: null,
          returnedNote: "",
          unlockReason: "",
          goals: [
            goal({
              thrustArea: "Quality and Compliance",
              title: "Maintain audit readiness",
              description: "Close monthly documentation checks before internal audit.",
              uom: "minPercent",
              target: "98",
              weightage: 45,
            }),
            goal({
              thrustArea: "Cost Optimisation",
              title: "Reduce rework effort",
              description: "Lower rework hours through peer review and defect tagging.",
              uom: "maxNumber",
              target: "24",
              weightage: 25,
            }),
            goal({
              thrustArea: "Innovation",
              title: "Pilot workflow automation",
              description: "Launch one low-code automation for weekly reporting.",
              uom: "timeline",
              target: "2026-11-30",
              weightage: 30,
            }),
          ],
        },
        emp3: {
          employeeId: "emp3",
          status: "approved",
          locked: true,
          submittedAt: now,
          approvedAt: now,
          returnedNote: "",
          unlockReason: "",
          goals: [
            goal({
              thrustArea: "Quality and Compliance",
              title: "Zero reportable safety incidents",
              description: "Maintain safety controls across quarterly operations.",
              uom: "zero",
              target: "0",
              weightage: 40,
            }),
            goal({
              thrustArea: "Customer Delivery",
              title: "Improve first-pass resolution",
              description: "Increase first-pass resolution through checklist adoption.",
              uom: "minPercent",
              target: "86",
              weightage: 30,
            }),
            goal({
              thrustArea: "Operational Excellence",
              title: "Close SOP refresh",
              description: "Publish updated SOPs for all critical queues.",
              uom: "timeline",
              target: "2026-10-15",
              weightage: 30,
            }),
          ],
        },
      },
      checkins: [
        {
          id: id("chk"),
          employeeId: "emp3",
          managerId: "mgr1",
          quarter: "Q1",
          focus: "Quality controls are stable.",
          blockers: "SOP sign-off is slower than planned.",
          nextSteps: "Schedule final reviewer session this week.",
          createdAt: now,
        },
      ],
      auditLog: [
        {
          id: id("aud"),
          timestamp: now,
          actorId: "admin1",
          action: "Demo workspace seeded",
          detail: "Initial employees, manager, admin, and sample goal sheets created.",
        },
      ],
      escalations: [],
    };
  }

  function goal(overrides) {
    return {
      id: id("goal"),
      thrustArea: "",
      title: "",
      description: "",
      uom: "minNumber",
      target: "",
      weightage: 10,
      sharedGroupId: null,
      primaryOwnerId: null,
      achievements: {},
      ...overrides,
    };
  }

  function id(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()
      .toString(36)
      .slice(-4)}`;
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : createSeedState();
    } catch (error) {
      console.warn("Unable to load saved portal state", error);
      return createSeedState();
    }
  }

  function saveState() {
    state.currentUserId = currentUserId;
    state.currentView = currentView;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentUser() {
    return state.users.find((user) => user.id === currentUserId) || state.users[0];
  }

  function defaultViewForRole(role) {
    return navByRole[role][0][0];
  }

  function employees() {
    return state.users.filter((user) => user.role === "Employee");
  }

  function managers() {
    return state.users.filter((user) => user.role === "Manager");
  }

  function teamForManager(managerId) {
    return employees().filter((user) => user.managerId === managerId);
  }

  function filterUsers(users, query) {
    const normalized = String(query || "").trim().toLowerCase();
    if (!normalized) return users;
    return users.filter((user) =>
      [user.name, user.department, user.email, user.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }

  function sheetFor(employeeId) {
    if (!state.goalSheets[employeeId]) {
      state.goalSheets[employeeId] = {
        employeeId,
        status: "draft",
        locked: false,
        submittedAt: null,
        approvedAt: null,
        returnedNote: "",
        unlockReason: "",
        goals: [],
      };
    }
    return state.goalSheets[employeeId];
  }

  function periodById(idValue) {
    return periods.find((period) => period.id === idValue) || periods[0];
  }

  function activePeriod() {
    return periodById(state.cycle.activePeriod);
  }

  function isActiveOpen(type) {
    const active = activePeriod();
    return active.type === type && Boolean(state.cycle.periodOpen[active.id]);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function statusMeta(status) {
    const map = {
      draft: ["Draft", "info"],
      submitted: ["Pending L1", "warn"],
      returned: ["Returned", "danger"],
      approved: ["Approved", "ok"],
    };
    return map[status] || [status, "info"];
  }

  function statusPill(status) {
    const [label, tone] = statusMeta(status);
    return `<span class="status-pill ${tone}">${label}</span>`;
  }

  function activeBadge() {
    const active = activePeriod();
    const open = state.cycle.periodOpen[active.id];
    return `<span class="status-pill ${open ? "ok" : "danger"}">${escapeHtml(
      active.label,
    )} ${open ? "open" : "closed"}</span>`;
  }

  function visibleQuarter() {
    const active = activePeriod();
    if (active.type === "checkin") return active.id;
    return ui.selectedQuarter;
  }

  function renderQuarterTabs(selected = visibleQuarter()) {
    return `
      <div class="segmented" role="tablist" aria-label="Quarter selector">
        ${["Q1", "Q2", "Q3", "Q4"]
          .map(
            (quarter) => `
              <button class="${selected === quarter ? "active" : ""}" data-action="select-quarter" data-quarter="${quarter}" type="button">
                ${quarter}
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function setToast(message, tone = "ok") {
    ui.toast = { message, tone };
    window.clearTimeout(setToast.timer);
    setToast.timer = window.setTimeout(() => {
      ui.toast = null;
      render();
    }, 2600);
  }

  function renderToast() {
    if (!ui.toast) return "";
    return `
      <div class="toast ${ui.toast.tone}" role="status">
        <strong>${escapeHtml(ui.toast.message)}</strong>
      </div>
    `;
  }

  function renderModal() {
    if (!ui.modal) return "";
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(ui.modal.title)}">
          <div class="modal-head">
            <div>
              <h3>${escapeHtml(ui.modal.title)}</h3>
              <p>${escapeHtml(ui.modal.subtitle || "")}</p>
            </div>
            <button class="ghost-button icon-button" data-action="close-modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">${ui.modal.body}</div>
        </section>
      </div>
    `;
  }

  function sheetTotal(sheet) {
    return sheet.goals.reduce((sum, item) => sum + numberValue(item.weightage), 0);
  }

  function validationFor(sheet) {
    const total = sheetTotal(sheet);
    const issues = [];
    if (sheet.goals.length === 0) issues.push("Add at least one goal.");
    if (sheet.goals.length > 8) issues.push("Maximum 8 goals are allowed.");
    if (sheet.goals.some((item) => numberValue(item.weightage) < 10)) {
      issues.push("Each goal needs at least 10% weightage.");
    }
    if (total !== 100) issues.push(`Total weightage must be 100%. Current total is ${total}%.`);
    return issues;
  }

  function canEditSheet(sheet) {
    if (sheet.locked) return false;
    return ["draft", "returned", "approved"].includes(sheet.status) && isActiveOpen("goal");
  }

  function canSubmitSheet(sheet) {
    return canEditSheet(sheet) && validationFor(sheet).length === 0;
  }

  function progressFor(goalItem, quarter) {
    const achievement = goalItem.achievements?.[quarter];
    if (!achievement || achievement.actual === "" || achievement.actual == null) {
      return { value: null, label: "No update", tone: "danger" };
    }

    const target = goalItem.target;
    const actual = achievement.actual;
    let score = 0;

    if (goalItem.uom === "minNumber" || goalItem.uom === "minPercent") {
      score = numberValue(actual) / Math.max(numberValue(target), 0.0001);
    } else if (goalItem.uom === "maxNumber" || goalItem.uom === "maxPercent") {
      score = Math.max(numberValue(target), 0.0001) / Math.max(numberValue(actual), 0.0001);
    } else if (goalItem.uom === "zero") {
      score = numberValue(actual) === 0 ? 1 : 0;
    } else if (goalItem.uom === "timeline") {
      const targetDate = new Date(target);
      const actualDate = new Date(actual);
      score = actualDate.getTime() <= targetDate.getTime() ? 1 : 0;
    }

    const percent = Math.max(0, Math.min(150, Math.round(score * 100)));
    const tone = percent >= 90 ? "ok" : percent >= 60 ? "warn" : "danger";
    return { value: percent, label: `${percent}%`, tone };
  }

  function weightedProgress(employeeId, quarter) {
    const sheet = sheetFor(employeeId);
    if (!sheet.goals.length) return 0;
    const total = sheet.goals.reduce((sum, item) => {
      const progress = progressFor(item, quarter);
      return sum + (progress.value == null ? 0 : progress.value) * (numberValue(item.weightage) / 100);
    }, 0);
    return Math.round(total);
  }

  function checkinComplete(employeeId, quarter) {
    const sheet = sheetFor(employeeId);
    if (!sheet.goals.length) return false;
    const everyGoalUpdated = sheet.goals.every((item) => {
      const update = item.achievements?.[quarter];
      return update && update.actual !== "" && update.status;
    });
    const managerComment = state.checkins.some(
      (item) => item.employeeId === employeeId && item.quarter === quarter,
    );
    return everyGoalUpdated && managerComment;
  }

  function addAudit(actorId, action, detail) {
    state.auditLog.unshift({
      id: id("aud"),
      timestamp: new Date().toISOString(),
      actorId,
      action,
      detail,
    });
  }

  function render() {
    const user = currentUser();
    const nav = navByRole[user.role];
    if (!nav.some(([view]) => view === currentView)) {
      currentView = defaultViewForRole(user.role);
    }

    app.innerHTML = `
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">AQ</div>
          <div>
            <h1>AtomQuest Goal Portal</h1>
            <p>In-house goal setting, approval, check-ins and governance</p>
          </div>
        </div>
        <div class="session">
          <select id="user-switcher" aria-label="Switch role">
            ${state.users
              .map(
                (item) =>
                  `<option value="${item.id}" ${item.id === user.id ? "selected" : ""}>${escapeHtml(
                    item.name,
                  )} - ${escapeHtml(item.role)}</option>`,
              )
              .join("")}
          </select>
          <button class="ghost-button" data-action="reset-demo">Reset demo</button>
        </div>
      </header>
      <div class="layout">
        <aside class="sidebar">
          <nav class="nav-group" aria-label="${escapeHtml(user.role)} navigation">
            ${nav
              .map(
                ([view, label]) => `
                  <button class="nav-button ${
                    currentView === view ? "active" : ""
                  }" data-view="${view}">${label}</button>
                `,
              )
              .join("")}
          </nav>
        </aside>
        <main class="main">${renderView(user)}</main>
      </div>
      ${renderToast()}
      ${renderModal()}
    `;
  }

  function renderView(user) {
    if (user.role === "Employee") {
      if (currentView === "checkins") return renderEmployeeCheckins(user);
      if (currentView === "activity") return renderEmployeeActivity(user);
      return renderEmployeeGoals(user);
    }

    if (user.role === "Manager") {
      if (currentView === "approvals") return renderManagerApprovals(user);
      if (currentView === "managerCheckins") return renderManagerCheckins(user);
      if (currentView === "shared") return renderSharedKpis(user);
      return renderManagerTeam(user);
    }

    if (currentView === "cycles") return renderAdminCycles(user);
    if (currentView === "reports") return renderAdminReports(user);
    if (currentView === "audit") return renderAudit(user);
    return renderAdminDashboard(user);
  }

  function renderViewHead(title, subtitle, extra = "") {
    return `
      <div class="view-head">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        <div class="toolbar">${activeBadge()}${extra}</div>
      </div>
    `;
  }

  function renderEmployeeGoals(user) {
    const sheet = sheetFor(user.id);
    const issues = validationFor(sheet);
    const editable = canEditSheet(sheet);
    const submitReady = canSubmitSheet(sheet);
    const total = sheetTotal(sheet);
    const lockedCopy = sheet.locked
      ? `<div class="notice warn">This goal sheet is locked after L1 approval. HR can unlock it for an exception.</div>`
      : "";
    const returnedCopy = sheet.returnedNote
      ? `<div class="notice danger">Returned by manager: ${escapeHtml(sheet.returnedNote)}</div>`
      : "";
    const unlockedCopy = sheet.status === "approved" && !sheet.locked
      ? `<div class="notice ok">HR unlocked this approved sheet. Any edits are captured in the audit trail.</div>`
      : "";

    return `
      ${renderViewHead("Goal Sheet", "Create up to eight weighted goals, submit them for L1 review, and track approval status.")}
      <section class="stat-grid">
        <div class="stat"><div class="value">${sheet.goals.length}/8</div><div class="label">Goals added</div></div>
        <div class="stat"><div class="value">${total}%</div><div class="label">Total weightage</div></div>
        <div class="stat"><div class="value">${sheet.goals.filter((item) => item.sharedGroupId).length}</div><div class="label">Shared KPIs</div></div>
        <div class="stat"><div class="value">${sheet.locked ? "Yes" : "No"}</div><div class="label">Locked</div></div>
      </section>
      <div class="grid">
        ${lockedCopy}
        ${returnedCopy}
        ${unlockedCopy}
        <section class="panel">
          <div class="panel-head">
            <div>
              <h3>Current sheet ${statusPill(sheet.status)}</h3>
              <p>${issues.length ? escapeHtml(issues.join(" ")) : "Validation passed. The sheet is ready for submission."}</p>
            </div>
            <div class="actions-row">
              <button class="solid-button" data-action="submit-sheet" ${submitReady ? "" : "disabled"}>Submit to L1</button>
            </div>
          </div>
          <div class="panel-body">
            ${renderGoalTable(sheet, { mode: "employee", editable })}
          </div>
        </section>
        ${renderAddGoalPanel(sheet, editable)}
      </div>
    `;
  }

  function renderGoalTable(sheet, options) {
    if (!sheet.goals.length) {
      return `<div class="empty-state">No goals added yet.</div>`;
    }

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Thrust Area</th>
              <th>UoM</th>
              <th>Target</th>
              <th>Weightage</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            ${sheet.goals
              .map((item) => renderGoalRow(sheet, item, options))
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderGoalRow(sheet, item, options) {
    const shared = Boolean(item.sharedGroupId);
    const editable = Boolean(options.editable);
    const managerMode = options.mode === "manager";
    const canEditTitle = editable && !shared && !managerMode;
    const canEditTarget = editable && (!shared || managerMode);
    const canEditWeight = editable || managerMode;
    const canDelete = editable && !shared && !managerMode;
    const targetType = uomTypes[item.uom]?.inputType || "text";

    return `
      <tr>
        <td>
          <div class="cell-main">
            ${
              canEditTitle
                ? `<input data-action="update-goal" data-goal-id="${item.id}" data-field="title" value="${escapeHtml(item.title)}" placeholder="Goal title" />`
                : `<strong>${escapeHtml(item.title || "Untitled goal")}</strong>`
            }
            ${
              canEditTitle
                ? `<textarea data-action="update-goal" data-goal-id="${item.id}" data-field="description" placeholder="Description">${escapeHtml(item.description)}</textarea>`
                : `<span>${escapeHtml(item.description || "-")}</span>`
            }
            ${shared ? `<span class="small-pill info">Shared KPI</span>` : ""}
          </div>
        </td>
        <td>
          ${
            canEditTitle
              ? `<select data-action="update-goal" data-goal-id="${item.id}" data-field="thrustArea">
                  ${thrustAreas
                    .map(
                      (area) =>
                        `<option value="${escapeHtml(area)}" ${
                          area === item.thrustArea ? "selected" : ""
                        }>${escapeHtml(area)}</option>`,
                    )
                    .join("")}
                </select>`
              : escapeHtml(item.thrustArea)
          }
        </td>
        <td>
          ${
            canEditTitle
              ? `<select data-action="update-goal" data-goal-id="${item.id}" data-field="uom">
                  ${Object.entries(uomTypes)
                    .map(
                      ([value, meta]) =>
                        `<option value="${value}" ${value === item.uom ? "selected" : ""}>${meta.label}</option>`,
                    )
                    .join("")}
                </select>`
              : escapeHtml(uomTypes[item.uom]?.short || item.uom)
          }
        </td>
        <td>
          ${
            canEditTarget
              ? `<input class="inline-input" type="${targetType}" data-action="update-goal" data-goal-id="${item.id}" data-field="target" value="${escapeHtml(item.target)}" />`
              : escapeHtml(item.target || "-")
          }
        </td>
        <td>
          ${
            canEditWeight
              ? `<input class="weight-input" type="number" min="10" max="100" data-action="update-goal" data-goal-id="${item.id}" data-field="weightage" value="${escapeHtml(item.weightage)}" />`
              : `${escapeHtml(item.weightage)}%`
          }
        </td>
        <td>
          ${
            canDelete
              ? `<button class="danger-button" data-action="delete-goal" data-goal-id="${item.id}">Delete</button>`
              : `<span class="mini-note">${sheet.locked ? "Locked" : "No action"}</span>`
          }
        </td>
      </tr>
    `;
  }

  function renderAddGoalPanel(sheet, editable) {
    if (!editable) {
      return "";
    }

    const maxReached = sheet.goals.length >= 8;
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>Add goal</h3>
            <p>Minimum weightage is 10%. The sheet can be submitted only when total weightage is exactly 100%.</p>
          </div>
        </div>
        <div class="panel-body">
          <form id="add-goal-form" class="form-grid">
            <label>
              Thrust Area
              <select name="thrustArea" ${maxReached ? "disabled" : ""}>
                ${thrustAreas.map((area) => `<option>${escapeHtml(area)}</option>`).join("")}
              </select>
            </label>
            <label class="span-2">
              Goal Title
              <input name="title" maxlength="120" required ${maxReached ? "disabled" : ""} />
            </label>
            <label>
              UoM
              <select name="uom" ${maxReached ? "disabled" : ""}>
                ${Object.entries(uomTypes)
                  .map(([value, meta]) => `<option value="${value}">${meta.label}</option>`)
                  .join("")}
              </select>
            </label>
            <label class="span-2">
              Description
              <textarea name="description" required ${maxReached ? "disabled" : ""}></textarea>
            </label>
            <label>
              Target
              <input name="target" required ${maxReached ? "disabled" : ""} />
            </label>
            <label>
              Weightage
              <input name="weightage" type="number" min="10" max="100" value="10" required ${maxReached ? "disabled" : ""} />
            </label>
            <div class="span-4 actions-row">
              <button class="solid-button" type="submit" ${maxReached ? "disabled" : ""}>Add goal</button>
              ${maxReached ? `<span class="mini-note">Maximum goal count reached.</span>` : ""}
            </div>
          </form>
        </div>
      </section>
    `;
  }

  function renderEmployeeCheckins(user) {
    const sheet = sheetFor(user.id);
    const active = activePeriod();
    const quarter = visibleQuarter();
    const open = active.type === "checkin" && state.cycle.periodOpen[active.id] && active.id === quarter;
    const locked = sheet.status !== "approved";
    const disabledReason = locked
      ? "Goal sheet must be approved before quarterly updates."
      : "Achievement capture is available only during an open quarterly window.";

    return `
      ${renderViewHead("Quarterly Updates", "Log actual achievement and status against approved planned targets.")}
      ${
        !open || locked
          ? `<div class="notice warn">${escapeHtml(disabledReason)}</div>`
          : `<div class="notice ok">${escapeHtml(active.label)} is open for achievement capture.</div>`
      }
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>${escapeHtml(periodById(quarter).label)}</h3>
            <p>Status options: Not Started, On Track, Completed.</p>
          </div>
          ${renderQuarterTabs(quarter)}
        </div>
        <div class="panel-body">
          ${renderAchievementTable(user.id, quarter, open && !locked, "employee")}
        </div>
      </section>
    `;
  }

  function renderAchievementTable(employeeId, quarter, editable, mode) {
    const sheet = sheetFor(employeeId);
    if (!sheet.goals.length) return `<div class="empty-state">No goals available.</div>`;

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Planned Target</th>
              <th>Actual</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            ${sheet.goals
              .map((item) => renderAchievementRow(employeeId, item, quarter, editable, mode))
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAchievementRow(employeeId, item, quarter, editable, mode) {
    const update = item.achievements?.[quarter] || { actual: "", status: "Not Started" };
    const progress = progressFor(item, quarter);
    const actualType = uomTypes[item.uom]?.inputType || "text";
    const isSharedRecipient =
      item.sharedGroupId && item.primaryOwnerId && item.primaryOwnerId !== employeeId;
    const canEdit = editable && !isSharedRecipient && mode === "employee";
    const fillClass = progress.tone === "ok" ? "" : progress.tone;
    return `
      <tr>
        <td>
          <div class="cell-main">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(uomTypes[item.uom]?.label || item.uom)} | ${escapeHtml(item.weightage)}%</span>
            ${isSharedRecipient ? `<span class="small-pill info">Synced from primary owner</span>` : ""}
          </div>
        </td>
        <td>${escapeHtml(item.target)}</td>
        <td>
          ${
            canEdit
              ? `<input type="${actualType}" data-action="update-achievement" data-goal-id="${item.id}" data-quarter="${quarter}" data-field="actual" value="${escapeHtml(update.actual)}" />`
              : escapeHtml(update.actual || "-")
          }
        </td>
        <td>
          ${
            canEdit
              ? `<select data-action="update-achievement" data-goal-id="${item.id}" data-quarter="${quarter}" data-field="status">
                  ${["Not Started", "On Track", "Completed"]
                    .map(
                      (status) =>
                        `<option ${status === update.status ? "selected" : ""}>${status}</option>`,
                    )
                    .join("")}
                </select>`
              : escapeHtml(update.status || "-")
          }
        </td>
        <td>
          <div class="cell-main">
            <strong>${escapeHtml(progress.label)}</strong>
            <div class="progress-track">
              <div class="progress-fill ${fillClass}" style="--progress: ${Math.min(
                progress.value || 0,
                100,
              )}%"></div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  function renderEmployeeActivity(user) {
    const items = state.auditLog.filter(
      (item) =>
        item.actorId === user.id ||
        item.detail.toLowerCase().includes(user.name.toLowerCase()) ||
        item.detail.toLowerCase().includes(user.id.toLowerCase()),
    );
    return `
      ${renderViewHead("Activity", "Recent submissions, approval changes, achievement updates and exception actions.")}
      <section class="panel">
        <div class="panel-body">
          ${renderAuditItems(items)}
        </div>
      </section>
    `;
  }

  function renderManagerTeam(user) {
    const team = teamForManager(user.id);
    const filteredTeam = filterUsers(team, ui.teamFilter);
    const approved = team.filter((member) => sheetFor(member.id).status === "approved").length;
    const submitted = team.filter((member) => sheetFor(member.id).status === "submitted").length;
    const activeQ = visibleQuarter();
    const completed = team.filter((member) => checkinComplete(member.id, activeQ)).length;
    return `
      ${renderViewHead("Team Dashboard", "Review sheet status, completion risk and weighted progress for your team.")}
      <section class="stat-grid">
        <div class="stat"><div class="value">${team.length}</div><div class="label">Team members</div></div>
        <div class="stat"><div class="value">${submitted}</div><div class="label">Awaiting approval</div></div>
        <div class="stat"><div class="value">${approved}</div><div class="label">Approved sheets</div></div>
        <div class="stat"><div class="value">${completed}</div><div class="label">${activeQ} completed</div></div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>Team progress</h3>
            <p>${filteredTeam.length} of ${team.length} people shown.</p>
          </div>
          <div class="toolbar">
            ${renderQuarterTabs(activeQ)}
            <input class="search-input" data-action="filter-team" placeholder="Search team" value="${escapeHtml(ui.teamFilter)}" />
          </div>
        </div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Sheet</th><th>Goals</th><th>Total Weight</th><th>${activeQ} Progress</th><th>Open</th></tr></thead>
              <tbody>
                ${filteredTeam
                  .map((member) => {
                    const sheet = sheetFor(member.id);
                    const progress = weightedProgress(member.id, activeQ);
                    return `
                      <tr>
                        <td><div class="cell-main"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.department)}</span></div></td>
                        <td>${statusPill(sheet.status)}</td>
                        <td>${sheet.goals.length}/8</td>
                        <td>${sheetTotal(sheet)}%</td>
                        <td>
                          <div class="cell-main">
                            <strong>${progress}%</strong>
                            <div class="progress-track"><div class="progress-fill ${
                              progress >= 90 ? "" : progress >= 60 ? "warn" : "danger"
                            }" style="--progress: ${Math.min(progress, 100)}%"></div></div>
                          </div>
                        </td>
                        <td><button class="ghost-button" data-action="open-sheet" data-employee-id="${member.id}">View</button></td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function renderManagerApprovals(user) {
    const team = teamForManager(user.id);
    return `
      ${renderViewHead("Approvals", "Review submitted goal sheets, adjust target or weightage inline, approve, or return for rework.")}
      <div class="grid">
        ${team
          .map((member) => {
            const sheet = sheetFor(member.id);
            const canApprove = sheet.status === "submitted";
            const issues = validationFor(sheet);
            return `
              <section class="panel">
                <div class="panel-head">
                  <div>
                    <h3>${escapeHtml(member.name)} ${statusPill(sheet.status)}</h3>
                    <p>${issues.length ? escapeHtml(issues.join(" ")) : "Validation passed."}</p>
                  </div>
                  <div class="actions-row">
                    <button class="solid-button" data-action="approve-sheet" data-employee-id="${member.id}" ${
                      canApprove && issues.length === 0 ? "" : "disabled"
                    }>Approve</button>
                    <button class="ghost-button" data-action="return-sheet" data-employee-id="${member.id}" ${
                      canApprove ? "" : "disabled"
                    }>Return</button>
                  </div>
                </div>
                <div class="panel-body">
                  ${renderGoalTable(sheet, { mode: "manager", editable: canApprove })}
                </div>
              </section>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderManagerCheckins(user) {
    const team = teamForManager(user.id);
    const filteredTeam = filterUsers(team, ui.teamFilter);
    const selectedQuarter = visibleQuarter();
    return `
      ${renderViewHead("Manager Check-ins", "Compare planned target against achievement and record structured discussion notes.")}
      <section class="panel no-shadow" style="margin-bottom:16px;">
        <div class="panel-body toolbar">
          ${renderQuarterTabs(selectedQuarter)}
          <input class="search-input" data-action="filter-team" placeholder="Search team" value="${escapeHtml(ui.teamFilter)}" />
        </div>
      </section>
      <div class="grid">
        ${filteredTeam
          .map((member) => {
            const sheet = sheetFor(member.id);
            const approved = sheet.status === "approved";
            const comment = state.checkins.find(
              (item) => item.employeeId === member.id && item.quarter === selectedQuarter,
            );
            return `
              <section class="panel">
                <div class="panel-head">
                  <div>
                    <h3>${escapeHtml(member.name)} ${approved ? statusPill("approved") : statusPill(sheet.status)}</h3>
                    <p>${escapeHtml(selectedQuarter)} weighted progress: ${weightedProgress(member.id, selectedQuarter)}%</p>
                  </div>
                  <span class="status-pill ${comment ? "ok" : "warn"}">${comment ? "Comment saved" : "Pending comment"}</span>
                </div>
                <div class="panel-body">
                  ${renderAchievementTable(member.id, selectedQuarter, false, "manager")}
                  <div class="divider"></div>
                  <form class="form-grid" data-action="save-checkin" data-employee-id="${member.id}" data-quarter="${selectedQuarter}">
                    <label class="span-2">
                      Discussion focus
                      <textarea name="focus" ${approved ? "" : "disabled"}>${escapeHtml(comment?.focus || "")}</textarea>
                    </label>
                    <label>
                      Blockers
                      <textarea name="blockers" ${approved ? "" : "disabled"}>${escapeHtml(comment?.blockers || "")}</textarea>
                    </label>
                    <label>
                      Next steps
                      <textarea name="nextSteps" ${approved ? "" : "disabled"}>${escapeHtml(comment?.nextSteps || "")}</textarea>
                    </label>
                    <div class="span-4 actions-row">
                      <button class="solid-button" type="submit" ${approved ? "" : "disabled"}>Save check-in</button>
                    </div>
                  </form>
                </div>
              </section>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderSharedKpis(user) {
    const team = teamForManager(user.id);
    return `
      ${renderViewHead("Shared KPIs", "Push a departmental KPI to multiple employees. Recipients can change only their own weightage.")}
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>New shared KPI</h3>
            <p>The title and target stay read-only for recipients. Achievement updates by the primary owner sync to linked sheets.</p>
          </div>
        </div>
        <div class="panel-body">
          ${renderSharedForm(team, user.id)}
        </div>
      </section>
    `;
  }

  function renderSharedForm(team, ownerId) {
    return `
      <form id="shared-kpi-form" class="form-grid">
        <label>
          Thrust Area
          <select name="thrustArea">${thrustAreas
            .map((area) => `<option>${escapeHtml(area)}</option>`)
            .join("")}</select>
        </label>
        <label class="span-2">
          Goal Title
          <input name="title" required maxlength="120" />
        </label>
        <label>
          UoM
          <select name="uom">${Object.entries(uomTypes)
            .map(([value, meta]) => `<option value="${value}">${meta.label}</option>`)
            .join("")}</select>
        </label>
        <label class="span-2">
          Description
          <textarea name="description" required></textarea>
        </label>
        <label>
          Target
          <input name="target" required />
        </label>
        <label>
          Default weightage
          <input name="weightage" type="number" min="10" max="100" value="10" required />
        </label>
        <label>
          Primary owner
          <select name="primaryOwnerId">${team
            .map((member) => `<option value="${member.id}">${escapeHtml(member.name)}</option>`)
            .join("")}</select>
        </label>
        <div class="field span-4">
          Recipients
          <div class="check-list">
            ${team
              .map(
                (member) => `
                  <label class="check-row">
                    <input type="checkbox" name="recipients" value="${member.id}" checked />
                    <span>${escapeHtml(member.name)} - ${escapeHtml(member.department)}</span>
                  </label>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="span-4 actions-row">
          <button class="solid-button" type="submit" data-owner-id="${ownerId}">Push KPI</button>
        </div>
      </form>
    `;
  }

  function renderAdminDashboard(user) {
    const activeQ = visibleQuarter();
    const allEmployees = employees();
    const approved = allEmployees.filter((member) => sheetFor(member.id).status === "approved").length;
    const submitted = allEmployees.filter((member) => sheetFor(member.id).status === "submitted").length;
    const completed = allEmployees.filter((member) => checkinComplete(member.id, activeQ)).length;
    return `
      ${renderViewHead("Completion", "Real-time completion view across employees, managers and active review windows.")}
      <section class="stat-grid">
        <div class="stat"><div class="value">${approved}</div><div class="label">Approved goal sheets</div></div>
        <div class="stat"><div class="value">${submitted}</div><div class="label">Pending L1 approval</div></div>
        <div class="stat"><div class="value">${completed}/${allEmployees.length}</div><div class="label">${activeQ} check-ins complete</div></div>
        <div class="stat"><div class="value">${state.escalations.length}</div><div class="label">Escalations logged</div></div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h3>Employee completion dashboard</h3>
            <p>Goal status, weighted progress and manager check-in completion.</p>
          </div>
          <div class="toolbar">
            ${renderQuarterTabs(activeQ)}
            <button class="ghost-button" data-action="seed-demo-progress">Demo progress</button>
            <button class="ghost-button" data-action="generate-escalations">Generate escalations</button>
          </div>
        </div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Manager</th><th>Sheet</th><th>Total Weight</th><th>${activeQ} Progress</th><th>Check-in</th><th>Open</th></tr></thead>
              <tbody>
                ${allEmployees
                  .map((member) => {
                    const manager = state.users.find((item) => item.id === member.managerId);
                    const sheet = sheetFor(member.id);
                    const complete = checkinComplete(member.id, activeQ);
                    return `
                      <tr>
                        <td><div class="cell-main"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.department)}</span></div></td>
                        <td>${escapeHtml(manager?.name || "-")}</td>
                        <td>${statusPill(sheet.status)}</td>
                        <td>${sheetTotal(sheet)}%</td>
                        <td>${weightedProgress(member.id, activeQ)}%</td>
                        <td><span class="status-pill ${complete ? "ok" : "warn"}">${complete ? "Complete" : "Pending"}</span></td>
                        <td><button class="ghost-button" data-action="open-sheet" data-employee-id="${member.id}">View</button></td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="grid two" style="margin-top:16px;">
        <div class="panel">
          <div class="panel-head"><h3>Quarter heatmap</h3></div>
          <div class="panel-body">${renderHeatmap()}</div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Escalation log</h3></div>
          <div class="panel-body">${renderEscalations()}</div>
        </div>
      </section>
    `;
  }

  function renderHeatmap() {
    return `
      <div class="heatmap">
        <div class="heat-row mini-note"><strong>Employee</strong><strong>Q1</strong><strong>Q2</strong><strong>Q3</strong><strong>Q4</strong></div>
        ${employees()
          .map(
            (member) => `
              <div class="heat-row">
                <span class="break-anywhere">${escapeHtml(member.name)}</span>
                ${["Q1", "Q2", "Q3", "Q4"]
                  .map((quarter) => {
                    const progress = weightedProgress(member.id, quarter);
                    return `<span class="heat-cell" style="--heat:${Math.max(18, Math.min(progress, 100))}%">${progress}%</span>`;
                  })
                  .join("")}
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderEscalations() {
    if (!state.escalations.length) return `<div class="empty-state">No escalations logged.</div>`;
    return `
      <div class="audit-log">
        ${state.escalations
          .map(
            (item) => `
              <div class="audit-item">
                <strong>${escapeHtml(item.type)} - ${escapeHtml(item.employeeName)}</strong>
                <span>${escapeHtml(item.message)}</span>
                <span>${formatDate(item.createdAt)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function renderAdminCycles(user) {
    return `
      ${renderViewHead("Cycles", "Configure the active window, review the quarterly schedule, and handle HR exceptions.")}
      <section class="grid two">
        <div class="panel">
          <div class="panel-head">
            <h3>Window control</h3>
          </div>
          <div class="panel-body">
            <form id="cycle-form" class="form-grid two">
              <label>
                Active period
                <select name="activePeriod">
                  ${periods
                    .map(
                      (period) =>
                        `<option value="${period.id}" ${
                          state.cycle.activePeriod === period.id ? "selected" : ""
                        }>${period.label}</option>`,
                    )
                    .join("")}
                </select>
              </label>
              <label>
                Window status
                <select name="windowOpen">
                  <option value="open" ${
                    state.cycle.periodOpen[state.cycle.activePeriod] ? "selected" : ""
                  }>Open</option>
                  <option value="closed" ${
                    !state.cycle.periodOpen[state.cycle.activePeriod] ? "selected" : ""
                  }>Closed</option>
                </select>
              </label>
              <div class="span-2 actions-row">
                <button class="solid-button" type="submit">Save cycle</button>
              </div>
            </form>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Goal unlock</h3></div>
          <div class="panel-body">
            <div class="table-wrap">
              <table>
                <thead><tr><th>Employee</th><th>Sheet</th><th>Lock</th><th>Action</th></tr></thead>
                <tbody>
                  ${employees()
                    .map((member) => {
                      const sheet = sheetFor(member.id);
                      return `
                        <tr>
                          <td>${escapeHtml(member.name)}</td>
                          <td>${statusPill(sheet.status)}</td>
                          <td>${sheet.locked ? "Locked" : "Open"}</td>
                          <td><button class="ghost-button" data-action="unlock-sheet" data-employee-id="${member.id}" ${
                            sheet.locked ? "" : "disabled"
                          }>Unlock</button></td>
                        </tr>
                      `;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <section class="panel" style="margin-top:16px;">
        <div class="panel-head"><h3>Quarterly schedule</h3></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Period</th><th>Window opens</th><th>Action</th><th>Configured status</th></tr></thead>
              <tbody>
                ${periods
                  .map(
                    (period) => `
                      <tr>
                        <td>${escapeHtml(period.label)}</td>
                        <td>${escapeHtml(period.window)}</td>
                        <td>${escapeHtml(period.action)}</td>
                        <td><span class="status-pill ${
                          state.cycle.periodOpen[period.id] ? "ok" : "danger"
                        }">${state.cycle.periodOpen[period.id] ? "Open" : "Closed"}</span></td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="panel" style="margin-top:16px;">
        <div class="panel-head"><h3>Org hierarchy</h3></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Role</th><th>Department</th><th>Manager</th></tr></thead>
              <tbody>
                ${state.users
                  .map((member) => {
                    const manager = state.users.find((item) => item.id === member.managerId);
                    return `
                      <tr>
                        <td>${escapeHtml(member.name)}</td>
                        <td>${escapeHtml(member.role)}</td>
                        <td>${escapeHtml(member.department)}</td>
                        <td>${escapeHtml(manager?.name || "-")}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function renderAdminReports(user) {
    const rows = reportRows();
    const filteredRows = rows.filter((row) => {
      const query = ui.reportFilter.trim().toLowerCase();
      if (!query) return true;
      return [row.Employee, row.Department, row.Manager, row.Goal, row.ThrustArea, row.UoM]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
    return `
      ${renderViewHead("Reports", "Export achievement data and review goal distribution across thrust area, UoM and status.")}
      <section class="grid two">
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3>Achievement report</h3>
              <p>${filteredRows.length} report rows visible.</p>
            </div>
            <div class="toolbar">
              <input class="search-input" data-action="filter-report" placeholder="Search report" value="${escapeHtml(ui.reportFilter)}" />
              <button class="solid-button" data-action="export-csv">Export CSV</button>
            </div>
          </div>
          <div class="panel-body">
            <div class="table-wrap">
              <table>
                <thead><tr><th>Employee</th><th>Goal</th><th>Target</th><th>Q1 Actual</th><th>Q1 Progress</th></tr></thead>
                <tbody>
                  ${filteredRows
                    .slice(0, 8)
                    .map(
                      (row) => `
                        <tr>
                          <td>${escapeHtml(row.Employee)}</td>
                          <td>${escapeHtml(row.Goal)}</td>
                          <td>${escapeHtml(row.Target)}</td>
                          <td>${escapeHtml(row.Q1Actual)}</td>
                          <td>${escapeHtml(row.Q1Progress)}</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Goal distribution</h3></div>
          <div class="panel-body">${renderDistribution()}</div>
        </div>
      </section>
      <section class="panel" style="margin-top:16px;">
        <div class="panel-head"><h3>Manager effectiveness</h3></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Manager</th><th>Team</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr></thead>
              <tbody>
                ${managers()
                  .map((manager) => {
                    const team = teamForManager(manager.id);
                    return `
                      <tr>
                        <td>${escapeHtml(manager.name)}</td>
                        <td>${team.length}</td>
                        ${["Q1", "Q2", "Q3", "Q4"]
                          .map((quarter) => {
                            const done = team.filter((member) => checkinComplete(member.id, quarter)).length;
                            return `<td>${done}/${team.length}</td>`;
                          })
                          .join("")}
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  function renderDistribution() {
    const counts = {};
    Object.values(state.goalSheets).forEach((sheet) => {
      sheet.goals.forEach((goalItem) => {
        counts[goalItem.thrustArea] = (counts[goalItem.thrustArea] || 0) + 1;
      });
    });
    const max = Math.max(1, ...Object.values(counts));
    return `
      <div class="bar-list">
        ${thrustAreas
          .map((area) => {
            const count = counts[area] || 0;
            return `
              <div class="bar-row">
                <span>${escapeHtml(area)}</span>
                <div class="progress-track"><div class="progress-fill" style="--progress:${(count / max) * 100}%"></div></div>
                <strong>${count}</strong>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderAudit(user) {
    return `
      ${renderViewHead("Audit Trail", "All post-lock exceptions, manager adjustments, shared KPI pushes and check-in comments are captured here.")}
      <section class="panel">
        <div class="panel-body">${renderAuditItems(state.auditLog)}</div>
      </section>
    `;
  }

  function renderAuditItems(items) {
    if (!items.length) return `<div class="empty-state">No activity yet.</div>`;
    return `
      <div class="audit-log">
        ${items
          .map((item) => {
            const actor = state.users.find((user) => user.id === item.actorId);
            return `
              <div class="audit-item">
                <strong>${escapeHtml(item.action)}</strong>
                <span>${escapeHtml(item.detail)}</span>
                <span>${escapeHtml(actor?.name || "System")} | ${formatDate(item.timestamp)}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function openSheetModal(employeeId) {
    const member = state.users.find((user) => user.id === employeeId);
    if (!member) return;
    const manager = state.users.find((user) => user.id === member.managerId);
    const sheet = sheetFor(employeeId);
    const quarter = visibleQuarter();
    const comments = state.checkins
      .filter((item) => item.employeeId === employeeId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    ui.modal = {
      title: member.name,
      subtitle: `${member.department} | Manager: ${manager?.name || "-"}`,
      body: `
        <section class="stat-grid modal-stats">
          <div class="stat"><div class="value">${statusMeta(sheet.status)[0]}</div><div class="label">Sheet status</div></div>
          <div class="stat"><div class="value">${sheetTotal(sheet)}%</div><div class="label">Weightage</div></div>
          <div class="stat"><div class="value">${weightedProgress(employeeId, quarter)}%</div><div class="label">${quarter} progress</div></div>
          <div class="stat"><div class="value">${sheet.locked ? "Locked" : "Open"}</div><div class="label">Edit state</div></div>
        </section>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Goal</th><th>UoM</th><th>Target</th><th>Weight</th><th>${quarter} actual</th><th>Progress</th></tr></thead>
            <tbody>
              ${sheet.goals
                .map((goalItem) => {
                  const update = goalItem.achievements?.[quarter] || {};
                  const progress = progressFor(goalItem, quarter);
                  return `
                    <tr>
                      <td><div class="cell-main"><strong>${escapeHtml(goalItem.title)}</strong><span>${escapeHtml(goalItem.thrustArea)}</span></div></td>
                      <td>${escapeHtml(uomTypes[goalItem.uom]?.short || goalItem.uom)}</td>
                      <td>${escapeHtml(goalItem.target || "-")}</td>
                      <td>${escapeHtml(goalItem.weightage)}%</td>
                      <td>${escapeHtml(update.actual || "-")}</td>
                      <td>${escapeHtml(progress.label)}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
        <div class="divider"></div>
        <h3 class="compact-title">Check-in notes</h3>
        ${
          comments.length
            ? `<div class="audit-log">${comments
                .map(
                  (comment) => `
                    <div class="audit-item">
                      <strong>${escapeHtml(comment.quarter)} - ${escapeHtml(comment.focus || "No focus entered")}</strong>
                      <span>${escapeHtml(comment.blockers || "No blockers recorded")}</span>
                      <span>${escapeHtml(comment.nextSteps || "No next steps recorded")}</span>
                    </div>
                  `,
                )
                .join("")}</div>`
            : `<div class="empty-state">No manager comments saved yet.</div>`
        }
      `,
    };
    render();
  }

  function reportRows() {
    const rows = [];
    employees().forEach((member) => {
      const sheet = sheetFor(member.id);
      sheet.goals.forEach((goalItem) => {
        const base = {
          Employee: member.name,
          Department: member.department,
          Manager: state.users.find((item) => item.id === member.managerId)?.name || "",
          Goal: goalItem.title,
          ThrustArea: goalItem.thrustArea,
          UoM: uomTypes[goalItem.uom]?.label || goalItem.uom,
          Target: goalItem.target,
          Weightage: `${goalItem.weightage}%`,
          SheetStatus: sheet.status,
        };
        ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
          const update = goalItem.achievements?.[quarter] || {};
          const progress = progressFor(goalItem, quarter);
          base[`${quarter}Actual`] = update.actual || "";
          base[`${quarter}Status`] = update.status || "";
          base[`${quarter}Progress`] = progress.value == null ? "" : `${progress.value}%`;
        });
        rows.push(base);
      });
    });
    return rows;
  }

  function exportCsv() {
    const rows = reportRows();
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header] ?? "");
            return `"${value.replaceAll('"', '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "atomquest-achievement-report.csv";
    link.click();
    URL.revokeObjectURL(url);
    setToast("CSV export started");
    render();
  }

  function handleGoalUpdate(target) {
    const sheet = findSheetForGoal(target.dataset.goalId);
    if (!sheet) return;
    const goalItem = sheet.goals.find((item) => item.id === target.dataset.goalId);
    const field = target.dataset.field;
    const previous = goalItem[field];
    goalItem[field] = field === "weightage" ? numberValue(target.value) : target.value;

    if (field === "uom") {
      goalItem.target = "";
      goalItem.achievements = {};
    }

    const actor = currentUser();
    const isManager = actor.role === "Manager";
    if (isManager) {
      const employeeId = findEmployeeForGoal(goalItem.id);
      const employee = state.users.find((user) => user.id === employeeId);
      addAudit(
        actor.id,
        "Manager adjustment",
        `${actor.name} changed ${field} for ${employee?.name || employeeId}: ${previous || "-"} -> ${
          goalItem[field] || "-"
        }.`,
      );
    } else if (sheet.status === "approved") {
      addAudit(
        actor.id,
        "Post-lock edit",
        `${actor.name} changed ${field} on an unlocked approved sheet: ${previous || "-"} -> ${
          goalItem[field] || "-"
        }.`,
      );
    }

    saveState();
    render();
  }

  function findSheetForGoal(goalId) {
    return Object.values(state.goalSheets).find((sheet) =>
      sheet.goals.some((goalItem) => goalItem.id === goalId),
    );
  }

  function findEmployeeForGoal(goalId) {
    return findSheetForGoal(goalId)?.employeeId;
  }

  function updateAchievement(target) {
    const sheet = sheetFor(currentUserId);
    const goalItem = sheet.goals.find((item) => item.id === target.dataset.goalId);
    if (!goalItem) return;

    const quarter = target.dataset.quarter;
    const field = target.dataset.field;
    const payload = {
      ...(goalItem.achievements?.[quarter] || { actual: "", status: "Not Started" }),
      [field]: target.value,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUserId,
    };

    goalItem.achievements[quarter] = payload;

    if (goalItem.sharedGroupId && goalItem.primaryOwnerId === currentUserId) {
      Object.values(state.goalSheets).forEach((linkedSheet) => {
        linkedSheet.goals.forEach((linkedGoal) => {
          if (linkedGoal.sharedGroupId === goalItem.sharedGroupId) {
            linkedGoal.achievements[quarter] = { ...payload };
          }
        });
      });
      addAudit(
        currentUserId,
        "Shared achievement sync",
        `${currentUser().name} updated ${goalItem.title}; ${quarter} achievement synced to linked goal sheets.`,
      );
    }

    saveState();
    render();
  }

  function handleAddGoal(event) {
    event.preventDefault();
    const sheet = sheetFor(currentUserId);
    if (!canEditSheet(sheet) || sheet.goals.length >= 8) return;
    const data = new FormData(event.target);
    sheet.goals.push(
      goal({
        thrustArea: data.get("thrustArea"),
        title: data.get("title"),
        description: data.get("description"),
        uom: data.get("uom"),
        target: data.get("target"),
        weightage: numberValue(data.get("weightage")),
      }),
    );
    if (sheet.status === "returned") sheet.returnedNote = "";
    saveState();
    render();
  }

  function submitSheet() {
    const sheet = sheetFor(currentUserId);
    if (!canSubmitSheet(sheet)) return;
    sheet.status = "submitted";
    sheet.locked = false;
    sheet.submittedAt = new Date().toISOString();
    sheet.returnedNote = "";
    sheet.unlockReason = "";
    addAudit(currentUserId, "Goal sheet submitted", `${currentUser().name} submitted a goal sheet for L1 approval.`);
    setToast("Goal sheet sent to L1");
    saveState();
    render();
  }

  function deleteGoal(goalId) {
    const sheet = sheetFor(currentUserId);
    if (!canEditSheet(sheet)) return;
    sheet.goals = sheet.goals.filter((item) => item.id !== goalId);
    setToast("Goal removed", "warn");
    saveState();
    render();
  }

  function approveSheet(employeeId) {
    const sheet = sheetFor(employeeId);
    if (sheet.status !== "submitted" || validationFor(sheet).length) return;
    sheet.status = "approved";
    sheet.locked = true;
    sheet.approvedAt = new Date().toISOString();
    sheet.returnedNote = "";
    const employee = state.users.find((user) => user.id === employeeId);
    addAudit(currentUserId, "Goal sheet approved", `${currentUser().name} approved ${employee?.name || employeeId}'s goal sheet.`);
    setToast("Goal sheet approved");
    saveState();
    render();
  }

  function returnSheet(employeeId) {
    const sheet = sheetFor(employeeId);
    const reason = window.prompt("Return reason", "Please revise targets or weightage.");
    if (!reason) return;
    sheet.status = "returned";
    sheet.locked = false;
    sheet.returnedNote = reason;
    const employee = state.users.find((user) => user.id === employeeId);
    addAudit(currentUserId, "Goal sheet returned", `${currentUser().name} returned ${employee?.name || employeeId}'s sheet: ${reason}`);
    setToast("Returned for rework", "warn");
    saveState();
    render();
  }

  function unlockSheet(employeeId) {
    const sheet = sheetFor(employeeId);
    if (!sheet.locked) return;
    const reason = window.prompt("Unlock reason", "HR exception unlock for correction.");
    if (!reason) return;
    sheet.locked = false;
    sheet.unlockReason = reason;
    const employee = state.users.find((user) => user.id === employeeId);
    addAudit(currentUserId, "Goal sheet unlocked", `${currentUser().name} unlocked ${employee?.name || employeeId}'s approved sheet: ${reason}`);
    setToast("Sheet unlocked for exception", "warn");
    saveState();
    render();
  }

  function saveCheckin(event) {
    event.preventDefault();
    const form = event.target;
    const employeeId = form.dataset.employeeId;
    const quarter = form.dataset.quarter;
    const existing = state.checkins.find(
      (item) => item.employeeId === employeeId && item.quarter === quarter,
    );
    const data = new FormData(form);
    const payload = {
      focus: data.get("focus"),
      blockers: data.get("blockers"),
      nextSteps: data.get("nextSteps"),
      createdAt: new Date().toISOString(),
    };
    if (existing) {
      Object.assign(existing, payload);
    } else {
      state.checkins.push({
        id: id("chk"),
        employeeId,
        managerId: currentUserId,
        quarter,
        ...payload,
      });
    }
    const employee = state.users.find((user) => user.id === employeeId);
    addAudit(currentUserId, "Check-in comment saved", `${currentUser().name} saved ${quarter} check-in notes for ${employee?.name || employeeId}.`);
    setToast("Check-in saved");
    saveState();
    render();
  }

  function pushSharedKpi(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const recipients = data.getAll("recipients");
    const primaryOwnerId = data.get("primaryOwnerId");
    if (!recipients.includes(primaryOwnerId)) recipients.push(primaryOwnerId);

    const blocked = recipients.filter((employeeId) => sheetFor(employeeId).goals.length >= 8);
    if (blocked.length) {
      window.alert("One or more selected employees already have 8 goals.");
      return;
    }

    const sharedGroupId = id("shared");
    recipients.forEach((employeeId) => {
      const sheet = sheetFor(employeeId);
      sheet.goals.push(
        goal({
          thrustArea: data.get("thrustArea"),
          title: data.get("title"),
          description: data.get("description"),
          uom: data.get("uom"),
          target: data.get("target"),
          weightage: numberValue(data.get("weightage")),
          sharedGroupId,
          primaryOwnerId,
        }),
      );
    });
    addAudit(
      currentUserId,
      "Shared KPI pushed",
      `${currentUser().name} pushed "${data.get("title")}" to ${recipients.length} employee goal sheets.`,
    );
    setToast("Shared KPI pushed");
    saveState();
    render();
  }

  function saveCycle(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const period = data.get("activePeriod");
    state.cycle.activePeriod = period;
    state.cycle.periodOpen[period] = data.get("windowOpen") === "open";
    addAudit(currentUserId, "Cycle updated", `${currentUser().name} set ${periodById(period).label} to ${state.cycle.periodOpen[period] ? "open" : "closed"}.`);
    setToast("Cycle window updated");
    saveState();
    render();
  }

  function generateEscalations() {
    const active = activePeriod();
    const createdAt = new Date().toISOString();
    const nextEscalations = [];
    employees().forEach((member) => {
      const sheet = sheetFor(member.id);
      if (active.type === "goal" && sheet.status === "draft") {
        nextEscalations.push({
          id: id("esc"),
          employeeId: member.id,
          employeeName: member.name,
          type: "Goal not submitted",
          message: "Notify employee, then manager, then HR if still pending.",
          createdAt,
        });
      }
      if (active.type === "goal" && sheet.status === "submitted") {
        nextEscalations.push({
          id: id("esc"),
          employeeId: member.id,
          employeeName: member.name,
          type: "Approval pending",
          message: "Notify L1 manager and HR if approval remains pending.",
          createdAt,
        });
      }
      if (active.type === "checkin" && !checkinComplete(member.id, active.id)) {
        nextEscalations.push({
          id: id("esc"),
          employeeId: member.id,
          employeeName: member.name,
          type: `${active.id} check-in pending`,
          message: "Notify employee and manager for achievement capture and discussion notes.",
          createdAt,
        });
      }
    });
    state.escalations = [...nextEscalations, ...state.escalations].slice(0, 50);
    addAudit(currentUserId, "Escalations generated", `${currentUser().name} generated ${nextEscalations.length} escalation records.`);
    setToast(`${nextEscalations.length} escalations generated`);
    saveState();
    render();
  }

  function seedDemoProgress() {
    state.cycle.activePeriod = ui.selectedQuarter;
    state.cycle.periodOpen[ui.selectedQuarter] = true;
    const profiles = {
      emp1: [91, 17, "2026-12-10"],
      emp2: [99, 20, "2026-11-24"],
      emp3: [0, 83, "2026-10-20"],
    };
    employees().forEach((member) => {
      const sheet = sheetFor(member.id);
      sheet.goals.forEach((goalItem, index) => {
        const fallback = goalItem.uom === "timeline" ? goalItem.target : goalItem.uom === "zero" ? "0" : goalItem.target;
        const actual = profiles[member.id]?.[index] ?? fallback;
        goalItem.achievements[ui.selectedQuarter] = {
          actual: String(actual),
          status: index === 0 ? "Completed" : "On Track",
          updatedAt: new Date().toISOString(),
          updatedBy: currentUserId,
        };
      });
      if (
        sheet.status === "approved" &&
        !state.checkins.some(
          (item) => item.employeeId === member.id && item.quarter === ui.selectedQuarter,
        )
      ) {
        state.checkins.push({
          id: id("chk"),
          employeeId: member.id,
          managerId: member.managerId,
          quarter: ui.selectedQuarter,
          focus: "Progress reviewed against planned targets.",
          blockers: "No critical blocker reported.",
          nextSteps: "Continue weekly follow-up and close delayed items early.",
          createdAt: new Date().toISOString(),
        });
      }
    });
    addAudit(
      currentUserId,
      "Demo progress generated",
      `${currentUser().name} populated ${ui.selectedQuarter} achievements for presentation flow.`,
    );
    setToast(`${ui.selectedQuarter} demo progress added`);
    saveState();
    render();
  }

  function resetDemo() {
    if (!window.confirm("Reset all demo data?")) return;
    state = createSeedState();
    currentUserId = state.currentUserId;
    currentView = state.currentView;
    ui.selectedQuarter = "Q1";
    ui.teamFilter = "";
    ui.reportFilter = "";
    setToast("Demo reset");
    saveState();
    render();
  }

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.id === "user-switcher") {
      currentUserId = target.value;
      currentView = defaultViewForRole(currentUser().role);
      saveState();
      render();
      return;
    }
    if (target.matches("[data-action='update-goal']")) {
      handleGoalUpdate(target);
      return;
    }
    if (target.matches("[data-action='update-achievement']")) {
      updateAchievement(target);
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.matches("[data-action='filter-team']")) {
      ui.teamFilter = target.value;
      render();
    }
    if (target.matches("[data-action='filter-report']")) {
      ui.reportFilter = target.value;
      render();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.action === "close-modal") {
      ui.modal = null;
      render();
      return;
    }

    if (target.dataset.view) {
      currentView = target.dataset.view;
      saveState();
      render();
      return;
    }

    const action = target.dataset.action;
    if (action === "submit-sheet") submitSheet();
    if (action === "delete-goal") deleteGoal(target.dataset.goalId);
    if (action === "approve-sheet") approveSheet(target.dataset.employeeId);
    if (action === "return-sheet") returnSheet(target.dataset.employeeId);
    if (action === "unlock-sheet") unlockSheet(target.dataset.employeeId);
    if (action === "export-csv") exportCsv();
    if (action === "generate-escalations") generateEscalations();
    if (action === "seed-demo-progress") seedDemoProgress();
    if (action === "select-quarter") {
      ui.selectedQuarter = target.dataset.quarter;
      render();
    }
    if (action === "open-sheet") openSheetModal(target.dataset.employeeId);
    if (action === "reset-demo") resetDemo();
  });

  document.addEventListener("click", (event) => {
    const backdrop = event.target.closest(".modal-backdrop");
    if (backdrop && event.target === backdrop) {
      ui.modal = null;
      render();
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "add-goal-form") handleAddGoal(event);
    if (event.target.id === "shared-kpi-form") pushSharedKpi(event);
    if (event.target.id === "cycle-form") saveCycle(event);
    if (event.target.matches("[data-action='save-checkin']")) saveCheckin(event);
  });

  render();
})();
