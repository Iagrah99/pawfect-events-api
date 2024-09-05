const { fetchEvents, fetchEventById } = require('../models/events.models.js');

module.exports.getEvents = async (req, res) => {
  const events = await fetchEvents();
  res.status(200).send({ events });
};

module.exports.getEventById = async (req, res) => {
  const { event_id } = req.params;
  const event = await fetchEventById(event_id);
  res.status(200).send({ event });
};
