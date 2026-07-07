const express = require('express');
const { check, createReading, list } = require('./sentinel-devices.controller');

const router = express.Router();

router.get('/', list);
router.post('/readings', createReading);
router.post('/:id/check', check);

module.exports = router;
