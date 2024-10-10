const mongoose = require("mongoose");

const FocusAreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  year: { type: mongoose.Types.ObjectId, required: true, ref: "AcademicYear" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FocusArea", FocusAreaSchema);
