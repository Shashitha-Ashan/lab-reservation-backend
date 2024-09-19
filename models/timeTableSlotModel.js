const mongoose = require("mongoose");

const TimeTableSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const endTime = new Date(value);
        const startTime = new Date(this.start_time);
        return endTime > startTime;
      },
      message: "Start time must be before end time",
    },
  },
  module: { type: mongoose.Types.ObjectId, ref: "Module", required: true },
  lecturer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  hall: { type: mongoose.Types.ObjectId, ref: "LectureHall", required: true },
  slot_type: {
    type: String,
    enum: ["reschaduled", "cancelled", "ordinary", "extra"],
    default: "ordinary",
    required: true,
  },
  slotStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      return this.slot_type === "ordinary" ? "approved" : "pending"; // not sure about this yet
    },
    required: true,
  },
  sessionType: {
    type: String,
    enum: ["lecture", "lab"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TimeTableSlot", TimeTableSlotSchema);
