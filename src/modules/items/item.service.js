const { findAllItems } = require('./item.model');

async function getItems() {
  return findAllItems();
}

module.exports = { getItems };
