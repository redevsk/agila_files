const prisma = require('../../config/database');

async function findAllItems() {
  const areas = await prisma.area.findMany({
    include: { barangay: true },
  });
  return areas;
}

module.exports = { findAllItems };
