const { PRIORITIES, PUBLIC_STATUSES } = require('../../constants/statuses');

const areas = [
  {
    id: 1,
    barangayId: 1,
    name: 'Market Area',
    type: 'public_area',
    centerLat: 14.5995,
    centerLng: 120.9842,
    boundaryGeojson: null,
    lastCheckedAt: '2026-06-20T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.RED,
    historicalHotspot: true,
    hasDrainage: true,
    densityLevel: 'high',
    riskScore: 85,
    priority: PRIORITIES.CRITICAL,
  },
  {
    id: 2,
    barangayId: 1,
    name: 'Canal Side Block',
    type: 'drainage_corridor',
    centerLat: 14.6012,
    centerLng: 120.9815,
    boundaryGeojson: null,
    lastCheckedAt: '2026-06-28T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.YELLOW,
    historicalHotspot: false,
    hasDrainage: true,
    densityLevel: 'medium',
    riskScore: 62,
    priority: PRIORITIES.HIGH,
  },
  {
    id: 3,
    barangayId: 1,
    name: 'School Zone',
    type: 'public_area',
    centerLat: 14.603,
    centerLng: 120.986,
    boundaryGeojson: null,
    lastCheckedAt: '2026-07-03T08:00:00Z',
    publicStatus: PUBLIC_STATUSES.GREEN,
    historicalHotspot: false,
    hasDrainage: false,
    densityLevel: 'medium',
    riskScore: 20,
    priority: PRIORITIES.LOW,
  },
];

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

module.exports = {
  findAllAreas,
  findAreaById,
  updateArea,
};
