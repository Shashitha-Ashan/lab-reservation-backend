const validator = require("validator");

const isUniversityEmail = (email) => {
  return (
    (validator.isEmail(email) && email.endsWith("@fot.sjp.ac.lk")) ||
    email.endsWith("@sjp.ac.lk")
  );
};
const isStudentEmail = (email) => {
  return validator.isEmail(email) && email.endsWith("@fot.sjp.ac.lk");
};
const getAcademicYear = (email) => {
  const emailParts = email.split("@");
  if (validator.isEmail(email) && email.endsWith("@fot.sjp.ac.lk")) {
    const yearSecondPotion = emailParts[0].substring(3, 5);
    const yearFirstPotion = parseInt(emailParts[0].substring(3, 5)) - 1;
    return yearFirstPotion + "/" + yearSecondPotion;
  }
  return null;
};
const getDepartment = (email) => {
  const emailParts = email.split("@");
  if (emailParts[1] === "fot.sjp.ac.lk") {
    return emailParts[0].substring(0, 3).toLowerCase();
  }
  return null;
};

module.exports = {
  isUniversityEmail,
  isStudentEmail,
  getAcademicYear,
  getDepartment,
};
