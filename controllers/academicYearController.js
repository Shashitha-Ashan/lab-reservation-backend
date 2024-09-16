const AcademicYear = require("../models/academicYearModel");

const addNewAcademicYear = async (req, res) => {
  try {
    const { year, academicYear } = req.body;
    const newAcademicYear = new AcademicYear({ year, academicYear });
    await newAcademicYear.save();
    res.status(201).send({ message: "Academic year added successfully" });
  } catch (e) {
    res.status(400).send(e);
  }
};
const editAcademicYear = async (req, res) => {
  try {
    const { year, academicYear } = req.body;
    const academicYearId = req.params.id;
    await AcademicYear.findByIdAndUpdate(
      academicYearId,
      { year, academicYear },
      { new: true }
    );
    res.status(200).send({ message: "Academic year updated successfully" });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getAcademicYears = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find();
    academicYears.sort(sortAcademicYearsByYear);

    res.status(200).send(academicYears);
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};
const sortAcademicYearsByYear = (a, b) => {
  if (a.year < b.year) {
    return -1;
  }
  if (a.year > b.year) {
    return 1;
  }
  return 0;
};
const deleteAcademicYear = async (req, res) => {
  try {
    const academicYearId = req.params.id;
    await AcademicYear.findByIdAndDelete(academicYearId);
    res.status(200).send({ message: "Academic year deleted successfully" });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};
const deleteBulkAcademicYears = async (req, res) => {
  try {
    const academicYearIds = req.body;
    await AcademicYear.deleteMany({ _id: { $in: academicYearIds } });
    res.status(200).send({ message: "Academic years deleted successfully" });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};
const getAcademicYearById = async (req, res) => {
  try {
    const academicYearId = req.params.id;
    const academicYear = await AcademicYear.findById(academicYearId);
    if (!academicYear) {
      return res.status(404).send({ message: "Academic year not found" });
    }
    res.status(200).send(academicYear);
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};
const startNewAcademicYear = async (req, res) => {
  try {
    const years = await AcademicYear.find();
    years.forEach(async (year) => {
      const academicYear = year.academicYear;
      const { startYear, endYear } = splitAcademicYear(academicYear);
      year.academicYear = `${parseInt(startYear) + 1}/${parseInt(endYear) + 1}`;
      // await year.save();
      console.log(year.academicYear);
    });

    res.status(200).send({ message: "New academic year started successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
const splitAcademicYear = (academicYear) => {
  const [startYear, endYear] = academicYear.split("/");

  return { startYear, endYear };
};

module.exports = {
  addNewAcademicYear,
  editAcademicYear,
  getAcademicYears,
  deleteAcademicYear,
  deleteBulkAcademicYears,
  getAcademicYearById,
  startNewAcademicYear,
};
