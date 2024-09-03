const User = require("../models/User");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Helper functions
const {
  isUniversityEmail,
  isStudentEmail,
  getAcademicYear,
} = require("../utils/helpers");

// Register function
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!isUniversityEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (
      await User.findOne({
        uniEmail: email,
      })
    ) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      uniEmail: email,
      password: hashedPassword,
      role: isStudentEmail(email) ? "student" : "lecturer",
      academicYear: getAcademicYear(email),
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { username, email },
      { new: true }
    );

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsercredintials = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, uniEmail, role, academicYear } = user;

    res.status(200).json({ name, uniEmail, role, academicYear });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
};
const verifyUser = async (req, res) => {
  if (req.user.role === "student" || req.user.role === "lecturer") {
    return res.status(403).json({ message: "Forbidden" });
  } else {
    try {
      const { id } = req.body;
      const user = await User.findByIdAndUpdate(id, { isVerified: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
module.exports = {
  register,
  login,
  updateProfile,
  getUsercredintials,
  verifyUser,
};
