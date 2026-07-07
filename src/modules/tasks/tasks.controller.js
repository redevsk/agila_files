const { ok } = require('../../utils/respond');
const { assignTask, generatePreventiveTasks, listTasks, setTaskStatus } = require('./tasks.service');

async function list(_req, res) {
  return ok(res, await listTasks());
}

async function assign(req, res) {
  return ok(res, await assignTask(req.params.id, req.body.assignedTo));
}

async function updateStatus(req, res) {
  return ok(res, await setTaskStatus(req.params.id, req.body.status));
}

async function generatePreventive(_req, res) {
  return ok(res, await generatePreventiveTasks());
}

module.exports = {
  assign,
  generatePreventive,
  list,
  updateStatus,
};
