const express = require("express");
const router = express.Router();

const {
  getSystemStatus,
  updateSystemStatus,
} = require("../controllers/systemStatusController");

router.get("/", getSystemStatus);
router.put("/", updateSystemStatus);

module.exports = router;
