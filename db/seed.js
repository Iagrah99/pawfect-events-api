const connection = require('./connection');

async function seed() {
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
        password VARCHAR(40) NOT NULL,
        is_organiser BOOLEAN NOT NULL
      );
    `
  );
  await connection.query(
    `
      CREATE TABLE events
      (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        organiser VARCHAR NOT NULL REFERENCES users(username),
        description text NOT NULL,
        start_date TIMESTAMP(0) DEFAULT NOW() NOT NULL,
        end_date TIMESTAMP(0) DEFAULT (NOW() + INTERVAL '1 day') NOT NULL,
        event_type VARCHAR NOT NULL,
        price_in_pence INT,
        location VARCHAR(70) NOT NULL
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
}

module.exports = seed;
