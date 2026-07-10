declare var L: any;

const role = document.body.dataset.rolePage;
const $ = (id: string) => document.getElementById(id);

const center: [number, number] = [14.68135, 120.97455];
const scopeBounds: [[number, number], [number, number]] = [
  [14.67765, 120.96965],
  [14.68475, 120.98035],
];

interface Sentinel {
  id: string;
  pos: [number, number];
  risk: string;
  eggs: number;
  zone: string;
}

interface LegendRow {
  className: string;
  label: string;
}

interface ListItem {
  text?: string;
  current?: boolean;
}

interface MetricItem {
  label: string;
  value: string;
}

interface AlertItem {
  time: string;
  label: string;
  type: string;
}

interface ActivityItem {
  time: string;
  label: string;
  type: string;
}

interface QueueItem {
  label: string;
  value: string;
  tone?: string;
}

interface Barangay {
  name: string;
  score: number;
  risk: string;
  bounds: [[number, number], [number, number]];
  teams?: string[];
}

interface DispatchTeam {
  id: string;
  name: string;
  members: number;
  status: "ready" | "dispatched" | "on-site" | "returning";
  zone: string;
  lead: string;
  role: string;
  targetZone?: string;
}

const dispatchTeams: DispatchTeam[] = [
  {
    id: "T-01",
    name: "Alpha",
    members: 3,
    status: "ready",
    zone: "School drainage",
    lead: "M. Santos",
    role: "Field Inspector",
  },
  {
    id: "T-02",
    name: "Bravo",
    members: 2,
    status: "dispatched",
    zone: "General Luna",
    lead: "J. Cruz",
    role: "Response Team",
  },
  {
    id: "T-03",
    name: "Charlie",
    members: 4,
    status: "on-site",
    zone: "Mabini cluster",
    lead: "R. Reyes",
    role: "Response Team",
  },
  {
    id: "T-04",
    name: "Delta",
    members: 2,
    status: "ready",
    zone: "Transmitter site",
    lead: "L. Garcia",
    role: "Field Inspector",
  },
  {
    id: "T-05",
    name: "Echo",
    members: 3,
    status: "ready",
    zone: "J.P. Rizal",
    lead: "A. Flores",
    role: "Field Inspector",
  },
  {
    id: "T-06",
    name: "Foxtrot",
    members: 4,
    status: "returning",
    zone: "Sampaguita",
    lead: "D. Tan",
    role: "Response Team",
  },
  {
    id: "T-07",
    name: "Golf",
    members: 2,
    status: "ready",
    zone: "General Luna",
    lead: "C. Lim",
    role: "Response Team",
  },
  {
    id: "T-08",
    name: "Hotel",
    members: 3,
    status: "dispatched",
    zone: "School drainage",
    lead: "B. Yu",
    role: "Field Inspector",
  },
];

const sentinels: Sentinel[] = [
  {
    id: "OVI-A",
    pos: [14.68065, 120.9748],
    risk: "critical",
    eggs: 91,
    zone: "School drainage",
  },
  {
    id: "OVI-A2",
    pos: [14.68105, 120.9741],
    risk: "high",
    eggs: 72,
    zone: "General Luna",
  },
  {
    id: "OVI-A3",
    pos: [14.6797, 120.97355],
    risk: "high",
    eggs: 76,
    zone: "Sampaguita",
  },
  {
    id: "OVI-C1",
    pos: [14.68255, 120.97245],
    risk: "moderate",
    eggs: 49,
    zone: "Mabini cluster",
  },
  {
    id: "OVI-B",
    pos: [14.68275, 120.9769],
    risk: "moderate",
    eggs: 42,
    zone: "J.P. Rizal",
  },
  {
    id: "OVI-D",
    pos: [14.67925, 120.97675],
    risk: "low",
    eggs: 18,
    zone: "Transmitter site",
  },
];

const riskColor: Record<string, string> = {
  critical: "#dc2626",
  high: "#f97316",
  moderate: "#d99a00",
  low: "#16a34a",
};
const riskLabel: Record<string, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Mod.",
  low: "Low",
};

function toggleCollapse(btn: HTMLElement) {
  const body = btn.closest("article")?.querySelector(".collapse-body");
  if (!body) return;
  body.classList.toggle("is-open");
  btn.textContent = body.classList.contains("is-open")
    ? "Show less"
    : "See more";
}

const recentActivity: ActivityItem[] = [
  {
    time: "2h ago",
    label: "Citizen report R-104 (larvae) submitted near General Luna",
    type: "report",
  },
  {
    time: "3h ago",
    label: "Inspector checked in at School drainage perimeter",
    type: "inspection",
  },
  {
    time: "5h ago",
    label: "Treatment team completed larvicide at Mabini cluster",
    type: "treatment",
  },
  {
    time: "6h ago",
    label: "OVI-A sentinel alert: 91 eggs counted — critical threshold",
    type: "alert",
  },
  {
    time: "8h ago",
    label: "Task T-22 assigned to BHW-03 for General Luna inspection",
    type: "task",
  },
  {
    time: "1d ago",
    label: "Routine preventive patrol completed — Dambana Creekside",
    type: "patrol",
  },
];

