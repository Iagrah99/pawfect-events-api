const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');
const seed = require('../db/seed');

afterAll(() => db.end());

beforeEach(() => seed());

describe('GET /api/users', () => {
  test('status 200: should respond with an array of user objects with all their properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toMatchObject({
            user_id: expect.any(Number),
            username: expect.any(String),
            email: expect.any(String),
            password: expect.any(String),
            is_organiser: expect.any(Boolean),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('GET /api/users/:user_id', () => {
  test('status 200: should respond with the user object associated with the specified user_id ', () => {
    return request(app)
      .get('/api/users/1')
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          user_id: 1,
          username: 'PawsAndPlay',
          email: 'pawsandplay@example.com',
          password: expect.any(String),
          is_organiser: true,
          avatar_url: 'https://i.ibb.co/db7BbZ6/default-dog.png',
        });
      });
  });

  test('status 404: should respond with a "not found" error when given a valid but non-existent user_id', () => {
    return request(app)
      .get('/api/users/100')
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('The user with the specified user_id was not found.');
      });
  });

  test('status 400: should respond with a "bad request" error when given an invalid user_id', () => {
    return request(app)
      .get('/api/users/random')
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe('Bad request. Please provide a valid user_id');
      });
  });
});

describe('GET /api/users/:user_id/attending', () => {
  test('status 200: should respond with an object with the string "eventsAttending" as the key, and an array of events as its value for the user with the specified user_id', () => {
    return request(app)
      .get('/api/users/2/attending')
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          eventsAttending: ['Doggy Dash Derby', 'Fetch Fest'],
        });
      });
  });
});

describe('GET /api/events', () => {
  test('status 200: should respond with an array of event objects with all their properties', () => {
    return request(app)
      .get('/api/events')
      .expect(200)
      .then(({ body }) => {
        const { events } = body;
        expect(Array.isArray(events)).toBe(true);
        events.forEach((event) => {
          expect(event).toMatchObject({
            event_id: expect.any(Number),
            title: expect.any(String),
            organiser: expect.any(String),
            start_date: expect.any(String),
            end_date: expect.any(String),
            description: expect.any(String),
            event_type: expect.any(String),
            price_in_pence: expect.any(Number),
            location: expect.any(String),
            image: expect.any(String),
          });
        });
      });
  });
});

describe('GET /api/events/:event_id', () => {
  test('status 200: should respond with the event object associated with the specified event_id ', () => {
    return request(app)
      .get('/api/events/1')
      .expect(200)
      .then(({ body }) => {
        const { event } = body;
        expect(event).toMatchObject({
          event_id: 1,
          title: 'Paws in the Park',
          organiser: 'PawsAndPlay',
          start_date: expect.any(String),
          end_date: expect.any(String),
          description: 'A fun-filled day in the park.',
          event_type: 'Dog Show',
          price_in_pence: 1500,
          location: 'London',
          image: 'https://i.ibb.co/2Y8bKmQ/BPp0q-Bhb-V.jpg',
        });
      });
  });
});

describe('GET /api/events/:event_id/attendees', () => {
  test('status 200: should respond with an object with a key of attendees, and an array of individual attendee usernames as its value for the event with the specified event_id', () => {
    return request(app)
      .get('/api/events/1/attendees')
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          attendees: ['PawsAndPlay', 'FetchMaster'],
        });
      });
  });
});

describe('POST /api/users', () => {
  test('status 201: should respond with the user object that was created with the correct properties including the default avatar_url value if one is not specified by the user', () => {
    return request(app)
      .post('/api/users')
      .send({
        username: 'New User',
        email: 'newuser@email.com',
        password: 'NewUser123!',
        isOrganiser: false,
        avatarUrl: '',
      })
      .expect(201)
      .then(({ body }) => {
        const { newUser } = body;
        expect(newUser).toMatchObject({
          user_id: 4,
          username: 'New User',
          email: 'newuser@email.com',
          password: expect.any(String),
          is_organiser: false,
          avatar_url: 'https://i.ibb.co/db7BbZ6/default-dog.png',
        });
      });
  });
});

describe('POST /api/users/login', () => {
  test('status 201: should respond with the user object that was created with their user details if provided correct login credentials ', () => {
    return request(app)
      .post('/api/users/login')
      .send({
        email: 'fetchmaster@example.com',
        password: 'BallChaser2024!',
      })
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          user_id: 3,
          username: 'FetchMaster',
          email: 'fetchmaster@example.com',
          is_organiser: true,
          avatar_url: 'https://i.ibb.co/db7BbZ6/default-dog.png',
        });
      });
  });
});

describe('POST /api/users/:user_id/attending', () => {
  test('status 201: should respond with an object with the string "eventsAttending" as the key, and an updated array of events as its value for the user with the specified user_id with the added event appended to the array', () => {
    return request(app)
      .post('/api/users/1/attending')
      .send({
        username: 'PawsAndPlay',
        // Add a specific event to the array
        eventAttending: 'Doggy Dash Derby',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body).toMatchObject({
          // Responds with the updated array of events the user is attending
          eventsAttending: ['Paws in the Park', 'Doggy Dash Derby'],
        });
      });
  });
});
