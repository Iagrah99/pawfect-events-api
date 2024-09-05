const db = require('../db/connection');

module.exports.fetchUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};

module.exports.fetchUserById = (id) => {
  return db
    .query('SELECT * FROM users WHERE user_id = $1', [id])
    .then(({ rows }) => {
      return rows[0];
    });
};
