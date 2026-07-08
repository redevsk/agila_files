const VALENZUELA_CENTER = [14.6923, 120.9768];
const VALENZUELA_BOUNDS = {
  minLat: 14.67,
  maxLat: 14.715,
  minLng: 120.955,
  maxLng: 120.995,
};
const DEMO_AREA_ID = 3;
const DEMO_BARANGAY_ID = 2;
const DEMO_ROUTE_ID = 2;

const state = {
  layers: null,
  publicStatusAreas: [],
  coverage: null,
  route: null,
  routePoints: [],
  activeView: 'public',
  map: null,
  fallback: false,
  layerGroups: {},
  baseLayer: null,
  tileErrorCount: 0,
  gpsWatchId: null,
  demoPointIndex: 0,
  activeDemoPath: null,
  patrolDemoRunning: false,
  pendingTrapType: null,
  demoReportId: null,
  demoTaskId: null,
  treatmentRecorded: false,
};

const colors = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#16a34a',
  red: '#dc2626',
  yellow: '#eab308',
  green: '#16a34a',
  gray: '#64748b',
};

const roleProfiles = {
  operations: {
    title: 'City Operations',
    sees: 'Sees all barangays, risk areas, reports, traps, tasks, and routes.',
    actions: 'Can generate preventive tasks and coordinate response.',
    stepTitle: 'Step 3: City prioritizes the response',
    stepText: 'The command center compares risk scores, sees coverage gaps, and generates preventive patrol tasks once per high-risk area.',
    layers: ['areas', 'reports', 'sentinelDevices', 'tasks', 'routes', 'coverage'],
    actionsVisible: ['city'],
  },
  dambana: {
    title: 'Barangay Dambana Admin',
    sees: 'Sees Dambana risk areas, reports, traps, tasks, and local routes.',
    actions: 'Can update public status after validation.',
    stepTitle: 'Step 2: Barangay validates local conditions',
    stepText: 'Barangay staff focus only on their local reports, tasks, and area status before publishing a public update.',
    layers: ['areas', 'reports', 'sentinelDevices', 'tasks', 'routes', 'coverage'],
    actionsVisible: ['barangay'],
  },
  marulas: {
    title: 'Barangay Marulas Admin',
    sees: 'Sees Marulas risk areas, reports, traps, tasks, and local routes.',
    actions: 'Can monitor local reports and coordinate barangay response.',
    stepTitle: 'Step 2: Barangay triages the citizen report',
    stepText: 'Barangay Marulas receives the citizen report and marks the same area as scheduled for inspection.',
    layers: ['areas', 'reports', 'sentinelDevices', 'tasks', 'routes', 'coverage'],
    actionsVisible: ['barangay'],
  },
  public: {
    title: 'Citizen / Public',
    sees: 'Sees simplified public area status only.',
    actions: 'Can submit a location-based stagnant water report.',
    stepTitle: 'Step 1: Citizen sees simple status and reports an issue',
    stepText: 'The public map hides internal tasks, traps, routes, staff locations, and exact operational detail.',
    layers: ['areas'],
    actionsVisible: ['citizen'],
  },
  inspector: {
    title: 'Field Inspector',
    sees: 'Sees the assigned Marulas task, report location, nearby traps, and own route trail.',
    actions: 'Can start the Marulas patrol, record trail points, and validate the report.',
    stepTitle: 'Step 4: Inspector records real field coverage',
    stepText: 'The field view emphasizes assigned work, route status, route distance, and checked or missed areas.',
    layers: ['areas', 'reports', 'sentinelDevices', 'tasks', 'routes', 'coverage'],
    actionsVisible: ['inspector'],
  },
  treatment: {
    title: 'Treatment Team',
    sees: 'Sees treatment-relevant risk areas, tasks, traps, and cleared inspection paths.',
    actions: 'Can focus on assigned treatment work after inspection clearance.',
    stepTitle: 'Step 5: Treatment closes the loop',
    stepText: 'Treatment is recorded for the same Marulas area, then the public status moves into monitoring.',
    layers: ['areas', 'sentinelDevices', 'tasks', 'routes', 'coverage'],
    actionsVisible: ['treatment'],
  },
};

const demoPaths = [
  {
    name: 'Marulas Market Drainage Validation',
    points: [
      { lat: 14.681867, lng: 120.976292 },
      { lat: 14.682079, lng: 120.975458 },
      { lat: 14.682283, lng: 120.974226 },
      { lat: 14.682877, lng: 120.974558 },
      { lat: 14.683543, lng: 120.974478 },
      { lat: 14.684126, lng: 120.973945 },
      { lat: 14.6845, lng: 120.9738 },
    ],
  },
  {
    name: 'Marulas Residential Access Check',
    points: [
      { lat: 14.6818, lng: 120.9763 },
      { lat: 14.682079, lng: 120.975458 },
      { lat: 14.682877, lng: 120.974558 },
      { lat: 14.683543, lng: 120.974478 },
      { lat: 14.684126, lng: 120.973945 },
    ],
  },
];

function setStatus(message) {
  document.getElementById('status').textContent = message;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function popup(title, rows) {
  const body = rows
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `<div class="popup-row"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</div>`)
    .join('');

  return `<div><div class="popup-title">${escapeHtml(title)}</div>${body}</div>`;
}

function normalizePoint(point) {
  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
    timestamp: point.timestamp || point.recordedAt || new Date().toISOString(),
  };
}