const citizenReport = {
  id: "R-104",
  pos: [14.68088, 120.97415] as [number, number],
  label: "Report",
};
const task = {
  id: "T-22",
  pos: [14.68105, 120.9744] as [number, number],
  label: "Inspect",
};

const barangaySearchTargets = [
  {
    name: "School drainage",
    keywords: [
      "school",
      "drainage",
      "ovi-a",
      "drainage canal a",
      "drainage canal b",
    ],
    pos: [14.68065, 120.9748] as [number, number],
    zoom: 18,
  },
  {
    name: "General Luna",
    keywords: ["general luna", "canal", "ovi-a2"],
    pos: [14.68105, 120.9741] as [number, number],
    zoom: 18,
  },
  {
    name: "Sampaguita",
    keywords: ["sampaguita", "ovi-a3"],
    pos: [14.6797, 120.97355] as [number, number],
    zoom: 18,
  },
  {
    name: "Mabini cluster",
    keywords: ["mabini", "cluster", "ovi-c1"],
    pos: [14.68255, 120.97245] as [number, number],
    zoom: 18,
  },
  {
    name: "J.P. Rizal",
    keywords: ["j.p. rizal", "jp rizal", "rizal", "ovi-b"],
    pos: [14.68275, 120.9769] as [number, number],
    zoom: 18,
  },
  {
    name: "Transmitter site",
    keywords: ["transmitter", "tower", "ovi-d"],
    pos: [14.67925, 120.97675] as [number, number],
    zoom: 18,
  },
  {
    name: "Citizen report",
    keywords: ["report", "citizen report", "larvae"],
    pos: citizenReport.pos,
    zoom: 18,
  },
  {
    name: "Inspection task",
    keywords: ["task", "inspection", "inspect"],
    pos: task.pos,
    zoom: 18,
  },
];

const inspectionPath: [number, number][] = [
  [14.6812, 120.97435],
  [14.68195, 120.97438],
  [14.68208, 120.97345],
  [14.68118, 120.9734],
  [14.6811, 120.97415],
  [14.68042, 120.97423],
  [14.67982, 120.97505],
  [14.67995, 120.97642],
  [14.68072, 120.97655],
  [14.68088, 120.97415],
];

const cityBarangays: Barangay[] = [
  {
    name: "Karuhatan",
    score: 88,
    risk: "critical",
    bounds: [
      [14.67795, 120.9699],
      [14.68455, 120.9799],
    ],
    teams: ["T-01", "T-08"],
  },
  {
    name: "Marulas",
    score: 61,
    risk: "high",
    bounds: [
      [14.6757, 120.9753],
      [14.68145, 120.9835],
    ],
    teams: ["T-02", "T-07"],
  },
  {
    name: "Tinajeros",
    score: 39,
    risk: "moderate",
    bounds: [
      [14.67475, 120.9668],
      [14.67975, 120.97355],
    ],
    teams: ["T-03", "T-04"],
  },
];

const teamZones = [
  "School drainage",
  "General Luna",
  "Mabini cluster",
  "J.P. Rizal",
  "Transmitter site",
  "Sampaguita",
];

function deployTeam(teamId: string) {
  const team = dispatchTeams.find((t) => t.id === teamId);
  if (!team || team.status !== "ready") return;
  const zoneEl = document.getElementById(
    `deployZone-${teamId}`,
  ) as HTMLSelectElement;
  team.targetZone = zoneEl?.value || team.zone;
  team.status = "dispatched";
  renderTeamModal();
}

