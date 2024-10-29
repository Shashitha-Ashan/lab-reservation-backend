const mongoose = require("mongoose");

const DeviceIdSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
});

module.exports = mongoose.model("DeviceId", DeviceIdSchema);
