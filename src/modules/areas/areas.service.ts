const { findAllAreas, findAreaById, updateArea } = require('./areas.model');

function getPriority(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function getRiskFactors(area) {
  const factors = [];
  if (area.historicalHotspot) factors.push({ label: 'Historical hotspot', points: 30 });
  if (area.publicStatus === 'green') factors.push({ label: 'Green status expiring soon', points: 20 });
  if (area.hasDrainage) factors.push({ label: 'Drainage or canal risk', points: 10 });
  if (area.densityLevel === 'high') factors.push({ label: 'Dense residential activity', points: 10 });
  if (area.publicStatus === 'red') factors.push({ label: 'Public status is high concern', points: 20 });
  if (area.publicStatus === 'yellow') factors.push({ label: 'Scheduled or caution status', points: 10 });
  return factors;
}

function calculateAreaScore(area) {
  let score = 0;
  getRiskFactors(area).forEach((factor) => {
    score += factor.points;
  });
  return Math.min(score, 100);
}

function enrichArea(area) {
  const riskFactors = getRiskFactors(area);
  return {
    ...area,
    riskFactors,
    riskSummary: riskFactors.map((factor) => `${factor.label} +${factor.points}`).join(', ') || 'No active risk factors',
  };
}

async function listAreas() {
  const areas = await findAllAreas();
  return areas.map(enrichArea);
}

async function getArea(id) {
  const area = await findAreaById(id);
  return area ? enrichArea(area) : null;
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
  return [...areas].sort((a, b) => b.riskScore - a.riskScore).map(enrichArea);
}

module.exports = {
  getArea,
  getAreaPriorityRanking,
  listAreas,
  recalculateAreaPriorities,
  updateAreaStatus,
};
