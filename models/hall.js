const LectureHallSchema = new mongoose.Schema({
  hl_name: { type: String, required: true },
  NO_seats: { type: Number, required: true },
  NO_projectors: { type: Number, required: true, default: 1 },
  // ...
});
