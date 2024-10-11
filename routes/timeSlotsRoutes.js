const express = require("express");
const router = express.Router();
const {
  getTodayTimeSlots,
  addTimeSlot,
  deleteTimeSlot,
  editTimeSlot,
  rescheduleTimeSlot,
  cancelTimeSlot,
  searchFreeSlots,
  getSelectedDateTimeSlots,
  getRescheduleModules,
  addExtraLecture,
  cancelRangeOfTimeSlots,
  getAllTimeSlots,
<<<<<<< HEAD
  getLecturerTimeSlotsByTimeRange,
=======
  getRangeTimeSlots,
>>>>>>> 996892ad705e510ddbfa8830937a50a957750347
} = require("../controllers/timeSlotsController");
const isLecturer = require("../middlewares/verifyLecturer");
const { isAdmin } = require("../middlewares/verifyAdmin");

router.get("/today", getTodayTimeSlots);
router.post("/add", isAdmin, addTimeSlot);
router.delete("/delete/:id", isAdmin, deleteTimeSlot);
router.put("/edit/:id", isAdmin, editTimeSlot);
router.post("/reschedule", isLecturer, rescheduleTimeSlot);
router.post("/cancel", isLecturer, cancelTimeSlot);
router.post("/selectedate", getSelectedDateTimeSlots);
router.get("/reschedule", getRescheduleModules);
router.post("/add-extra", isLecturer, addExtraLecture);
router.post("/cancel/range", isLecturer, cancelRangeOfTimeSlots);
router.post("/search", isLecturer, searchFreeSlots);
router.get("/all", isAdmin, getAllTimeSlots);
<<<<<<< HEAD
router.get("/lecturer/time-range", isLecturer, getLecturerTimeSlotsByTimeRange);
=======
router.post("/range", isLecturer, getRangeTimeSlots);
>>>>>>> 996892ad705e510ddbfa8830937a50a957750347

module.exports = router;
