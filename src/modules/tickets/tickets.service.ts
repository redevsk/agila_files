const prisma = require('../../config/database');

async function findAll() {
  return prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
}

async function create(data) {
  return prisma.ticket.create({
    data: {
      type: data.type,
      description: data.description,
      status: 'Submitted',
      submittedBy: data.submittedBy,
    },
  });
}

async function cancel(id) {
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return null;
  if (ticket.status !== 'Submitted' && ticket.status !== 'Pending Review') return null;
  return prisma.ticket.update({
    where: { id },
    data: { status: 'Cancelled' },
  });
}

module.exports = { findAll, create, cancel };
