const FocusArea = require("../../models/FocusArea");

const getFocusAreaIdByName = async (name) => {
  const focusArea = await FocusArea.findOne({ name });
  if (!focusArea) {
    throw new Error("Focus Area not found");
  }
  return focusArea._id;
};
const isFocusAreaMatchDepartment = async (focusAreaId, departmentName) => {
  const focusArea = await FocusArea.findById(focusAreaId);
  if (!focusArea) {
    throw new Error("Focus Area not found");
  }
  return focusArea.department.equals(departmentId);
};

module.exports = { getFocusAreaIdByName, isFocusAreaMatchDepartment };
