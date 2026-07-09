const CENTER = [14.6834, 120.9748];
const WALK_POINT_DELAY_MS = 1200;

const demo = {
  candidateSites: [
    {
      id: '1',
      name: 'River bend drainage edge',
      center: [14.68095, 120.9741],
      score: 91,
      level: 'critical',
      reason: 'beside river + drainage outfall + dense homes',
    },
    {
      id: '2',
      name: 'School perimeter',
      center: [14.68235, 120.97615],
      score: 42,
      level: 'moderate',
      reason: 'containers + child exposure',
    },
    {
      id: '3',
      name: 'Vacant lot tires',
      center: [14.68155, 120.9723],
      score: 72,
      level: 'high',
      reason: 'discarded tires + pooling near river road',
    },
    {
      id: '4',
      name: 'Subdivision corner',
      center: [14.68485, 120.97675],
      score: 31,
      level: 'moderate',
      reason: 'reported mosquitoes, no water source nearby',
    },
    {
      id: '5',
      name: 'Open court',
      center: [14.67995, 120.97565],
      score: 18,
      level: 'low',
      reason: 'open area, low container risk',
    },
    {
      id: '6',
      name: 'Creekside houses',
      center: [14.68025, 120.97305],
      score: 76,
      level: 'high',
      reason: 'near waterway + dense homes',
    },
    {
      id: '7',
      name: 'Terminal waiting area',
      center: [14.6829, 120.97255],
      score: 49,
      level: 'moderate',
      reason: 'high exposure, intermittent water',
    },
  ],
  zones: [
    {
      id: 'Z-01',
      name: 'River Bend Drainage Cluster',
      type: 'River / drainage residential cluster',
      center: [14.68095, 120.9741],
      radius: 260,
      level: 'critical',
      score: 91,
      reasons: ['river edge', 'drainage outfall', 'dense homes'],
    },
    {
      id: 'Z-02',
      name: 'School Perimeter',
      type: 'School / container-prone area',
      center: [14.68235, 120.97615],
      radius: 210,
      level: 'moderate',
      score: 42,
      reasons: ['student exposure', 'many containers', 'easy sentinel access'],
    },
    {
      id: 'Z-03',
      name: 'Vacant Lot Cluster',
      type: 'Vacant lot / tire risk',
      center: [14.68155, 120.9723],
      radius: 190,
      level: 'high',
      score: 67,
      reasons: ['discarded tires', 'low visibility', 'reported pooling after rain'],
    },
  ],
  sentinels: [
    {
      code: 'OVI-A',
      zoneId: 'Z-01',
      center: [14.68078, 120.97445],
      eggCount: 58,
      risk: 'critical',
      battery: 82,
      water: 67,
    },
    {
      code: 'OVI-A2',
      zoneId: 'Z-01',
      center: [14.68125, 120.97372],
      eggCount: 51,
      risk: 'critical',
      battery: 88,
      water: 70,
    },
    {
      code: 'OVI-A3',
      zoneId: 'Z-01',
      center: [14.68048, 120.97395],
      eggCount: 46,
      risk: 'high',
      battery: 79,
      water: 62,
    },
    {
      code: 'OVI-C1',
      zoneId: 'Z-03',
      center: [14.68178, 120.97205],
      eggCount: 34,
      risk: 'high',
      battery: 74,
      water: 51,
    },
    {
      code: 'OVI-C2',
      zoneId: 'Z-03',
      center: [14.68125, 120.97262],
      eggCount: 29,
      risk: 'high',
      battery: 77,
      water: 48,
    },
    {
      code: 'OVI-B',
      zoneId: 'Z-02',
      center: [14.6821, 120.97685],
      eggCount: 18,
      risk: 'moderate',
      battery: 61,
      water: 44,
    },
    {
      code: 'OVI-D',
      zoneId: 'Z-06',
      center: [14.68005, 120.97328],
      eggCount: 26,
      risk: 'high',
      battery: 69,
      water: 56,
    },
  ],
  report: {
    id: 'R-104',
    center: [14.68118, 120.97395],
    type: 'stagnant water and larvae near canal',
  },
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
    subtitle: 'Nothing is assumed yet. The app first needs operational areas before it can score risk.',
    layers: [],
    focus: 'Base map only',
    status: 'Ready',
    current: [['Map', 'Blank'], ['Next', 'Area mapping']],
    notes: ['Start from geography, not patient counts.', 'Click Next step to build the workflow one layer at a time.'],
  },
  {
    badge: 'Step 1',
    title: 'Area mapping: define risk zones',
    subtitle: 'Barangay staff divide the map into zones that can be inspected and acted on.',
    layers: ['water', 'candidates', 'zones'],
    focus: 'Candidate risk sites',
    status: 'Mapped',
    current: [['Candidates', '7'], ['Priority', '#1']],
    notes: [
      'Barangay maps many candidate sites first, then groups the strongest candidates into inspectable risk zones.',
      'Site 1 is prioritized because it sits near the river, has a drainage outfall, dense homes, and recurring stagnant-water risk.',
    ],
  },
  {
    badge: 'Step 2',
    title: 'Sentinel placement: barangay chooses monitoring points',
    subtitle: 'Sentinels are placed where they can represent risk without being unsafe or hard to maintain.',
    layers: ['zones', 'sentinels'],
    focus: 'Sentinel placement',
    status: 'Placed',
    current: [['Sentinels', '7'], ['Most traps', 'Z-01']],
    notes: [
      'Higher-score zones get more traps because they need tighter monitoring coverage.',
      'Lower-score sites still get coverage, but fewer devices to preserve hardware and maintenance capacity.',
    ],
  },
  {
    badge: 'Step 3',
    title: 'Monitoring: active reports plus passive sentinel readings',
    subtitle: 'The system monitors dengue-vector risk signals instead of counting dengue patients.',
    layers: ['sentinels'],
    focus: 'Passive monitoring',
    status: 'Monitoring',
    current: [['OVI-A eggs', '58'], ['Mode', 'Passive']],
    notes: [
      'Sentinels send egg activity, water level, battery, trap status, and maintenance condition.',
      'A high ovitrap reading suggests vector risk; it is not a dengue diagnosis.',
    ],
  },
  {
    badge: 'Step 4',
    title: 'Risk validation: score the most vulnerable spots',
    subtitle: 'After enough monitoring time, the app ranks zones and flags the strongest target.',
    layers: ['zones', 'sentinels', 'score'],
    focus: 'Risk score',
    status: 'Critical',
    current: [['Z-01 score', '91'], ['Trigger', 'OVI-A']],
    notes: [
      'Z-01 becomes Critical because several traps near the river show high activity and the area already has drainage and exposure risks.',
      'The score tells inspectors where to verify first.',
    ],
  },
  {
    badge: 'Step 5',
    title: 'Citizen report: residents add environmental concerns',
    subtitle: 'Reports sit beside sentinel data as another signal to validate.',
    layers: ['zones', 'sentinels', 'report'],
    focus: 'Citizen report',
    status: 'Pending',
    current: [['Report', 'R-104'], ['Type', 'Larvae']],
    notes: [
      'Residents can report stagnant water, clogged canals, larvae, garbage, tires, uncovered containers, flooding, or high mosquito presence.',
      'The app checks overlap so repeated reports in the same area become one validation target.',
    ],
  },
  {
    badge: 'Step 6',
    title: 'Field verification: inspector checks the target',
    subtitle: 'The inspector confirms what is actually happening on site before response is assigned.',
    layers: ['report', 'task', 'path'],
    focus: 'Inspection task',
    status: 'Verifying',
    current: [['Task', 'INS-221'], ['Check-in', 'GPS']],
    notes: [
      'The inspector starts inspection, records GPS check-in, photos, findings, checked spots, and breeding-site pins.',
      'The result decides whether the report is valid, invalid, duplicate, needs action, or needs recheck.',
    ],
  },
  {
    badge: 'Step 7',
    title: 'Response: update map status and act',
    subtitle: 'Confirmed risk becomes an intervention perimeter for barangay response.',
    layers: ['sentinels', 'response'],
    focus: 'Intervention perimeter',
    status: 'Action needed',
    current: [['Action', 'Cleanup'], ['Status', 'Assigned']],
    notes: [
      'Response can include cleanup, source reduction, container covering, resident education, and fogging or larvicide only when authorized by local protocol.',
      'The map changes because the situation is now verified, not just suspected.',
    ],
  },
  {
    badge: 'Step 8',
    title: 'Expiration and recheck: clean status is temporary',
    subtitle: 'Safe or completed status expires so the barangay can measure whether the action worked.',
    layers: ['sentinels', 'resolved'],
    focus: 'For recheck',
    status: 'Expires',
    current: [['Area', 'Clean'], ['Recheck', '14 days']],
    notes: [
      'Completed, safe, or clean status should expire after a configured period.',
      'The area returns to monitoring/recheck so the LGU can track intervention effectiveness.',
    ],
  },
];

