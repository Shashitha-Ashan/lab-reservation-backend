const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // focusAreas: [
  //   {
  //     type: mongoose.Types.ObjectId,
  //     ref: "FocusArea",
  //   },
  // ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Department", DepartmentSchema);
