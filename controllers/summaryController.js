const TimeTableSlot = require("../models/timeTableSlotModel");
const mongoose = require("mongoose");

const getLecturerFullSummary = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    const summary = await TimeTableSlot.aggregate([
      {
        $match: {
          lecturer: new mongoose.Types.ObjectId(lecturerId),
        },
      },
      {
        $group: {
          _id: "$slot_type",
          NumberOfSessions: {
            $sum: 1,
          },
        },
      },
    ]);
    if (!summary) {
      return res.status(200).json({ summary: [] });
    }

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSemesterSummary = async (req, res) => {
  try {
    const summary = await TimeTableSlot.aggregate([
      {
        $group: {
          _id: "$slot_type",
          NumberOfSessions: {
            $sum: 1,
          },
        },
      },
    ]);
    if (!summary) {
      return res.status(200).json({ summary: [] });
    }

    return summary;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLecturerFullSummary, getSemesterSummary };
