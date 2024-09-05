const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  moduleCode: { type: String, required: true, unique: true },
  moduleName: { type: String, required: true },
  semester: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
    required: true,
  },
  year: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  NOHours: { type: Number, required: true },
  department: { type: String, required: true, enum: ["ict", "egt", "bst"] },
  focusArea: { type: String, required: true, default: "common" },
});

module.exports = mongoose.model("Module", ModuleSchema);
