const { created, ok } = require('../../utils/respond');
const { listReports, setReportStatus, submitReport } = require('./reports.service');

async function list(_req, res) {
  return ok(res, await listReports());
}

async function create(req, res) {
  return created(res, await submitReport(req.body));
}

async function updateStatus(req, res) {
  return ok(res, await setReportStatus(req.params.id, req.body.status));
}

module.exports = {
  create,
  list,
  updateStatus,
};
