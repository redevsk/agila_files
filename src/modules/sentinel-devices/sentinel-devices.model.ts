const initialDevices = [
  {
    id: 1,
    deviceCode: 'OVI-DAMBANA-001',
    type: 'smart_ovitrap',
    barangayId: 1,
    areaId: 2,
    lat: 14.6999,
    lng: 120.9772,
    status: 'needs_maintenance',
    batteryLevel: 32,
    lastSeenAt: '2026-07-08T08:30:00Z',
  },
  {
    id: 2,
    deviceCode: 'OVI-MARULAS-001',
    type: 'smart_ovitrap',
    barangayId: 2,
    areaId: 3,
    lat: 14.684,
    lng: 120.9744,
    status: 'active',
    batteryLevel: 84,
    lastSeenAt: '2026-07-08T08:45:00Z',
  },
];

const devices = initialDevices.map((device) => ({ ...device }));
const readings = [];

async function findAllDevices() {
  return devices;
}

async function createDevice(payload) {
  const device = {
    id: devices.length + 1,
    status: 'active',
    batteryLevel: 100,
    lastSeenAt: new Date().toISOString(),
    ...payload,
  };
  devices.push(device);
  return device;
}

async function updateDevice(id, changes) {
  const device = devices.find((item) => item.id === Number(id));
  if (!device) return null;
  Object.assign(device, changes);
  return device;
}

async function resetDevices() {
  devices.splice(0, devices.length, ...initialDevices.map((device) => ({ ...device })));
  readings.splice(0, readings.length);
  return devices;
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
  createDevice,
  createReading,
  findAllDevices,
  resetDevices,
  updateDevice,
};

