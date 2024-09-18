const TimeTableSlot = require("../models/timeTableSlotModel");
const Hall = require("../models/hallModel");
const RescheduleModule = require("../models/reschaduleModule");
const Module = require("../models/moduleModel");
const {
  getYearByStudentAcademicYear,
} = require("../utils/helpers/academicYearHelper");

const {
  sendRescheduleNotificationToStudents,
  sendCancellationNotificationToStudents,
} = require("./notificationsController");

const getTodayTimeSlots = async (req, res) => {
  try {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    console.log(todayDate);
    if (req.user.role === "student") {
      const studentYear = await getYearByStudentAcademicYear(
        req.user.academicYear
      );
      const timeSlots = await TimeTableSlot.find({
        date: todayDate,
      })
        .populate({
          path: "module",
          match: {
            year: studentYear,
          },
          select: { moduleCode: 1, moduleName: 1, year: 1 },
          populate: {
            path: "department",
            match: { name: req.user.department },
            select: "name",
          },
          populate: {
            path: "focusArea",
            select: "name",
          },
        })
        .populate({ path: "lecturer", select: "name" })
        .populate({ path: "hall", select: "hallName" })
        .exec();
      const filteredTimeSlots = timeSlots.filter(
        (slot) => slot.module !== null && slot.module.department !== null
      );
      const acsendingOrderesSlotsByTime = filteredTimeSlots.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      return res.status(200).json({ timeSlots: acsendingOrderesSlotsByTime });
    }
    if (req.user.role === "lecturer") {
      const timeSlots = await TimeTableSlot.find({
        date: todayDate,
        lecturer: req.user.id,
      })
        .populate({
          path: "module",
          select: { moduleCode: 1, moduleName: 1, year: 1 },
          populate: {
            path: "department",
            select: "name",
          },
          populate: {
            path: "focusArea",
            select: "name",
          },
        })
        .populate({ path: "lecturer", select: "name" })
        .populate({ path: "hall", select: "hallName" })
        .exec();
      const filteredTimeSlots = timeSlots.filter(
        (slot) => slot.module !== null && slot.module.department !== null
      );
      const acsendingOrderesSlotsByTime = filteredTimeSlots.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      return res.status(200).json({ timeSlots: acsendingOrderesSlotsByTime });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTimeSlot = async (req, res) => {
  try {
    let {
      startDate,
      start_time,
      end_time,
      module,
      lecturer,
      hall,
      sessionType,
    } = req.body;
    startDate = new Date(startDate);
    start_time = new Date(start_time);
    end_time = new Date(end_time);

    const moduleNumberOfHours = await getModuleNumberOfHours(module);
    const timeSlotDuration = (end_time - start_time) / (1000 * 60 * 60);
    const numberOfWeeks = Math.ceil(moduleNumberOfHours / timeSlotDuration);

    const dates = Array.from({ length: numberOfWeeks }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i * 7);
      return date.toISOString().split("T")[0];
    });

    const timeSlots = dates.map((date) => ({
      date,
      start_time: date + "T" + start_time.toISOString().split("T")[1],
      end_time: date + "T" + end_time.toISOString().split("T")[1],
      module,
      lecturer,
      hall,
      slot_type: "ordinary",
      sessionType,
    }));
    await TimeTableSlot.insertMany(timeSlots);
    res.status(201).json({ message: "Time slot added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getModuleNumberOfHours = async (id) => {
  try {
    const module = await Module.findById(id);
    return module.NOHours;
  } catch (error) {
    console.error(error);
  }
};

const deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await TimeSlot.findByIdAndDelete(id);

    res.status(200).json({ message: "Time slot deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const editTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, start_time, end_time, module, lecturer, hall } =
      req.body;
    startDate = new Date(startDate);
    const moduleNumberOfHours = getModuleNumberOfHours(module);
    const timeSlotDuration = new Date(end_time) - new Date(start_time);
    const numberOfWeeks = moduleNumberOfHours / timeSlotDuration;

    for (let i = 0; i < numberOfWeeks; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      const timeSlot = await TimeSlot.findById(id);
      timeSlot.date = date;
      timeSlot.start_time = start_time;
      timeSlot.end_time = end_time;
      timeSlot.module = module;
      timeSlot.lecturer = lecturer;
      timeSlot.hall = hall;
      await timeSlot.save();
    }

    res.status(200).json({ message: "Time slot edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const rescheduleTimeSlot = async (req, res) => {
  try {
    const { id, newDate, start_time, end_time } = req.body;
    const reschedule_by = req.user._id;
    const timeSlot = await TimeTableSlot.findById(id);
    timeSlot.slot_type = "rescheduled";
    timeSlot.date = newDate;
    timeSlot.start_time = start_time;
    timeSlot.end_time = end_time;
    await timeSlot.save();

    const newRescheduleModule = new RescheduleModule({
      reschedule_by,
      time_slot: timeSlot._id,
    });
    await newRescheduleModule.save();

    // await sendRescheduleNotificationToStudents(
    //   timeSlot.module,
    //   newDate,
    //   start_time,
    //   end_time
    // );
    res.status(200).json({ message: "Time slot rescheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const cancelTimeSlot = async (req, res) => {
  try {
    const { id } = req.body;
    const timeSlot = await TimeTableSlot.findById(id);
    timeSlot.slot_type = "cancelled";
    await timeSlot.save();
    // await sendCancellationNotificationToStudents(timeSlot);
    res.status(200).json({ message: "Time slot cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const searchFreeSlots = async (req, res) => {
  try {
    let { date, startTime, endTime, capacity, slotType } = req.body;
    if (!date || !startTime || !endTime || !capacity || !slotType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    slotType = slotType.toLowerCase();
    const startDateTime = new Date(date + "T" + startTime.split("T")[1]);
    const endDateTime = new Date(date + "T" + endTime.split("T")[1]);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date/time format" });
    }

    if (startDateTime > endDateTime) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time" });
    }
    const startTimeISO = startDateTime.toISOString();
    const endTimeISO = endDateTime.toISOString();

    const timeSlots = await TimeTableSlot.find({
      date: date,
      $or: [
        { start_time: { $lt: endTimeISO }, end_time: { $gt: startTimeISO } },
      ],
      $or: [{ slot_type: "ordinary" }, { slot_type: "extra" }],
    });

    const bookedHalls = timeSlots.map((timeSlot) => timeSlot.hall);

    const freeHalls = await Hall.find({
      _id: { $nin: bookedHalls },
      NOSeats: { $gte: capacity },
      hallType: slotType,
    });
    const closetSlots = freeHalls.sort((a, b) => a.NOSeats - b.NOSeats);
    res.status(200).json({ avaiable: closetSlots[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const formatDate = (dateString) => {
  let [year, month, day] = dateString.split("-");
  month = month.padStart(2, "0");
  day = day.padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getSelectedDateTimeSlots = async (req, res) => {
  try {
    const { selectedDate } = req.body;
    const date = formatDate(selectedDate);
    if (req.user.role === "student") {
      const studentYear = await getYearByStudentAcademicYear(
        req.user.academicYear
      );
      const timeSlots = await TimeTableSlot.find({
        date: date,
      })
        .populate({
          path: "module",
          match: {
            year: studentYear,
          },
          select: { moduleCode: 1, moduleName: 1, year: 1 },
          populate: {
            path: "department",
            match: { name: req.user.department },
            select: "name",
          },
          populate: {
            path: "focusArea",
            select: "name",
          },
        })
        .populate({ path: "lecturer", select: "name" })
        .populate({ path: "hall", select: "hallName" })
        .exec();
      const filteredTimeSlots = timeSlots.filter(
        (slot) => slot.module !== null && slot.module.department !== null
      );
      const acsendingOrderesSlotsByTime = filteredTimeSlots.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      return res.status(200).json({ timeSlots: acsendingOrderesSlotsByTime });
    }
    if (req.user.role === "lecturer") {
      const timeSlots = await TimeTableSlot.find({
        date: date,
        lecturer: req.user.id,
      })
        .populate({
          path: "module",
          select: { moduleCode: 1, moduleName: 1, year: 1 },
          populate: {
            path: "department",
            select: "name",
          },
          populate: {
            path: "focusArea",
            select: "name",
          },
        })
        .populate({ path: "lecturer", select: "name" })
        .populate({ path: "hall", select: "hallName" })
        .exec();
      const filteredTimeSlots = timeSlots.filter(
        (slot) => slot.module !== null && slot.module.department !== null
      );
      const acsendingOrderesSlotsByTime = filteredTimeSlots.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      return res.status(200).json({ timeSlots: acsendingOrderesSlotsByTime });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getRescheduleModules = async (req, res) => {
  try {
    if (req.user.role === "student") {
      const studentYear = await getYearByStudentAcademicYear(
        req.user.academicYear
      );
      const timeSlots = await TimeTableSlot.find({
        slot_type: { $in: ["rescheduled", "cancelled", "extra"] },
      })
        .populate({
          path: "module",
          match: {
            year: studentYear,
          },
          select: { moduleCode: 1, moduleName: 1, year: 1 },
          populate: {
            path: "department",
            match: { name: req.user.department },
            select: "name",
          },
          populate: {
            path: "focusArea",
            select: "name",
          },
        })
        .populate({ path: "lecturer", select: "name" })
        .populate({ path: "hall", select: "hallName" })
        .exec();
      const filteredTimeSlots = timeSlots.filter(
        (slot) => slot.module !== null && slot.module.department !== null
      );
      const acsendingOrderesSlotsByTime = filteredTimeSlots.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      return res.status(200).json({ timeSlots: acsendingOrderesSlotsByTime });
    }
    if (req.user.role === "lecturer") {
      const timeSlots = await TimeTableSlot.find({
        slot_type: { $in: ["reschaduled", "cancelled", "extra"] },
        lecturer: req.user.id,
      })
        .populate({
          path: "module",
          select: { moduleCode: 1, moduleName: 1, year: 1 },
          populate: {
            path: "department",
            select: "name",
          },
          populate: {
            path: "focusArea",
            select: "name",
          },
        })
        .populate({ path: "lecturer", select: "name" })
        .populate({ path: "hall", select: "hallName" })
        .exec();
      const filteredTimeSlots = timeSlots.filter(
        (slot) => slot.module !== null && slot.module.department !== null
      );
      const acsendingOrderesSlotsByTime = filteredTimeSlots.sort((a, b) => {
        return new Date(a.start_time) - new Date(b.start_time);
      });
      return res.status(200).json({ timeSlots: acsendingOrderesSlotsByTime });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const addExtraLecture = async (req, res) => {
  try {
    const { date, start_time, end_time, module, hall } = req.body;
    const newTimeSlot = new TimeTableSlot({
      date,
      start_time,
      end_time,
      module,
      lecturer: req.user._id,
      hall,
      slot_type: "extra",
    });
    await newTimeSlot.save();

    res.status(201).json({ message: "Extra lecture added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const cancelRangeOfTimeSlots = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const timeSlots = await TimeTableSlot.find({
      date: { $gte: startDate, $lte: endDate },
      lecturer: req.user._id,
    });
    timeSlots.forEach((timeSlot) => async () => {
      timeSlot.slot_type = "cancelled";
      await timeSlot.save();
    });

    res.status(200).json({ message: "Time slots cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllTimeSlots = async (_, res) => {
  try {
    const timeSlots = await TimeTableSlot.find()
      .populate("module", "moduleCode moduleName")
      .populate("lecturer", "name")
      .populate("hall", "hallName")
      .exec();

    const filterTimeSlots = timeSlots.filter(
      (slot) => slot.module !== null && slot.module.department !== null
    );

    res.status(200).json({ filterTimeSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
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
};
