const express = require('express');
const { barangay, city } = require('./dashboard.controller');

const router = express.Router();

router.get('/city', city);
router.get('/barangay/:id', barangay);

module.exports = router;
