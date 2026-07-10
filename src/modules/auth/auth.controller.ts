const { ok, fail } = require('../../utils/http');
const { login, register } = require('./auth.service');

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 400, 'Email and password are required');

  const result = await login(email, password);
  if (!result) return fail(res, 401, 'Invalid email or password');

  return ok(res, result);
}

async function registerUser(req, res) {
  const { name, email, password, homeAddress } = req.body;
  if (!name || !email || !password) return fail(res, 400, 'Name, email, and password are required');

  if (password.length < 8) return fail(res, 400, 'Password must be at least 8 characters');

  try {
    const result = await register({ name, email, password, homeAddress });
    return ok(res, result);
  } catch (err) {
    if (err.code === 'P2002') return fail(res, 409, 'Email already registered');
    return fail(res, 500, 'Registration failed');
  }
}

module.exports = { loginUser, registerUser };
