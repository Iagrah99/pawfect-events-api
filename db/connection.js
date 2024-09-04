const { Pool } = require('pg');

const db = new Pool({
  database: 'dog_events_test',
});

const eventsData = await db.query('SELECT * FROM events;');
