const db = require('../db/connection.js');

exports.getPassword = async (user_id) => {
  const userInformation = (
    await db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
  ).rows[0];

  return userInformation.password;
};
