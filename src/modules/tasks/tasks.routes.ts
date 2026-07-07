const express = require('express');
const { assign, generatePreventive, list, updateStatus } = require('./tasks.controller');

const router = express.Router();

router.get('/', list);
router.post('/generate-preventive', generatePreventive);
router.patch('/:id/assign', assign);
router.patch('/:id/status', updateStatus);

module.exports = router;
