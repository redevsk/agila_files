const express = require('express');
const { ranking } = require('./risk.controller');

const router = express.Router();

router.get('/ranking', ranking);

module.exports = router;