function renderTeamModal() {
  const popup = document.getElementById("teamPopup");
  if (!popup) return;
  const statusLabel: Record<string, string> = {
    ready: "Ready",
    dispatched: "En route",
    "on-site": "On site",
    returning: "Returning",
  };
  const readyCount = dispatchTeams.filter((t) => t.status === "ready").length;
  popup.innerHTML = `
    <div class="team-overlay-bg"></div>
    <div class="team-modal">
      <div class="team-modal-head">
        <div>
          <h3>Team Dispatch</h3>
          <p class="team-modal-sub">${readyCount} team${readyCount !== 1 ? "s" : ""} ready to deploy</p>
        </div>
        <button class="team-modal-close" onclick="toggleTeamPopup()">&times;</button>
      </div>
      <div class="team-modal-body">
        <div class="team-modal-list">
          ${dispatchTeams
            .map(
              (t) => `
            <div class="team-modal-card ${t.status}">
              <div class="team-modal-card-head">
                <span class="team-photo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>
                <span class="team-name">${t.name}</span>
                <span class="team-role-tag">${t.role}</span>
                <span class="team-badge ${t.status}">${statusLabel[t.status]}</span>
              </div>
              <div class="team-modal-card-body">
                <span class="team-lead">${t.lead}</span>
                <span class="team-members">${t.members} members</span>
              </div>
              <div class="team-modal-card-footer ${t.status === "ready" ? "is-ready" : ""}">
                ${
                  t.status === "ready"
                    ? `
                  <div class="team-deploy-form">
                    <select id="deployZone-${t.id}" class="deploy-select">
                      ${teamZones.map((z) => `<option value="${z}" ${z === t.zone ? "selected" : ""}>${z}</option>`).join("")}
                    </select>
                    <button class="deploy-btn" onclick="deployTeam('${t.id}')">Deploy</button>
                  </div>
                `
                    : `<span class="team-modal-status">${statusLabel[t.status]} ${t.targetZone ? "\u2192 " + t.targetZone : ""}</span>`
                }
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>`;
  popup.classList.add("is-open");
}

function toggleTeamPopup() {
  const popup = document.getElementById("teamPopup");
  const arrow = document.getElementById("teamArrow");
  if (!popup) return;
  const open = popup.classList.contains("is-open");
  if (open) {
    popup.classList.remove("is-open");
    popup.innerHTML = "";
    if (arrow) arrow.innerHTML = "&#9660;";
    return;
  }
  renderTeamModal();
  if (arrow) arrow.innerHTML = "&#9650;";
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const popup = document.getElementById("teamPopup");
  if (
    popup &&
    popup.classList.contains("is-open") &&
    target.closest(".team-overlay-bg")
  ) {
    popup.classList.remove("is-open");
    popup.innerHTML = "";
    const arrow = document.getElementById("teamArrow");
    if (arrow) arrow.innerHTML = "&#9660;";
  }
});

function icon(html: string, className: string) {
  return L.divIcon({
    className: "",
    html: `<div class="${className}">${html}</div>`,
    iconAnchor: [22, 18],
  });
}

function list(id: string, items: (string | ListItem)[]) {
  const node = $(id);
  if (!node) return;
  node.innerHTML = items
    .map(
      (item) =>
        `<li class="${(item as ListItem).current ? "is-current" : ""}">${(item as ListItem).text || item}</li>`,
    )
    .join("");
}

function metrics(items: MetricItem[], containerId = "metrics") {
  const node = $(containerId);
  if (!node) return;
  node.innerHTML = items
    .map(
      ({ label, value }) =>
        `<div><span>${label}</span><strong>${value}</strong></div>`,
    )
    .join("");
}

function ops(items: MetricItem[]) {
  const node = $("opsGrid");
  if (!node) return;
  node.innerHTML = items
    .map(
      ({ label, value }) =>
        `<div><span>${label}</span><strong>${value}</strong></div>`,
    )
    .join("");
}

function queue(items: QueueItem[]) {
  const node = $("priorityQueue");
  if (!node) return;
  node.innerHTML = `<div class="queue-stack">${items
    .map(
      (item) =>
        `<div class="queue-item ${item.tone || ""}" onclick="showBarangayRoles('${item.label}')"><span>${item.label}</span><strong>${item.value}</strong></div>`,
    )
    .join("")}</div>`;
}

function addBaseMap(containerId = "roleMap") {
  const map = L.map(containerId, {
    zoomControl: true,
    scrollWheelZoom: true,
  }).setView(center, 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
  return map;
}

function addLegend(map: any, rows: LegendRow[]) {
  const legend = L.control({ position: "bottomleft" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "map-legend");
    div.innerHTML = `<strong>Legend</strong>${rows
      .map((row) => `<span><i class="${row.className}"></i>${row.label}</span>`)
      .join("")}`;
    return div;
  };
  legend.addTo(map);
}

function addBarangayScope(map: any) {
  L.rectangle(scopeBounds, {
    color: "#0f766e",
    weight: 3,
    dashArray: "9 7",
    fill: false,
  }).addTo(map);
}

function addRiskLayers(map: any, options: { public?: boolean } = {}) {
  L.circle([14.68075, 120.97435], {
    radius: 430,
    color: "#dc2626",
    weight: 4,
    fillColor: "#dc2626",
    fillOpacity: options.public ? 0.08 : 0.14,
  }).addTo(map);

  L.circle([14.68145, 120.97305], {
    radius: 350,
    color: "#f97316",
    weight: 2,
    fillColor: "#f97316",
    fillOpacity: 0.08,
  }).addTo(map);

  L.circle([14.68255, 120.9765], {
    radius: 390,
    color: "#d99a00",
    weight: 2,
    fillColor: "#d99a00",
    fillOpacity: 0.07,
  }).addTo(map);
}

function addSentinels(map: any, detailed = true) {
  sentinels.forEach((trap) => {
    const text = detailed ? `${trap.id}` : "OVI";
    L.marker(trap.pos, { icon: icon(text, `trap-pin ${trap.risk}`) })
      .bindPopup(`<strong>${trap.id}</strong><br>${trap.zone}`)
      .addTo(map);
  });
}

function shortAddress(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const compact = parts.slice(0, 2).join(", ") || address;
  return compact.length > 54 ? compact.slice(0, 51).trimEnd() + "..." : compact;
}

function citizenView(map: any) {
  addRiskLayers(map, { public: true });
  L.marker(citizenReport.pos, { icon: icon("My report", "report-pin") }).addTo(
    map,
  );
  L.marker([14.67995, 120.97685], {
    icon: icon("Advisory", "hex-pin moderate"),
  }).addTo(map);
  addLegend(map, [
    { className: "legend-risk", label: "Public monitoring area" },
    { className: "legend-report", label: "Submitted report" },
  ]);
  const userHome = (window as any)._userHome;
  const homeLabel = userHome?.address ? shortAddress(userHome.address) : "";
  if (userHome) {
    map.setView([userHome.lat, userHome.lng], 16);
    const search = $("locationSearch") as HTMLInputElement | null;
    if (search && homeLabel) search.value = homeLabel;
    const status = $("locationStatus");
    if (status)
      status.textContent = `Showing area for your saved location${homeLabel ? ": " + homeLabel : "."}`;
  } else {
    map.fitBounds(scopeBounds, { padding: [28, 28] });
  }

  fetch("/api/v1/public-status/areas")
    .then((r) => r.json())
    .then((json: any) => {
      const areas = json.data || [];
      let area = null;
      if (userHome) {
        let minDist = Infinity;
        areas.forEach((a: any) => {
          if (a.centerLat && a.centerLng) {
            const d =
              Math.pow(a.centerLat - userHome.lat, 2) +
              Math.pow(a.centerLng - userHome.lng, 2);
            if (d < minDist) {
              minDist = d;
              area = a;
            }
          }
        });
      }
      if (!area) area = areas[0];
      if (area) {
        const name = $("currentAreaName");
        if (name) name.textContent = homeLabel || area.areaName;
        const badge = $("currentAreaStatus");
        if (badge) {
          const colors: Record<string, string> = {
            red: "bg-red-100 text-red-700",
            orange: "bg-orange-100 text-orange-700",
            yellow: "bg-amber-100 text-amber-700",
            green: "bg-green-100 text-green-700",
            gray: "bg-slate-100 text-slate-600",
          };
          const labels: Record<string, string> = {
            red: "Critical",
            orange: "High",
            yellow: "Moderate",
            green: "Low Risk",
            gray: "Unverified",
          };
          badge.textContent = labels[area.publicStatus] || area.publicStatus;
          badge.className =
            "ml-auto rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider " +
            (colors[area.publicStatus] || "bg-slate-100 text-slate-600");
        }
      }
    })
    .catch(() => {});

  const CITIZEN_ID = 5;
  let tickets: any[] = [];
  let pendingCancelId: number | null = null;

  function renderTickets() {
    const tbody = $("ticketTableBody");
    if (!tbody) return;
    tbody.innerHTML = tickets
      .map((t, i) => {
        const status = t.status || t.Status || "Submitted";
        const color =
          status === "Resolved"
            ? "text-green-600 bg-green-50"
            : status === "Cancelled"
              ? "text-red-600 bg-red-50"
              : status === "Pending Review" || status === "Pending_Review"
                ? "text-amber-600 bg-amber-50"
                : "text-slate-600 bg-slate-50";
        const canCancel =
          status === "Submitted" ||
          status === "Pending Review" ||
          status === "Pending_Review";
        const type = t.type || t.Type || "";
        const desc = t.description || t.Description || "";
        const date = (t.createdAt || "").substring(0, 10);
        return `<tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50">
        <td class="px-5 py-3 font-medium text-slate-800">${type}</td>
        <td class="px-5 py-3 text-slate-500">${desc}</td>
        <td class="px-5 py-3"><span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${color}">${status}</span></td>
        <td class="px-5 py-3 text-slate-400">${date}</td>
        <td class="px-5 py-3">${canCancel ? `<button class="cancel-ticket-btn rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100" data-id="${t.id || t.ID}">Cancel</button>` : ""}</td>
      </tr>`;
      })
      .join("");
    const count = $("ticketCount");
    if (count)
      count.textContent =
        tickets.length + " ticket" + (tickets.length !== 1 ? "s" : "");
    tbody.querySelectorAll(".cancel-ticket-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        pendingCancelId = parseInt(btn.getAttribute("data-id")!);
        const modal = document.getElementById("cancelConfirmModal");
        if (modal) {
          modal.classList.remove("hidden");
          modal.classList.add("flex");
        }
      });
    });
  }

  function loadTickets() {
    fetch("/api/v1/tickets")
      .then((r) => r.json())
      .then((json) => {
        tickets = json.data || [];
        renderTickets();
      })
      .catch(() => {});
  }
  loadTickets();

  const button = $("submitReportButton");
  if (button) {
    button.addEventListener("click", () => {
      const modal = document.getElementById("submitConfirmModal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }
    });
  }

  const confirmSubmit = document.getElementById("confirmSubmit");
  if (confirmSubmit) {
    confirmSubmit.addEventListener("click", () => {
      const select = $("concernType") as HTMLSelectElement;
      const desc = $("reportDescription") as HTMLTextAreaElement;
      if (!select || !desc) return;
      fetch("/api/v1/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: select.value,
          description: desc.value,
          submittedBy: CITIZEN_ID,
        }),
      })
        .then((r) => r.json())
        .then(() => {
          select.selectedIndex = 0;
          desc.value = "";
          loadTickets();
          $("reportStatus").textContent = "Ticket submitted.";
          const m = document.getElementById("submitConfirmModal");
          m.classList.add("hidden");
          m.classList.remove("flex");
        })
        .catch((e) => {
          console.error(e);
          $("reportStatus").textContent =
            "Error: " + (e.message || "submit failed");
        });
    });
  }

  const cancelSubmitConfirm = document.getElementById("cancelSubmitConfirm");
  if (cancelSubmitConfirm) {
    cancelSubmitConfirm.addEventListener("click", () => {
      const m = document.getElementById("submitConfirmModal");
      m.classList.add("hidden");
      m.classList.remove("flex");
    });
  }

  const confirmCancelTicket = document.getElementById("confirmCancelTicket");
  if (confirmCancelTicket) {
    confirmCancelTicket.addEventListener("click", () => {
      if (pendingCancelId === null) return;
      fetch("/api/v1/tickets/" + pendingCancelId + "/cancel", {
        method: "PATCH",
      })
        .then((r) => r.json())
        .then(() => loadTickets())
        .catch(() => alert("Failed to cancel ticket"))
        .finally(() => {
          pendingCancelId = null;
          const m = document.getElementById("cancelConfirmModal");
          m.classList.add("hidden");
          m.classList.remove("flex");
        });
    });
  }

  const cancelCancelConfirm = document.getElementById("cancelCancelConfirm");
  if (cancelCancelConfirm) {
    cancelCancelConfirm.addEventListener("click", () => {
      pendingCancelId = null;
      const m = document.getElementById("cancelConfirmModal");
      m.classList.add("hidden");
      m.classList.remove("flex");
    });
  }

  const locateButton = $("locateButton");
  if (locateButton) {
    locateButton.addEventListener("click", () => {
      if (userHome) {
        map.flyTo([userHome.lat, userHome.lng], 17, { duration: 0.8 });
        $("locationStatus")!.textContent =
          `Showing area for your saved location${homeLabel ? ": " + homeLabel : "."}`;
      } else {
        map.flyTo([14.6808, 120.9745], 17, { duration: 0.8 });
        $("locationStatus")!.textContent =
          `Showing public monitoring area for ${($("locationSearch") as HTMLInputElement)?.value || "selected location"}.`;
      }
    });
  }
}

function sentinelStatus() {
  const node = $("sentinelGrid");
  if (!node) return;
  node.innerHTML = sentinels
    .map(
      (trap) => `
    <div class="sentinel-card ${trap.risk}">
      <div class="sentinel-head">
        <span class="sentinel-id">${trap.id}</span>
        <span class="sentinel-badge ${trap.risk}">${riskLabel[trap.risk]}</span>
      </div>
      <div class="sentinel-body">
        <span class="sentinel-zone">${trap.zone}</span>
        <strong class="sentinel-eggs">${trap.eggs}<small> eggs</small></strong>
      </div>
      <div class="sentinel-bar ${trap.risk}" style="width:${Math.min(trap.eggs, 100)}%"></div>
    </div>
  `,
    )
    .join("");
}

function activityFeed() {
  const node = $("activityList");
  if (!node) return;
  node.innerHTML = recentActivity
    .map(
      (item) => `
    <div class="activity-item">
      <div class="activity-dot ${item.type}"></div>
      <div class="activity-content">
        <p class="activity-text">${item.label}</p>
        <span class="activity-time">${item.time}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

function barangayView(map: any) {
  addBarangayScope(map);
  addRiskLayers(map);
  addSentinels(map);
  L.marker(citizenReport.pos, {
    icon: icon(citizenReport.label, "report-pin"),
  }).addTo(map);
  L.marker(task.pos, { icon: icon(task.label, "task-pin") }).addTo(map);
  L.polyline(inspectionPath, {
    color: "#7c3aed",
    weight: 5,
    opacity: 0.8,
  }).addTo(map);
  addLegend(map, [
    { className: "legend-scope", label: "Barangay scope" },
    { className: "legend-risk", label: "Risk perimeter" },
    { className: "legend-trap", label: "Smart ovitrap" },
    { className: "legend-report", label: "Citizen report" },
    { className: "legend-task", label: "Inspection task" },
  ]);
  map.fitBounds(scopeBounds, { padding: [28, 28] });

  metrics([
    { label: "Critical zones", value: "1" },
    { label: "Open tasks", value: "4" },
    { label: "Sentinels online", value: "6 / 7" },
    { label: "For recheck", value: "2" },
  ]);
  ops([
    { label: "Zone mapping", value: "Mapped" },
    { label: "Risk scoring", value: "Live" },
    { label: "High-risk alert", value: "Created" },
    { label: "Inspection assignment", value: "BHW-03" },
    { label: "Risk perimeter", value: "Verified" },
    { label: "Intervention status", value: "Active" },
  ]);
  sentinelStatus();
  activityFeed();
  queue([
    {
      label: "School drainage cluster",
      value: "Critical score 91",
      tone: "critical",
    },
    { label: "General Luna canal", value: "High score 72" },
    { label: "Transmitter edge", value: "Monitoring", tone: "low" },
  ]);

  const searchInput = $("barangayAreaSearch") as HTMLInputElement | null;
  const searchButton = $("barangayAreaSearchButton");
  const searchStatus = $("barangayAreaSearchStatus");
  let searchMarker: any = null;

  function runBarangaySearch() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    if (!query) {
      if (searchStatus)
        searchStatus.textContent =
          "Enter an area, zone, task, or sentinel name.";
      return;
    }
    const target = barangaySearchTargets.find(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.keywords.some(
          (keyword) => keyword.includes(query) || query.includes(keyword),
        ),
    );
    if (!target) {
      if (searchStatus)
        searchStatus.textContent = `No operation area found for "${searchInput?.value}".`;
      return;
    }
    if (searchMarker) map.removeLayer(searchMarker);
    searchMarker = L.circleMarker(target.pos, {
      radius: 14,
      color: "#0f766e",
      weight: 3,
      fillColor: "#14b8a6",
      fillOpacity: 0.22,
    }).addTo(map);
    map.flyTo(target.pos, target.zoom, { duration: 0.8 });
    if (searchStatus) searchStatus.textContent = `Showing ${target.name}.`;
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", runBarangaySearch);
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") runBarangaySearch();
    });
  }
}

