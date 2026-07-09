const express = require('express');
const { create, list } = require('./inspections.controller');

const router = express.Router();

router.get('/', list);
router.post('/', create);

module.exports = router;
