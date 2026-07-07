const barangays = [
  {
    id: 1,
    name: 'Barangay 1',
    boundaryGeojson: null,
  },
];

async function findAllBarangays() {
  return barangays;
}

module.exports = { findAllBarangays };
