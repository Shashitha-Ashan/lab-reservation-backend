const isUniversityEmail = (email) => {
  const emailParts = email.split("@");
  if (emailParts[1] === "fot.sjp.ac.lk" || emailParts[1] === "sjp.ac.lk") {
    return true;
  }
  return false;
};
const isStudentEmail = (email) => {
  const emailParts = email.split("@");
  if (emailParts[1] === "fot.sjp.ac.lk") {
    return true;
  }
  return false;
};
const getAcademicYear = (email) => {
  const emailParts = email.split("@");
  if (emailParts[1] === "fot.sjp.ac.lk") {
    const yearSecondPotion = emailParts[0].substring(3, 5);
    const yearFirstPotion = parseInt(emailParts[0].substring(3, 5)) - 1;
    return yearFirstPotion + "/" + yearSecondPotion;
  }
  return null;
};

module.exports = { isUniversityEmail, isStudentEmail, getAcademicYear };
