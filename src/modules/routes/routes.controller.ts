const { ok } = require('../../utils/respond');
const { appendTrail, changeRouteStatus, getRoute, listRoutes } = require('./routes.service');

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

module.exports = {
  addTrail,
  complete,
  list,
  pause,
  resume,
  show,
  start,
};