function withinValenzuelaDemo(point) {
  const lat = Number(point.lat);
  const lng = Number(point.lng);
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= VALENZUELA_BOUNDS.minLat &&
    lat <= VALENZUELA_BOUNDS.maxLat &&
    lng >= VALENZUELA_BOUNDS.minLng &&
    lng <= VALENZUELA_BOUNDS.maxLng
  );
}

function normalizeDemoTrail(points) {
  return points.map(normalizePoint).filter(withinValenzuelaDemo);
}

function areaLatLng(area) {
  return [Number(area.centerLat), Number(area.centerLng)];
}

function layerEnabled(name) {
  if (!roleAllowsLayer(name)) return false;
  const checkbox = document.querySelector(`[data-layer="${name}"]`);
  return !checkbox || checkbox.checked;
}

function roleAllowsLayer(name) {
  return (roleProfiles[state.activeView]?.layers || []).includes(name);
}

function visibleAreas() {
  if (publicOnly()) {
    return (state.publicStatusAreas || []).map((area) => ({
      id: area.areaId,
      name: area.areaName,
      centerLat: area.centerLat,
      centerLng: area.centerLng,
      publicStatus: area.publicStatus,
      lastCheckedAt: area.lastCheckedAt,
    }));
  }

  const areas = state.layers?.areas || [];
  if (state.activeView === 'dambana') return areas.filter((area) => area.barangayId === 1);
  if (state.activeView === 'marulas' || state.activeView === 'inspector' || state.activeView === 'treatment') {
    return areas.filter((area) => area.barangayId === DEMO_BARANGAY_ID);
  }
  return areas;
}

function visibleByBarangay(items) {
  if (state.activeView === 'dambana') return items.filter((item) => item.barangayId === 1);
  if (state.activeView === 'marulas' || state.activeView === 'inspector' || state.activeView === 'treatment') {
    return items.filter((item) => item.barangayId === DEMO_BARANGAY_ID);
  }
  return items;
}

function publicOnly() {
  return state.activeView === 'public';
}

function visibleCoverageItems() {
  const coverage = state.coverage || {};
  const items = [
    ...(coverage.checked || []),
    ...(coverage.unchecked || []),
    ...(coverage.scheduled || []),
    ...(coverage.inProgress || []),
    ...(coverage.skipped || []),
    ...(coverage.needRevisit || []),
  ];
  return visibleByBarangay(items);
}

function switchRole(role) {
  state.activeView = role;
  document.getElementById('viewSelect').value = role;
  render();
}

function currentIncident() {
  const reports = state.layers?.reports || [];
  const tasks = state.layers?.tasks || [];
  const publicArea = (state.publicStatusAreas || []).find((area) => area.areaId === DEMO_AREA_ID);
  const report =
    reports.find((item) => item.id === state.demoReportId) ||
    [...reports].reverse().find((item) => item.areaId === DEMO_AREA_ID && item.description?.includes('Citizen report'));
  const task =
    tasks.find((item) => item.id === state.demoTaskId) ||
    tasks.find((item) => item.areaId === DEMO_AREA_ID && ['scheduled', 'in_progress'].includes(item.status));

  if (report && !state.demoReportId) state.demoReportId = report.id;
  if (task && !state.demoTaskId) state.demoTaskId = task.id;

  return {
    areaName: publicArea?.areaName || 'Marulas Market Drainage',
    publicStatus: publicArea?.publicStatus || 'red',
    report,
    task,
    route: state.route,
  };
}

function nextStepLabel() {
  const labels = {
    public: '1. Submit Marulas report',
    marulas: '2. Schedule inspection',
    operations: '3. Generate city task',
    inspector: '4. Run Marulas patrol',
    treatment: '5. Record treatment',
    dambana: 'Back to Marulas flow',
  };
  return labels[state.activeView] || 'Run Current Step';
}

function routeStyle(route) {
  if (route.status === 'completed') {
    return { color: '#16a34a', weight: 6, dashArray: null, className: 'cleared-route-line' };
  }

  if (route.id === DEMO_ROUTE_ID && state.route?.status === 'in_progress') {
    return { color: '#7c3aed', weight: 6, dashArray: null, className: 'active-route-line' };
  }

  if (route.status === 'scheduled') {
    return { color: '#64748b', weight: 4, dashArray: '8 10', className: '' };
  }

  return { color: route.id === DEMO_ROUTE_ID ? '#7c3aed' : '#475569', weight: 5, dashArray: null, className: '' };
}

function createLeafletMap() {
  if (!window.L) {
    state.fallback = true;
    document.getElementById('map').classList.add('fallback-map');
    setStatus('Offline demo mode: Leaflet or map tiles are unavailable, showing local map layer.');
    return;
  }

  const bounds = L.latLngBounds(
    [VALENZUELA_BOUNDS.minLat, VALENZUELA_BOUNDS.minLng],
    [VALENZUELA_BOUNDS.maxLat, VALENZUELA_BOUNDS.maxLng],
  );

  state.map = L.map('map', {
    maxBounds: bounds.pad(0.3),
    maxBoundsViscosity: 0.8,
    minZoom: 12,
    zoomSnap: 0.25,
  }).setView(VALENZUELA_CENTER, 14);
  state.baseLayer = createBaseLayer('osm');
  state.baseLayer.addTo(state.map);

  ['areas', 'reports', 'sentinelDevices', 'tasks', 'routes', 'coverage'].forEach((name) => {
    state.layerGroups[name] = L.layerGroup().addTo(state.map);
  });

  setTimeout(() => {
    state.map.invalidateSize();
    state.map.fitBounds(bounds, { padding: [24, 24] });
  }, 0);

  window.addEventListener('resize', () => state.map.invalidateSize());
  state.map.on('click', handleMapClick);
}

