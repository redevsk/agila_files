const { ok } = require('../../utils/respond');
const { getCoverage, getMapLayers } = require('./maps.service');

async function layers(_req, res) {
  return ok(res, await getMapLayers());
}

async function coverage(_req, res) {
  return ok(res, await getCoverage());
}

module.exports = {
  coverage,
  layers,
};
