const { findAllAreas, findAreaById, updateArea } = require('./areas.model');

function getPriority(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function calculateAreaScore(area) {
  let score = 0;
  if (area.historicalHotspot) score += 30;
  if (area.publicStatus === 'green') score += 20;
  if (area.hasDrainage) score += 10;
  if (area.densityLevel === 'high') score += 10;
  if (area.publicStatus === 'red') score += 20;
  if (area.publicStatus === 'yellow') score += 10;
  return Math.min(score, 100);
}

async function listAreas() {
  return findAllAreas();
}

async function getArea(id) {
  return findAreaById(id);
}

async function updateAreaStatus(id, publicStatus) {
  return updateArea(id, { publicStatus });
}

async function recalculateAreaPriorities() {
  const areas = await findAllAreas();
  return Promise.all(
    areas.map((area) => {
      const riskScore = calculateAreaScore(area);
      return updateArea(area.id, {
        priority: getPriority(riskScore),
        riskScore,
      });
    }),
  );
}

async function getAreaPriorityRanking() {
  const areas = await findAllAreas();
  return [...areas].sort((a, b) => b.riskScore - a.riskScore);
}

module.exports = {
  getArea,
  getAreaPriorityRanking,
  listAreas,
  recalculateAreaPriorities,
  updateAreaStatus,
};
