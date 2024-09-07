const bcrypt = require('bcrypt');

const {
  fetchUsers,
  fetchUserById,
  fetchEventsAttending,
  addUser,
} = require('../models/users.models.js');

module.exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};

module.exports.getUserById = async (req, res) => {
  const { user_id } = req.params;
  const user = await fetchUserById(user_id);
  res.status(200).send({ user });
};

module.exports.getUserEventsAttending = async (req, res) => {
  const { user_id } = req.params;
  const eventsAttending = await fetchEventsAttending(user_id);
  res.status(200).send(eventsAttending);
};

module.exports.registerUser = async (req, res) => {
  const { username, email, password, isOrganiser, avatarUrl } = req.body;

  // Hash password

  if (!password) {
    res.status(400);
    throw new Error('Please provide a password.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await addUser(
    username,
    email,
    hashedPassword,
    isOrganiser,
    avatarUrl
  );
  res.status(201).send({ newUser });
};
