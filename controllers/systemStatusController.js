const SystemStatus = require("../models/systemStatusModel");

const getSystemStatus = async (req, res) => {
  try {
    const systemStatus = await SystemStatus.findOne();
    if (systemStatus === null) {
      const newSystemStatus = new SystemStatus();
      await newSystemStatus.save();
      return res.status(200).json({ systemStatus: newSystemStatus });
    }
    if (systemStatus.isUpdating) {
      return res.status(503).json({ message: "System is currently updating" });
    }
    res.status(200).json({ message: "system is working" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSystemStatus = async (req, res) => {
  try {
    const { isUpdating } = req.body;
    const systemStatus = await SystemStatus.findOne();
    systemStatus.isUpdating = isUpdating;
    await systemStatus.save();
    res.status(200).json({ message: "System status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSystemStatus, updateSystemStatus };
