const mongoose = require("mongoose");

const FocusAreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FocusArea", FocusAreaSchema);
