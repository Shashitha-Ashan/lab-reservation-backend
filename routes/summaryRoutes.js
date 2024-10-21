const express = require("express");
const {
  getLecturerFullSummary,
  getSemesterSummary,
} = require("../controllers/summaryController");

const router = express.Router();
const isLecturer = require("../middlewares/verifyLecturer");
const { isAdmin } = require("../middlewares/verifyAdmin");

router.get("/lecturer-summary", isLecturer, getLecturerFullSummary);
router.get("/semester-summary", isAdmin, getSemesterSummary);

module.exports = router;
