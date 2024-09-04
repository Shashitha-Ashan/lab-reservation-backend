const admin = require("firebase-admin");

const sendBulkNotification = async (tokens, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    tokens,
  };
  try {
    const res = await admin.messaging().sendEachForMulticast(message);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};
const sendIndividualNotification = async (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };
  try {
    const res = await admin.messaging().send(message);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendBulkNotification, sendIndividualNotification };
