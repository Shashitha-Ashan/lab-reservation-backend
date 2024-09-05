const mongoose = require("mongoose");

const AcademicYearSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true, min: 1, max: 4 },
  academicYear: { type: String, required: true, unique: true },
});

const AcademicYear = mongoose.model("AcademicYear", AcademicYearSchema);
module.exports = AcademicYear;
