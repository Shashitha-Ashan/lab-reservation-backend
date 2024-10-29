const mongoose = require("mongoose");

const requestNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notification: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: mongoose.Types.ObjectId,
    ref: "TimeTableSlot",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "RequestNotification",
  requestNotificationSchema
);
