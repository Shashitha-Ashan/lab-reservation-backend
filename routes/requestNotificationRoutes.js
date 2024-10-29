const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/requestNotificationController");

router.get("/", getAllNotifications);
router.put("/:id", markNotificationAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
