const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");

const {
  addNewAcademicYear,
  editAcademicYear,
  getAcademicYears,
} = require("../controllers/academicYearController");
router.use(verifyToken);
router.use(isAdmin);
router.post("/", addNewAcademicYear);
router.get("/", getAcademicYears);
router.put("/:id", editAcademicYear);

module.exports = router;
