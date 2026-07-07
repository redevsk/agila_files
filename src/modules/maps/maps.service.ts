const { listAreas } = require('../areas/areas.service');
const { listReports } = require('../reports/reports.service');
const { listRoutes } = require('../routes/routes.service');
const { listDevices } = require('../sentinel-devices/sentinel-devices.service');
const { listTasks } = require('../tasks/tasks.service');

async function getMapLayers() {
  const [areas, reports, routes, sentinelDevices, tasks] = await Promise.all([
    listAreas(),
    listReports(),
    listRoutes(),
    listDevices(),
    listTasks(),
  ]);

  return {
    areas,
    reports,
    routes,
    sentinelDevices,
    tasks,
  };
}

async function getCoverage() {
  const routes = await listRoutes();
  return {
    routes,
    checked: [],
    unchecked: [],
    skipped: [],
    needRevisit: [],
  };
}

module.exports = {
  getCoverage,
  getMapLayers,
};
