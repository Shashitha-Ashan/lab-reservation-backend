const mongoose = require("mongoose");

const LectureHallSchema = new mongoose.Schema({
  hallName: { type: String, required: true },
  NOSeats: { type: Number, required: true },
  // NOProjectors: { type: Number, required: true, default: 1 },
  // ...
});
module.exports = mongoose.model("LectureHall", LectureHallSchema);
