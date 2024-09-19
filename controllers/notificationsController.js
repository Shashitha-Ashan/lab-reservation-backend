const User = require("../models/userModel");
const Module = require("../models/moduleModel");
const DeviceId = require("../models/deviceIdsModel");
const {
  sendBulkNotification,
} = require("../utils/helpers/sendNotificationHelper");

const sendRescheduleNotificationToStudents = async (
  moduleId,
  newDate,
  startTime,
  endTime
) => {
  let deviceIds = [];
  const students = await getStudentsByModuleId(moduleId);
  const DeviceIds = await DeviceId.find({ userId }).populate({
    path: "userId",
    match: { role: "student" },
  });
  deviceIds = DeviceIds.map((device) => device.deviceId);
  const title = "Reschedule Notification";
  const body = `The module has been rescheduled to ${newDate} from ${startTime} to ${endTime}`;
  await sendBulkNotification(deviceIds, title, body);
};
const getStudentsByModuleId = async (_id) => {
  const module = await Module.findById(_id);
  const students = await User.find({
    role: "student",
    academicYear: module.academicYear,
    department: module.department,
  });
  return students;
};
const sendCancellationNotificationToStudents = async (moduleId) => {
  let deviceIds = [];
  const students = await getStudentsByModuleId(moduleId);
  const DeviceIds = await DeviceId.find({ userId: { $in: students } });
  deviceIds = DeviceIds.map((device) => device.deviceId);
  const title = "Cancellation Notification";
  const body = `The module has been cancelled`;
  await sendBulkNotification(deviceIds, title, body);
};

const sendCancellationNotificationToLectures = async () => {
  let deviceIds = [];
  const lectures = await User.find({ role: "lecturer" });
  const DeviceIds = await DeviceId.find({ userId: { $in: lectures } });
  deviceIds = DeviceIds.map((device) => device.deviceId);
  const title = "Cancellation Notification";
  const body = `The module has been cancelled`;
  await sendBulkNotification(deviceIds, title, body);
};
const sendNotificationToAll = async (req, res) => {
  try {
    const { title, body } = req.body;
    let deviceIds = [];
    const devices = await DeviceId.find();
    console.log(devices.length);
    // deviceIds = devices.map((device) => device.deviceId);
    await sendBulkNotification(deviceIds, title, body);

    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sendNotificationToStudents = async (req, res) => {
  try {
    const { title, body } = req.body;
    let deviceIds = [];
    const students = await User.find({ role: "student" });
    const DeviceIds = await DeviceId.find({ userId: { $in: students } });
    deviceIds = DeviceIds.map((device) => device.deviceId);
    await sendBulkNotification(deviceIds, title, body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const sendNotificationToLectures = async (req, res) => {
  try {
    const { title, body } = req.body;
    let deviceIds = [];
    const lectures = await User.find({ role: "lecturer" });
    const DeviceIds = await DeviceId.find({ userId: { $in: lectures } });
    deviceIds = DeviceIds.map((device) => device.deviceId);
    await sendBulkNotification(deviceIds, title, body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  sendRescheduleNotificationToStudents,
  sendCancellationNotificationToStudents,
  sendNotificationToAll,
  sendNotificationToStudents,
  sendNotificationToLectures,
};
