const prisma = require('../../config/database');

async function listDevices() {
  return prisma.sentinelDevice.findMany({
    orderBy: { id: 'asc' },
    include: {
      readings: {
        orderBy: { recordedAt: 'desc' },
      },
    },
  });
}

async function removeDevice(id) {
  const deviceId = parseInt(id, 10);
  const device = await prisma.sentinelDevice.findUnique({ where: { id: deviceId } });
  if (!device) return null;
  await prisma.sentinelReading.deleteMany({ where: { deviceId } });
  await prisma.sentinelDevice.delete({ where: { id: deviceId } });
  return device;
}

async function checkDevice(id, payload) {
  const deviceId = parseInt(id, 10);
  const device = await prisma.sentinelDevice.findUnique({ where: { id: deviceId } });
  if (!device) return null;
  return prisma.sentinelDevice.update({
    where: { id: deviceId },
    data: {
      ...payload,
      lastMaintenanceAt: new Date(),
    },
  });
}

async function ingestReading(payload) {
  return prisma.sentinelReading.create({
    data: {
      deviceId: parseInt(payload.deviceId, 10),
      batteryLevel: payload.batteryLevel,
      waterLevel: payload.waterLevel,
      temperature: payload.temperature,
      humidity: payload.humidity,
      insectEntryEvents: payload.insectEntryEvents,
      signalStrength: payload.signalStrength,
      recordedAt: payload.recordedAt ? new Date(payload.recordedAt) : new Date(),
    },
  });
}

async function placeDevice(payload) {
  return prisma.sentinelDevice.create({
    data: {
      deviceCode: payload.deviceCode,
      barangayId: parseInt(payload.barangayId, 10),
      areaId: payload.areaId != null ? parseInt(payload.areaId, 10) : null,
      lat: Number(payload.lat),
      lng: Number(payload.lng),
      status: payload.status || 'active',
      batteryLevel: payload.batteryLevel != null ? payload.batteryLevel : 100,
      lastSeenAt: new Date(),
    },
  });
}

module.exports = {
  checkDevice,
  ingestReading,
  listDevices,
  placeDevice,
  removeDevice,
};
