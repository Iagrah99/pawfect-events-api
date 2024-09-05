const { fetchUsers, fetchUserById } = require('../models/users.models.js');

module.exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};

module.exports.getUserById = async (req, res) => {
  const { user_id } = req.params;
  const user = await fetchUserById(user_id);
  res.status(200).send({ user });
};
