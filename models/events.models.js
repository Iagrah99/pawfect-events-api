const db = require('../db/connection');
const format = require('pg-format');

module.exports.fetchEvents = async () => {
  return (await db.query('SELECT * FROM events ORDER BY title')).rows;
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

module.exports.updateEventInfoById = async (
  event_id,
  title,
  organiser,
  start_date,
  end_date,
  description,
  event_type,
  price_in_pence,
  location,
  image
) => {
  // Create a mapping of column names to their respective values
  const columns = {
    title,
    organiser,
    start_date,
    end_date,
    description,
    event_type,
    price_in_pence,
    location,
    image,
  };

  // Filter out undefined values
  const setClause = [];

  for (const [column, value] of Object.entries(columns)) {
    if (value !== undefined) {
      setClause.push(format('%I = %L', column, value)); // %I for column name, %L for literal value
    }
  }

  // If there are no valid fields to update, return early
  if (setClause.length === 0) {
    throw new Error('No valid fields to update');
  }

  // Add event_id as a last condition for the WHERE clause
  const query = format(
    `
    UPDATE events
    SET %s
    WHERE event_id = %L
    RETURNING *;
  `,
    setClause.join(', '),
    event_id
  );

  // Execute the query
  const updateEventQuery = (await db.query(query)).rows[0];

  return updateEventQuery;
};
