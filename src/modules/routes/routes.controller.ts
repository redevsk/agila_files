const { ok } = require('../../utils/respond');
const { appendTrail, changeRouteStatus, getRoute, listRoutes, resetRoute } = require('./routes.service');

async function list(_req, res) {
  return ok(res, await listRoutes());
}

async function show(req, res) {
  return ok(res, await getRoute(req.params.id));
}

async function start(req, res) {
  return ok(res, await changeRouteStatus(req.params.id, 'in_progress'));
}

async function pause(req, res) {
  return ok(res, await changeRouteStatus(req.params.id, 'paused'));
}

async function resume(req, res) {
  return ok(res, await changeRouteStatus(req.params.id, 'in_progress'));
}

async function complete(req, res) {
  return ok(res, await changeRouteStatus(req.params.id, 'completed'));
}

async function addTrail(req, res) {
  return ok(res, await appendTrail(req.params.id, req.body.points || []));
}

async function reset(req, res) {
  return ok(res, await resetRoute(req.params.id, req.body || {}));
}

module.exports = {
  addTrail,
  complete,
  list,
  pause,
  reset,
  resume,
  show,
  start,
};
