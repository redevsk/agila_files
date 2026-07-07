const treatments = [];

async function findAllTreatments() {
  return treatments;
}

async function createTreatment(payload) {
  const treatment = {
    id: treatments.length + 1,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  treatments.push(treatment);
  return treatment;
}

module.exports = {
  createTreatment,
  findAllTreatments,
};
