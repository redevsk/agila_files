const { getCityCsv } = require('./exports.service');

async function cityCsv(_req, res) {
  res.setHeader('Content-Type', 'text/csv');
  return res.status(200).send(await getCityCsv());
}

module.exports = { cityCsv };
