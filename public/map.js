const CENTER = [14.6816, 120.9741];
const WALK_POINT_DELAY_MS = 1200;

const data = {
  scopeBounds: [
    [14.67895, 120.97085],
    [14.68395, 120.97805],
  ],
  candidateSites: [
    { id: '1', name: 'River bend drainage edge', center: [14.68095, 120.9741], score: 91, level: 'critical', reason: 'beside river + drainage outfall + dense homes' },
    { id: '2', name: 'School perimeter', center: [14.68235, 120.97615], score: 42, level: 'moderate', reason: 'containers + child exposure' },
    { id: '3', name: 'Vacant lot tires', center: [14.68155, 120.9723], score: 72, level: 'high', reason: 'discarded tires + pooling near river road' },
    { id: '4', name: 'Subdivision corner', center: [14.68305, 120.97695], score: 31, level: 'moderate', reason: 'reported mosquitoes, no water source nearby' },
    { id: '5', name: 'Open court', center: [14.67925, 120.97675], score: 18, level: 'low', reason: 'open area, outside the critical drainage cluster' },
    { id: '6', name: 'Creekside houses', center: [14.68025, 120.97305], score: 76, level: 'high', reason: 'near waterway + dense homes' },
    { id: '7', name: 'Terminal waiting area', center: [14.6829, 120.97255], score: 49, level: 'moderate', reason: 'high exposure, intermittent water' },
  ],
  zones: [
    { id: 'Z-01', name: 'River Bend Drainage Cluster', center: [14.68095, 120.9741], radius: 260, level: 'critical', score: 91 },
    { id: 'Z-02', name: 'School Perimeter', center: [14.68235, 120.97615], radius: 210, level: 'moderate', score: 42 },
    { id: 'Z-03', name: 'Vacant Lot Cluster', center: [14.68155, 120.9723], radius: 190, level: 'high', score: 72 },
  ],
  sentinels: [
    { code: 'OVI-A', center: [14.68078, 120.97445], eggCount: 58, risk: 'critical' },
    { code: 'OVI-A2', center: [14.68125, 120.97372], eggCount: 51, risk: 'critical' },
    { code: 'OVI-A3', center: [14.68048, 120.97395], eggCount: 46, risk: 'high' },
    { code: 'OVI-C1', center: [14.68178, 120.97205], eggCount: 34, risk: 'high' },
    { code: 'OVI-C2', center: [14.68125, 120.97262], eggCount: 29, risk: 'high' },
    { code: 'OVI-B', center: [14.6821, 120.97685], eggCount: 18, risk: 'moderate' },
    { code: 'OVI-D', center: [14.68005, 120.97328], eggCount: 26, risk: 'high' },
  ],
  report: { id: 'R-104', center: [14.68118, 120.97395], type: 'stagnant water and larvae near canal' },
  waterPath: [
    [14.68215, 120.97195],
    [14.68155, 120.97255],
    [14.68105, 120.97325],
    [14.68062, 120.97412],
    [14.68005, 120.97485],
    [14.67935, 120.97555],
  ],
  inspectionPath: [
    [14.68234, 120.97522],
    [14.68216, 120.97496],
    [14.68195, 120.9747],
    [14.68182, 120.97442],
    [14.68182, 120.97405],
    [14.68155, 120.97405],
    [14.68122, 120.97405],
    [14.68086, 120.97405],
    [14.6805, 120.97405],
    [14.68034, 120.97428],
    [14.68034, 120.97462],
    [14.68034, 120.97495],
    [14.68068, 120.97502],
    [14.68102, 120.97502],
    [14.68108, 120.97468],
    [14.68112, 120.97436],
    [14.68118, 120.97395],
  ],
};

