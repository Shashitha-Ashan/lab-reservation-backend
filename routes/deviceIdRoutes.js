const express = require("express");
const router = express.Router();

const {
  createOrUpdateDeviceId,
  getAllDeviceId,
} = require("../controllers/deviceIdController");

router.post("/device-id", createOrUpdateDeviceId);
router.get("/device-id", getAllDeviceId);

module.exports = router;
