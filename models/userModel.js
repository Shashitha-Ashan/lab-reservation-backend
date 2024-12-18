const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uniEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["lecturer", "student", "demonstrator"],
    required: true,
  },
  isVerified: { type: Boolean, default: false, required: true },
  academicYear: {
    type: String,
    required: function () {
      return this.role === "student";
    },
  },
  department: {
    type: String,
    enum: ["ict", "egt", "bst"],
    required: function () {
      return this.role === "student";
    },
  },
  adminConfirmation: {
    type: Boolean,
    default: function () {
      return this.role !== "lecturer";
    },
  },
  focusArea: {
    type: mongoose.Types.ObjectId,
    ref: "FocusArea",
    default: null,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      role: this.role,
      department: this.department,
      email: this.uniEmail,
      academicYear: this.academicYear,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

UserSchema.methods.generateEmailToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
UserSchema.methods.userVerify = function (token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
