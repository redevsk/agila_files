const { created, ok } = require('../../utils/respond');
const { checkDevice, ingestReading, listDevices, placeDevice } = require('./sentinel-devices.service');

async function list(_req, res) {
  return ok(res, await listDevices());
}

async function check(req, res) {
  return ok(res, await checkDevice(req.params.id, req.body));
}

async function createReading(req, res) {
  return created(res, await ingestReading(req.body));
}

async function create(req, res) {
  return created(res, await placeDevice(req.body));
}

module.exports = {
  check,
  create,
  createReading,
  list,
};
