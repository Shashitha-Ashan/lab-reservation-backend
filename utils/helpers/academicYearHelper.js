const AcademicYear = require("../../models/academicYearModel");

const getAcademicYear = async (semester) => {
  const year = Math.ceil(semester / 2);
  const studentAcademicYear = await AcademicYear.findOne({ year });
  return studentAcademicYear.academicYear;
};

const getYearByStudentAcademicYear = async (academicYear) => {
  const studentAcademicYear = await AcademicYear.findOne({ academicYear });
  return studentAcademicYear.year;
};
module.exports = { getAcademicYear, getYearByStudentAcademicYear };