const steps = [
  {
    badge: 'Blank',
    title: 'Start with a blank barangay map',
    status: 'Ready',
    layers: [],
    metrics: [['Map', 'Blank'], ['Next', 'Area mapping']],
    notes: ['Start from geography and environmental risk, not patient counts.'],
  },
  {
    badge: 'Step 1',
    title: 'Map candidate risk locations',
    status: 'Mapped',
    layers: ['water', 'candidates', 'zones'],
    metrics: [['Candidates', '7'], ['Priority', '#1']],
    notes: ['Candidate #1 wins because it is near the river, has a drainage outfall, dense homes, and recurring stagnant water risk.'],
  },
  {
    badge: 'Step 2',
    title: 'Place sentinel ovitraps by risk',
    status: 'Placed',
    layers: ['zones', 'sentinels'],
    metrics: [['Sentinels', '7'], ['Most traps', 'Z-01']],
    notes: ['Higher-score zones get more traps. Lower-risk areas still get coverage, but fewer devices.'],
  },
  {
    badge: 'Step 3',
    title: 'Monitor passive vector-risk signals',
    status: 'Monitoring',
    layers: ['sentinels'],
    metrics: [['OVI-A eggs', '58'], ['Mode', 'Passive']],
    notes: ['Ovitrap readings indicate environmental vector risk. They do not diagnose dengue or replace PIDSR.'],
  },
  {
    badge: 'Step 4',
    title: 'Validate and score the highest-risk zone',
    status: 'Critical',
    layers: ['zones', 'sentinels', 'score'],
    metrics: [['Z-01 score', '91'], ['Trigger', 'OVI-A']],
    notes: ['Several traps near the river show high activity, so the river bend becomes the first validation target.'],
  },
  {
    badge: 'Step 5',
    title: 'Add citizen environmental reports',
    status: 'Pending',
    layers: ['zones', 'sentinels', 'report'],
    metrics: [['Report', 'R-104'], ['Type', 'Larvae']],
    notes: ['Citizen reports sit beside sentinel data as another environmental signal to verify.'],
  },
  {
    badge: 'Step 6',
    title: 'Inspector verifies the target on foot',
    status: 'Verifying',
    layers: ['report', 'task', 'path'],
    metrics: [['Task', 'INS-221'], ['Check-in', 'GPS']],
    notes: ['The inspector walks the target streets, records GPS check-in, photos, findings, and breeding-site pins.'],
  },
  {
    badge: 'Step 7',
    title: 'Assign response and update map status',
    status: 'Action',
    layers: ['sentinels', 'response'],
    metrics: [['Action', 'Cleanup'], ['Status', 'Assigned']],
    notes: ['Cleanup, source reduction, education, fogging, or larvicide are tracked only after field verification and according to protocol.'],
  },
  {
    badge: 'Step 8',
    title: 'Expire clean status and recheck',
    status: 'Recheck',
    layers: ['sentinels', 'resolved'],
    metrics: [['Area', 'Clean'], ['Recheck', '14 days']],
    notes: ['Safe or completed status expires so the barangay can measure whether the response actually reduced risk.'],
  },
];

const state = {
  step: 0,
  map: null,
  layers: null,
  animation: null,
  pathRunId: 0,
};

function qs(id) {
  return document.getElementById(id);
}

function color(value) {
  return { low: '#16a34a', moderate: '#d99a00', high: '#f97316', critical: '#dc2626', task: '#2563eb' }[value] || '#2563eb';
}

function step() {
  return steps[state.step];
}

function has(layer) {
  return step().layers.includes(layer);
}

