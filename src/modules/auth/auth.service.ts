const { findDemoUser } = require('./auth.model');

async function login() {
  const user = await findDemoUser();
  return {
    token: 'demo-token',
    user,
  };
}

async function getCurrentUser() {
  return findDemoUser();
}

module.exports = {
  getCurrentUser,
  login,
};
