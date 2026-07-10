const express = require('express');
const { coverage, layers } = require('./maps.controller');

const router = express.Router();

router.get('/layers', layers);
router.get('/coverage', coverage);

module.exports = router;