const state = {
  step: 0,
  pathRunId: 0,
  map: null,
  layerGroup: null,
  pulseLayer: null,
};

function qs(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function colorFor(value) {
  return {
    low: '#16a34a',
    moderate: '#d99a00',
    high: '#f97316',
    critical: '#dc2626',
    clean: '#16a34a',
    task: '#2563eb',
    report: '#be123c',
    sentinel: '#0f766e',
  }[value] || '#2563eb';
}

function currentStep() {
  return steps[state.step];
}

function hasLayer(name) {
  return currentStep().layers.includes(name);
}

function setStatus(message) {
  qs('status').textContent = message;
}

function initMap() {
  if (!window.L) {
    qs('mapFallback').hidden = false;
    return;
  }

  state.map = L.map('demoMap', { zoomSnap: 0.25, zoomControl: false }).setView(CENTER, 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  })
    .on('tileerror', () => {
      qs('mapFallback').hidden = false;
    })
    .addTo(state.map);

  state.layerGroup = L.layerGroup().addTo(state.map);
  state.pulseLayer = L.layerGroup().addTo(state.map);
}

function addZone(zone, options = {}) {
  const color = options.color || colorFor(zone.level);
  const circle = L.circle(zone.center, {
    radius: zone.radius,
    color,
    fillColor: color,
    fillOpacity: options.fillOpacity ?? 0.11,
    weight: options.weight ?? 2,
  }).addTo(state.layerGroup);
  return circle;
}

