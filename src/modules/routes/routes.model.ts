const initialRoutes = [
  {
    id: 1,
    assignedTo: 3,
    type: 'preventive_patrol',
    status: 'in_progress',
    barangayId: 1,
    areaId: 1,
    trailJson: [
      { lat: 14.700142, lng: 120.97723, timestamp: '2026-07-08T08:05:00Z' },
      { lat: 14.699758, lng: 120.975966, timestamp: '2026-07-08T08:12:00Z' },
      { lat: 14.698764, lng: 120.976053, timestamp: '2026-07-08T08:19:00Z' },
      { lat: 14.698953, lng: 120.978334, timestamp: '2026-07-08T08:27:00Z' },
      { lat: 14.699669, lng: 120.9796, timestamp: '2026-07-08T08:34:00Z' },
      { lat: 14.700632, lng: 120.978794, timestamp: '2026-07-08T08:42:00Z' },
      { lat: 14.701612, lng: 120.977633, timestamp: '2026-07-08T08:50:00Z' },
      { lat: 14.70217, lng: 120.979165, timestamp: '2026-07-08T08:58:00Z' },
    ],
    createdAt: '2026-07-08T08:00:00Z',
  },
  {
    id: 2,
    assignedTo: 4,
    type: 'inspection',
    status: 'scheduled',
    barangayId: 2,
    areaId: 3,
    trailJson: [
      { lat: 14.681867, lng: 120.976292, timestamp: '2026-07-08T09:10:00Z' },
      { lat: 14.682079, lng: 120.975458, timestamp: '2026-07-08T09:16:00Z' },
      { lat: 14.682283, lng: 120.974226, timestamp: '2026-07-08T09:23:00Z' },
      { lat: 14.682877, lng: 120.974558, timestamp: '2026-07-08T09:29:00Z' },
      { lat: 14.683543, lng: 120.974478, timestamp: '2026-07-08T09:36:00Z' },
      { lat: 14.684126, lng: 120.973945, timestamp: '2026-07-08T09:43:00Z' },
    ],
    createdAt: '2026-07-08T09:00:00Z',
  },
];

const routes = initialRoutes.map((route) => ({
  ...route,
  trailJson: [...route.trailJson],
}));

async function findAllRoutes() {
  return routes;
}

async function findRouteById(id) {
  return routes.find((route) => route.id === Number(id)) || null;
}

async function updateRoute(id, changes) {
  const route = await findRouteById(id);
  if (!route) return null;
  Object.assign(route, changes);
  return route;
}

async function resetRoutes() {
  routes.splice(
    0,
    routes.length,
    ...initialRoutes.map((route) => ({
      ...route,
      trailJson: [...route.trailJson],
    })),
  );
  return routes;
}

module.exports = {
  findAllRoutes,
  findRouteById,
  resetRoutes,
  updateRoute,
};
