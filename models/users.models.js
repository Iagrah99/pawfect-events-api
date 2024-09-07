const db = require('../db/connection');

module.exports.fetchUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};

module.exports.fetchUserById = (id) => {
  return db
    .query('SELECT * FROM users WHERE user_id = $1', [id])
    .then(({ rows }) => {
      return rows[0];
    });
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
