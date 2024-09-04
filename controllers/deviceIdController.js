const DeviceId = require("../models/deviceIdsModel");

const createOrUpdateDeviceId = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const { _id } = req.user;
    const existingUser = await DeviceId.findOne({ _id });
    if (existingUser) {
      existingUser.deviceId = deviceId;
      await existingDevice.save();
      return res.json({ message: "Device ID updated successfully" });
    }
    const newDevice = new DeviceId({
      deviceId,
      userId: _id,
    });
    await newDevice.save();
    return res.status(200).json({ message: "Device ID created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeDeviceId = async (req, res) => {
  try {
    const { _id } = req.user;
    const existingUser = await DeviceId.findOne({ userId: _id });
    if (!existingUser) {
      return res.status(400).json({ message: "Device ID not found" });
    }
    await existingUser.delete();
    return res.json({ message: "Device ID removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { createOrUpdateDeviceId };
