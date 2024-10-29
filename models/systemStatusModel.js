const mongoose = require("mongoose");

const systemStatusSchema = new mongoose.Schema({
  isUpdating: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const SystemStatus = mongoose.model("SystemStatus", systemStatusSchema);

module.exports = SystemStatus;
