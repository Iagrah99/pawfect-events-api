DROP DATABASE IF EXISTS dog_events;
CREATE DATABASE dog_events;

\c dog_events

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(40) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(40) NOT NULL,
  is_organiser BOOLEAN NOT NULL
);

CREATE TABLE events(
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

CREATE TABLE users_events (
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);

INSERT INTO users
  (username, email, password, is_organiser)
VALUES
  ('PawsAndPlay', 'pawsandplay@example.com', 'BarkLover123!', TRUE),
  ('WoofWanderer', 'woofwanderer@example.com', 'DoggoTrail4Ever!', FALSE),
  ('FetchMaster', 'fetchmaster@example.com', 'BallChaser2024!', TRUE);

INSERT INTO events
  (title, organiser, description, event_type, price_in_pence, location)
VALUES
  ('Paws in the Park', 'PawsAndPlay', 'A fun-filled day in the park.', 'Dog Show', 1500, 'London'),
  ('Doggy Dash Derby', 'PawsAndPlay', 'Join us for an exciting dog race.', 'Dog Show', 2000, 'Manchester'),
  ('Fetch Fest', 'FetchMaster', 'A festival dedicated to all things fetch!', 'Dog Training', 1200, 'Bristol');

INSERT INTO users_events
  (user_id, event_id)
VALUES
  (1,1), (1,2), (1,3), (2,1), (2,2), (3,1), (3,2), (3,3);

SELECT 
    users_events.user_id, 
    users_events.event_id, 
    events.title
FROM 
    users_events
JOIN 
    users ON users_events.user_id = users.user_id
JOIN 
    events ON users_events.event_id = events.event_id;
