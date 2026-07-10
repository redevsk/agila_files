const { ok } = require('../../utils/respond');
const { getUser, listUsers, updateUser } = require('./users.service');

async function list(_req, res) {
  return ok(res, await listUsers());
}

async function show(req, res) {
  return ok(res, await getUser(req.params.id));
}

async function update(req, res) {
  try {
    const { name, email, homeAddress, homeLat, homeLng } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const user = await updateUser(req.params.id, { name, email, homeAddress, homeLat, homeLng });
    return ok(res, user);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

module.exports = {
  list,
  show,
  update,
};
