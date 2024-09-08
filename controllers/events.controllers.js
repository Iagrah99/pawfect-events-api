const {
  fetchEvents,
  fetchEventById,
  fetchEventAttendees,
} = require('../models/events.models.js');

module.exports.getEvents = async (req, res) => {
  const events = await fetchEvents();
  res.status(200).send({ events });
};

module.exports.getEventById = async (req, res) => {
  const { event_id } = req.params;
  try {
    const event = await fetchEventById(event_id);
    res.status(200).send({ event });
  } catch (err) {
    if (err.code === '22P02') {
      res
        .status(400)
        .send({ msg: 'Bad request. Please provide a valid event_id' });
    } else {
      res.status(404).send({ msg: err.msg });
    }
  }
};

module.exports.getEventAttendees = async (req, res) => {
  const { event_id } = req.params;
  const eventAttendees = await fetchEventAttendees(event_id);
  res.status(200).send(eventAttendees);
};
