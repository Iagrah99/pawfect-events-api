const bcrypt = require('bcrypt');

const {
  fetchUsers,
  fetchUserById,
  fetchEventsAttending,
  addUser,
  fetchUser,
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

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await fetchUser(email);
  console.log(user);

  if (user && (await bcrypt.compare(password, user.password))) {
    const userDetails = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      is_organiser: user.is_organiser,
      avatar_url: user.avatar_url,
    };
    res.status(201).send({ user: userDetails });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
};
