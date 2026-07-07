const { listAreas } = require('../areas/areas.service');
const { listReports } = require('../reports/reports.service');
const { listTasks } = require('../tasks/tasks.service');

async function getCityDashboard() {
  const [areas, reports, tasks] = await Promise.all([listAreas(), listReports(), listTasks()]);
  return {
    counts: {
      areas: areas.length,
      activeReports: reports.length,
      scheduledTasks: tasks.filter((task) => task.status === 'scheduled').length,
      highPriorityAreas: areas.filter((area) => ['high', 'critical'].includes(area.priority)).length,
    },
    areas,
    reports,
    tasks,
  };
}

async function getBarangayDashboard(barangayId) {
  const dashboard = await getCityDashboard();
  return {
    ...dashboard,
    areas: dashboard.areas.filter((area) => area.barangayId === Number(barangayId)),
    reports: dashboard.reports.filter((report) => report.barangayId === Number(barangayId)),
    tasks: dashboard.tasks.filter((task) => task.barangayId === Number(barangayId)),
  };
}

module.exports = {
  getBarangayDashboard,
  getCityDashboard,
};