function baseLayerConfig(type) {
  const configs = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    carto: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri',
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data &copy; OpenStreetMap contributors, SRTM | OpenTopoMap',
    },
  };

  return configs[type] || configs.osm;
}

function createBaseLayer(type) {
  const config = baseLayerConfig(type);
  const layer = L.tileLayer(config.url, {
    maxZoom: 19,
    noWrap: true,
    attribution: config.attribution,
  });

  layer.on('tileerror', () => {
    state.tileErrorCount += 1;
    if (type !== 'carto' && state.tileErrorCount >= 4) {
      state.map.removeLayer(state.baseLayer);
      state.baseLayer = createBaseLayer('carto');
      state.baseLayer.addTo(state.map);
      setStatus('OSM tiles were incomplete, switched to CARTO base map. Data remains Valenzuela-only.');
      return;
    }

    if (type === 'carto' && state.tileErrorCount >= 10) {
      state.fallback = true;
      setStatus('Web map tiles are unavailable, switched to local schematic demo map.');
      render();
    }
  });

  return layer;
}

function switchBaseLayer(type) {
  if (!state.map || state.fallback) return;
  state.tileErrorCount = 0;
  if (state.baseLayer) state.map.removeLayer(state.baseLayer);
  state.baseLayer = createBaseLayer(type);
  state.baseLayer.addTo(state.map);
  setStatus(`Switched basemap to ${document.getElementById('baseMapSelect').selectedOptions[0].text}.`);
}

function handleMapClick(event) {
  if (!state.pendingTrapType) return;
  placeTrapAt(state.pendingTrapType, {
    lat: event.latlng.lat,
    lng: event.latlng.lng,
  });
}

function clearLeafletLayers() {
  Object.values(state.layerGroups).forEach((group) => group.clearLayers());
}

function addAreaLayer(areas) {
  if (!layerEnabled('areas')) return;

  L.rectangle(
    [
      [VALENZUELA_BOUNDS.minLat, VALENZUELA_BOUNDS.minLng],
      [VALENZUELA_BOUNDS.maxLat, VALENZUELA_BOUNDS.maxLng],
    ],
    {
      color: '#0f766e',
      weight: 2,
      fillColor: '#0f766e',
      fillOpacity: 0.04,
      dashArray: '7 7',
    },
  )
    .bindPopup('Valenzuela MVP demo boundary')
    .addTo(state.layerGroups.areas);

  areas.forEach((area) => {
    const color = publicOnly() ? colors[area.publicStatus] || colors.gray : colors[area.priority] || colors[area.publicStatus] || '#2563eb';
    L.circleMarker(areaLatLng(area), {
      radius: area.priority === 'critical' ? 19 : 15,
      color,
      weight: 2,
      fillColor: color,
      fillOpacity: publicOnly() ? 0.35 : 0.22,
    })
      .bindPopup(
        popup(area.name, [
          ['Barangay', publicOnly() ? undefined : area.barangayId === 1 ? 'Dambana' : 'Marulas'],
          ['Priority', publicOnly() ? undefined : area.priority],
          ['Risk score', publicOnly() ? undefined : area.riskScore],
          ['Why', publicOnly() ? undefined : area.riskSummary],
          ['Public status', area.publicStatus],
          ['Last checked', area.lastCheckedAt],
        ]),
      )
      .addTo(state.layerGroups.areas);
  });
}

function addReportLayer(reports) {
  if (!layerEnabled('reports') || publicOnly()) return;

  reports.forEach((report) => {
    L.marker([Number(report.lat), Number(report.lng)])
      .bindPopup(
        popup(`Report #${report.id}`, [
          ['Description', report.description],
          ['Risk', report.riskLevel],
          ['Status', report.status],
          ['Created', report.createdAt],
        ]),
      )
      .addTo(state.layerGroups.reports);
  });
}

function addDeviceLayer(devices) {
  if (!layerEnabled('sentinelDevices') || publicOnly()) return;

  devices.forEach((device) => {
    const isMosquitoTrap = device.type === 'mosquito_trap';
    L.circleMarker([Number(device.lat), Number(device.lng)], {
      radius: isMosquitoTrap ? 8 : 9,
      color: isMosquitoTrap ? '#86198f' : '#0f766e',
      weight: 2,
      fillColor: isMosquitoTrap ? '#d946ef' : '#14b8a6',
      fillOpacity: 0.75,
      dashArray: isMosquitoTrap ? '3 3' : null,
    })
      .bindPopup(
        popup(device.deviceCode, [
          ['Trap type', device.type],
          ['Status', device.status],
          ['Battery', `${device.batteryLevel}%`],
          ['Last seen', device.lastSeenAt],
        ]),
      )
      .addTo(state.layerGroups.sentinelDevices);
  });
}

function addTaskLayer(tasks, areas) {
  if (!layerEnabled('tasks') || publicOnly()) return;

  const areasById = new Map(areas.map((area) => [area.id, area]));
  tasks.forEach((task) => {
    const area = areasById.get(task.areaId);
    if (!area) return;

    const [lat, lng] = areaLatLng(area);
    L.circleMarker([lat + 0.00025, lng - 0.00025], {
      radius: 7,
      color: '#1d4ed8',
      weight: 2,
      fillColor: '#60a5fa',
      fillOpacity: 0.85,
    })
      .bindPopup(
        popup(`Task #${task.id}`, [
          ['Type', task.type],
          ['Priority', task.priority],
          ['Status', task.status],
          ['Area', area.name],
          ['Due', task.dueAt],
        ]),
      )
      .addTo(state.layerGroups.tasks);
  });
}

