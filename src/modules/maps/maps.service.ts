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
  const [areas, routes] = await Promise.all([listAreas(), listRoutes()]);
  const skippedArea = areas.find((area) => area.id === 2);

  const coverageItems = areas.map((area) => {
    const relatedRoute = routes.find((route) => route.areaId === area.id);
    let status = 'unchecked';
    if (relatedRoute?.status === 'completed') status = 'checked';
    if (relatedRoute?.status === 'in_progress') status = 'in_progress';
    if (area.publicStatus === 'yellow') status = 'scheduled';
    if (area.publicStatus === 'orange') status = 'need_revisit';

    return {
      areaId: area.id,
      areaName: area.name,
      barangayId: area.barangayId,
      centerLat: area.centerLat,
      centerLng: area.centerLng,
      status,
      routeId: relatedRoute?.id || null,
    };
  });

  return {
    routes,
    checked: coverageItems.filter((item) => item.status === 'checked'),
    unchecked: coverageItems.filter((item) => item.status === 'unchecked'),
    scheduled: coverageItems.filter((item) => item.status === 'scheduled'),
    inProgress: coverageItems.filter((item) => item.status === 'in_progress'),
    skipped: [
      {
        areaId: 2,
        areaName: skippedArea?.name || 'Dambana School Perimeter',
        barangayId: 1,
        centerLat: skippedArea?.centerLat || 14.6998,
        centerLng: skippedArea?.centerLng || 120.9775,
        status: 'skipped',
        reason: 'Gate was closed during last patrol',
      },
    ],
    needRevisit: coverageItems.filter((item) => item.status === 'need_revisit'),
  };
}

module.exports = {
  getCoverage,
  getMapLayers,
};
