const UserModuleSchema = new mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  sessions: [{ type: mongoose.Types.ObjectId, ref: "TimeTableSlot",}],
});
