DROP DATABASE IF EXISTS dog_events_test;
CREATE DATABASE dog_events_test;

\c dog_events_test

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

INSERT INTO users
  (username, email, password, is_organiser)
VALUES
  ('PawsAndPlay', 'pawsandplay@example.com', 'BarkLover123!', TRUE),
  ('WoofWanderer', 'woofwanderer@example.com', 'DoggoTrail4Ever!', FALSE),
  ('FetchMaster', 'fetchmaster@example.com', 'BallChaser2024!', TRUE);

INSERT INTO events
  (title, organiser, description, event_type, price_in_pence, location)
VALUES
  ('Paws in the Park', 'PawsAndPlay', 'A fun-filled day in the park with agility courses, doggy meetups, and plenty of treats for your furry friends.', 'Dog Show', 1500, 'London'),
  ('Doggy Dash Derby', 'PawsAndPlay', 'Join us for an exciting dog race event where your pups can show off their speed and win some great prizes!', 'Dog Show', 2000, 'Manchester'),
  ('Fetch Fest', 'FetchMaster', 'Dog Training', 'A festival dedicated to all things fetch! Bring your dog and compete in fetch competitions or just enjoy the fun activities.', 1200, 'Bristol');