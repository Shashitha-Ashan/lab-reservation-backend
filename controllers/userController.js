const User = require("../models/userModel");
const SystemStatus = require("../models/systemStatusModel");
const bcrypt = require("bcrypt");
const { sendConfirmationEmail } = require("../utils/services/emailService");

// Helper functions
const {
  isUniversityEmail,
  isStudentEmail,
  getAcademicYear,
  getDepartment,
} = require("../utils/helpers/academicEmailHelper");

// Register function
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isUniversityEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const alreadyUser = await User.findOne({
      uniEmail: email,
    });
    if (alreadyUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      uniEmail: email,
      password: hashedPassword,
      role: isStudentEmail(email) ? "student" : "lecturer",
      academicYear: getAcademicYear(email),
      department: getDepartment(email),
    });
    await user.save();
    // await sendConfirmationEmail(user.uniEmail, user.generateEmailToken());
    res
      .status(201)
      .json({ message: "User registered successfully please verify email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const systemStatus = await SystemStatus.findOne();
    if (systemStatus.isUpdating) {
      return res.status(503).json({ message: "System is updating" });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ uniEmail: email });
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Email and password are required" });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.isVerified === false) {
      return res.status(401).json({ message: "User not verified" });
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
    const user = await User.findOne({ _id: req.user.id });
    const systemStatus = await SystemStatus.findOne();

    if (systemStatus.isUpdating) {
      return res.status(503).json({ message: "System is updating" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, uniEmail, role, academicYear, department } = user;

    res.status(200).json({ name, uniEmail, role, academicYear, department });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const verifyUser = async (req, res) => {
  try {
    const { id } = req.body;
    await User.findByIdAndUpdate(id, { adminConfirmation: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const userConfirmation = async (req, res) => {
  try {
    if (!req.params.token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const { token } = req.params;
    const decoded = User.userVerify(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.status(200).send("User verified successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addUserFromAdmin = async (req, res) => {
  try {
    const { name, email, role, academicYear } = req.body;
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
    const user = new User({
      name,
      uniEmail: email,
      role,
      academicYear,
    });

    await user.save();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUsers = async (req, res) => {
  try {
    const projectionFields = {
      adminConfirmation: 1,
      focusArea: 1,
      _id: 1,
      name: 1,
      uniEmail: 1,
      role: 1,
      isVerified: 1,
      academicYear: 1,
      department: 1,
    };

    const users = await User.find({}, projectionFields);

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getLecturers = async (req, res) => {
  try {
    const projectionFields = {
      _id: 1,
      name: 1,
      uniEmail: 1,
      role: 1,
      academicYear: 1,
      department: 1,
    };

    const users = await User.find({ role: "lecturer" }, projectionFields);

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ uniEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await sendConfirmationEmail(user.uniEmail, user.generateEmailToken());
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const passwordConfirmation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified === false) {
      return res.status(400).json({ message: "User not verified" });
    }
    if (user.role === "student") {
      return res.status(400).json({ message: "User is a student" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Password confirmed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  register,
  login,
  updateProfile,
  getUsercredintials,
  verifyUser,
  addUserFromAdmin,
  userConfirmation,
  getUsers,
  getLecturers,
  forgetPassword,
  resetPassword,
  passwordConfirmation,
};
