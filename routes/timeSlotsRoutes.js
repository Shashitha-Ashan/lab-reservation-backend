const express = require("express");
const router = express.Router();
const {
  getTodayTimeSlots,
  addTimeSlot,
  deleteTimeSlot,
  editTimeSlot,
  rescheduleTimeSlot,
  cancelTimeSlot,
} = require("../controllers/timeSlotsController");
const verifyToken = require("../middleware/verifyToken");
router.use(verifyToken);

router.get("/today", getTodayTimeSlots);
router.post("/add", addTimeSlot);
router.delete("/delete/:id", deleteTimeSlot);
router.put("/edit/:id", editTimeSlot);
router.put("/reschedule/:id", rescheduleTimeSlot);
router.put("/cancel/:id", cancelTimeSlot);

module.exports = router;
