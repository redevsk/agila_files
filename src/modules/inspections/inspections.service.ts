const { createInspection, findAllInspections } = require('./inspections.model');

async function listInspections() {
  return findAllInspections();
}

async function submitInspection(payload) {
  return createInspection(payload);
}

module.exports = {
  listInspections,
  submitInspection,
};
