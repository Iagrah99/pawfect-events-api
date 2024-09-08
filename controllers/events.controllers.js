const {
  fetchEvents,
  fetchEventById,
  fetchEventAttendees,
} = require('../models/events.models.js');

module.exports.getEvents = async (req, res, next) => {
  try {
    const events = await fetchEvents();
    res.status(200).send({ events });
  } catch (err) {
    next(err);
  }
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

module.exports.getEventAttendees = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    const eventAttendees = await fetchEventAttendees(event_id);
    res.status(200).send(eventAttendees);
  } catch (err) {
    next(err);
  }
};
