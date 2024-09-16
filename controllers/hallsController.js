const mongoose = require("mongoose");
const Hall = require("../models/hallModel");

const addHall = async (req, res) => {
  const { hallName, NOSeats, hallType } = req.body;
  console.log(req.body);
  const newHall = new Hall({
    hallName,
    NOSeats,
    hallType,
  });
  try {
    await newHall.save();
    res.status(201).json({ message: "Hall added successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const deleteHall = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No hall with that id");
  await Hall.findByIdAndRemove(id);
  res.json({ message: "Hall deleted successfully" });
};
const getHalls = async (req, res) => {
  try {
    const halls = await Hall.find();
    res.status(200).json(halls);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const updateHall = async (req, res) => {
  const { id } = req.params;
  const { hallName, NOSeats } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No hall with that id");
  const updatedHall = {
    hallName,
    NOSeats,
    _id: id,
  };
  await Hall.findByIdAndUpdate(id, updatedHall, { new: true });
  res.json(updatedHall);
};

module.exports = { addHall, deleteHall, getHalls, updateHall };
