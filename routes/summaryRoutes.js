const express = require("express");
const { getLecturerFullSummary } = require("../controllers/summaryController");

const router = express.Router();
const isLecturer = require("../middlewares/verifyLecturer");

router.get("/lecturer-summary", isLecturer, getLecturerFullSummary);

module.exports = router;
