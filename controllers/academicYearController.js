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
    res.status(200).send(academicYears);
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = { addNewAcademicYear, editAcademicYear, getAcademicYears };
