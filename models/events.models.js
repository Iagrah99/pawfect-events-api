const db = require('../db/connection');

module.exports.fetchEvents = () => {
  return db.query('SELECT * FROM events').then(({ rows }) => {
    return rows;
  });
};

module.exports.fetchEventById = (id) => {
  return db
    .query('SELECT * FROM events WHERE event_id = $1', [id])
    .then(({ rows }) => {
      return rows[0];
    });
};
