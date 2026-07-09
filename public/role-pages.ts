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
}

const sentinels: Sentinel[] = [
  { id: 'OVI-A', pos: [14.68065, 120.9748], risk: 'critical', eggs: 91, zone: 'School drainage' },
  { id: 'OVI-A2', pos: [14.68105, 120.9741], risk: 'high', eggs: 72, zone: 'General Luna' },
  { id: 'OVI-A3', pos: [14.6797, 120.97355], risk: 'high', eggs: 76, zone: 'Sampaguita' },
  { id: 'OVI-C1', pos: [14.68255, 120.97245], risk: 'moderate', eggs: 49, zone: 'Mabini cluster' },
  { id: 'OVI-B', pos: [14.68275, 120.9769], risk: 'moderate', eggs: 42, zone: 'J.P. Rizal' },
  { id: 'OVI-D', pos: [14.67925, 120.97675], risk: 'low', eggs: 18, zone: 'Transmitter site' },
];

const riskColor: Record<string, string> = { critical: '#dc2626', high: '#f97316', moderate: '#d99a00', low: '#16a34a' };
const riskLabel: Record<string, string> = { critical: 'Critical', high: 'High', moderate: 'Mod.', low: 'Low' };

function toggleCollapse(btn: HTMLElement) {
  const body = btn.closest('article')?.querySelector('.collapse-body');
  if (!body) return;
  body.classList.toggle('is-open');
  btn.textContent = body.classList.contains('is-open') ? 'Show less' : 'See more';
}

const recentActivity: ActivityItem[] = [
  { time: '2h ago', label: 'Citizen report R-104 (larvae) submitted near General Luna', type: 'report' },
  { time: '3h ago', label: 'Inspector checked in at School drainage perimeter', type: 'inspection' },
  { time: '5h ago', label: 'Treatment team completed larvicide at Mabini cluster', type: 'treatment' },
  { time: '6h ago', label: 'OVI-A sentinel alert: 91 eggs counted — critical threshold', type: 'alert' },
  { time: '8h ago', label: 'Task T-22 assigned to BHW-03 for General Luna inspection', type: 'task' },
  { time: '1d ago', label: 'Routine preventive patrol completed — Dambana Creekside', type: 'patrol' },
];

const citizenReport = { id: 'R-104', pos: [14.68088, 120.97415] as [number, number], label: 'Report' };
const task = { id: 'T-22', pos: [14.68105, 120.9744] as [number, number], label: 'Inspect' };

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
    name: 'Karuhatan',
    score: 88,
    risk: 'critical',
    bounds: [
      [14.67795, 120.9699],
      [14.68455, 120.9799],
    ],
  },
  {
    name: 'Marulas',
    score: 61,
    risk: 'high',
    bounds: [
      [14.6757, 120.9753],
      [14.68145, 120.9835],
    ],
  },
  {
    name: 'Tinajeros',
    score: 39,
    risk: 'moderate',
    bounds: [
      [14.67475, 120.9668],
      [14.67975, 120.97355],
    ],
  },
];

function icon(html: string, className: string) {
  return L.divIcon({
    className: '',
    html: `<div class="${className}">${html}</div>`,
    iconAnchor: [22, 18],
  });
}

function list(id: string, items: (string | ListItem)[]) {
  const node = $(id);
  if (!node) return;
  node.innerHTML = items.map((item) => `<li class="${(item as ListItem).current ? 'is-current' : ''}">${(item as ListItem).text || item}</li>`).join('');
}

