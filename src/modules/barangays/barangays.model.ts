const barangays = [
  {
    id: 1,
    name: 'Dambana',
    city: 'Valenzuela City',
    centerLat: 14.7016,
    centerLng: 120.9787,
    boundaryGeojson: null,
  },
  {
    id: 2,
    name: 'Marulas',
    city: 'Valenzuela City',
    centerLat: 14.6834,
    centerLng: 120.9748,
    boundaryGeojson: null,
  },
];

async function findAllBarangays() {
  return barangays;
}

module.exports = { findAllBarangays };
