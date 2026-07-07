const express = require('express');
const { cityCsv } = require('./exports.controller');

const router = express.Router();

router.get('/city.csv', cityCsv);

module.exports = router;
