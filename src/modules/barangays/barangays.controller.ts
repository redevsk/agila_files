const { ok } = require('../../utils/respond');
const { listBarangays } = require('./barangays.service');

async function list(_req, res) {
  return ok(res, await listBarangays());
}

module.exports = { list };
