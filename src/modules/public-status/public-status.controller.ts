const { ok } = require('../../utils/respond');
const { listPublicStatuses, setPublicStatus } = require('./public-status.service');

async function list(_req, res) {
  return ok(res, await listPublicStatuses());
}

async function update(req, res) {
  return ok(res, await setPublicStatus(req.params.areaId, req.body.publicStatus));
}

module.exports = {
  list,
  update,
};
