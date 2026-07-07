const { findAllUsers, findUserById } = require('./users.model');

async function listUsers() {
  return findAllUsers();
}

async function getUser(id) {
  return findUserById(id);
}

module.exports = {
  getUser,
  listUsers,
};
