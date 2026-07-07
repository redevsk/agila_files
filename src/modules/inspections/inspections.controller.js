const { created, ok } = require('../../utils/respond');
const { listInspections, submitInspection } = require('./inspections.service');

async function list(_req, res) {
  return ok(res, await listInspections());
}

async function create(req, res) {
  return created(res, await submitInspection(req.body));
}

module.exports = {
  create,
  list,
};
