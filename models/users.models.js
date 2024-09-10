const db = require('../db/connection');

module.exports.fetchUsers = async () => {
  const users = (await db.query('SELECT * FROM users')).rows;
  return users;
};

module.exports.fetchUserById = async (user_id) => {
  // Check if user_id exists and reject if it doesn't

  const user = (
    await db.query('SELECT * FROM users WHERE user_id = $1', [user_id])
  ).rows[0];

  if (!user)
    return Promise.reject({
      msg: 'The user with the specified user_id was not found.',
    });

  return user;
};

module.exports.fetchEventsAttending = async (user_id) => {
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

  const addedUser = (
    await db.query(
      `
      INSERT INTO users
        (username, email, password, is_organiser, avatar_url)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [username, email, password, isOrganiser, avatarUrl]
    )
  ).rows[0];

  return addedUser;
};

module.exports.fetchUser = async (user_email) => {
  const userInfo = (
    await db.query(`SELECT * FROM users WHERE email = $1`, [user_email])
  ).rows[0];

  return userInfo;
};

module.exports.postUserEventAttending = async (username, eventAttending) => {
  const { user_id } = (
    await db.query('SELECT user_id FROM users WHERE username = $1', [username])
  ).rows[0];

  const { event_id } = (
    await db.query('SELECT * FROM events WHERE title = $1', [eventAttending])
  ).rows[0];

  const userEventsAttending = (
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

  return userEventsAttending;
};

module.exports.deleteUserById = async (user_id) => {
  const deleteUserQuery = (
    await db.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [
      user_id,
    ])
  ).rowCount;

  if (!deleteUserQuery) {
    return Promise.reject('The user with the specified user_id was not found');
  }

  return;
};