function addWaterRiskCorridor() {
  const waterPath = [
    [14.68215, 120.97195],
    [14.68155, 120.97255],
    [14.68105, 120.97325],
    [14.68062, 120.97412],
    [14.68005, 120.97485],
    [14.67935, 120.97555],
  ];

  L.polyline(waterPath, {
    color: '#0284c7',
    weight: 9,
    opacity: 0.28,
    lineCap: 'round',
  }).addTo(state.layerGroup);

  L.polyline(waterPath, {
    color: '#0369a1',
    weight: 2,
    opacity: 0.8,
    dashArray: '6 8',
  }).addTo(state.layerGroup);

  return waterPath;
}

function addCandidateSite(site) {
  const icon = L.divIcon({
    className: '',
    html: `<div class="candidate-pin ${site.level}"><span>${escapeHtml(site.id)}</span><strong>${site.score}</strong></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
  return L.marker(site.center, { icon }).addTo(state.layerGroup);
}

function addSentinel(sentinel, large = false) {
  const icon = L.divIcon({
    className: '',
    html: `<div class="map-pin sentinel-pin ${large ? 'large' : ''}">${escapeHtml(sentinel.code)}</div>`,
    iconSize: large ? [56, 26] : [42, 22],
    iconAnchor: large ? [28, 13] : [21, 11],
  });
  return L.marker(sentinel.center, { icon }).addTo(state.layerGroup);
}

function addReport() {
  const icon = L.divIcon({
    className: '',
    html: '<div class="map-pin report-pin">Report</div>',
    iconSize: [62, 26],
    iconAnchor: [31, 13],
  });
  return L.marker(demo.report.center, { icon }).addTo(state.layerGroup);
}

function addTask() {
  const icon = L.divIcon({
    className: '',
    html: '<div class="map-pin task-pin">Inspect</div>',
    iconSize: [62, 26],
    iconAnchor: [31, 13],
  });
  return L.marker([14.68162, 120.97405], { icon }).addTo(state.layerGroup);
}

function addPerimeter(label, radius, color, dashArray) {
  L.circle(demo.zones[0].center, {
    radius,
    color,
    fillColor: color,
    fillOpacity: 0.055,
    dashArray,
    weight: 3,
  }).addTo(state.layerGroup);
  const icon = L.divIcon({
    className: '',
    html: `<div class="perimeter-label">${escapeHtml(label)}</div>`,
    iconSize: [130, 28],
    iconAnchor: [65, 14],
  });
  L.marker([demo.zones[0].center[0] + 0.00275, demo.zones[0].center[1] + 0.00025], { icon, interactive: false }).addTo(state.layerGroup);
}

function renderMap() {
  if (!state.map || !state.layerGroup) return;
  state.layerGroup.clearLayers();
  const bounds = [];

  if (hasLayer('zones') || hasLayer('score')) {
    demo.zones.forEach((zone) => {
      addZone(zone, {
        weight: zone.id === 'Z-01' || hasLayer('score') ? 4 : 2,
        fillOpacity: zone.id === 'Z-01' || hasLayer('score') ? 0.1 : 0.045,
      });
      bounds.push(zone.center);
    });
  }

  if (hasLayer('water')) {
    bounds.push(...addWaterRiskCorridor());
  }

  if (hasLayer('candidates')) {
    demo.candidateSites.forEach((site) => {
      addCandidateSite(site);
      bounds.push(site.center);
    });
  }

  if (hasLayer('sentinels')) {
    demo.sentinels.forEach((sentinel) => {
      addSentinel(sentinel, (hasLayer('score') || hasLayer('response') || hasLayer('resolved')) && sentinel.code === 'OVI-A');
      bounds.push(sentinel.center);
    });
  }

  if (hasLayer('report')) {
    addReport();
    bounds.push(demo.report.center);
  }

  if (hasLayer('task')) {
    addTask();
    addPerimeter('Target perimeter', 205, '#2563eb', '8 8');
    bounds.push(demo.report.center, demo.zones[0].center);
  }

  if (hasLayer('path')) {
    L.polyline(demo.inspectionPath, {
      color: '#64748b',
      weight: 4,
      opacity: 0.75,
      dashArray: '8 10',
      lineCap: 'round',
    }).addTo(state.layerGroup);
    bounds.push(...demo.inspectionPath);
  }

  if (hasLayer('response')) {
    addZone(demo.zones[0], { color: colorFor('critical'), fillOpacity: 0.08, weight: 3 });
    addPerimeter('Intervention area', 330, '#f97316', '12 8');
    addTask();
    bounds.push(demo.zones[0].center);
  }

  if (hasLayer('resolved')) {
    addZone(demo.zones[0], { color: colorFor('clean'), fillOpacity: 0.1, weight: 3 });
    addPerimeter('Recheck in 14 days', 300, '#16a34a', '5 8');
    bounds.push(demo.zones[0].center);
  }

  if (!bounds.length) {
    state.map.setView(CENTER, 15);
    return;
  }

  state.map.fitBounds(bounds, { padding: [84, 84], maxZoom: state.step <= 2 ? 15 : 16 });
}

function renderStepRail() {
  qs('stepRail').innerHTML = steps
    .map((step, index) => {
      const className = index < state.step ? 'done' : index === state.step ? 'active' : '';
      return `<button class="role-tab ${className}" type="button" data-step="${index}">${index === 0 ? 'Blank' : index}</button>`;
    })
    .join('');

  document.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      state.step = Number(button.dataset.step);
      state.pulseLayer?.clearLayers();
      render();
    });
  });
}

function renderLayerBar() {
  const labels = {
    zones: 'Risk zones',
    candidates: 'Candidate sites',
    water: 'Water-risk corridor',
    sentinels: 'Sentinels',
    score: 'Risk score',
    report: 'Citizen report',
    task: 'Inspection task',
    path: 'Inspector path',
    response: 'Intervention',
    resolved: 'Recheck',
  };
  const layers = currentStep().layers;
  qs('layerBar').innerHTML = layers.length
    ? layers.map((layer) => `<span class="layer-toggle active">${escapeHtml(labels[layer] || layer)}</span>`).join('')
    : '<span class="layer-toggle">No operational layers yet</span>';
}

function renderStepPanel() {
  const step = currentStep();
  const currentGrid = step.current
    .map(([label, value]) => `<div class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join('');
  const rankedCandidates = [...demo.candidateSites]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(
      (site) => `
        <li>
          <strong>#${escapeHtml(site.id)} ${escapeHtml(site.name)}</strong>
          <br><span class="text-secondary">${site.score} pts - ${escapeHtml(site.reason)}</span>
        </li>
      `,
    )
    .join('');

  qs('rolePanel').innerHTML = `
    <div class="step-card">
      <span>${escapeHtml(step.badge)}</span>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.subtitle)}</p>
    </div>
    <div class="outcome-grid mt-3">${currentGrid}</div>
    ${
      state.step === 1
        ? `
          <h3 class="h4 mt-3">Why site #1 is prioritized</h3>
          <ul class="risk-list">${rankedCandidates}</ul>
        `
        : ''
    }
    <ul class="action-list mt-3">
      ${step.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
    </ul>
  `;
}

function render() {
  const step = currentStep();
  qs('mapTitle').textContent = step.title;
  qs('mapSubtitle').textContent = step.subtitle;
  qs('nextButton').textContent = state.step >= steps.length - 1 ? 'Restart' : 'Next step';
  qs('publicStatusPill').className = `status ${state.step === 0 ? 'status-gray' : state.step >= 8 ? 'status-green' : state.step >= 7 ? 'status-orange' : 'status-blue'}`;
  qs('publicStatusPill').textContent = step.status;

  renderStepRail();
  renderLayerBar();
  renderStepPanel();
  renderMap();
  if (hasLayer('path')) animateInspectionWalk();
}

function pulse(center, variant = '') {
  if (!state.map || !state.pulseLayer) return;
  state.pulseLayer.clearLayers();
  const icon = L.divIcon({
    className: '',
    html: `<div class="pulse-dot ${variant}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
  L.marker(center, { icon, interactive: false }).addTo(state.pulseLayer);
}

function addInspectorMarker(center) {
  const icon = L.divIcon({
    className: '',
    html: '<div class="inspector-dot">BH</div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
  return L.marker(center, { icon, interactive: false }).addTo(state.pulseLayer);
}

function animateInspectionWalk() {
  if (!state.map || !state.pulseLayer) return;
  const pathRunId = state.pathRunId + 1;
  state.pathRunId = pathRunId;
  state.pulseLayer.clearLayers();

  const walkedLine = L.polyline([demo.inspectionPath[0]], {
    color: '#7c3aed',
    weight: 6,
    opacity: 0.95,
    lineCap: 'round',
  }).addTo(state.pulseLayer);
  const inspector = addInspectorMarker(demo.inspectionPath[0]);

  demo.inspectionPath.slice(1).forEach((point, index) => {
    setTimeout(() => {
      if (pathRunId !== state.pathRunId || !hasLayer('path')) return;
      inspector.setLatLng(point);
      walkedLine.addLatLng(point);
    }, (index + 1) * WALK_POINT_DELAY_MS);
  });
}

function advanceStep() {
  if (state.step >= steps.length - 1) {
    resetDemo();
    return;
  }
  state.step += 1;
  render();
  const center = state.step >= 6 ? demo.inspectionPath.at(-1) : demo.zones[0].center;
  if (state.step !== 6) pulse(center, state.step >= 7 ? 'success' : state.step >= 4 ? 'danger' : '');
  setStatus(`${currentStep().badge}: ${currentStep().title}`);
}

function resetDemo() {
  state.pathRunId += 1;
  state.step = 0;
  state.pulseLayer?.clearLayers();
  qs('nextButton').disabled = false;
  setStatus('Reset to blank map. Click Next step to begin area mapping.');
  render();
}

qs('nextButton').addEventListener('click', advanceStep);
qs('resetButton').addEventListener('click', resetDemo);

initMap();
render();
setStatus('Blank map ready. Click Next step to begin area mapping.');
