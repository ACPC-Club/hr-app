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
  name: String,
  date: Date,
  attendees: [attendeeSchema],
});

module.exports = mongoose.model("Event", eventSchema);
