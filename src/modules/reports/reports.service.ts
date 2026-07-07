const { createReport, findAllReports, updateReportStatus } = require('./reports.model');

async function listReports() {
  return findAllReports();
}

async function submitReport(payload) {
  return createReport(payload);
}

async function setReportStatus(id, status) {
  return updateReportStatus(id, status);
}

module.exports = {
  listReports,
  setReportStatus,
  submitReport,
};
