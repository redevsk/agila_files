const { findAllRoutes, findRouteById, updateRoute } = require('./routes.model');

const VALENZUELA_DEMO_BOUNDS = {
  minLat: 14.67,
  maxLat: 14.715,
  minLng: 120.955,
  maxLng: 120.995,
};

const DEMO_ROUTE_TRAILS = {
  1: [
    { lat: 14.700142, lng: 120.97723, timestamp: '2026-07-08T08:05:00Z' },
    { lat: 14.699758, lng: 120.975966, timestamp: '2026-07-08T08:12:00Z' },
    { lat: 14.698764, lng: 120.976053, timestamp: '2026-07-08T08:19:00Z' },
    { lat: 14.698953, lng: 120.978334, timestamp: '2026-07-08T08:27:00Z' },
    { lat: 14.699669, lng: 120.9796, timestamp: '2026-07-08T08:34:00Z' },
    { lat: 14.700632, lng: 120.978794, timestamp: '2026-07-08T08:42:00Z' },
    { lat: 14.701612, lng: 120.977633, timestamp: '2026-07-08T08:50:00Z' },
    { lat: 14.70217, lng: 120.979165, timestamp: '2026-07-08T08:58:00Z' },
  ],
  2: [
    { lat: 14.681867, lng: 120.976292, timestamp: '2026-07-08T09:10:00Z' },
    { lat: 14.682079, lng: 120.975458, timestamp: '2026-07-08T09:16:00Z' },
    { lat: 14.682283, lng: 120.974226, timestamp: '2026-07-08T09:23:00Z' },
    { lat: 14.682877, lng: 120.974558, timestamp: '2026-07-08T09:29:00Z' },
    { lat: 14.683543, lng: 120.974478, timestamp: '2026-07-08T09:36:00Z' },
    { lat: 14.684126, lng: 120.973945, timestamp: '2026-07-08T09:43:00Z' },
  ],
};

function isValidDemoPoint(point) {
  const lat = Number(point.lat);
  const lng = Number(point.lng);
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= VALENZUELA_DEMO_BOUNDS.minLat &&
    lat <= VALENZUELA_DEMO_BOUNDS.maxLat &&
    lng >= VALENZUELA_DEMO_BOUNDS.minLng &&
    lng <= VALENZUELA_DEMO_BOUNDS.maxLng
  );
}

function normalizeDemoPoint(point) {
  return {
    lat: Number(point.lat),
    lng: Number(point.lng),
    timestamp: point.timestamp || point.recordedAt || new Date().toISOString(),
  };
}

function sanitizeRouteTrail(route) {
  if (!route) return route;
  const trailJson = (route.trailJson || []).filter(isValidDemoPoint).map(normalizeDemoPoint);
  if (trailJson.length !== (route.trailJson || []).length) {
    Object.assign(route, { trailJson });
  }
  return route;
}

async function listRoutes() {
  const routes = await findAllRoutes();
  return routes.map(sanitizeRouteTrail);
}

async function getRoute(id) {
  return sanitizeRouteTrail(await findRouteById(id));
}

async function changeRouteStatus(id, status) {
  const timestampKey = status === 'in_progress' ? 'startedAt' : `${status}At`;
  return updateRoute(id, {
    status,
    [timestampKey]: new Date().toISOString(),
  });
}

async function appendTrail(id, points) {
  const route = await findRouteById(id);
  if (!route) return null;
  if (route.status !== 'in_progress') return sanitizeRouteTrail(route);
  const validPoints = points.filter(isValidDemoPoint).map(normalizeDemoPoint);
  const trailJson = [...(sanitizeRouteTrail(route).trailJson || []), ...validPoints];
  return updateRoute(id, { trailJson });
}

async function resetRoute(id, options = {}) {
  const route = await findRouteById(id);
  if (!route) return null;
  return updateRoute(id, {
    status: 'scheduled',
    startedAt: null,
    pausedAt: null,
    completedAt: null,
    trailJson: options.clearTrail ? [] : DEMO_ROUTE_TRAILS[Number(id)] || [],
  });
}

module.exports = {
  appendTrail,
  changeRouteStatus,
  getRoute,
  listRoutes,
  resetRoute,
};
