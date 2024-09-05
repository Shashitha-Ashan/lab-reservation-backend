const express = require("express");
const router = express.Router();

const { createOrUpdateDeviceId } = require("../controllers/deviceIdController");

router.post("/device-id", createOrUpdateDeviceId);

module.exports = router;
