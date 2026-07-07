const express = require('express');
const { addTrail, complete, list, pause, resume, show, start } = require('./routes.controller');

const router = express.Router();

router.get('/', list);
router.get('/:id', show);
router.post('/:id/start', start);
router.post('/:id/pause', pause);
router.post('/:id/resume', resume);
router.post('/:id/complete', complete);
router.post('/:id/trail', addTrail);

module.exports = router;
