const { createDevice, createReading, findAllDevices, updateDevice } = require('./sentinel-devices.model');

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

async function placeDevice(payload) {
  return createDevice({
    deviceCode: payload.deviceCode,
    type: payload.type,
    barangayId: payload.barangayId,
    areaId: payload.areaId,
    lat: payload.lat,
    lng: payload.lng,
    status: payload.status || 'active',
    batteryLevel: payload.batteryLevel || 100,
    lastSeenAt: new Date().toISOString(),
  });
}

module.exports = {
  checkDevice,
  ingestReading,
  listDevices,
  placeDevice,
};
