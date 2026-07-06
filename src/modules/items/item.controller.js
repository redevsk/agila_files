const { getItems } = require('./item.service');

async function listItems(_req, res) {
  const items = await getItems();
  return res.status(200).json({ data: items });
}

module.exports = { listItems };
