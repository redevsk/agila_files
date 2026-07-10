const prisma = require('../../config/database');
const { findAllUsers, findUserById } = require('./users.model');

async function listUsers() {
  return findAllUsers();
}

async function getUser(id) {
  var dbUser = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
  return dbUser || findUserById(id);
}

async function updateUser(id, data) {
  var updateData: {
    name: any;
    email: any;
    homeAddress?: any;
    homeLat?: any;
    homeLng?: any;
  } = { name: data.name, email: data.email };
  if (data.homeAddress !== undefined) updateData.homeAddress = data.homeAddress;
  if (data.homeLat !== undefined) updateData.homeLat = data.homeLat;
  if (data.homeLng !== undefined) updateData.homeLng = data.homeLng;
  return prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: updateData,
  });
}

module.exports = {
  getUser,
  listUsers,
  updateUser,
};
