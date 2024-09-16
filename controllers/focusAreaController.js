const FocusArea = require("../models/focusAreaModel");
const mongoose = require("mongoose");

const addNewFocusArea = async (req, res) => {
  const { focusAreaName, departmentId } = req.body;
  const existingFocusArea = await FocusArea.findOne({ name: focusAreaName });
  if (existingFocusArea) {
    return res.status(409).json({ message: "Focus area already exists" });
  }
  const newFocusArea = new FocusArea({
    name: focusAreaName,
    department: departmentId,
  });
  try {
    await newFocusArea.save();
    res.status(201).json({ message: "Focus area added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFocusArea = async (req, res) => {
  const { id } = req.params;
  const { focusAreaName } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No focus area with that id");
  }
  await FocusArea.findByIdAndUpdate(id, { focusAreaName });
  res.json({ message: "Focus area updated successfully" });
};

const deleteFocusArea = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No focus area with that id");
  await FocusArea.findByIdAndRemove(id);
  res.json({ message: "Focus area deleted successfully" });
};

const getFocusAreas = async (req, res) => {
  try {
    const { departmentId } = req.body;
    if (departmentId) {
      const focusAreas = await FocusArea.find({ department: departmentId });
      return res.json(focusAreas);
    }

    res.status(404).json({ message: "No focus areas found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllFocusAreas = async (req, res) => {
  try {
    const focusAreas = await FocusArea.find().populate(
      "department",
      (select = "name")
    );
    const sendData = focusAreas.map((focusArea) => {
      return {
        id: focusArea._id,
        name: focusArea.name,
        department: focusArea.department.name,
      };
    });
    res.json(sendData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addNewFocusArea,
  updateFocusArea,
  deleteFocusArea,
  getFocusAreas,
  getAllFocusAreas,
};
