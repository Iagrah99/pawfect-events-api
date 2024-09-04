DROP DATABASE IF EXISTS dog_events;
CREATE DATABASE dog_events;

\c dog_events

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
