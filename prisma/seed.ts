const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const eighteenDaysAgo = new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.sentinelReading.deleteMany();
  await prisma.sentinelDevice.deleteMany();
  await prisma.publicStatus.deleteMany();
  await prisma.routePoint.deleteMany();
  await prisma.route.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.task.deleteMany();
  await prisma.report.deleteMany();
  await prisma.area.deleteMany();
  await prisma.operationSentinel.deleteMany();
  await prisma.operationRoute.deleteMany();
  await prisma.user.deleteMany();
  await prisma.barangay.deleteMany();

  const barangay1 = await prisma.barangay.create({
    data: { id: 1, name: 'Barangay Marulas', boundaryGeojson: null, createdAt: now },
  });
  const barangay2 = await prisma.barangay.create({
    data: { id: 2, name: 'Barangay Rizal', boundaryGeojson: null, createdAt: now },
  });

  await prisma.user.createMany({
    data: [
      { id: 1, name: 'City Admin', email: 'city@agila.test', password: 'password123', role: 'city_admin', city: 'Valenzuela City', barangayId: null, createdAt: now },
      { id: 2, name: 'Barangay Lead', email: 'barangay@agila.test', password: 'password123', role: 'barangay_admin', barangayId: 1, createdAt: now },
      { id: 3, name: 'Inspector One', email: 'inspector@agila.test', password: 'password123', role: 'inspector', barangayId: 1, createdAt: now },
      { id: 4, name: 'Treatment Crew', email: 'treatment@agila.test', password: 'password123', role: 'treatment_team', barangayId: 1, createdAt: now },
      { id: 5, name: 'Citizen Demo', email: 'citizen@agila.test', password: 'password123', role: 'citizen', barangayId: 1, createdAt: now },
      { id: 6, name: 'System Admin', email: 'admin@agila.test', password: 'password123', role: 'admin', city: 'Valenzuela City', barangayId: null, createdAt: now },
    ],
  });

  await prisma.area.createMany({
    data: [
      { id: 1, barangayId: 1, name: 'Market Drainage Corridor', type: 'drainage_corridor', centerLat: 14.5995, centerLng: 120.9842, lastCheckedAt: eighteenDaysAgo, publicStatus: 'red', historicalHotspot: true, hasDrainage: true, densityLevel: 'high', riskScore: 90, priority: 'critical', createdAt: now },
      { id: 2, barangayId: 1, name: 'Riverside Residential Block', type: 'block', centerLat: 14.6012, centerLng: 120.9815, lastCheckedAt: sevenDaysAgo, publicStatus: 'orange', historicalHotspot: true, hasDrainage: false, densityLevel: 'high', riskScore: 68, priority: 'high', createdAt: now },
      { id: 3, barangayId: 1, name: 'School Perimeter', type: 'public_area', centerLat: 14.603, centerLng: 120.985, lastCheckedAt: now, publicStatus: 'green', historicalHotspot: false, hasDrainage: false, densityLevel: 'medium', riskScore: 18, priority: 'low', createdAt: now },
      { id: 4, barangayId: 2, name: 'Rizal North Zone', type: 'zone', centerLat: 14.607, centerLng: 120.988, lastCheckedAt: null, publicStatus: 'gray', historicalHotspot: false, hasDrainage: true, densityLevel: 'medium', riskScore: 45, priority: 'medium', createdAt: now },
    ],
  });

  await prisma.ticket.createMany({
    data: [
      { id: 1, type: 'Stagnant water', description: 'Water pooling beside the canal after rain.', status: 'Pending Review', submittedBy: 5, createdAt: sevenDaysAgo, updatedAt: now },
      { id: 2, type: 'Garbage buildup', description: 'Uncollected waste blocking drainage.', status: 'Submitted', submittedBy: 5, createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), updatedAt: now },
      { id: 3, type: 'Larvae sighting', description: 'Mosquito larvae in open container.', status: 'Resolved', submittedBy: 5, createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), updatedAt: now },
    ],
  });

  await prisma.report.create({
    data: {
      id: 1, submittedBy: 5, barangayId: 1, areaId: 1,
      lat: 14.5997, lng: 120.984,
      description: 'Standing water and larvae visible beside the market drainage.',
      photoUrl: null, status: 'scheduled_for_inspection', riskLevel: 'critical',
      createdAt: sevenDaysAgo, updatedAt: now,
    },
  });

  await prisma.sentinelDevice.createMany({
    data: [
      { id: 1, deviceCode: 'OVI-BRGY-001', barangayId: 1, areaId: 1, lat: 14.5995, lng: 120.9842, status: 'active', batteryLevel: 87, lastSeenAt: now, lastMaintenanceAt: sevenDaysAgo, createdAt: now, updatedAt: now },
      { id: 2, deviceCode: 'MOSQ-BRGY-004', barangayId: 1, areaId: 2, lat: 14.6012, lng: 120.9815, status: 'needs_maintenance', batteryLevel: 74, lastSeenAt: now, lastMaintenanceAt: eighteenDaysAgo, createdAt: now, updatedAt: now },
      { id: 3, deviceCode: 'OVI-BRGY-002', barangayId: 1, areaId: 3, lat: 14.603, lng: 120.985, status: 'active', batteryLevel: 91, lastSeenAt: now, lastMaintenanceAt: sevenDaysAgo, createdAt: now, updatedAt: now },
      { id: 4, deviceCode: 'MOSQ-BRGY-007', barangayId: 2, areaId: 4, lat: 14.607, lng: 120.988, status: 'needs_maintenance', batteryLevel: 19, lastSeenAt: now, lastMaintenanceAt: eighteenDaysAgo, createdAt: now, updatedAt: now },
    ],
  });

  await prisma.task.createMany({
    data: [
      { id: 1, type: 'inspection', status: 'assigned', priority: 'critical', assignedTo: 3, barangayId: 1, areaId: 1, reportId: 1, sentinelDeviceId: null, dueAt: tomorrow, createdAt: sevenDaysAgo, updatedAt: now },
      { id: 2, type: 'sentinel_check', status: 'scheduled', priority: 'high', assignedTo: 3, barangayId: 1, areaId: 2, reportId: null, sentinelDeviceId: 2, dueAt: tomorrow, createdAt: now, updatedAt: now },
    ],
  });

  await prisma.route.create({
    data: {
      id: 1, assignedTo: 3, type: 'inspection', status: 'scheduled',
      startedAt: null, pausedAt: null, completedAt: null, trailJson: null,
      createdAt: now,
    },
  });

  await prisma.routePoint.create({
    data: {
      id: 1, routeId: 1, taskId: 1,
      lat: 14.5997, lng: 120.984, status: 'scheduled', notes: '', checkedAt: null,
    },
  });

  await prisma.publicStatus.createMany({
    data: [
      { id: 1, areaId: 1, status: 'red', sourceType: 'report', sourceId: 1, lastCheckedAt: null, expiresAt: null, createdAt: sevenDaysAgo, updatedAt: now },
      { id: 2, areaId: 2, status: 'orange', sourceType: 'treatment', sourceId: null, lastCheckedAt: sevenDaysAgo, expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), createdAt: sevenDaysAgo, updatedAt: now },
      { id: 3, areaId: 3, status: 'green', sourceType: 'inspection', sourceId: null, lastCheckedAt: now, expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), createdAt: now, updatedAt: now },
    ],
  });

  const readingProfiles = [
    { deviceId: 1, eggs: 22, water: 58, temp: 30.6, hum: 79 },
    { deviceId: 2, eggs: 18, water: 45, temp: 31.1, hum: 81 },
    { deviceId: 3, eggs: 9, water: 70, temp: 29.8, hum: 74 },
    { deviceId: 4, eggs: 34, water: 88, temp: 32.3, hum: 85 },
  ];

  const readingsData: any[] = [];
  let readingId = 1;
  readingProfiles.forEach((profile, idx) => {
    for (let day = 6; day >= 0; day--) {
      const recorded = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
      const wobble = Math.sin(readingId + idx) * 5;
      readingsData.push({
        id: readingId++,
        deviceId: profile.deviceId,
        batteryLevel: Math.max(5, Math.min(100, profile.water + 35 - day * 3 + Math.round(wobble))),
        waterLevel: Math.max(0, Math.min(100, profile.water + Math.round(wobble))),
        temperature: Math.round((profile.temp + wobble / 10) * 10) / 10,
        humidity: Math.max(0, Math.min(100, profile.hum + Math.round(wobble))),
        insectEntryEvents: Math.max(0, profile.eggs + Math.round(wobble)),
        signalStrength: -60 - Math.round(Math.abs(wobble) * 2),
        recordedAt: recorded,
        createdAt: recorded,
      });
    }
  });

  await prisma.sentinelReading.createMany({ data: readingsData });

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
