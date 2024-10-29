const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminUserModel");
const UserModel = require("../models/userModel");
const TimeTableSlot = require("../models/timeTableSlotModel");

const {
  sendNotificationToAll,
  sendNotificationByStudentFocusArea,
  sendNotificationByStudentYear,
  sendNotificationToAllLecturers,
  sendNotificationToAllStudents,
  sendNotificationToIndividual,
} = require("../utils/services/notificationService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const password = genarateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, role: "admin" });
    await admin.save();
    res.json({ message: "Admin added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const genarateRandomPassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    await Admin.findOneAndDelete({ email });
    res.json({ message: "Admin removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUsercredintials = async (req, res) => {
  try {
    await Admin.findById(req.user._id);
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const selfRegister = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      email,
      password: hashedPassword,
      role: "admin",
      username,
    });
    await admin.save();
    res.json({ message: "Admin added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await Admin.findOne ({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email" });
//     }
//     const password = genarateRandomPassword();
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await Admin.findByIdAndUpdate(user._id, { password: hashedPassword });
//     res.json({ message: "Password updated successfully" });
//   }
//   catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
const removeStudentBatch = async (req, res) => {
  try {
    const { academicYear } = req.body;
    await UserModel.deleteMany({ academicYear });
    res.status(200).json({ message: "Batch removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectRescheduleOrCancellation = async (req, res) => {
  try {
    const { id } = req.body;
    const timeSlot = await TimeTableSlot.findById(id);
    timeSlot.slotStatus = "rejected";
    await timeSlot.save();
    const userId = timeSlot.lecturer;
    rejectRescheduleOrCancellationNotificationRequest(userId);

    res.status(200).json({ message: "Time slot status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const approveRescheduleOrCancellation = async (req, res) => {
  try {
    const { id } = req.body;
    const timeSlot = await TimeTableSlot.findById(id);
    timeSlot.slotStatus = "approved";
    await timeSlot.save();

    const year = timeSlot.populate("module").year;
    const userId = timeSlot.lecturer;
    await approveRescheduleOrCancellationNotificationRequest(userId);
    if (timeSlot.slot_type === "cancelled") {
      await cancellationNotificationRequest(year);
    } else {
      await rescheduleNotificationRequest(year);
    }

    res.status(200).json({ message: "Time slot status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancellationNotificationRequest = async (year) => {
  const title = "Cancellation Notification";
  const body = `The module has been cancelled on ${timeSlot.date} from ${timeSlot.start_time} to ${timeSlot.end_time}`;
  await sendNotificationByStudentYear(title, body, year);
};
const rescheduleNotificationRequest = async (year) => {
  const title = "Reschedule Notification";
  const body = `The module has been rescheduled on ${timeSlot.date} from ${timeSlot.start_time} to ${timeSlot.end_time}`;
  await sendNotificationByStudentYear(title, body, year);
};
const rejectRescheduleOrCancellationNotificationRequest = async (userId) => {
  const title = "Reschedule/Cancellation Notification";
  const body = `The reschedule/cancellation request has been rejected for the module on ${timeSlot.date} from ${timeSlot.start_time} to ${timeSlot.end_time}`;
  await sendNotificationToIndividual(title, body, userId);
};
const approveRescheduleOrCancellationNotificationRequest = async (userId) => {
  const title = "Reschedule/Cancellation Notification";
  const body = `The reschedule/cancellation request has been approved for the module on ${timeSlot.date} from ${timeSlot.start_time} to ${timeSlot.end_time}`;
  await sendNotificationToIndividual(title, body, userId);
};
const getAllAdminUsers = async (req, res) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  login,
  addAdmin,
  removeAdmin,
  getUsercredintials,
  selfRegister,
  removeStudentBatch,
  rejectRescheduleOrCancellation,
  approveRescheduleOrCancellation,
  getAllAdminUsers,
};
