const initialDevices = [
  {
    id: 1,
    deviceCode: 'OVI-DAMBANA-001',
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
    deviceCode: 'OVI-MABOLO-002',
    barangayId: 1,
    areaId: 1,
    lat: 14.6975,
    lng: 120.9758,
    status: 'active',
    batteryLevel: 91,
    lastSeenAt: '2026-07-09T09:10:00Z',
  },
  {
    id: 4,
    deviceCode: 'OVI-POBLACION-003',
    barangayId: 2,
    areaId: 4,
    lat: 14.6902,
    lng: 120.9791,
    status: 'needs_maintenance',
    batteryLevel: 19,
    lastSeenAt: '2026-07-07T21:05:00Z',
  },
];

const devices = initialDevices.map((device) => ({ ...device }));

const initialReadings = [
  {
    id: 1,
    deviceId: 1,
    batteryLevel: 28,
    waterLevel: 62,
    temperature: 30.5,
    humidity: 79,
    insectEntryEvents: 12,
    signalStrength: -71,
    recordedAt: '2026-07-08T08:30:00Z',
  },
  {
    id: 2,
    deviceId: 2,
    batteryLevel: 80,
    waterLevel: 45,
    temperature: 31.1,
    humidity: 81,
    insectEntryEvents: 18,
    signalStrength: -68,
    recordedAt: '2026-07-08T08:45:00Z',
  },
  {
    id: 3,
    deviceId: 1,
    batteryLevel: 32,
    waterLevel: 58,
    temperature: 30.9,
    humidity: 80,
    insectEntryEvents: 15,
    signalStrength: -69,
    recordedAt: '2026-07-09T08:30:00Z',
  },
  {
    id: 4,
    deviceId: 2,
    batteryLevel: 84,
    waterLevel: 48,
    temperature: 31.4,
    humidity: 82,
    insectEntryEvents: 21,
    signalStrength: -66,
    recordedAt: '2026-07-09T08:45:00Z',
  },
  {
    id: 5,
    deviceId: 3,
    batteryLevel: 91,
    waterLevel: 70,
    temperature: 29.8,
    humidity: 74,
    insectEntryEvents: 9,
    signalStrength: -64,
    recordedAt: '2026-07-09T09:10:00Z',
  },
  {
    id: 6,
    deviceId: 4,
    batteryLevel: 19,
    waterLevel: 88,
    temperature: 32.3,
    humidity: 85,
    insectEntryEvents: 34,
    signalStrength: -78,
    recordedAt: '2026-07-07T21:05:00Z',
  },
];

const readings = initialReadings.map((reading) => ({ ...reading }));

async function findAllDevices() {
  return devices.map((device) => ({
    ...device,
    readings: readings
      .filter((reading) => reading.deviceId === device.id)
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
      ),
  }));
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

async function deleteDevice(id) {
  const index = devices.findIndex((item) => item.id === Number(id));
  if (index === -1) return null;
  const [removed] = devices.splice(index, 1);
  for (let i = readings.length - 1; i >= 0; i -= 1) {
    if (readings[i].deviceId === Number(id)) readings.splice(i, 1);
  }
  return removed;
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
  deleteDevice,
  findAllDevices,
  resetDevices,
  updateDevice,
};

