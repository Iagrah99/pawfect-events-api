const express = require('express');
const { getUsers, getUserById } = require('./controllers/users.controllers.js');
const {
  getEvents,
  getEventById,
  getEventAttendees,
} = require('./controllers/events.controllers.js');

const app = express();

app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById);

app.get('/api/events', getEvents);
app.get('/api/events/:event_id', getEventById);
app.get('/api/events/:event_id/attendees', getEventAttendees);

module.exports = app;
