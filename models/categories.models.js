const db = require('../db/connection');

exports.fetchCategoriesData = async () => {
  const categoriesData = await db.query('SELECT * FROM categories');
  return categoriesData.rows;
};
