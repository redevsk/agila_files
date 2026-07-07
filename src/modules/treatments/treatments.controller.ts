const { created, ok } = require('../../utils/respond');
const { listTreatments, submitTreatment } = require('./treatments.service');

async function list(_req, res) {
  return ok(res, await listTreatments());
}

async function create(req, res) {
  return created(res, await submitTreatment(req.body));
}

module.exports = {
  create,
  list,
};
