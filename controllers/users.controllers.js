const bcrypt = require('bcrypt');

const {
  fetchUsers,
  fetchUserById,
  fetchEventsAttending,
  addUser,
  fetchUser,
  postUserEventAttending,
} = require('../models/users.models.js');

module.exports.getUsers = async (req, res) => {
  const users = await fetchUsers();
  res.status(200).send({ users });
};

module.exports.getUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await fetchUserById(user_id);
    res.status(200).send({ user });
  } catch (err) {
    if (err.code === '22P02') {
      res
        .status(400)
        .send({ msg: 'Bad request. Please provide a valid user_id' });
    } else {
      res.status(404).send({ msg: err.msg });
    }
  }
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

module.exports.addUserEventsAttending = async (req, res) => {
  const { username, eventAttending } = req.body;
  const eventsAttending = await fetchEventsAttending(
    (
      await postUserEventAttending(username, eventAttending)
    ).user_id
  );

  res.status(201).send(eventsAttending);
};
