const express = require('express');
const { create, list, updateStatus } = require('./reports.controller');

const router = express.Router();

router.get('/', list);
router.post('/', create);
router.patch('/:id/status', updateStatus);

module.exports = router;
