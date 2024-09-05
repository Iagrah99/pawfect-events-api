const db = require('../db/connection');

module.exports.fetchEvents = () => {
  return db.query('SELECT * FROM events').then(({ rows }) => {
    return rows;
  });
};
