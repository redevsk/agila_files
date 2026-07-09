const express = require('express');
const { list, show } = require('./users.controller');

const router = express.Router();

router.get('/', list);
router.get('/:id', show);

module.exports = router;
