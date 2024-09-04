const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uniEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "lecturer", "student", "demostrator"],
    required: true,
  },
  isVerified: { type: Boolean, default: false, required: true },
  academicYear: { type: String },
  department: { type: String, enum: ["ict", "egt", "bst"] },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
