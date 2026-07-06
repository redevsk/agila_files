const express = require('express');
const { listItems } = require('./item.controller');

const router = express.Router();

router.get('/items', listItems);

module.exports = router;
