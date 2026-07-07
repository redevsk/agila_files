const { ok } = require('../../utils/respond');
const { getRiskRanking } = require('./risk.service');

async function ranking(_req, res) {
  return ok(res, await getRiskRanking());
}

module.exports = { ranking };
