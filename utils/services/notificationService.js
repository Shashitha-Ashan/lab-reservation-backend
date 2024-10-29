const axios = require("axios");
const api = axios.create({
  baseURL: process.env.NOTIFICATION_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `api-key=${process.env.Notification_API_KEY}`,
  },
});

const sendNotificationToAll = async (title, body) => {
  try {
    const response = await api.post("/sendNotificationToAll", {
      title,
      body,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const sendNotificationToAllLecturers = async (title, body) => {
  try {
    const response = await api.post("/sendNotificationToAllLecturers", {
      title,
      body,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const sendNotificationToAllStudents = async (title, body) => {
  try {
    const response = await api.post("/sendNotificationToAllStudents", {
      title,
      body,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const sendNotificationByStudentYear = async (title, body, year) => {
  try {
    const response = await api.post("/sendNotificationByStudentYear", {
      title,
      body,
      year,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const sendNotificationByStudentFocusArea = async (title, body, focusArea) => {
  try {
    const response = await api.post("/sendNotificationByStudentFocusArea", {
      title,
      body,
      focusArea,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
const sendNotificationToIndividual = async (title, body, userId) => {
  try {
    const response = await api.post("/sendNotificationToIndividual", {
      title,
      body,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  sendNotificationToAll,
  sendNotificationToAllLecturers,
  sendNotificationToAllStudents,
  sendNotificationByStudentYear,
  sendNotificationByStudentFocusArea,
  sendNotificationToIndividual,
};
