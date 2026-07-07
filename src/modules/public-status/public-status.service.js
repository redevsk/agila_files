const { findAllPublicStatuses, updatePublicStatus } = require('./public-status.model');

async function listPublicStatuses() {
  return findAllPublicStatuses();
}

async function setPublicStatus(areaId, publicStatus) {
  return updatePublicStatus(areaId, publicStatus);
}

module.exports = {
  listPublicStatuses,
  setPublicStatus,
};
