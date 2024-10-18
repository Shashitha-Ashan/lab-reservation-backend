const Department = require("../../models/departmentModel");

const getDepartment = async (departmentId) => {
  return await Department.findById(departmentId);
};
const getDepartmentIdByName = async (departmentName) => {
  const department = await Department.findOne({ departmentName });
  if (!department) {
    throw new Error("Department not found");
  }
  return department._id;
};

module.exports = { getDepartment, getDepartmentIdByName };
