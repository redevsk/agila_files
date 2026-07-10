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

async function resetTreatments() {
  treatments.splice(0, treatments.length);
  return treatments;
}

module.exports = {
  createTreatment,
  findAllTreatments,
  resetTreatments,
};
