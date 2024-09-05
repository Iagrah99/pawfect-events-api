const express = require('express');
const { getUsers, getUserById } = require('./controllers/users.controllers');

const app = express();

app.get('/api/users', getUsers);
app.get('/api/users/:user_id', getUserById);

module.exports = app;
