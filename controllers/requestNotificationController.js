const RequestNotification = require("../models/requestNotificationModel");

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await RequestNotification.find({
      userId: req.user._id,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await RequestNotification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const notification = await RequestNotification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notification.remove();
    res.json({ message: "Notification removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
};
