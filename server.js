const express = require('express');
const {
  getUsers,
  getUserById,
  getUserEventsAttending,
  registerUser,
  loginUser,
} = require('./controllers/users.controllers.js');
const {
  getEvents,
  getEventById,
  getEventAttendees,
} = require('./controllers/events.controllers.js');

const app = express();

app.use(express.json());

app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById);
app.get('/api/users/:user_id/attending', getUserEventsAttending);
app.post('/api/users', registerUser);
app.post('/api/users/login', loginUser);
// post /api/users
// Encrypt password with bcrypt?
// JWT authentication?

app.get('/api/events', getEvents);
app.get('/api/events/:event_id', getEventById);
app.get('/api/events/:event_id/attendees', getEventAttendees);

module.exports = app;
