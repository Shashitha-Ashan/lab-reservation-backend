const TimeTableSlotSchema = new mongoose.Schema({
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  module: { type: mongoose.Types.ObjectId, ref: "Module", required: true },
  lecturer: { type: mongoose.Types.ObjectId, ref: "Lecturer", required: true },
  hall: { type: mongoose.Types.ObjectId, ref: "LectureHall", required: true },
  slot_type: {
    type: String,
    enum: ["reschadule", "extra", "ordinary"],
    required: true,
  },
});
