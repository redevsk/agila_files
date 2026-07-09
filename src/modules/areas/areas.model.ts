const { PRIORITIES, PUBLIC_STATUSES } = require('../../constants/statuses');

const initialAreas = [
  {
    id: 1,
    barangayId: 1,
    name: 'Dambana Creekside Block',
    type: 'public_area',
    centerLat: 14.7021,
    centerLng: 120.9792,
    boundaryGeojson: null,
    lastCheckedAt: '2026-07-01T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.RED,
    historicalHotspot: true,
    hasDrainage: true,
    densityLevel: 'high',
    riskScore: 88,
    priority: PRIORITIES.CRITICAL,
  },
  {
    id: 2,
    barangayId: 1,
    name: 'Dambana School Perimeter',
    type: 'drainage_corridor',
    centerLat: 14.6998,
    centerLng: 120.9775,
    boundaryGeojson: null,
    lastCheckedAt: '2026-07-04T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.YELLOW,
    historicalHotspot: false,
    hasDrainage: true,
    densityLevel: 'medium',
    riskScore: 62,
    priority: PRIORITIES.HIGH,
  },
  {
    id: 3,
    barangayId: 2,
    name: 'Marulas Market Drainage',
    type: 'public_area',
    centerLat: 14.6842,
    centerLng: 120.9741,
    boundaryGeojson: null,
    lastCheckedAt: '2026-06-29T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.RED,
    historicalHotspot: true,
    hasDrainage: true,
    densityLevel: 'high',
    riskScore: 81,
    priority: PRIORITIES.CRITICAL,
  },
  {
    id: 4,
    barangayId: 2,
    name: 'Marulas Residential Cluster',
    type: 'residential_cluster',
    centerLat: 14.6818,
    centerLng: 120.9763,
    boundaryGeojson: null,
    lastCheckedAt: '2026-07-06T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.GREEN,
    historicalHotspot: false,
    hasDrainage: false,
    densityLevel: 'medium',
    riskScore: 24,
    priority: PRIORITIES.LOW,
  },
];

const areas = initialAreas.map((area) => ({ ...area }));

async function findAllAreas() {
  return areas;
}

async function findAreaById(id) {
  return areas.find((area) => area.id === Number(id)) || null;
}

async function updateArea(id, changes) {
  const area = await findAreaById(id);
  if (!area) return null;
  Object.assign(area, changes);
  return area;
}

async function resetAreas() {
  areas.splice(0, areas.length, ...initialAreas.map((area) => ({ ...area })));
  return areas;
}

module.exports = {
  findAllAreas,
  findAreaById,
  resetAreas,
  updateArea,
};
