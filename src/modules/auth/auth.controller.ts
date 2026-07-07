const { ok } = require('../../utils/respond');
const { getCurrentUser, login } = require('./auth.service');

async function loginUser(_req, res) {
  return ok(res, await login());
}

async function me(_req, res) {
  return ok(res, await getCurrentUser());
}

module.exports = {
  loginUser,
  me,
};
