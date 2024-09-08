const express = require('express');
const {
  getUsers,
  getUserById,
  getUserEventsAttending,
  registerUser,
  loginUser,
  addUserEventsAttending,
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
app.post('/api/users/:user_id/attending', addUserEventsAttending);
// post /api/users
// JWT authentication?

app.get('/api/events', getEvents);
app.get('/api/events/:event_id', getEventById);
app.get('/api/events/:event_id/attendees', getEventAttendees);

app.use((err, req, res, next) => {
  const type = req.originalUrl.split('/')[2].slice(0, -1);
  if (err.code === '22P02') {
    res
      .status(400)
      .send({ msg: `Bad request. Please provide a valid ${type}_id` });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg.includes('not found')) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    msg: 'I suck at coding, sorry!',
  });
});

module.exports = app;
