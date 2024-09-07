const mongoose = require("mongoose");

const LectureHallSchema = new mongoose.Schema({
  hallName: { type: String, required: true, unique: true },
  NOSeats: { type: Number, required: true },
  hallType: { type: String, required: true, enum: ["lecture", "lab"] },
  // NOProjectors: { type: Number, required: true, default: 1 },
  // ...
});
module.exports = mongoose.model("LectureHall", LectureHallSchema);
