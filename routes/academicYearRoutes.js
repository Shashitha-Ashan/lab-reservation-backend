const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");

const {
  addNewAcademicYear,
  editAcademicYear,
  getAcademicYears,
  deleteAcademicYear,
  deleteBulkAcademicYears,
  getAcademicYearById,
  startNewAcademicYear,
} = require("../controllers/academicYearController");
router.use(isAdmin);
router.post("/", addNewAcademicYear);
router.get("/", getAcademicYears);
router.put("/:id", editAcademicYear);
router.delete("/:id", deleteAcademicYear);
router.post("/bulk-delete", deleteBulkAcademicYears);
router.get("/:id", getAcademicYearById);
router.post("/start-new", startNewAcademicYear);

module.exports = router;
