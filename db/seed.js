const connection = require('./connection');
const format = require('pg-format');
const bcrypt = require('bcrypt');

async function seed({ usersData, eventsData }) {
  await connection.query('DROP TABLE IF EXISTS users_events');
  await connection.query('DROP TABLE IF EXISTS events');
  await connection.query('DROP TABLE IF EXISTS users');
  await connection.query(
    `
      CREATE TABLE users
      (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(40) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        is_organiser BOOLEAN NOT NULL,
        avatar_url VARCHAR(255) NOT NULL
      );
    `
  );
  await connection.query(
    `
      CREATE TABLE events
      (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        organiser VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
        description text NOT NULL,
        start_date TIMESTAMPTZ(0) NOT NULL,
        end_date TIMESTAMPTZ(0) NOT NULL,
        event_type VARCHAR NOT NULL,
        price_in_pence INT,
        location VARCHAR(70) NOT NULL,
        image VARCHAR NOT NULL
      );
    `
  );
  await connection.query(
    `
      CREATE TABLE users_events
      (
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, event_id)
      );
    `
  );

  const hashedUsersData = await Promise.all(
    usersData.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      return [
        user.username,
        user.email,
        hashedPassword,
        user.isOrganiser,
        user.avatarUrl,
      ];
    })
  );

  const insertUsersQuery = format(
    `
    INSERT INTO users
    (username, email, password, is_organiser, avatar_url)
    VALUES
    %L
  `,
    hashedUsersData
  );

  await connection.query(insertUsersQuery);

  // const formattedEventsData = convertTimestampToDate(eventsData);

  // console.log(formattedEventsData);

  const insertEventsQuery = format(
    `
      INSERT INTO events
      (title, organiser, description, start_date, end_date, event_type, price_in_pence, location, image)
      VALUES
      %L
    `,
    eventsData.map((event) => {
      return [
        event.title,
        event.organiser,
        event.description,
        event.start_date,
        event.end_date,
        event.event_type,
        event.priceInPence,
        event.location,
        event.image,
      ];
    })
  );
  await connection.query(insertEventsQuery);

  const usersEventsValues = [];

  for (const user of usersData) {
    const eventAttendee = await connection.query(
      'SELECT user_id FROM users WHERE username = $1',
      [user.username]
    );

    const userId = eventAttendee.rows[0].user_id;

    for (const eventTitle of user.eventsAttending) {
      const eventResponse = await connection.query(
        'SELECT event_id FROM events WHERE title = $1',
        [eventTitle]
      );
      const eventId = eventResponse.rows[0].event_id;

      usersEventsValues.push([userId, eventId]);
    }
  }

  const insertUsersEventsQuery = format(
    `
      INSERT INTO users_events (user_id, event_id)
      VALUES %L
    `,
    usersEventsValues
  );

  await connection.query(insertUsersEventsQuery);
}

module.exports = seed;