function metrics(items: MetricItem[]) {
  const node = $('metrics');
  if (!node) return;
  node.innerHTML = items
    .map(({ label, value }) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function ops(items: MetricItem[]) {
  const node = $('opsGrid');
  if (!node) return;
  node.innerHTML = items
    .map(({ label, value }) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function queue(items: QueueItem[]) {
  const node = $('priorityQueue');
  if (!node) return;
  node.innerHTML = `<div class="queue-stack">${items
    .map((item) => `<div class="queue-item ${item.tone || ''}"><span>${item.label}</span><strong>${item.value}</strong></div>`)
    .join('')}</div>`;
}

function addBaseMap() {
  const map = L.map('roleMap', { zoomControl: true, scrollWheelZoom: true }).setView(center, 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  return map;
}

function addLegend(map: any, rows: LegendRow[]) {
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `<strong>Legend</strong>${rows
      .map((row) => `<span><i class="${row.className}"></i>${row.label}</span>`)
      .join('')}`;
    return div;
  };
  legend.addTo(map);
}

function addBarangayScope(map: any) {
  L.rectangle(scopeBounds, {
    color: '#0f766e',
    weight: 3,
    dashArray: '9 7',
    fill: false,
  }).addTo(map);
}

function addRiskLayers(map: any, options: { public?: boolean } = {}) {
  L.circle([14.68075, 120.97435], {
    radius: 430,
    color: '#dc2626',
    weight: 4,
    fillColor: '#dc2626',
    fillOpacity: options.public ? 0.08 : 0.14,
  }).addTo(map);

  L.circle([14.68145, 120.97305], {
    radius: 350,
    color: '#f97316',
    weight: 2,
    fillColor: '#f97316',
    fillOpacity: 0.08,
  }).addTo(map);

  L.circle([14.68255, 120.9765], {
    radius: 390,
    color: '#d99a00',
    weight: 2,
    fillColor: '#d99a00',
    fillOpacity: 0.07,
  }).addTo(map);
}

function addSentinels(map: any, detailed = true) {
  sentinels.forEach((trap) => {
    const text = detailed ? `${trap.id}<br>${trap.eggs}` : 'OVI';
    L.marker(trap.pos, { icon: icon(text, `trap-pin ${trap.risk}`) })
      .bindPopup(`<strong>${trap.id}</strong><br>${trap.zone}<br>${trap.eggs} eggs counted`)
      .addTo(map);
  });
}

function citizenView(map: any) {
  addRiskLayers(map, { public: true });
  L.marker(citizenReport.pos, { icon: icon('My report', 'report-pin') }).addTo(map);
  L.marker([14.67995, 120.97685], { icon: icon('Advisory', 'hex-pin moderate') }).addTo(map);
  addLegend(map, [
    { className: 'legend-risk', label: 'Public monitoring area' },
    { className: 'legend-report', label: 'Submitted report' },
  ]);
  map.fitBounds(scopeBounds, { padding: [28, 28] });

  metrics([
    { label: 'Area status', value: 'Monitoring' },
    { label: 'My latest report', value: 'Pending' },
  ]);
  list('statusFlow', [
    { text: 'Submitted' },
    { text: 'Pending Review', current: true },
    { text: 'Inspection Task Created' },
    { text: 'Field Verification' },
    { text: 'Action Taken / Resolved' },
  ]);
  list('featureList', [
    'Submit stagnant water, canal, larvae, garbage, tire, container, flood, and mosquito reports.',
    'Attach a location pin, photo evidence, short description, and date/time.',
    'View public advisories and report status only; internal routes and risk scoring stay private.',
  ]);

  const button = $('submitReportButton');
  if (button) {
    button.addEventListener('click', () => {
      $('reportStatus')!.textContent = 'Report submitted: Pending Review. Barangay team can now validate and assign inspection.';
      list('statusFlow', [
        { text: 'Submitted', current: true },
        { text: 'Pending Review' },
        { text: 'Inspection Task Created' },
        { text: 'Field Verification' },
        { text: 'Action Taken / Resolved' },
      ]);
    });
  }

  const locateButton = $('locateButton');
  if (locateButton) {
    locateButton.addEventListener('click', () => {
      map.flyTo([14.6808, 120.9745], 17, { duration: 0.8 });
      $('locationStatus')!.textContent = `Showing public monitoring area for ${($('locationSearch') as HTMLInputElement)?.value || 'selected location'}.`;
    });
  }
}

function sentinelStatus() {
  const node = $('sentinelGrid');
  if (!node) return;
  node.innerHTML = sentinels.map((trap) => `
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
  `).join('');
}

function activityFeed() {
  const node = $('activityList');
  if (!node) return;
  node.innerHTML = recentActivity.map((item) => `
    <div class="activity-item">
      <div class="activity-dot ${item.type}"></div>
      <div class="activity-content">
        <p class="activity-text">${item.label}</p>
        <span class="activity-time">${item.time}</span>
      </div>
    </div>
  `).join('');
}

function barangayView(map: any) {
  addBarangayScope(map);
  addRiskLayers(map);
  addSentinels(map);
  L.marker(citizenReport.pos, { icon: icon(citizenReport.label, 'report-pin') }).addTo(map);
  L.marker(task.pos, { icon: icon(task.label, 'task-pin') }).addTo(map);
  L.polyline(inspectionPath, { color: '#7c3aed', weight: 5, opacity: 0.8 }).addTo(map);
  addLegend(map, [
    { className: 'legend-scope', label: 'Barangay scope' },
    { className: 'legend-risk', label: 'Risk perimeter' },
    { className: 'legend-trap', label: 'Smart ovitrap' },
    { className: 'legend-report', label: 'Citizen report' },
    { className: 'legend-task', label: 'Inspection task' },
  ]);
  map.fitBounds(scopeBounds, { padding: [28, 28] });

  metrics([
    { label: 'Critical zones', value: '1' },
    { label: 'Open tasks', value: '4' },
    { label: 'Sentinels online', value: '6 / 7' },
    { label: 'For recheck', value: '2' },
  ]);
  ops([
    { label: 'Zone mapping', value: 'Mapped' },
    { label: 'Risk scoring', value: 'Live' },
    { label: 'High-risk alert', value: 'Created' },
    { label: 'Inspection assignment', value: 'BHW-03' },
    { label: 'Risk perimeter', value: 'Verified' },
    { label: 'Intervention status', value: 'Active' },
  ]);
  sentinelStatus();
  activityFeed();
  queue([
    { label: 'School drainage cluster', value: 'Critical score 91', tone: 'critical' },
    { label: 'General Luna canal', value: 'High score 72' },
    { label: 'Transmitter edge', value: 'Monitoring', tone: 'low' },
  ]);
}

const cityAlerts: AlertItem[] = [
  { time: '1h ago', label: 'Karuhatan critical threshold exceeded — 91 eggs at School drainage', type: 'critical' },
  { time: '4h ago', label: 'Marulas inspection overdue — BHW-02 missed check-in', type: 'warning' },
  { time: '6h ago', label: 'Tinajeros sentinel OVI-C1 moderate — recheck scheduled', type: 'info' },
  { time: '12h ago', label: 'Treatment team deployed to General Luna canal (Marulas)', type: 'success' },
  { time: '1d ago', label: 'Weekly report generated — 3 barangays, 14 completed actions', type: 'info' },
];

function barangayComparison() {
  const node = $('comparisonTable');
  if (!node) return;
  node.innerHTML = `<table class="compare-table">
    <thead><tr><th>Barangay</th><th>Score</th><th>Status</th></tr></thead>
    <tbody>${cityBarangays.map((b) => `
      <tr>
        <td class="compare-name">${b.name}</td>
        <td><span class="compare-score ${b.risk}">${b.score}</span></td>
        <td><span class="compare-badge ${b.risk}">${b.risk}</span></td>
      </tr>`).join('')}</tbody>
  </table>`;
}

function alertFeed() {
  const node = $('alertFeed');
  if (!node) return;
  node.innerHTML = cityAlerts.map((a) => `
    <div class="alert-item ${a.type}">
      <div class="alert-icon ${a.type}"></div>
      <div class="alert-body">
        <p class="alert-text">${a.label}</p>
        <span class="alert-time">${a.time}</span>
      </div>
    </div>
  `).join('');
}

function cityView(map: any) {
  cityBarangays.forEach((area) => {
    const color = area.risk === 'critical' ? '#dc2626' : area.risk === 'high' ? '#f97316' : '#d99a00';
    L.rectangle(area.bounds, {
      color,
      weight: 3,
      fillColor: color,
      fillOpacity: 0.11,
    })
      .bindPopup(`<strong>${area.name}</strong><br>Environmental risk score: ${area.score}`)
      .addTo(map);
    const labelPos: [number, number] = [
      (area.bounds[0][0] + area.bounds[1][0]) / 2,
      (area.bounds[0][1] + area.bounds[1][1]) / 2,
    ];
    L.marker(labelPos, { icon: icon(`${area.name}<br>${area.score}`, `hex-pin ${area.risk}`) }).addTo(map);
  });
  addSentinels(map, false);
  addLegend(map, [
    { className: 'legend-risk', label: 'Barangay risk area' },
    { className: 'legend-trap', label: 'Sentinel network' },
  ]);
  map.fitBounds([
    [14.6744, 120.9664],
    [14.6852, 120.984],
  ]);

  metrics([
    { label: 'Barangays watched', value: '3' },
    { label: 'Critical hotspots', value: '1' },
    { label: 'Overdue inspections', value: '2' },
    { label: 'Completed actions', value: '14' },
  ]);
  ops([
    { label: 'Highest risk', value: 'Karuhatan' },
    { label: 'Weekly trend', value: '+12%' },
    { label: 'Avg. closure time', value: '2.4 days' },
    { label: 'Report export', value: 'Ready' },
  ]);
  barangayComparison();
  alertFeed();
  list('featureList', [
    'Karuhatan: critical perimeter needs recheck after intervention expiry.',
    'Marulas: high mosquito-prone conditions around drainage and vacant lots.',
    'Tinajeros: moderate risk, continue sentinel monitoring.',
  ]);
  queue([
    { label: 'Karuhatan', value: 'Critical / 1 unresolved', tone: 'critical' },
    { label: 'Marulas', value: 'High / response active' },
    { label: 'Tinajeros', value: 'Moderate / monitor', tone: 'low' },
  ]);
}

const map = addBaseMap();

if (role === 'citizen') citizenView(map);
if (role === 'barangay') barangayView(map);
if (role === 'city') cityView(map);
