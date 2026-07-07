const { findAllBarangays } = require('./barangays.model');

async function listBarangays() {
  return findAllBarangays();
}

module.exports = { listBarangays };
