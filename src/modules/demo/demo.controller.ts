const { ok } = require('../../utils/respond');
const { resetDemo } = require('./demo.service');

async function reset(_req, res) {
  return ok(res, await resetDemo());
}

module.exports = {
  reset,
};
