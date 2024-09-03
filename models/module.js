const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  module_code: { type: String, required: true },
  module_name: { type: String, required: true },
  module_type: { type: String, enum: moduleTypeEnum, required: true },
  semester: { type: String, enum: semesterEnum, required: true },
  academic_year: { type: String, required: true },
  NO_hours: { type: Number, required: true },
});

module.exports = mongoose.model("Module", ModuleSchema);