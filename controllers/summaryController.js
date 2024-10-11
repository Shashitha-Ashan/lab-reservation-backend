const TimeTableSlot = require("../models/timeTableSlotModel");

const getLecturerSummary = async (lecturerId) => {
  const summary = await TimeTableSlot.aggregate([
    {
      $match: {
        lecturer: lecturerId,
        slot_type: { $in: ["reschaduled", "cancelled", "ordinary"] },
      },
    },
    {
      $addFields: {
        dateObject: {
          $dateFromString: {
            dateString: "$date",
            format: "%Y-%m-%d",
          },
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$dateObject" },
          year: { $year: "$dateObject" },
          slot_type: "$slot_type",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          month: "$_id.month",
          year: "$_id.year",
        },
        summary: {
          $push: {
            slot_type: "$_id.slot_type",
            count: "$count",
          },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  return summary;
};

const getLecturerFullSummary = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    const summary = await getLecturerSummary(lecturerId);

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLecturerFullSummary };
