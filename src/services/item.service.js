const { findAllItems } = require('../models/item.model');

async function getItems() {
  return findAllItems();
}

module.exports = { getItems };
