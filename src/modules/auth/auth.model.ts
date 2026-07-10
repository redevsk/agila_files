const { findUserById } = require('../users/users.model');

async function findDemoUser() {
  return findUserById(1);
}

module.exports = { findDemoUser };
