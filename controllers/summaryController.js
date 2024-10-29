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
    const result = await TimeTableSlot.aggregate([
      {
        $lookup: {
          from: "modules",
          localField: "module",
          foreignField: "_id",
          as: "moduleDetails",
        },
      },
      { $unwind: "$moduleDetails" },
      {
        $group: {
          _id: "$moduleDetails.year",
          rescheduledCount: {
            $sum: { $cond: [{ $eq: ["$slot_type", "rescheduled"] }, 1, 0] },
          },
          ordinaryCount: {
            $sum: { $cond: [{ $eq: ["$slot_type", "ordinary"] }, 1, 0] },
          },
          cancelledCount: {
            $sum: { $cond: [{ $eq: ["$slot_type", "cancelled"] }, 1, 0] },
          },
          extraCount: {
            $sum: { $cond: [{ $eq: ["$slot_type", "extra"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({ summary: result });
  } catch (error) {
    console.error("Error in getting session counts by module year:", error);
  }
};

module.exports = { getLecturerFullSummary, getSemesterSummary };
