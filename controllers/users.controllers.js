const bcrypt = require('bcrypt');

const {
  fetchUsers,
  fetchUserById,
  fetchEventsAttending,
  addUser,
  fetchUser,
  postUserEventAttending,
} = require('../models/users.models.js');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const user = await fetchUserById(user_id);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserEventsAttending = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const eventsAttending = await fetchEventsAttending(user_id);
    res.status(200).send(eventsAttending);
  } catch (err) {
    next(err);
  }
};

module.exports.registerUser = async (req, res, next) => {
  const { username, email, password, isOrganiser, avatarUrl } = req.body;

  // Hash password

  if (!password) {
    res.status(400);
    throw new Error('Please provide a password.');
  }

  try {
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
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
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
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addUserEventsAttending = async (req, res, next) => {
  const { username, eventAttending } = req.body;
  try {
    const eventsAttending = await fetchEventsAttending(
      (
        await postUserEventAttending(username, eventAttending)
      ).user_id
    );

    res.status(201).send(eventsAttending);
  } catch (err) {
    next(err);
  }
};
