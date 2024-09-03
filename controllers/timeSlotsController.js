const getTodayTimeSlots = async (req, res) => {
  try {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const timeSlots = await TimeSlot.find({ date: todayDate });

    res.status(200).json({ timeSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTimeSlot = async (req, res) => {
  if (req.user.role === "student" || req.user.role === "lecturer") {
    return res.status(403).json({ message: "Forbidden" });
  } else {
    try {
      const { startDate, start_time, end_time, module, lecturer, hall } =
        req.body;
      startDate = new Date(startDate);
      const moduleNumberOfHours = getModuleNumberOfHours(module);
      const timeSlotDuration = new Date(end_time) - new Date(start_time);
      const numberOfWeeks = moduleNumberOfHours / timeSlotDuration;

      for (let i = 0; i < numberOfWeeks; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i * 7);
        const newTimeSlot = new TimeSlot({
          date,
          start_time,
          end_time,
          module,
          lecturer,
          hall,
          slot_type: "ordinary",
        });
        await newTimeSlot.save();
      }

      res.status(201).json({ message: "Time slot added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
const getModuleNumberOfHours = async (id) => {
  try {
    const module = await Module.findById(id);
    module.NO_hours;
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
    const { id, newDate, start_time, end_time } = req.params;
    const { reschedule_by } = req.body;
    const timeSlot = await TimeSlot.findById(id);
    timeSlot.slot_type = "rescheduled";
    timeSlot.date = new Date(newDate);
    timeSlot.start_time = start_time;
    timeSlot.end_time = end_time;
    await timeSlot.save();

    const newRescheduleModule = new RescheduleModule({
      reschedule_by,
      time_slot: timeSlot._id,
    });
    await newRescheduleModule.save();

    res.status(200).json({ message: "Time slot rescheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const cancelTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const timeSlot = await TimeSlot.findById(id);
    timeSlot.slot_type = "cancelled";
    await timeSlot.save();

    res.status(200).json({ message: "Time slot cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const searchFreeSlots = async (req, res) => {
  try {
    const { date, startTime, endTime, capacity } = req.body;
    const timeSlots = await TimeSlot.find({
      date: { $eq: date, $gte: startTime, $lte: endTime },
    });

    const bookedHalls = timeSlots.map((timeSlot) => timeSlot.hall);

    const freeHalls = await Hall.find({
      _id: { $nin: bookedHalls, NO_seats: { $gte: capacity } },
    });
    res.status(200).json({ avaiable: freeHalls });
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
};
