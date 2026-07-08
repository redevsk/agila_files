const devices = [
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
  {
    id: 3,
    deviceCode: 'MOSQ-DAMBANA-001',
    type: 'mosquito_trap',
    barangayId: 1,
    areaId: 1,
    lat: 14.7017,
    lng: 120.9789,
    status: 'active',
    batteryLevel: 91,
    lastSeenAt: '2026-07-08T09:05:00Z',
  },
  {
    id: 4,
    deviceCode: 'MOSQ-MARULAS-001',
    type: 'mosquito_trap',
    barangayId: 2,
    areaId: 4,
    lat: 14.6819,
    lng: 120.976,
    status: 'active',
    batteryLevel: 76,
    lastSeenAt: '2026-07-08T09:15:00Z',
  },
];

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
  updateDevice,
};
