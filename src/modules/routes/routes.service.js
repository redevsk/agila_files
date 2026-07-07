const { findAllRoutes, findRouteById, updateRoute } = require('./routes.model');

async function listRoutes() {
  return findAllRoutes();
}

async function getRoute(id) {
  return findRouteById(id);
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
  const trailJson = [...(route.trailJson || []), ...points];
  return updateRoute(id, { trailJson });
}

module.exports = {
  appendTrail,
  changeRouteStatus,
  getRoute,
  listRoutes,
};
