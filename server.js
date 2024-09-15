const express = require('express');

const { getEndpoints } = require('./controllers/api.controller.js');

const {
  getUsers,
  getUserById,
  getUserEventsAttending,
  registerUser,
  loginUser,
  addUserEventsAttending,
  removeUserById,
  updateUserById,
} = require('./controllers/users.controllers.js');
const {
  getEvents,
  getEventById,
  getEventAttendees,
  removeEventById,
  updateEventById,
  addEvent,
} = require('./controllers/events.controllers.js');

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);
app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById);
app.get('/api/users/:user_id/attending', getUserEventsAttending);
app.post('/api/users', registerUser);
app.post('/api/users/login', loginUser);
app.post('/api/users/:user_id/attending', addUserEventsAttending);
app.delete('/api/users/:user_id', removeUserById);
app.patch('/api/users/:user_id', updateUserById);

// post /api/users
// JWT authentication?

app.get('/api/events', getEvents);
app.get('/api/events/:event_id', getEventById);
app.get('/api/events/:event_id/attendees', getEventAttendees);
app.delete('/api/events/:event_id', removeEventById);
app.patch('/api/events/:event_id', updateEventById);
app.post('/api/events', addEvent);

app.use((err, req, res, next) => {
  const type = req.path.split('/')[2].slice(0, -1);
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
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({
    msg: "Uh oh, it looks like there's something wrong on our end.",
  });
});

module.exports = app;
