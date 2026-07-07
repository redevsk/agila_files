const routes = [
  {
    id: 1,
    assignedTo: 3,
    type: 'preventive_patrol',
    status: 'scheduled',
    trailJson: [],
    createdAt: '2026-07-08T08:00:00Z',
  },
];

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

module.exports = {
  findAllRoutes,
  findRouteById,
  updateRoute,
};
