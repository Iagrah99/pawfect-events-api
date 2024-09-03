DROP DATABASE IF EXISTS dog_events;
CREATE DATABASE dog_events;

\c dog_events

CREATE TABLE events(
  event_id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  organiser VARCHAR NOT NULL REFERENCES users(username),
  description VARCHAR NOT NULL,
  start_date TIMESTAMP DEFAULT NOW() NOT NULL,
  end_date TIMESTAMP DEFAULT (NOW() + INTERVAL '1 day') NOT NULL,
  category VARCHAR NOT NULL,
  cost INT DEFAULT 0 NOT NULL,
  location VARCHAR(255) NOT NULL
)

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(40) VARCHAR NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(40) NOT NULL,
)

CREATE TABLE users_events(
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);