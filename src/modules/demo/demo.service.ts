const { resetAreas } = require('../areas/areas.model');
const { resetReports } = require('../reports/reports.model');
const { resetRoutes } = require('../routes/routes.model');
const { resetDevices } = require('../sentinel-devices/sentinel-devices.model');
const { resetTasks } = require('../tasks/tasks.model');
const { resetTreatments } = require('../treatments/treatments.model');

async function resetDemo() {
  await Promise.all([
    resetAreas(),
    resetReports(),
    resetRoutes(),
    resetDevices(),
    resetTasks(),
    resetTreatments(),
  ]);

  return {
    message: 'Demo scenario reset to the original Marulas incident.',
  };
}

module.exports = {
  resetDemo,
};
