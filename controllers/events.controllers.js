const { fetchEvents } = require('../models/events.models.js');

module.exports.getEvents = async (req, res) => {
  const events = await fetchEvents();
  res.status(200).send({ events });
};
