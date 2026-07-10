const express = require('express');
const { listTickets, createTicket, cancelTicket } = require('./tickets.controller');

const router = express.Router();

router.get('/', listTickets);
router.post('/', createTicket);
router.patch('/:id/cancel', cancelTicket);

module.exports = router;
