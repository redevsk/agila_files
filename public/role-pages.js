const role = document.body.dataset.rolePage;
const $ = (id) => document.getElementById(id);

const center = [14.68135, 120.97455];
const scopeBounds = [
  [14.67765, 120.96965],
  [14.68475, 120.98035],
];

const sentinels = [
  { id: 'OVI-A', pos: [14.68065, 120.9748], risk: 'critical', eggs: 91, zone: 'School drainage' },
  { id: 'OVI-A2', pos: [14.68105, 120.9741], risk: 'high', eggs: 72, zone: 'General Luna' },
  { id: 'OVI-A3', pos: [14.6797, 120.97355], risk: 'high', eggs: 76, zone: 'Sampaguita' },
  { id: 'OVI-C1', pos: [14.68255, 120.97245], risk: 'moderate', eggs: 49, zone: 'Mabini cluster' },
  { id: 'OVI-B', pos: [14.68275, 120.9769], risk: 'moderate', eggs: 42, zone: 'J.P. Rizal' },
  { id: 'OVI-D', pos: [14.67925, 120.97675], risk: 'low', eggs: 18, zone: 'Transmitter site' },
];

const citizenReport = { id: 'R-104', pos: [14.68088, 120.97415], label: 'Report' };
const task = { id: 'T-22', pos: [14.68105, 120.9744], label: 'Inspect' };

const inspectionPath = [
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

const cityBarangays = [
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

function icon(html, className) {
  return L.divIcon({
    className: '',
    html: `<div class="${className}">${html}</div>`,
    iconAnchor: [22, 18],
  });
}

function list(id, items) {
  const node = $(id);
  if (!node) return;
  node.innerHTML = items.map((item) => `<li class="${item.current ? 'is-current' : ''}">${item.text || item}</li>`).join('');
}

function metrics(items) {
  const node = $('metrics');
  if (!node) return;
  node.innerHTML = items
    .map(({ label, value }) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function ops(items) {
  const node = $('opsGrid');
  if (!node) return;
  node.innerHTML = items
    .map(({ label, value }) => `<div><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function queue(items) {
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

function addLegend(map, rows) {
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

function addBarangayScope(map) {
  L.rectangle(scopeBounds, {
    color: '#0f766e',
    weight: 3,
    dashArray: '9 7',
    fill: false,
  }).addTo(map);
}

function addRiskLayers(map, options = {}) {
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

function addSentinels(map, detailed = true) {
  sentinels.forEach((trap) => {
    const text = detailed ? `${trap.id}<br>${trap.eggs}` : 'OVI';
    L.marker(trap.pos, { icon: icon(text, `trap-pin ${trap.risk}`) })
      .bindPopup(`<strong>${trap.id}</strong><br>${trap.zone}<br>${trap.eggs} eggs counted`)
      .addTo(map);
  });
}

function citizenView(map) {
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
      $('reportStatus').textContent = 'Report submitted: Pending Review. Barangay team can now validate and assign inspection.';
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
      $('locationStatus').textContent = `Showing public monitoring area for ${$('locationSearch').value || 'selected location'}.`;
    });
  }
}

function barangayView(map) {
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
  list('inspectorList', [
    'GPS check-in at target perimeter',
    'Validate citizen report as valid, invalid, or duplicate',
    'Upload site photos and breeding-site pins',
    'Recommend response or recheck',
  ]);
  list('treatmentList', [
    'Clean drainage and remove stagnant water',
    'Apply authorized larvicide only when assigned',
    'Upload before/after photos',
    'Set clean status expiry for recheck',
  ]);
  queue([
    { label: 'School drainage cluster', value: 'Critical score 91', tone: 'critical' },
    { label: 'General Luna canal', value: 'High score 72' },
    { label: 'Transmitter edge', value: 'Monitoring', tone: 'low' },
  ]);
}

function cityView(map) {
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
    const labelPos = [
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
