const db = require('../db/connection');

module.exports.fetchEvents = () => {
  return db.query('SELECT * FROM events').then(({ rows }) => {
    return rows;
  });
};

module.exports.fetchEventById = (id) => {
  return db
    .query('SELECT * FROM events WHERE event_id = $1', [id])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports.fetchEventAttendees = async (event_id) => {
  const eventAttendees = (
    await db.query('SELECT user_id FROM users_events WHERE event_id = $1', [
      event_id,
    ])
  ).rows;

  const attendeeUsernames = await Promise.all(
    eventAttendees.map(async (attendee) => {
      const user_id = attendee.user_id;
      const user = await db
        .query('SELECT * FROM users WHERE user_id = $1', [user_id])
        .then(({ rows }) => {
          return rows[0].username;
        });
      // const user = (await fetchUserById(user_id)).username;
      return user;
    })
  );

  return { attendees: attendeeUsernames };
};
