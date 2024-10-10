const Module = require("../models/moduleModel");
const mongoose = require("mongoose");
const { getDepartmentIdByName } = require("../utils/helpers/departmentHelper");
const {
  getFocusAreaIdByName,
  isFocusAreaMatchDepartment,
} = require("../utils/helpers/focusAreasHelper");

const addNewModule = async (req, res) => {
  const {
    moduleCode,
    moduleName,
    semester,
    academicYear,
    NOHours,
    department,
    focusArea,
  } = req.body;
  console.log(req.body);
  const existingModule = await Module.findOne({ moduleCode });
  if (existingModule) {
    return res.status(409).json({ message: "Module already exists" });
  }

  const newModule = new Module({
    moduleCode,
    moduleName,
    semester,
    NOHours,
    department,
    focusArea,
    year: academicYear,
  });

  try {
    await newModule.save();
    res.status(201).json({ message: "Module added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteModule = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No module with that id");
  await Module.findByIdAndRemove(id);
  res.json({ message: "Module deleted successfully" });
};
const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const updateModule = async (req, res) => {
  const { id } = req.params;
  const {
    moduleCode,
    moduleName,
    semester,
    academicYear,
    NOHours,
    focusArea,
    department,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No module with that id");
  }

  const existingModule = await Module.findOne({ moduleCode });
  if (existingModule) {
    return res.status(409).json({ message: "Module already exists" });
  }
  const updatedModule = {
    moduleCode,
    moduleName,
    semester,
    academicYear,
    NOHours,
    focusArea,
    department,
    _id: id,
  };
  await Module.findByIdAndUpdate(id, updatedModule, { new: true });
  res.json({ message: "Module updated successfully" });
};

const getModule = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No module with that id");
  const module = await Module.findById(id);
  res.json(module);
};
// TODO: check whether department and focus area mached
const addBulkModules = async (req, res) => {
  let modules = req.body;
  try {
    const depIds = await getDepatmentsIds(
      modules.map((module) => module.department)
    );
    const focusAreaIds = await getFocuAreasIds(
      modules.map((module) => module.focusArea)
    );
    for (let i = 0; i < modules.length; i++) {
      modules[i].department = depIds[i];
    }
    for (let i = 0; i < modules.length; i++) {
      modules[i].focusArea = focusAreaIds[i];
    }
    await Module.insertMany(modules);
    res.status(201).json({ message: "Modules added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getDepatmentsIds = async (departments) => {
  try {
    let departmentIds = [];
    for (let i = 0; i < departments.length; i++) {
      const department = await getDepartmentIdByName(departments[i]);
      departmentIds.push(department);
    }
    return departmentIds;
  } catch (error) {
    throw new Error(error);
  }
};
const getFocuAreasIds = async (focusAreas) => {
  try {
    let focusAreaIds = [];
    for (let i = 0; i < focusAreas.length; i++) {
      const focusArea = await getFocusAreaIdByName(focusAreas[i]);
      focusAreaIds.push(focusArea);
    }
    return focusAreaIds;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  addNewModule,
  deleteModule,
  getModules,
  updateModule,
  getModule,
  addBulkModules,
};
