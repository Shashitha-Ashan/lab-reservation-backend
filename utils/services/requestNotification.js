const RequestNotification = require("../../models/requestNotificationModel");

const sendCancelRequestNotifcationToAdmin = async (request) => {
  const notification = new RequestNotification({
    userId: request.userId,
    message: `User ${request.userId} has canceled request ${request._id}`,
    timeSlot: request.timeSlotId,
  });
  await notification.save();
};
const sendRescheduleRequestNotifcationToAdmin = async (request) => {
  const notification = new RequestNotification({
    userId: request.userId,
    message: `User ${request.userId} has rescheduled request ${request._id}`,
    timeSlot: request.timeSlotId,
  });
  await notification.save();
};

const sendExtraRequestNotifcationToAdmin = async (request) => {
  const notification = new RequestNotification({
    userId: request.userId,
    message: `User ${request.userId} has requested extra time for request ${request._id}`,
    timeSlot: request.timeSlotId,
  });
  await notification.save();
};

module.exports = {
  sendCancelRequestNotifcationToAdmin,
  sendRescheduleRequestNotifcationToAdmin,
  sendExtraRequestNotifcationToAdmin,
};
