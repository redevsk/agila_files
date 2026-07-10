const prisma = require('../../config/database');

async function listBarangays() {
  const barangays = await prisma.barangay.findMany({
    include: {
      areas: {
        select: {
          centerLat: true,
          centerLng: true,
        },
      },
    },
    orderBy: { id: 'asc' },
  });

  return barangays.map((barangay) => {
    const areaPoints = barangay.areas.filter((area) => Number.isFinite(area.centerLat) && Number.isFinite(area.centerLng));
    const centerLat = areaPoints.length
      ? areaPoints.reduce((sum, area) => sum + area.centerLat, 0) / areaPoints.length
      : null;
    const centerLng = areaPoints.length
      ? areaPoints.reduce((sum, area) => sum + area.centerLng, 0) / areaPoints.length
      : null;

    return {
      id: barangay.id,
      name: barangay.name,
      city: 'Valenzuela City',
      centerLat,
      centerLng,
      boundaryGeojson: barangay.boundaryGeojson,
      createdAt: barangay.createdAt,
    };
  });
}

module.exports = { listBarangays };
