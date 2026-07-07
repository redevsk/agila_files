const express = require('express');
const { loginUser, me } = require('./auth.controller');

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', me);

module.exports = router;
