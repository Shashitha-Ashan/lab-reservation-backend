const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");

const {
  addNewAcademicYear,
  editAcademicYear,
  getAcademicYears,
} = require("../controllers/academicYearController");
router.use(isAdmin);
router.post("/", addNewAcademicYear);
router.get("/", getAcademicYears);
router.put("/:id", editAcademicYear);

module.exports = router;