const cityAlerts: AlertItem[] = [
  {
    time: "1h ago",
    label: "Karuhatan critical threshold exceeded — 91 eggs at School drainage",
    type: "critical",
  },
  {
    time: "4h ago",
    label: "Marulas inspection overdue — BHW-02 missed check-in",
    type: "warning",
  },
  {
    time: "6h ago",
    label: "Tinajeros sentinel OVI-C1 moderate — recheck scheduled",
    type: "info",
  },
  {
    time: "12h ago",
    label: "Treatment team deployed to General Luna canal (Marulas)",
    type: "success",
  },
  {
    time: "1d ago",
    label: "Weekly report generated — 3 barangays, 14 completed actions",
    type: "info",
  },
];

function showBarangayRoles(name: string) {
  const overlay = document.createElement("div");
  overlay.className = "role-overlay";
  overlay.innerHTML = `
    <div class="role-modal">
      <div class="role-modal-head">
        <h3>${name}</h3>
        <button class="role-modal-close" onclick="this.closest('.role-overlay').remove()">&times;</button>
      </div>
      <p class="role-modal-sub">Select a role to manage ${name}</p>
      <div class="role-cards">
        <div class="role-card">
          <div class="role-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="role-card-body">
            <h4>Field Inspector</h4>
            <p>Conduct site inspections, monitor breeding sites, submit reports</p>
          </div>
          <a href="/field-inspector?barangay=${name}" class="role-card-btn">Open</a>
        </div>
        <div class="role-card">
          <div class="role-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="role-card-body">
            <h4>Response Team</h4>
            <p>Deploy for larvicide, fogging, and treatment operations</p>
          </div>
          <a href="/response-team?barangay=${name}" class="role-card-btn">Open</a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function barangayComparison() {
  const node = $("comparisonTable");
  if (!node) return;
  node.innerHTML = `<table class="compare-table">
    <thead><tr><th>Barangay</th><th>Score</th><th>Status</th></tr></thead>
    <tbody>${cityBarangays
      .map(
        (b) => `
      <tr onclick="showBarangayRoles('${b.name}')">
        <td class="compare-name">${b.name}</td>
        <td><span class="compare-score ${b.risk}">${b.score}</span></td>
        <td><span class="compare-badge ${b.risk}">${b.risk}</span></td>
      </tr>`,
      )
      .join("")}</tbody>
  </table>`;
}

function alertFeed() {
  const node = $("alertFeed");
  if (!node) return;
  node.innerHTML = cityAlerts
    .map(
      (a) => `
    <div class="alert-item ${a.type}">
      <div class="alert-icon ${a.type}"></div>
      <div class="alert-body">
        <p class="alert-text">${a.label}</p>
        <span class="alert-time">${a.time}</span>
      </div>
    </div>
  `,
    )
    .join("");
}

function cityView(map: any) {
  cityBarangays.forEach((area) => {
    const color =
      area.risk === "critical"
        ? "#dc2626"
        : area.risk === "high"
          ? "#f97316"
          : "#d99a00";
    L.rectangle(area.bounds, {
      color,
      weight: 3,
      fillColor: color,
      fillOpacity: 0.11,
    })
      .bindPopup(
        `<strong>${area.name}</strong><br>Environmental risk score: ${area.score}<br><br><strong>Assigned Teams</strong><br>${(
          area.teams || []
        )
          .map((id) => {
            const t = dispatchTeams.find((d) => d.id === id);
            return t ? `${t.name} (${t.role})` : "";
          })
          .filter(Boolean)
          .join("<br>")}`,
      )
      .addTo(map);
    const labelPos: [number, number] = [
      (area.bounds[0][0] + area.bounds[1][0]) / 2,
      (area.bounds[0][1] + area.bounds[1][1]) / 2,
    ];
    L.marker(labelPos, {
      icon: icon(`${area.name}`, `hex-pin ${area.risk}`),
    }).addTo(map);
  });
  addSentinels(map, false);
  addLegend(map, [
    { className: "legend-risk", label: "Barangay risk area" },
    { className: "legend-trap", label: "Sentinel network" },
  ]);
  map.fitBounds([
    [14.6744, 120.9664],
    [14.6852, 120.984],
  ]);

  metrics([
    { label: "Barangays watched", value: "3" },
    { label: "Critical hotspots", value: "1" },
    { label: "Overdue inspections", value: "2" },
    { label: "Completed actions", value: "14" },
  ]);
  ops([
    { label: "Highest risk", value: "Karuhatan" },
    { label: "Weekly trend", value: "+12%" },
    { label: "Avg. closure time", value: "2.4 days" },
    { label: "Report export", value: "Ready" },
  ]);
  barangayComparison();
  alertFeed();
  list("featureList", [
    "Karuhatan: critical perimeter needs recheck after intervention expiry.",
    "Marulas: high mosquito-prone conditions around drainage and vacant lots.",
    "Tinajeros: moderate risk, continue sentinel monitoring.",
  ]);
  queue([
    { label: "Karuhatan", value: "Critical / 1 unresolved", tone: "critical" },
    { label: "Marulas", value: "High / response active" },
    { label: "Tinajeros", value: "Moderate / monitor", tone: "low" },
  ]);
}

/* ── Field Inspector ────────────────────────────── */

function fieldInspectorView() {
  const fiTasks = [
    {
      site: "Drainage Canal A",
      zone: "School drainage",
      priority: "high",
      due: "Today",
    },
    {
      site: "Drainage Canal B",
      zone: "School drainage",
      priority: "high",
      due: "Today",
    },
    {
      site: "Rizal Market",
      zone: "J.P. Rizal",
      priority: "medium",
      due: "Tomorrow",
    },
    {
      site: "Tower Base Bldg",
      zone: "Transmitter site",
      priority: "low",
      due: "In 3 days",
    },
  ];
  const fiReports = [
    { site: "Drainage Canal B", date: "Jul 6", eggs: 12, status: "Clear" },
    { site: "General Luna", date: "Jul 5", eggs: 45, status: "Alert" },
    { site: "Mabini Elementary", date: "Jul 4", eggs: 8, status: "Clear" },
  ];
  const fiSites = [
    "Drainage Canal A",
    "Drainage Canal B",
    "Rizal Market",
    "Tower Base Bldg",
    "Health Center",
  ];

  const siteNode = $("fiSites");
  if (siteNode) {
    siteNode.innerHTML = fiSites
      .map(
        (s) =>
          `<div class="fi-site-item"><span class="fi-site-icon">&#9679;</span><span>${s}</span></div>`,
      )
      .join("");
  }

  const tasksNode = $("fiTasks");
  if (tasksNode) {
    tasksNode.innerHTML = fiTasks
      .map(
        (t) => `
      <div class="fi-task ${t.priority}">
        <div class="fi-task-head">
          <span class="fi-task-name">${t.site}</span>
          <span class="fi-task-badge ${t.priority}">${t.priority}</span>
        </div>
        <div class="fi-task-meta">
          <span>${t.zone}</span>
          <span>Due: ${t.due}</span>
        </div>
      </div>
    `,
      )
      .join("");
  }

  const formNode = $("fiReportForm");
  if (formNode) {
    formNode.innerHTML = `
      <div class="fi-report-form">
        <label class="fi-label">Site</label>
        <select id="fiReportSite" class="fi-select">
          ${fiSites.map((s) => `<option>${s}</option>`).join("")}
        </select>
        <label class="fi-label">Egg Count</label>
        <input id="fiReportEggs" type="number" class="fi-input" placeholder="e.g. 0" min="0" />
        <label class="fi-label">Findings</label>
        <textarea id="fiReportFindings" class="fi-input fi-textarea" placeholder="Describe findings..." rows="2"></textarea>
        <button class="fi-submit" onclick="submitFiReport()">Submit Report</button>
        <p id="fiReportStatus" class="fi-report-status"></p>
      </div>
    `;
  }

  const reportsNode = $("fiReports");
  if (reportsNode) {
    reportsNode.innerHTML = fiReports
      .map(
        (r) => `
      <div class="fi-report-item">
        <span class="fi-report-site">${r.site}</span>
        <span class="fi-report-date">${r.date}</span>
        <span class="fi-report-eggs">${r.eggs} eggs</span>
        <span class="fi-report-badge ${r.status.toLowerCase()}">${r.status}</span>
      </div>
    `,
      )
      .join("");
  }

  metrics(
    [
      { label: "Assigned sites", value: fiSites.length.toString() },
      {
        label: "Pending today",
        value: fiTasks.filter((t) => t.due === "Today").length.toString(),
      },
      { label: "Reports this week", value: "3" },
      {
        label: "Alert sites",
        value: fiReports.filter((r) => r.status === "Alert").length.toString(),
      },
    ],
    "fiMetrics",
  );

  const m = addBaseMap("fiMap");
  if (m) m.setView([14.6798, 120.9735], 15);
}

