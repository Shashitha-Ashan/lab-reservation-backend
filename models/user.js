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
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

module.exports = mongoose.model("User", UserSchema);
