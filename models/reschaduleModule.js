const mongoose = require("mongoose");

const RescheduleModuleSchema = new mongoose.Schema({
  reschadule_by: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  time_slot: { type: mongoose.Types.ObjectId, ref: "TimeTableSlot", required: true },
});

module.exports = mongoose.model("RescheduleModule", RescheduleModuleSchema);