const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  lectureSkipped: String,
  lectureCode: String,
  lectureTime: String,
});

const attendeeSchema = new mongoose.Schema({
  name: String,
  universityId: String,
  lectures: [lectureSchema],
});

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attendees: [attendeeSchema],
});

module.exports = mongoose.model("Event", eventSchema);
