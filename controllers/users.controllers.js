const { fetchUsers } = require('../models/users.models.js');

module.exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};
