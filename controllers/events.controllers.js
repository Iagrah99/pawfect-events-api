const {
  fetchEvents,
  fetchEventById,
  fetchEventAttendees,
} = require('../models/events.models.js');

module.exports.getEvents = async (req, res) => {
  const events = await fetchEvents();
  res.status(200).send({ events });
};

module.exports.getEventById = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const event = await fetchEventById(event_id);
    res.status(200).send({ event });
  } catch (err) {
    next(err);
  }
};

module.exports.getEventAttendees = async (req, res) => {
  const { event_id } = req.params;
  const eventAttendees = await fetchEventAttendees(event_id);
  res.status(200).send(eventAttendees);
};