function addRouteLayer(routes) {
  if (!layerEnabled('routes') || publicOnly()) return;

  routes.forEach((route) => {
    const points = (route.id === DEMO_ROUTE_ID ? state.routePoints : route.trailJson || [])
      .map(normalizePoint)
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

    if (points.length >= 2) {
      const style = routeStyle(route);
      L.polyline(points.map((point) => [point.lat, point.lng]), {
        color: style.color,
        weight: style.weight,
        dashArray: style.dashArray,
        className: style.className,
      })
        .bindPopup(
          popup(`Route #${route.id}`, [
            ['Type', route.type],
            ['Status', route.id === DEMO_ROUTE_ID ? state.route?.status : route.status],
            ['Distance', `${calculateDistanceKm(points).toFixed(2)} km`],
            ['Points', points.length],
          ]),
        )
        .addTo(state.layerGroups.routes);
    }

    if (route.id === DEMO_ROUTE_ID && state.activeView === 'inspector' && points.length >= 1) {
      const lastPoint = points[points.length - 1];
      L.circleMarker([lastPoint.lat, lastPoint.lng], {
        radius: 11,
        color: '#4c1d95',
        weight: 3,
        fillColor: '#a78bfa',
        fillOpacity: 0.95,
      })
        .bindPopup(
          popup('Inspector Ana', [
            ['Status', state.route?.status],
            ['Current trail point', points.length],
            ['Distance', `${calculateDistanceKm(points).toFixed(2)} km`],
          ]),
        )
        .addTo(state.layerGroups.routes);
    }
  });
}

function coverageStyle(status) {
  const styles = {
    checked: { color: '#16a34a', label: 'Checked' },
    unchecked: { color: '#64748b', label: 'Unchecked' },
    scheduled: { color: '#eab308', label: 'Scheduled' },
    in_progress: { color: '#7c3aed', label: 'In progress' },
    skipped: { color: '#f97316', label: 'Skipped' },
    need_revisit: { color: '#f97316', label: 'Need revisit' },
  };
  return styles[status] || styles.unchecked;
}

function addCoverageLayer(items) {
  if (!layerEnabled('coverage') || publicOnly()) return;

  items.forEach((item) => {
    const style = coverageStyle(item.status);
    L.circleMarker([Number(item.centerLat), Number(item.centerLng)], {
      radius: 24,
      color: style.color,
      weight: 2,
      fillColor: style.color,
      fillOpacity: 0.08,
      dashArray: item.status === 'unchecked' || item.status === 'skipped' ? '4 6' : null,
    })
      .bindPopup(
        popup(`${style.label}: ${item.areaName}`, [
          ['Coverage status', style.label],
          ['Route', item.routeId ? `#${item.routeId}` : undefined],
          ['Reason', item.reason],
        ]),
      )
      .addTo(state.layerGroups.coverage);
  });
}

function renderLeaflet() {
  clearLeafletLayers();

  const areas = visibleAreas();
  const reports = publicOnly() ? [] : visibleByBarangay(state.layers.reports || []);
  const devices = publicOnly() ? [] : visibleByBarangay(state.layers.sentinelDevices || []);
  const tasks = publicOnly() ? [] : visibleByBarangay(state.layers.tasks || []);
  const routes = publicOnly() ? [] : visibleByBarangay(state.layers.routes || []);
  const coverage = visibleCoverageItems();

  addAreaLayer(areas);
  addCoverageLayer(coverage);
  addReportLayer(reports);
  addDeviceLayer(devices);
  addTaskLayer(tasks, areas);
  addRouteLayer(routes);

  const bounds = [];
  areas.forEach((area) => bounds.push(areaLatLng(area)));
  reports.forEach((report) => bounds.push([Number(report.lat), Number(report.lng)]));
  devices.forEach((device) => bounds.push([Number(device.lat), Number(device.lng)]));
  state.routePoints.filter(withinValenzuelaDemo).forEach((point) => bounds.push([point.lat, point.lng]));

  const validBounds = bounds.filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
  if (validBounds.length > 0) {
    state.map.invalidateSize();
    state.map.fitBounds(validBounds, { padding: [36, 36], maxZoom: 15 });
  }
}

function calculateDistanceKm(points) {
  const valid = points.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  if (valid.length < 2) return 0;

  if (window.turf) {
    const line = turf.lineString(valid.map((point) => [point.lng, point.lat]));
    return turf.length(line, { units: 'kilometers' });
  }

  let total = 0;
  for (let index = 1; index < valid.length; index += 1) {
    total += haversineKm(valid[index - 1], valid[index]);
  }
  return total;
}

