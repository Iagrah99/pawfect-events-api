const {
  fetchEvents,
  fetchEventById,
  fetchEventAttendees,
  deleteEventById,
  updateEventInfoById,
} = require('../models/events.models.js');

module.exports.getEvents = async (req, res, next) => {
  const { sort_by, order_by } = req.query;
  try {
    const events = await fetchEvents(sort_by, order_by);
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

module.exports.removeEventById = async (req, res, next) => {
  const { event_id } = req.params;
  try {
    await deleteEventById(event_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.updateEventById = async (req, res, next) => {
  const { event_id } = req.params;
  const {
    title,
    organiser,
    start_date,
    end_date,
    description,
    event_type,
    price_in_pence,
    location,
    image,
  } = req.body;
  try {
    const updatedEvent = await updateEventInfoById(
      event_id,
      title,
      organiser,
      start_date,
      end_date,
      description,
      event_type,
      price_in_pence,
      location,
      image
    );

    res.status(200).send({ event: updatedEvent });
  } catch (err) {
    next(err);
  }
};
