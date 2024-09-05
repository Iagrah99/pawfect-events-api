const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');
const seed = require('../db/seed');

afterAll(() => db.end());

beforeEach(() => {
  return seed();
});

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
          password: 'BarkLover123!',
          is_organiser: true,
          avatar_url: 'https://i.ibb.co/db7BbZ6/default-dog.png',
        });
      });
  });
});
