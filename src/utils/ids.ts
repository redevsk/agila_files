const counters = {};

function nextId(prefix) {
  counters[prefix] = (counters[prefix] || 0) + 1;
  return `${prefix}_${String(counters[prefix]).padStart(3, '0')}`;
}

function seedCounter(prefix, value) {
  counters[prefix] = Math.max(counters[prefix] || 0, value);
}

module.exports = { nextId, seedCounter };
