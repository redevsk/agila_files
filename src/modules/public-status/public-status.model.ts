const { findAllAreas, updateArea } = require('../areas/areas.model');

async function findAllPublicStatuses() {
  const areas = await findAllAreas();
  return areas.map((area) => ({
    areaId: area.id,
    areaName: area.name,
    centerLat: area.centerLat,
    centerLng: area.centerLng,
    publicStatus: area.publicStatus,
    lastCheckedAt: area.lastCheckedAt,
  }));
}

async function updatePublicStatus(areaId, publicStatus) {
  return updateArea(areaId, { publicStatus });
}

module.exports = {
  findAllPublicStatuses,
  updatePublicStatus,
};
