const express = require('express');
const {
  routes,
  addRoute,
  removeRoute,
  sentinels,
  addSentinel,
  removeSentinel,
} = require('./operation-map.controller');

const router = express.Router();

router.get('/routes', routes);
router.post('/routes', addRoute);
router.delete('/routes/:id', removeRoute);
router.get('/sentinels', sentinels);
router.post('/sentinels', addSentinel);
router.delete('/sentinels/:id', removeSentinel);

module.exports = router;