function haversineKm(a, b) {
  const radiusKm = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return radiusKm * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function renderSummary() {
  const areas = visibleAreas();
  const reports = visibleByBarangay(state.layers?.reports || []);
  const devices = visibleByBarangay(state.layers?.sentinelDevices || []);
  const tasks = visibleByBarangay(state.layers?.tasks || []);
  const coverage = visibleCoverageItems();
  const critical = areas.filter((area) => area.priority === 'critical').length;
  const distance = calculateDistanceKm(state.routePoints);

  document.getElementById('summary').innerHTML = [
    [publicOnly() ? 'Public areas' : 'Risk areas', areas.length],
    ['Critical areas', publicOnly() ? '-' : critical],
    ['Citizen reports', publicOnly() ? 0 : reports.length],
    ['Sentinel devices', publicOnly() ? 0 : devices.length],
    ['Open tasks', publicOnly() ? 0 : tasks.filter((task) => task.status !== 'completed').length],
    ['Coverage notes', publicOnly() ? 0 : coverage.length],
    ['Route distance', `${distance.toFixed(2)} km`],
  ]
    .map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join('');

  document.getElementById('routeName').textContent = state.route ? `Route #${state.route.id} ${state.route.status}` : 'Route #1';
  document.getElementById('distanceValue').textContent = `${distance.toFixed(2)} km`;
  document.getElementById('pointValue').textContent = state.routePoints.length;
}

function renderFallback() {
  const mapEl = document.getElementById('map');
  mapEl.classList.add('fallback-map');

  const areas = visibleAreas();
  const reports = publicOnly() ? [] : visibleByBarangay(state.layers?.reports || []);
  const devices = publicOnly() ? [] : visibleByBarangay(state.layers?.sentinelDevices || []);
  const tasks = publicOnly() ? [] : visibleByBarangay(state.layers?.tasks || []);
  const routes = publicOnly() ? [] : visibleByBarangay(state.layers?.routes || []);
  const coverage = publicOnly() ? [] : visibleCoverageItems();
  const allPoints = [
    ...areas.map((area) => ({ lat: area.centerLat, lng: area.centerLng })),
    ...reports,
    ...devices,
    ...state.routePoints.filter(withinValenzuelaDemo),
  ];

  const bounds = getBounds(allPoints);
  const project = (point) => {
    const x = ((Number(point.lng) - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 860 + 70;
    const y = 560 - ((Number(point.lat) - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 460;
    return { x, y };
  };

  const areaSvg = layerEnabled('areas')
    ? areas
        .map((area) => {
          const point = project({ lat: area.centerLat, lng: area.centerLng });
          const color = publicOnly() ? colors[area.publicStatus] || colors.gray : colors[area.priority] || colors[area.publicStatus] || '#2563eb';
          return `<circle cx="${point.x}" cy="${point.y}" r="22" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="3"></circle><text x="${point.x + 28}" y="${point.y + 4}" font-size="15" fill="#1f2933">${escapeHtml(area.name)}</text>`;
        })
        .join('')
    : '';

  const reportSvg = layerEnabled('reports') && !publicOnly()
    ? reports
        .map((report) => {
          const point = project(report);
          return `<rect x="${point.x - 7}" y="${point.y - 7}" width="14" height="14" fill="#f97316"></rect>`;
        })
        .join('')
    : '';

  const deviceSvg = layerEnabled('sentinelDevices') && !publicOnly()
    ? devices
        .map((device) => {
          const point = project(device);
          const isMosquitoTrap = device.type === 'mosquito_trap';
          return `<circle cx="${point.x}" cy="${point.y}" r="8" fill="${isMosquitoTrap ? '#d946ef' : '#14b8a6'}" stroke="${isMosquitoTrap ? '#86198f' : '#0f766e'}" stroke-width="2" stroke-dasharray="${isMosquitoTrap ? '3 3' : ''}"></circle>`;
        })
        .join('')
    : '';

  const taskSvg = layerEnabled('tasks') && !publicOnly()
    ? tasks
        .map((task) => {
          const area = areas.find((item) => item.id === task.areaId);
          if (!area) return '';
          const point = project({ lat: Number(area.centerLat) + 0.00025, lng: Number(area.centerLng) - 0.00025 });
          return `<circle cx="${point.x}" cy="${point.y}" r="7" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"></circle>`;
        })
        .join('')
    : '';

  const routeSvg = layerEnabled('routes') && !publicOnly()
    ? routes
        .map((route) => {
          const points = (route.id === DEMO_ROUTE_ID ? state.routePoints : route.trailJson || []).map(normalizePoint);
          if (points.length < 2) return '';
          const style = routeStyle(route);
          return `<polyline points="${points.map((point) => {
            const projected = project(point);
            return `${projected.x},${projected.y}`;
          }).join(' ')}" fill="none" stroke="${style.color}" stroke-width="${style.weight}" stroke-dasharray="${style.dashArray || ''}" stroke-linecap="round" stroke-linejoin="round"></polyline>`;
        })
        .join('')
    : '';

  mapEl.innerHTML = `
    <svg viewBox="0 0 1000 640" role="img" aria-label="Offline Valenzuela demo map">
      <rect x="0" y="0" width="1000" height="640" fill="transparent"></rect>
      <rect x="64" y="110" width="872" height="470" fill="#0f766e" fill-opacity="0.04" stroke="#0f766e" stroke-width="3" stroke-dasharray="9 9"></rect>
      <text x="70" y="60" font-size="24" font-weight="700" fill="#1f2933">Valenzuela MVP Demo Map</text>
      <text x="70" y="88" font-size="15" fill="#667085">Barangay Dambana and Barangay Marulas</text>
      ${routeSvg}
      ${areaSvg}
      ${coverage
        .map((item) => {
          const point = project({ lat: item.centerLat, lng: item.centerLng });
          const style = coverageStyle(item.status);
          return `<circle cx="${point.x}" cy="${point.y}" r="34" fill="none" stroke="${style.color}" stroke-width="3" stroke-dasharray="5 6"></circle>`;
        })
        .join('')}
      ${reportSvg}
      ${deviceSvg}
      ${taskSvg}
    </svg>
    <div class="fallback-label">Offline demo mode: no web tiles required. Geography is schematic.</div>
  `;
}

function getBounds(points) {
  const valid = points.filter((point) => Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng)));
  if (valid.length === 0) {
    return VALENZUELA_BOUNDS;
  }

  const lats = valid.map((point) => Number(point.lat));
  const lngs = valid.map((point) => Number(point.lng));
  return {
    minLat: Math.min(...lats) - 0.002,
    maxLat: Math.max(...lats) + 0.002,
    minLng: Math.min(...lngs) - 0.002,
    maxLng: Math.max(...lngs) + 0.002,
  };
}

function render() {
  if (!state.layers) return;
  applyRoleUi();
  renderSummary();
  renderIncidentThread();
  if (state.fallback) {
    renderFallback();
  } else {
    renderLeaflet();
  }
}

function applyRoleUi() {
  const profile = roleProfiles[state.activeView] || roleProfiles.operations;
  document.getElementById('roleTitle').textContent = profile.title;
  document.getElementById('roleSees').textContent = profile.sees;
  document.getElementById('roleActions').textContent = profile.actions;
  document.getElementById('demoStepTitle').textContent = profile.stepTitle;
  document.getElementById('demoStepText').textContent = profile.stepText;
  document.getElementById('guideActionButton').textContent = nextStepLabel();

  document.querySelectorAll('[data-flow-step]').forEach((step) => {
    const active = step.dataset.flowStep === state.activeView || (state.activeView === 'dambana' && step.dataset.flowStep === 'marulas');
    step.classList.toggle('is-active', active);
  });

  document.querySelectorAll('[data-layer]').forEach((checkbox) => {
    const allowed = profile.layers.includes(checkbox.dataset.layer);
    const wasDisabled = checkbox.disabled;
    checkbox.disabled = !allowed;
    if (!allowed) checkbox.checked = false;
    if (allowed && wasDisabled) checkbox.checked = true;
    checkbox.closest('label').classList.toggle('is-disabled', !allowed);
  });

  document.querySelectorAll('[data-role-action]').forEach((card) => {
    const visible = profile.actionsVisible.includes(card.dataset.roleAction);
    card.classList.toggle('is-current-role', visible);
    card.classList.toggle('is-hidden', !visible);
  });

  document.querySelectorAll('[data-role-section="route"]').forEach((section) => {
    section.classList.toggle('is-hidden', !['inspector', 'treatment'].includes(state.activeView));
  });
}

function renderIncidentThread() {
  const incident = currentIncident();
  document.getElementById('incidentThread').innerHTML = [
    ['Area', incident.areaName],
    ['Citizen report', incident.report ? `#${incident.report.id} ${incident.report.status}` : 'Not submitted yet'],
    ['Public status', incident.publicStatus],
    ['City task', incident.task ? `#${incident.task.id} ${incident.task.status}` : 'Not generated yet'],
    ['Inspector route', incident.route ? `#${incident.route.id} ${incident.route.status}` : 'Not started yet'],
    ['Treatment', state.treatmentRecorded ? 'Recorded, monitoring active' : 'Waiting for treatment team'],
  ]
    .map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value)}</dd>`)
    .join('');
}

async function loadLayers() {
  setStatus('Loading Dambana and Marulas map layers...');

  try {
    const [layersResponse, publicResponse, coverageResponse] = await Promise.all([
      fetch('/api/v1/maps/layers'),
      fetch('/api/v1/public-status/areas'),
      fetch('/api/v1/maps/coverage'),
    ]);
    if (!layersResponse.ok) throw new Error(`Map layers failed with ${layersResponse.status}`);
    if (!publicResponse.ok) throw new Error(`Public status failed with ${publicResponse.status}`);
    if (!coverageResponse.ok) throw new Error(`Coverage failed with ${coverageResponse.status}`);

    const [layersPayload, publicPayload, coveragePayload] = await Promise.all([
      layersResponse.json(),
      publicResponse.json(),
      coverageResponse.json(),
    ]);
    state.layers = layersPayload.data;
    state.publicStatusAreas = publicPayload.data;
    state.coverage = coveragePayload.data;
    state.route = (state.layers.routes || []).find((route) => route.id === DEMO_ROUTE_ID) || null;
    state.routePoints = normalizeDemoTrail(state.route?.trailJson || []);
    render();
    setStatus(state.fallback ? 'Offline demo mode loaded with local data layers.' : 'Loaded demo-ready map, public status, and coverage layers.');
  } catch (error) {
    setStatus(`Could not load map layers: ${error.message}`);
  }
}

async function routeAction(action) {
  try {
    const response = await fetch(`/api/v1/routes/${DEMO_ROUTE_ID}/${action}`, { method: 'POST' });
    if (!response.ok) throw new Error(`Route ${action} failed with ${response.status}`);
    const payload = await response.json();
    state.route = payload.data;
    state.routePoints = normalizeDemoTrail(state.route?.trailJson || state.routePoints);
    setStatus(`Route ${DEMO_ROUTE_ID} ${action} saved.`);
    render();
  } catch (error) {
    setStatus(error.message);
  }
}

async function resetRoute() {
  try {
    const response = await fetch(`/api/v1/routes/${DEMO_ROUTE_ID}/reset`, { method: 'POST' });
    if (!response.ok) throw new Error(`Route reset failed with ${response.status}`);
    const payload = await response.json();
    state.route = payload.data;
    state.routePoints = normalizeDemoTrail(state.route?.trailJson || []);
    state.demoPointIndex = 0;
    setStatus(`Route ${DEMO_ROUTE_ID} reset to the Valenzuela demo trail.`);
    render();
  } catch (error) {
    setStatus(error.message);
  }
}

async function clearRouteForPatrolDemo() {
  const response = await fetch(`/api/v1/routes/${DEMO_ROUTE_ID}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clearTrail: true }),
  });
  if (!response.ok) throw new Error(`Route reset failed with ${response.status}`);
  const payload = await response.json();
  state.route = payload.data;
  state.routePoints = [];
  state.demoPointIndex = 0;
  state.activeDemoPath = null;
  render();
}

