const prisma = require('../../config/database');

function scopedWhere(query) {
  return {
    barangayId: parseInt(query.barangayId, 10),
    createdBy: parseInt(query.createdBy, 10),
  };
}

function hasScope(query) {
  return Number.isFinite(parseInt(query.barangayId, 10)) && Number.isFinite(parseInt(query.createdBy, 10));
}

async function listRoutes(query) {
  if (!hasScope(query)) return [];
  return prisma.operationRoute.findMany({
    where: scopedWhere(query),
    orderBy: { createdAt: 'asc' },
  });
}

async function createRoute(data) {
  return prisma.operationRoute.create({
    data: {
      barangayId: parseInt(data.barangayId, 10),
      createdBy: parseInt(data.createdBy, 10),
      name: data.name,
      type: data.type,
      geojson: typeof data.geojson === 'string' ? data.geojson : JSON.stringify(data.geojson),
    },
  });
}

async function deleteRoute(id, query) {
  if (!hasScope(query)) return null;
  const route = await prisma.operationRoute.findFirst({
    where: { id: parseInt(id, 10), ...scopedWhere(query) },
  });
  if (!route) return null;
  await prisma.operationRoute.delete({ where: { id: route.id } });
  return route;
}

async function listSentinels(query) {
  if (!hasScope(query)) return [];
  return prisma.operationSentinel.findMany({
    where: scopedWhere(query),
    orderBy: { createdAt: 'asc' },
  });
}

async function createSentinel(data) {
  return prisma.operationSentinel.create({
    data: {
      barangayId: parseInt(data.barangayId, 10),
      createdBy: parseInt(data.createdBy, 10),
      name: data.name,
      lat: Number(data.lat),
      lng: Number(data.lng),
    },
  });
}

async function deleteSentinel(id, query) {
  if (!hasScope(query)) return null;
  const sentinel = await prisma.operationSentinel.findFirst({
    where: { id: parseInt(id, 10), ...scopedWhere(query) },
  });
  if (!sentinel) return null;
  await prisma.operationSentinel.delete({ where: { id: sentinel.id } });
  return sentinel;
}

module.exports = {
  listRoutes,
  createRoute,
  deleteRoute,
  listSentinels,
  createSentinel,
  deleteSentinel,
};
