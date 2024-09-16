const Module = require("../models/moduleModel");
const mongoose = require("mongoose");

const addNewModule = async (req, res) => {
  const {
    moduleCode,
    moduleName,
    semester,
    academicYear,
    NOHours,
    department,
    focusArea,
    year,
  } = req.body;
  const existingModule = await Module.findOne({ moduleCode });
  if (existingModule) {
    return res.status(409).json({ message: "Module already exists" });
  }

  const newModule = new Module({
    moduleCode,
    moduleName,
    semester,
    academicYear,
    NOHours,
    department,
    focusArea,
    year,
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
  console.log("hari update");
  const { id } = req.params;
  const {
    moduleCode,
    moduleName,
    semester,
    academicYear,
    NOHours,
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

const addBulkModules = async (req, res) => {
  console.log("hari bulk");
  const modules = req.body;
  try {
    await Module.insertMany(modules);
    res.status(201).json({ message: "Modules added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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