function submitFiReport() {
  const site =
    (document.getElementById("fiReportSite") as HTMLSelectElement)?.value || "";
  const eggs =
    (document.getElementById("fiReportEggs") as HTMLInputElement)?.value || "0";
  const findings =
    (document.getElementById("fiReportFindings") as HTMLTextAreaElement)
      ?.value || "";
  const status = document.getElementById("fiReportStatus");
  if (status) {
    status.textContent = `Report for ${site} submitted: ${eggs} eggs counted.`;
    status.className = "fi-report-status success";
    setTimeout(() => {
      if (status) status.textContent = "";
    }, 3000);
  }
}

/* ── Response Team ──────────────────────────────── */

function responseTeamView() {
  const rtTasks = [
    {
      zone: "School drainage",
      type: "Larvicide",
      priority: "high",
      due: "Today",
    },
    { zone: "General Luna", type: "Fogging", priority: "high", due: "Today" },
    {
      zone: "Mabini cluster",
      type: "Larvicide",
      priority: "medium",
      due: "Tomorrow",
    },
    {
      zone: "Sampaguita",
      type: "Fogging",
      priority: "medium",
      due: "Tomorrow",
    },
  ];
  const rtEquipment = [
    { name: "ULV Fogger #1", status: "Ready", lastUse: "Jul 7" },
    { name: "ULV Fogger #2", status: "Ready", lastUse: "Jul 5" },
    { name: "Backpack Sprayer", status: "Maintenance", lastUse: "Jul 3" },
    { name: "Larvicide Stock", status: "Ready", lastUse: "Jul 8" },
  ];
  const rtHistory = [
    {
      zone: "J.P. Rizal",
      type: "Larvicide",
      date: "Jul 7",
      status: "Completed",
    },
    {
      zone: "Transmitter site",
      type: "Fogging",
      date: "Jul 6",
      status: "Completed",
    },
    {
      zone: "General Luna",
      type: "Larvicide",
      date: "Jul 4",
      status: "Completed",
    },
  ];
  const rtDeployments = [
    { team: "Bravo", zone: "Barangay Hall", status: "En route" },
    { team: "Charlie", zone: "Mabini Elementary", status: "On site" },
  ];

  const depNode = $("rtDeployments");
  if (depNode) {
    depNode.innerHTML = rtDeployments
      .map(
        (d) => `
      <div class="rt-dep-item">
        <span class="rt-dep-team">${d.team}</span>
        <span class="rt-dep-zone">${d.zone}</span>
        <span class="rt-dep-status ${d.status === "On site" ? "active" : ""}">${d.status}</span>
      </div>
    `,
      )
      .join("");
  }

  const tasksNode = $("rtTasks");
  if (tasksNode) {
    tasksNode.innerHTML = rtTasks
      .map(
        (t) => `
      <div class="rt-task ${t.priority}">
        <div class="rt-task-head">
          <span class="rt-task-type">${t.type}</span>
          <span class="rt-task-badge ${t.priority}">${t.priority}</span>
        </div>
        <div class="rt-task-meta">
          <span>${t.zone}</span>
          <span>Due: ${t.due}</span>
        </div>
      </div>
    `,
      )
      .join("");
  }

  const equipNode = $("rtEquipment");
  if (equipNode) {
    equipNode.innerHTML = rtEquipment
      .map(
        (e) => `
      <div class="rt-equip-item">
        <span class="rt-equip-name">${e.name}</span>
        <span class="rt-equip-badge ${e.status === "Ready" ? "ok" : "warn"}">${e.status}</span>
        <span class="rt-equip-date">Last: ${e.lastUse}</span>
      </div>
    `,
      )
      .join("");
  }

  const histNode = $("rtHistory");
  if (histNode) {
    histNode.innerHTML = rtHistory
      .map(
        (h) => `
      <div class="rt-hist-item">
        <span class="rt-hist-zone">${h.zone}</span>
        <span class="rt-hist-type">${h.type}</span>
        <span class="rt-hist-date">${h.date}</span>
        <span class="rt-hist-badge">${h.status}</span>
      </div>
    `,
      )
      .join("");
  }

  metrics(
    [
      { label: "Active tasks", value: rtTasks.length.toString() },
      {
        label: "Due today",
        value: rtTasks.filter((t) => t.due === "Today").length.toString(),
      },
      {
        label: "Equipment ready",
        value: rtEquipment.filter((e) => e.status === "Ready").length + "/4",
      },
      { label: "Completed ops", value: rtHistory.length.toString() },
    ],
    "rtMetrics",
  );

  const m = addBaseMap("rtMap");
  if (m) m.setView([14.6798, 120.9735], 15);
}

const map = addBaseMap();

if (role === "citizen") citizenView(map);
if (role === "barangay") barangayView(map);
if (role === "city") cityView(map);
if (role === "field-inspector") fieldInspectorView();
if (role === "response-team") responseTeamView();
