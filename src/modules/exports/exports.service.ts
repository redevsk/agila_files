const { getCityDashboard } = require('../dashboard/dashboard.service');

async function getCityCsv() {
  const dashboard = await getCityDashboard();
  const rows = ['metric,value', `areas,${dashboard.counts.areas}`, `activeReports,${dashboard.counts.activeReports}`];
  return rows.join('\n');
}

module.exports = { getCityCsv };
