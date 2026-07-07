const express = require('express');
const {
  list,
  priorityRanking,
  recalculate,
  show,
  updateStatus,
} = require('./areas.controller');

const router = express.Router();

router.get('/', list);
router.get('/priority-ranking', priorityRanking);
router.post('/recalculate-priority', recalculate);
router.get('/:id', show);
router.patch('/:id/status', updateStatus);

module.exports = router;
