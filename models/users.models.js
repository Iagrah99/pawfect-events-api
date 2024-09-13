const db = require('../db/connection');
const bcrypt = require('bcrypt');

module.exports.fetchUsers = async () => {
  const users = (
    await db.query(
      'SELECT user_id, email, username, is_organiser, avatar_url FROM users'
    )
  ).rows;
  return users;
};

module.exports.fetchUserById = async (user_id) => {
  const user = (
    await db.query('SELECT * FROM users WHERE user_id = $1', [user_id])
  ).rows[0];

  if (!user)
    return Promise.reject({
      msg: 'The user with the specified user_id was not found',
    });

  return user;
};

module.exports.fetchEventsAttending = async (user_id) => {
  const checkUserExists = (
    await db.query('SELECT user_id FROM users WHERE user_id = $1', [user_id])
  ).rowCount;

  if (!checkUserExists) {
    return Promise.reject({
      msg: 'The user with the specified user_id was not found',
    });
  }

  const userEventsAttending = (
    await db.query('SELECT event_id FROM users_events WHERE user_id = $1', [
      user_id,
    ])
  ).rows;

  const eventTitles = await Promise.all(
    userEventsAttending.map(async (event) => {
      const event_id = event.event_id;
      const eventTitle = await db
        .query('SELECT * FROM events WHERE event_id = $1', [event_id])
        .then(({ rows }) => {
          return rows[0].title;
        });
      // const eventTitle = (await fetchEventById(event_id)).title;
      return eventTitle;
    })
  );

  return { eventsAttending: eventTitles };
};

module.exports.addUser = async (
  username,
  email,
  password,
  isOrganiser,
  avatarUrl
) => {
  if (!avatarUrl) {
    avatarUrl = 'https://i.ibb.co/db7BbZ6/default-dog.png';
  }

  if (!email) {
    return Promise.reject({ status: 400, msg: 'Please provide an email' });
  }

  if (!username) {
    return Promise.reject({ status: 400, msg: 'Please provide a username' });
  }

  if (!password) {
    return Promise.reject({ status: 400, msg: 'Please provide a password' });
  }

  const checkUserEmailExists = (
    await db.query('SELECT email FROM users WHERE email = $1', [email])
  ).rowCount;

  const checkUsernameExists = (
    await db.query('SELECT username FROM users WHERE username = $1', [username])
  ).rowCount;

  if (checkUserEmailExists) {
    return Promise.reject({
      status: 400,
      msg: 'A user with that email already exists',
    });
  }

  if (checkUsernameExists) {
    return Promise.reject({
      status: 400,
      msg: 'A user with that username already exists',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const addedUser = (
    await db.query(
      `
      INSERT INTO users
        (username, email, password, is_organiser, avatar_url)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [username, email, hashedPassword, isOrganiser, avatarUrl]
    )
  ).rows[0];

  return addedUser;
};

module.exports.fetchUser = async (user_email, password) => {
  const userInfo = (
    await db.query(`SELECT * FROM users WHERE email = $1`, [user_email])
  ).rows[0];

  if (!userInfo) {
    return Promise.reject({
      status: 400,
      msg: 'There is no registered user account that is associated with that email',
    });
  }

  let userDetails = {};

  if (await bcrypt.compare(password, userInfo.password)) {
    userDetails = {
      user_id: userInfo.user_id,
      username: userInfo.username,
      email: userInfo.email,
      is_organiser: userInfo.is_organiser,
      avatar_url: userInfo.avatar_url,
    };
  } else {
    return Promise.reject({
      status: 400,
      msg: 'Incorrect password. Please try again!',
    });
  }

  return userDetails;
};

module.exports.postUserEventAttending = async (username, eventAttending) => {
  const user = (
    await db.query('SELECT user_id FROM users WHERE username = $1', [username])
  ).rows[0];

  const { user_id } = user;

  const event = (
    await db.query('SELECT * FROM events WHERE title = $1', [eventAttending])
  ).rows[0];

  if (!event) {
    return Promise.reject({
      status: 400,
      msg: 'Please specify an event that exists',
    });
  }

  const { event_id } = event;

  const userEventsAttending = (
    await db.query('SELECT event_id FROM users_events WHERE user_id = $1', [
      user_id,
    ])
  ).rows;

  const eventTitles = await Promise.all(
    userEventsAttending.map(async (event) => {
      const event_id = event.event_id;
      const eventTitle = await db
        .query('SELECT * FROM events WHERE event_id = $1', [event_id])
        .then(({ rows }) => {
          return rows[0].title;
        });
      return eventTitle;
    })
  );

  if (eventTitles.includes(eventAttending)) {
    return Promise.reject({
      status: 400,
      msg: 'You have already signed up for this event',
    });
  }

  const addUserEventsAttending = (
    await db.query(
      `
    INSERT INTO users_events
      (user_id, event_id)
    VALUES
      ($1, $2)
    RETURNING *
    `,
      [user_id, event_id]
    )
  ).rows[0];

  return addUserEventsAttending;
};

module.exports.deleteUserById = async (user_id) => {
  const deleteUserQuery = (
    await db.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [
      user_id,
    ])
  ).rowCount;

  if (!deleteUserQuery) {
    return Promise.reject({
      msg: 'The user with the specified user_id was not found',
    });
  }

  return;
};

module.exports.patchUserById = async (user_id, username, password) => {
  const columns = [user_id, username, password];
  const keys = ['user_id', 'username', 'password'];

  const definedParams = columns
    .map((value, index) =>
      value !== undefined ? { [keys[index]]: value } : null
    )
    .filter((item) => item !== null);

  const queryParams = definedParams.map((param) => Object.values(param)[0]);

  const updatedUser = (
    await db.query(
      `UPDATE users
        SET
          username = $1,
          password = $2
        WHERE user_id = $3
        RETURNING *;`,
      [queryParams[1], queryParams[2], queryParams[0]]
    )
  ).rows[0];

  return updatedUser;
};
