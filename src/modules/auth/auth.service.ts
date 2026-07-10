const prisma = require('../../config/database');

const redirectMap = {
  citizen: '/citizen',
  barangay_admin: '/barangay/dashboard',
  inspector: '/field-inspector',
  treatment_team: '/response-team',
  city_admin: '/city/dashboard',
  admin: '/admin',
};

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  if (user.password !== password) return null;

  const role = user.role;
  return {
    token: 'demo-token',
    user: { id: user.id, name: user.name, email: user.email, role, city: user.city, barangayId: user.barangayId, homeAddress: user.homeAddress, homeLat: user.homeLat, homeLng: user.homeLng },
    redirect: redirectMap[role] || '/',
  };
}

async function register({ name, email, password, homeAddress }) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: 'citizen',
      homeAddress: homeAddress || null,
    },
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, homeAddress: user.homeAddress },
  };
}

module.exports = { login, register };
