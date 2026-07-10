const users = [
  { id: 1, name: 'Valenzuela City Admin', email: 'city@example.test', role: 'city_admin', barangayId: null },
  { id: 2, name: 'Dambana Barangay Lead', email: 'dambana@example.test', role: 'barangay_admin', barangayId: 1 },
  { id: 3, name: 'Inspector Ana', email: 'inspector@example.test', role: 'inspector', barangayId: 1 },
  { id: 4, name: 'Marulas Treatment Team', email: 'treatment@example.test', role: 'treatment_team', barangayId: 2 },
];

async function findAllUsers() {
  return users;
}

async function findUserById(id) {
  return users.find((user) => user.id === Number(id)) || null;
}

module.exports = {
  findAllUsers,
  findUserById,
};
