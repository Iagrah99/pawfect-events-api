const bcrypt = require('bcrypt');

const {
  fetchUsers,
  fetchUserById,
  fetchEventsAttending,
  addUser,
  fetchUser,
  postUserEventAttending,
  deleteUserById,
  patchUserById,
  deleteEventAttending,
} = require('../models/users.models.js');
const { getPassword } = require('../utils/getPassword.js');

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

  try {
    const newUser = await addUser(
      username,
      email,
      password,
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
    const user = await fetchUser(email, password);
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

module.exports.addUserEventsAttending = async (req, res, next) => {
  const { username, eventAttending } = req.body;
  try {
    const userId = (await postUserEventAttending(username, eventAttending))
      .user_id;
    const eventsAttending = await fetchEventsAttending(userId);

    res.status(201).send(eventsAttending);
  } catch (err) {
    next(err);
  }
};

module.exports.removeUserById = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    await deleteUserById(user_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserById = async (req, res, next) => {
  const { user_id } = req.params;
  const { username, password } = req.body;

  try {
    let updatedUser;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedUser = await patchUserById(user_id, username, hashedPassword);
    } else {
      updatedUser = await patchUserById(user_id, username);
    }

    res.status(200).send({ user: updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports.removeEventAttending = async (req, res, next) => {
  const { user_id } = req.params;
  const { event_title } = req.body;

  try {
    await deleteEventAttending(user_id, event_title);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
