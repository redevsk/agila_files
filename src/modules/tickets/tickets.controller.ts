const { ok, fail } = require('../../utils/http');
const { findAll, create, cancel } = require('./tickets.service');

async function listTickets(req, res) {
  const tickets = await findAll();
  return ok(res, tickets);
}

async function createTicket(req, res) {
  const { type, description, submittedBy } = req.body;
  if (!type || !description || !submittedBy) {
    return fail(res, 400, 'type, description, and submittedBy are required');
  }
  const ticket = await create({ type, description, submittedBy });
  return ok(res, ticket, 201);
}

async function cancelTicket(req, res) {
  const id = parseInt(req.params.id, 10);
  const ticket = await cancel(id);
  if (!ticket) return fail(res, 404, 'Ticket not found');
  return ok(res, ticket);
}

module.exports = { listTickets, createTicket, cancelTicket };
