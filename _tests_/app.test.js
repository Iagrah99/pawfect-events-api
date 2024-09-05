const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');

afterAll(() => db.end());

describe('GET /api/users', () => {
  test('status code: 200', () => {
    return request(app).get('/api/users').expect(200);
  });
  test('should respond with an array of user objects', () => {
    return request(app)
      .get('/api/users')
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
