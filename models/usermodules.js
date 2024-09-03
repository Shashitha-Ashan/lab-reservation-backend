const mongoose = require("mongoose");

const UserModuleSchema = new mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  sessions: [{ type: mongoose.Types.ObjectId, ref: "TimeTableSlot",}],
});
module.exports = mongoose.model("UserModule", UserModuleSchema);