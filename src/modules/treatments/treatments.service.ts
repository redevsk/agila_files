const { createTreatment, findAllTreatments } = require('./treatments.model');

async function listTreatments() {
  return findAllTreatments();
}

async function submitTreatment(payload) {
  return createTreatment(payload);
}

module.exports = {
  listTreatments,
  submitTreatment,
};
