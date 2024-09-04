const seed = require('./seed');
const connection = require('./connection');

seed().then(() => {
  connection.end();
});
