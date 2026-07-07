const { createReading, findAllDevices, updateDevice } = require('./sentinel-devices.model');

async function listDevices() {
  return findAllDevices();
}

async function checkDevice(id, payload) {
  return updateDevice(id, {
    ...payload,
    lastMaintenanceAt: new Date().toISOString(),
  });
}

async function ingestReading(payload) {
  return createReading(payload);
}

module.exports = {
  checkDevice,
  ingestReading,
  listDevices,
};
