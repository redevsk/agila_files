const { created, ok } = require('../../utils/respond');
const { fail } = require('../../utils/http');
const { checkDevice, ingestReading, listDevices, placeDevice, removeDevice } = require('./sentinel-devices.service');

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

async function remove(req, res) {
  const device = await removeDevice(req.params.id);
  if (!device) return fail(res, 404, 'Sentinel device not found');
  return ok(res, device);
}

module.exports = {
  check,
  create,
  createReading,
  list,
  remove,
};
