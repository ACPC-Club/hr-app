const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  universityId: String,
  department: String,
  year: String,
  warnings: [String],
  points: Number,
  isBoardMember: Boolean,
});

module.exports = mongoose.model("Member", memberSchema);
