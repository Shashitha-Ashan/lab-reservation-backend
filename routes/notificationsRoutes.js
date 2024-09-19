const express = require("express");
const router = express.Router();

const {
  sendNotificationToAll,
  sendNotificationToStudents,
  sendNotificationToLectures,
} = require("../controllers/notificationsController");

const { isAdmin } = require("../middlewares/verifyAdmin");
router.use(isAdmin);
router.post("/all", sendNotificationToAll);
router.post("/students", sendNotificationToStudents);
router.post("/lecturers", sendNotificationToLectures);

module.exports = router;
