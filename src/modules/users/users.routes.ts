const express = require('express');
const { list, show, update } = require('./users.controller');

const router = express.Router();

router.get('/', list);
router.get('/:id', show);
router.patch('/:id', update);

module.exports = router;
