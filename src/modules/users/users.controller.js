const { ok } = require('../../utils/respond');
const { getUser, listUsers } = require('./users.service');

async function list(_req, res) {
  return ok(res, await listUsers());
}

async function show(req, res) {
  return ok(res, await getUser(req.params.id));
}

module.exports = {
  list,
  show,
};
