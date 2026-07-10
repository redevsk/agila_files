const barangays = [
  {
    id: 1,
    name: 'Marulas',
    city: 'Valenzuela City',
    centerLat: 14.6834,
    centerLng: 120.9748,
    boundaryGeojson: null,
  },
  {
    id: 2,
    name: 'Rizal',
    city: 'Valenzuela City',
    centerLat: 14.607,
    centerLng: 120.988,
    boundaryGeojson: null,
  },
];

async function findAllBarangays() {
  return barangays;
}

module.exports = { findAllBarangays };
