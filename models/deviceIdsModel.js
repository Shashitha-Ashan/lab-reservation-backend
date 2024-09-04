const mongoose = require("mongoose");

const DeviceIdSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("DeviceId", DeviceIdSchema);
