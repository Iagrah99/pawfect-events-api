const express = require('express');
const { getUsers, getUserById } = require('./controllers/users.controllers.js');
const {
  getEvents,
  getEventById,
} = require('./controllers/events.controllers.js');

const app = express();

app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById);

app.get('/api/events', getEvents);
app.get('/api/events/:event_id', getEventById);

module.exports = app;
