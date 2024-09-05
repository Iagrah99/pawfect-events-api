const express = require('express');
const { getUsers } = require('./controllers/users.controllers');

const app = express();

app.get('/api/users', getUsers);

module.exports = app;
