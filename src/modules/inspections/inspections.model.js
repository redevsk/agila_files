const inspections = [];

async function findAllInspections() {
  return inspections;
}

async function createInspection(payload) {
  const inspection = {
    id: inspections.length + 1,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  inspections.push(inspection);
  return inspection;
}

module.exports = {
  createInspection,
  findAllInspections,
};
