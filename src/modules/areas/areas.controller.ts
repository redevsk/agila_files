const { ok } = require('../../utils/respond');
const {
  getArea,
  getAreaPriorityRanking,
  listAreas,
  recalculateAreaPriorities,
  updateAreaStatus,
} = require('./areas.service');

async function list(_req, res) {
  return ok(res, await listAreas());
}

async function show(req, res) {
  return ok(res, await getArea(req.params.id));
}

async function updateStatus(req, res) {
  return ok(res, await updateAreaStatus(req.params.id, req.body.publicStatus));
}

async function recalculate(_req, res) {
  return ok(res, await recalculateAreaPriorities());
}

async function priorityRanking(_req, res) {
  return ok(res, await getAreaPriorityRanking());
}

module.exports = {
  list,
  priorityRanking,
  recalculate,
  show,
  updateStatus,
};
