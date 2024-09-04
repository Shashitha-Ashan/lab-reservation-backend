const express = require("express");
const router = express.Router();
const {
  getTodayTimeSlots,
  addTimeSlot,
  deleteTimeSlot,
  editTimeSlot,
  rescheduleTimeSlot,
  cancelTimeSlot,
  getSelectedDateTimeSlots,
  getRescheduleModules,
  addExtraLecture,
} = require("../controllers/timeSlotsController");
const verifyToken = require("../middleware/verifyToken");
const isLecturer = require("../middleware/isLecturer");
const isAdmin = require("../middleware/isAdmin");
router.use(verifyToken);

router.get("/today", getTodayTimeSlots);
router.post("/add", isAdmin, addTimeSlot);
router.delete("/delete/:id", isAdmin, deleteTimeSlot);
router.put("/edit/:id", isAdmin, editTimeSlot);
router.put("/reschedule/:id", isLecturer, rescheduleTimeSlot);
router.put("/cancel/:id", isLecturer, cancelTimeSlot);
router.post("/selected", getSelectedDateTimeSlots);
router.get("/reschedule", getRescheduleModules);
router.post("/add-extra", isLecturer, addExtraLecture);

module.exports = router;
