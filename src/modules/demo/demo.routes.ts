const express = require('express');
const { reset } = require('./demo.controller');

const router = express.Router();

router.post('/reset', reset);

module.exports = router;