function initMap() {
  if (!window.L) {
    qs('mapFallback').hidden = false;
    return;
  }

  state.map = L.map('map', { zoomSnap: 0.25, zoomControl: true }).setView(CENTER, 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(state.map);

  state.layers = L.layerGroup().addTo(state.map);
  state.animation = L.layerGroup().addTo(state.map);
}

function divIcon(html, size, anchor) {
  return L.divIcon({ className: '', html, iconSize: size, iconAnchor: anchor });
}

function addZone(zone, options = {}) {
  const zoneColor = options.color || color(zone.level);
  L.circle(zone.center, {
    radius: zone.radius,
    color: zoneColor,
    fillColor: zoneColor,
    fillOpacity: options.fillOpacity ?? 0.08,
    weight: options.weight ?? 2,
  }).addTo(state.layers);
}

function addScopeBox() {
  L.rectangle(data.scopeBounds, {
    color: '#0f766e',
    weight: 4,
    fillColor: '#0f766e',
    fillOpacity: 0.028,
    dashArray: '14 9',
  }).addTo(state.layers);
}

function addWater() {
  L.polyline(data.waterPath, { color: '#0284c7', weight: 10, opacity: 0.26, lineCap: 'round' }).addTo(state.layers);
  L.polyline(data.waterPath, { color: '#0369a1', weight: 2, opacity: 0.85, dashArray: '6 8' }).addTo(state.layers);
}

function addCandidate(site) {
  L.marker(site.center, {
    icon: divIcon(`<div class="candidate-pin ${site.level}"><span>${site.id}</span><strong>${site.score}</strong></div>`, [38, 38], [19, 19]),
  }).addTo(state.layers);
}

function addSentinel(sentinel) {
  const large = sentinel.code === 'OVI-A' && (has('score') || has('response') || has('resolved'));
  L.marker(sentinel.center, {
    icon: divIcon(`<div class="map-pin sentinel-pin ${large ? 'large' : ''}">${sentinel.code}</div>`, large ? [56, 26] : [42, 22], large ? [28, 13] : [21, 11]),
  }).addTo(state.layers);
}

function addReport() {
  L.marker(data.report.center, {
    icon: divIcon('<div class="map-pin report-pin">Report</div>', [62, 26], [31, 13]),
  }).addTo(state.layers);
}

function addTask() {
  L.marker([14.68162, 120.97405], {
    icon: divIcon('<div class="map-pin task-pin">Inspect</div>', [62, 26], [31, 13]),
  }).addTo(state.layers);
}

function addPerimeter(label, radius, perimeterColor, dashArray) {
  L.circle(data.zones[0].center, {
    radius,
    color: perimeterColor,
    fillColor: perimeterColor,
    fillOpacity: 0.055,
    dashArray,
    weight: 3,
  }).addTo(state.layers);
  L.marker([data.zones[0].center[0] + 0.00275, data.zones[0].center[1] + 0.00025], {
    icon: divIcon(`<div class="perimeter-label">${label}</div>`, [130, 28], [65, 14]),
    interactive: false,
  }).addTo(state.layers);
}

function addInspectorMarker(center) {
  return L.marker(center, {
    icon: divIcon('<div class="inspector-dot">BH</div>', [26, 26], [13, 13]),
    interactive: false,
  }).addTo(state.animation);
}

function animateWalk() {
  if (!state.animation) return;
  const runId = state.pathRunId + 1;
  state.pathRunId = runId;
  state.animation.clearLayers();

  const line = L.polyline([data.inspectionPath[0]], { color: '#7c3aed', weight: 6, opacity: 0.95, lineCap: 'round' }).addTo(state.animation);
  const marker = addInspectorMarker(data.inspectionPath[0]);
  data.inspectionPath.slice(1).forEach((point, index) => {
    setTimeout(() => {
      if (runId !== state.pathRunId || !has('path')) return;
      marker.setLatLng(point);
      line.addLatLng(point);
    }, (index + 1) * WALK_POINT_DELAY_MS);
  });
}

function renderMap() {
  if (!state.map || !state.layers) return;
  state.layers.clearLayers();
  state.animation.clearLayers();
  const bounds = [];

  if (state.step > 0) {
    addScopeBox();
    bounds.push(...data.scopeBounds);
  }

  if (has('water')) {
    addWater();
    bounds.push(...data.waterPath);
  }
  if (has('zones') || has('score')) {
    data.zones.forEach((zone) => {
      addZone(zone, { weight: zone.id === 'Z-01' || has('score') ? 4 : 2, fillOpacity: zone.id === 'Z-01' || has('score') ? 0.1 : 0.045 });
      bounds.push(zone.center);
    });
  }
  if (has('candidates')) {
    data.candidateSites.forEach((site) => {
      addCandidate(site);
      bounds.push(site.center);
    });
  }
  if (has('sentinels')) {
    data.sentinels.forEach((sentinel) => {
      addSentinel(sentinel);
      bounds.push(sentinel.center);
    });
  }
  if (has('report')) {
    addReport();
    bounds.push(data.report.center);
  }
  if (has('task')) {
    addTask();
    addPerimeter('Target perimeter', 205, '#2563eb', '8 8');
    bounds.push(data.report.center, data.zones[0].center);
  }
  if (has('path')) {
    L.polyline(data.inspectionPath, { color: '#64748b', weight: 4, opacity: 0.75, dashArray: '8 10', lineCap: 'round' }).addTo(state.layers);
    bounds.push(...data.inspectionPath);
  }
  if (has('response')) {
    addZone(data.zones[0], { color: color('critical'), fillOpacity: 0.08, weight: 3 });
    addPerimeter('Intervention area', 330, '#f97316', '12 8');
    addTask();
    bounds.push(data.zones[0].center);
  }
  if (has('resolved')) {
    addZone(data.zones[0], { color: '#16a34a', fillOpacity: 0.1, weight: 3 });
    addPerimeter('Recheck in 14 days', 300, '#16a34a', '5 8');
    bounds.push(data.zones[0].center);
  }

  if (bounds.length) state.map.fitBounds(bounds, { padding: [64, 64], maxZoom: state.step <= 2 ? 15 : 16 });
  else state.map.setView(CENTER, 15);
  if (has('path')) animateWalk();
}

function renderStepRail() {
  qs('stepRail').innerHTML = steps
    .map((item, index) => `<li class="${index < state.step ? 'is-done' : index === state.step ? 'is-active' : ''}" data-step="${index}" tabindex="0"><span>${index === 0 ? 'B' : index}</span><strong>${item.title.replace(/^[^:]+: /, '')}</strong></li>`)
    .join('');

  document.querySelectorAll('[data-step]').forEach((node) => {
    const activate = () => {
      state.step = Number(node.dataset.step);
      render();
    };
    node.addEventListener('click', activate);
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });
}

function renderSidebar() {
  qs('stepBadge').textContent = step().badge;
  qs('stepTitle').textContent = step().title;
  qs('stepText').textContent = step().notes[0] || '';
  qs('stepMetrics').innerHTML = step().metrics.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
  qs('stepNotes').innerHTML = step().notes.map((note) => `<li>${note}</li>`).join('');
  qs('layerList').innerHTML = step().layers.length ? step().layers.map((layer) => `<span>${layerLabel(layer)}</span>`).join('') : '<span>No operational layers yet</span>';
  qs('statusPill').textContent = step().status;
  qs('mapTitle').textContent = step().title;
}

function layerLabel(layer) {
  return {
    water: 'Water-risk corridor',
    candidates: 'Candidate sites',
    zones: 'Risk zones',
    sentinels: 'Sentinel ovitraps',
    score: 'Risk score',
    report: 'Citizen report',
    task: 'Inspection task',
    path: 'Walked path',
    response: 'Intervention perimeter',
    resolved: 'Recheck perimeter',
  }[layer] || layer;
}

function render() {
  renderStepRail();
  renderSidebar();
  renderMap();
  qs('nextButton').textContent = state.step >= steps.length - 1 ? 'Restart' : 'Next step';
  qs('status').textContent = `${step().badge}: ${step().title}`;
}

function nextStep() {
  if (state.step >= steps.length - 1) state.step = 0;
  else state.step += 1;
  render();
}

function reset() {
  state.step = 0;
  state.pathRunId += 1;
  render();
}

qs('nextButton').addEventListener('click', nextStep);
qs('resetButton').addEventListener('click', reset);

initMap();
render();