async function appendRoutePoint(point) {
  if (state.route?.status !== 'in_progress') {
    setStatus('Start or resume the route before adding trail points.');
    return;
  }

  const normalized = normalizePoint(point);
  if (!withinValenzuelaDemo(normalized)) {
    setStatus('Ignored GPS point outside the Valenzuela MVP demo area. Use Add Demo Point for a repeatable local demo.');
    return;
  }

  state.routePoints = [...state.routePoints, normalized];
  render();

  try {
    const response = await fetch(`/api/v1/routes/${DEMO_ROUTE_ID}/trail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: [normalized] }),
    });
    if (!response.ok) throw new Error(`Trail save failed with ${response.status}`);
    const payload = await response.json();
    state.route = payload.data;
    state.routePoints = normalizeDemoTrail(state.route?.trailJson || state.routePoints);
    setStatus(`Added route point at ${normalized.lat.toFixed(5)}, ${normalized.lng.toFixed(5)}.`);
    render();
  } catch (error) {
    setStatus(`${error.message}. Point is visible locally until refresh.`);
  }
}

async function submitCitizenReportDemo() {
  switchRole('public');

  try {
    const response = await fetch('/api/v1/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submittedBy: null,
        barangayId: DEMO_BARANGAY_ID,
        areaId: DEMO_AREA_ID,
        lat: 14.6837,
        lng: 120.9749,
        description: 'Citizen report: stagnant water near Marulas walkway',
        riskLevel: 'high',
      }),
    });
    if (!response.ok) throw new Error(`Citizen report failed with ${response.status}`);
    const payload = await response.json();
    state.demoReportId = payload.data.id;
    switchRole('marulas');
    await loadLayers();
    setStatus(`Step 1 complete: report #${state.demoReportId} is now in Barangay Marulas triage.`);
  } catch (error) {
    setStatus(error.message);
  }
}

async function updateBarangayStatusDemo() {
  switchRole('marulas');

  try {
    const response = await fetch(`/api/v1/public-status/${DEMO_AREA_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicStatus: 'yellow' }),
    });
    if (!response.ok) throw new Error(`Status update failed with ${response.status}`);
    await loadLayers();
    switchRole('operations');
    setStatus('Step 2 complete: Barangay Marulas marked the reported area yellow and scheduled it for city prioritization.');
  } catch (error) {
    setStatus(error.message);
  }
}

async function generateCityTasksDemo() {
  switchRole('operations');

  try {
    const response = await fetch('/api/v1/tasks/generate-preventive', { method: 'POST' });
    if (!response.ok) throw new Error(`Task generation failed with ${response.status}`);
    const payload = await response.json();
    const demoTask = (payload.data || []).find((task) => task.areaId === DEMO_AREA_ID);
    if (demoTask) state.demoTaskId = demoTask.id;
    await loadLayers();
    switchRole('inspector');
    setStatus(`Step 3 complete: city generated task #${state.demoTaskId || 'for Marulas'} and handed it to the inspector view.`);
  } catch (error) {
    setStatus(error.message);
  }
}

function latestInspectorPoint() {
  const latest = state.routePoints[state.routePoints.length - 1];
  if (latest && withinValenzuelaDemo(latest)) return latest;
  return { lat: 14.6841, lng: 120.9739 };
}

function beginTrapPlacement(type) {
  if (state.activeView !== 'inspector') switchRole('inspector');

  state.pendingTrapType = type;
  document.body.classList.add('is-placement-mode');
  setStatus(`Inspector placement mode: click the map to place a ${type === 'mosquito_trap' ? 'mosquito trap' : 'smart ovitrap'}.`);

  if (state.fallback || !state.map) {
    placeTrapAt(type, latestInspectorPoint());
  }
}

async function placeTrapAt(type, point) {
  const normalizedPoint = normalizePoint(point);
  if (!withinValenzuelaDemo(normalizedPoint)) {
    setStatus('Trap placement ignored: selected point is outside the Valenzuela MVP area.');
    return;
  }

  state.pendingTrapType = null;
  document.body.classList.remove('is-placement-mode');

  const devicePrefix = type === 'mosquito_trap' ? 'MOSQ' : 'OVI';

  try {
    const response = await fetch('/api/v1/sentinel-devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceCode: `${devicePrefix}-INSPECT-${Date.now().toString().slice(-5)}`,
        type,
        barangayId: DEMO_BARANGAY_ID,
        areaId: DEMO_AREA_ID,
        lat: Number(normalizedPoint.lat.toFixed(6)),
        lng: Number(normalizedPoint.lng.toFixed(6)),
        status: 'active',
        batteryLevel: 100,
      }),
    });
    if (!response.ok) throw new Error(`Trap placement failed with ${response.status}`);
    await loadLayers();
    setStatus(`Inspector placed ${type === 'mosquito_trap' ? 'mosquito trap' : 'smart ovitrap'} at the selected map location.`);
  } catch (error) {
    setStatus(error.message);
  }
}

