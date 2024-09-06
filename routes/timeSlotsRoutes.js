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
  cancelRangeOfTimeSlots,
} = require("../controllers/timeSlotsController");
const verifyToken = require("../middlewares/verifyToken");
const isLecturer = require("../middlewares/verifyLecturer");
const { isAdmin } = require("../middlewares/verifyAdmin");
router.use(verifyToken);

router.get("/today", getTodayTimeSlots);
router.post("/add", isAdmin, addTimeSlot);
router.delete("/delete/:id", isAdmin, deleteTimeSlot);
router.put("/edit/:id", isAdmin, editTimeSlot);
router.put("/reschedule/:id", isLecturer, rescheduleTimeSlot);
router.put("/cancel/:id", isLecturer, cancelTimeSlot);
router.get("/selectedate", getSelectedDateTimeSlots);
router.get("/reschedule", getRescheduleModules);
router.post("/add-extra", isLecturer, addExtraLecture);
router.put("/cancel/range", isLecturer, cancelRangeOfTimeSlots);

module.exports = router;
