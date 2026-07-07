const express = require('express');
const { list, update } = require('./public-status.controller');

const router = express.Router();

router.get('/areas', list);
router.patch('/:areaId', update);

module.exports = router;