async function focusTreatmentWork() {
  switchRole('treatment');

  try {
    const treatmentResponse = await fetch('/api/v1/treatments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        areaId: DEMO_AREA_ID,
        barangayId: DEMO_BARANGAY_ID,
        status: 'monitoring',
        actionTaken: 'Source cleanup and larvicide applied',
        completedAt: new Date().toISOString(),
      }),
    });
    if (!treatmentResponse.ok) throw new Error(`Treatment save failed with ${treatmentResponse.status}`);

    const statusResponse = await fetch(`/api/v1/public-status/${DEMO_AREA_ID}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicStatus: 'orange' }),
    });
    if (!statusResponse.ok) throw new Error(`Monitoring status failed with ${statusResponse.status}`);

    state.treatmentRecorded = true;
    await loadLayers();
    switchRole('public');
    setStatus('Step 5 complete: treatment recorded. Public map now shows Marulas Market Drainage in orange monitoring.');
  } catch (error) {
    setStatus(error.message);
  }
}

function runCurrentStep() {
  const actions = {
    public: submitCitizenReportDemo,
    marulas: updateBarangayStatusDemo,
    operations: generateCityTasksDemo,
    inspector: runInspectorPatrolDemo,
    treatment: focusTreatmentWork,
    dambana: () => switchRole('marulas'),
  };

  return (actions[state.activeView] || submitCitizenReportDemo)();
}

async function runInspectorPatrolDemo() {
  if (state.patrolDemoRunning) return;
  state.patrolDemoRunning = true;
  switchRole('inspector');

  try {
    await clearRouteForPatrolDemo();
    await routeAction('start');

    const selectedPath = demoPaths[0];
    state.activeDemoPath = selectedPath;
    const points = selectedPath.points;

    setStatus(`Field inspector demo running: ${selectedPath.name}. First GPS point is being recorded.`);
    for (let index = 0; index < points.length; index += 1) {
      await wait(1150);
      await appendRoutePoint({ ...points[index], timestamp: new Date().toISOString() });
      setStatus(`Inspection ongoing on ${selectedPath.name}: recorded GPS point ${index + 1} of ${points.length}.`);
    }

    await routeAction('complete');
    await loadLayers();
    switchRole('treatment');
    setStatus(`Step 4 complete: ${selectedPath.name} validated. Treatment team now receives the same Marulas case.`);
  } catch (error) {
    setStatus(error.message);
  } finally {
    state.patrolDemoRunning = false;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addDemoPoint() {
  if (!state.activeDemoPath) {
    state.activeDemoPath = demoPaths[0];
    state.demoPointIndex = 0;
    setStatus(`Manual demo path selected: ${state.activeDemoPath.name}.`);
  }

  const next = state.activeDemoPath.points[state.demoPointIndex % state.activeDemoPath.points.length];
  state.demoPointIndex += 1;
  appendRoutePoint({ ...next, timestamp: new Date().toISOString() });
}

function toggleGps() {
  if (!navigator.geolocation) {
    setStatus('Browser geolocation is not available. Use Add Demo Point for the MVP demo.');
    return;
  }

  if (state.gpsWatchId !== null) {
    navigator.geolocation.clearWatch(state.gpsWatchId);
    state.gpsWatchId = null;
    document.getElementById('gpsButton').textContent = 'Use GPS';
    setStatus('GPS tracking stopped.');
    return;
  }

  state.gpsWatchId = navigator.geolocation.watchPosition(
    (position) => {
      appendRoutePoint({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date(position.timestamp).toISOString(),
      });
    },
    (error) => setStatus(`GPS error: ${error.message}`),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
  );
  document.getElementById('gpsButton').textContent = 'Stop GPS';
  setStatus('GPS tracking started. Browser permission is required.');
}

document.getElementById('refreshButton').addEventListener('click', loadLayers);
document.getElementById('baseMapSelect').addEventListener('change', (event) => {
  switchBaseLayer(event.target.value);
});
document.getElementById('viewSelect').addEventListener('change', (event) => {
  state.activeView = event.target.value;
  render();
});

document.querySelectorAll('[data-layer]').forEach((checkbox) => {
  checkbox.addEventListener('change', render);
});

document.getElementById('guideActionButton').addEventListener('click', runCurrentStep);

document.querySelectorAll('[data-flow-step]').forEach((step) => {
  const activate = () => switchRole(step.dataset.flowStep);
  step.addEventListener('click', activate);
  step.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate();
    }
  });
});

document.getElementById('startRouteButton').addEventListener('click', () => routeAction('start'));
document.getElementById('pauseRouteButton').addEventListener('click', () => routeAction('pause'));
document.getElementById('resumeRouteButton').addEventListener('click', () => routeAction('resume'));
document.getElementById('completeRouteButton').addEventListener('click', () => routeAction('complete'));
document.getElementById('addPointButton').addEventListener('click', addDemoPoint);
document.getElementById('gpsButton').addEventListener('click', toggleGps);
document.getElementById('resetRouteButton').addEventListener('click', resetRoute);
document.getElementById('citizenReportButton').addEventListener('click', submitCitizenReportDemo);
document.getElementById('barangayStatusButton').addEventListener('click', updateBarangayStatusDemo);
document.getElementById('cityTasksButton').addEventListener('click', generateCityTasksDemo);
document.getElementById('inspectorDemoButton').addEventListener('click', runInspectorPatrolDemo);
document.getElementById('placeOvitrapButton').addEventListener('click', () => beginTrapPlacement('smart_ovitrap'));
document.getElementById('placeMosquitoTrapButton').addEventListener('click', () => beginTrapPlacement('mosquito_trap'));
document.getElementById('treatmentFocusButton').addEventListener('click', focusTreatmentWork);

createLeafletMap();
loadLayers();
