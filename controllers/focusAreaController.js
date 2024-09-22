const FocusArea = require("../models/focusAreaModel");
const mongoose = require("mongoose");
const User = require("../models/userModel");

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
    const dep = req.user.department;
    if (req.user.role === "lecturer") {
      return res.status(200).json({ focusAreas: [] });
    }
    if (dep) {
      const focusAreas = await FocusArea.find().populate({
        path: "department",
        match: { name: dep },
      });

      const filteredFocusAreas = focusAreas.filter(
        (focusArea) => focusArea.department !== null
      );
      return res.status(200).json({ focusAreas: filteredFocusAreas });
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
const updateUserFocusArea = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No focus area with that id");
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("No user with that id");
    }
    user.focusArea = _id;
    await user.save();
    res.json({ message: "Focus area updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getFocusAreasBydepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    if (departmentId === "all") {
      const focusAreas = await FocusArea.find();
      return res.status(200).json(focusAreas);
    }
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(404).send("No department with that id");
    }

    const focusAreas = await FocusArea.find({ department: departmentId });
    res.status(200).json(focusAreas);
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
  updateUserFocusArea,
  getFocusAreasBydepartment,
};
