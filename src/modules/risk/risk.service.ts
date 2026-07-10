const { getAreaPriorityRanking } = require('../areas/areas.service');

async function getRiskRanking() {
  return getAreaPriorityRanking();
}

module.exports = { getRiskRanking };
