const { ok, created, fail } = require('../../utils/http');
const {
  listRoutes,
  createRoute,
  deleteRoute,
  listSentinels,
  createSentinel,
  deleteSentinel,
} = require('./operation-map.service');

function hasRequiredScope(body) {
  return body.barangayId && body.createdBy;
}

async function routes(req, res) {
  return ok(res, await listRoutes(req.query));
}

async function addRoute(req, res) {
  if (!hasRequiredScope(req.body) || !req.body.name || !req.body.type || !req.body.geojson) {
    return fail(res, 400, 'barangayId, createdBy, name, type, and geojson are required');
  }
  return created(res, await createRoute(req.body));
}

async function removeRoute(req, res) {
  const route = await deleteRoute(req.params.id, req.query);
  if (!route) return fail(res, 404, 'Route not found');
  return ok(res, route);
}

async function sentinels(req, res) {
  return ok(res, await listSentinels(req.query));
}

async function addSentinel(req, res) {
  if (!hasRequiredScope(req.body) || !req.body.name || req.body.lat === undefined || req.body.lng === undefined) {
    return fail(res, 400, 'barangayId, createdBy, name, lat, and lng are required');
  }
  return created(res, await createSentinel(req.body));
}

async function removeSentinel(req, res) {
  const sentinel = await deleteSentinel(req.params.id, req.query);
  if (!sentinel) return fail(res, 404, 'Sentinel not found');
  return ok(res, sentinel);
}

module.exports = {
  routes,
  addRoute,
  removeRoute,
  sentinels,
  addSentinel,
  removeSentinel,
};
