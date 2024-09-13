const db = require('../db/connection');
const format = require('pg-format');

module.exports.fetchEvents = async (sort_by = 'title', order_by = 'ASC') => {
  const validSortByQueries = [
    'title',
    'price_in_pence',
    'organiser',
    'start_date',
    'end_date',
  ];

  const validOrderByQueries = ['ASC', 'DESC'];

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request. Please provide a valid sort_by query.',
    });
  }

  if (!validOrderByQueries.includes(order_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request. Please provide a valid order_by query.',
    });
  }

  return (
    await db.query(`SELECT * FROM events ORDER BY ${sort_by} ${order_by}`)
  ).rows;
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
  const checkEventIdValid = (
    await db.query(`SELECT event_id FROM events WHERE event_id = $1`, [
      event_id,
    ])
  ).rowCount;

  if (!checkEventIdValid) {
    return Promise.reject({
      msg: 'The event with the specified event_id was not found.',
    });
  }

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
    return Promise.reject({
      status: 404,
      msg: 'The event with the specified event_id was not found',
    });
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

  const checkEventIdValid = (
    await db.query('SELECT event_id FROM events WHERE event_id = $1', [
      event_id,
    ])
  ).rowCount;

  if (!checkEventIdValid) {
    return Promise.reject({
      msg: 'The event with the specified event_id was not found',
    });
  }

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

module.exports.addNewEvent = async (
  title,
  organiser,
  description,
  start_date,
  end_date,
  event_type,
  price_in_pence,
  location,
  image
) => {
  // Check if the username stored in organiser is actually an organiser.

  const checkIsOrganiser = (
    await db.query('SELECT is_organiser FROM users WHERE username = $1', [
      organiser,
    ])
  ).rows[0].is_organiser;

  if (!checkIsOrganiser) {
    return Promise.reject({
      status: 400,
      msg: 'You do not have sufficent privileges',
    });
  }

  const insertEventQuery = (
    await db.query(
      `
      INSERT INTO events
        (title, organiser, description, event_type, start_date, end_date, price_in_pence, location, image)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        title,
        organiser,
        description,
        event_type,
        start_date,
        end_date,
        price_in_pence,
        location,
        image,
      ]
    )
  ).rows[0];

  return insertEventQuery;
};
