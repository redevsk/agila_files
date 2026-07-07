const devices = [
  {
    id: 1,
    deviceCode: 'OVI-BRGY-001',
    type: 'smart_ovitrap',
    barangayId: 1,
    areaId: 2,
    lat: 14.6012,
    lng: 120.9815,
    status: 'needs_maintenance',
    batteryLevel: 32,
    lastSeenAt: '2026-07-08T08:30:00Z',
  },
];

const readings = [];

async function findAllDevices() {
  return devices;
}

async function updateDevice(id, changes) {
  const device = devices.find((item) => item.id === Number(id));
  if (!device) return null;
  Object.assign(device, changes);
  return device;
}

async function createReading(payload) {
  const reading = {
    id: readings.length + 1,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  readings.push(reading);
  return reading;
}

module.exports = {
  createReading,
  findAllDevices,
  updateDevice,
};
