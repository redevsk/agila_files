const { ok } = require('../../utils/respond');
const { getBarangayDashboard, getCityDashboard } = require('./dashboard.service');

async function city(_req, res) {
  return ok(res, await getCityDashboard());
}

async function barangay(req, res) {
  return ok(res, await getBarangayDashboard(req.params.id));
}

module.exports = {
  barangay,
  city,
};
