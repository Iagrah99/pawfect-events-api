const db = require('../db/connection');

module.exports.fetchEvents = async () => {
  return (await db.query('SELECT * FROM events')).rows;
};

module.exports.fetchEventById = async (event_id) => {
  const event = (
    await db.query('SELECT * FROM events WHERE event_id = $1', [event_id])
  ).rows[0];

  if (!event) {
    return Promise.reject({
      msg: 'The event with the specified event_id was not found.',
    });
  }

  return event;
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

module.exports.deleteEventById = async (event_id) => {
  console.log(event_id);
  const deleteEventQuery = (
    await db.query('DELETE FROM events WHERE event_id = $1 RETURNING *', [
      event_id,
    ])
  ).rowCount;

  if (!deleteEventQuery) {
    return Promise.reject(
      'The event with the specified event_id was not found'
    );
  }

  return;
};
