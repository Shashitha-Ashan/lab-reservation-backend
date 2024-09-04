const addNewModule = async (req, res) => {
  const {
    moduleCode,
    moduleName,
    moduleType,
    semester,
    academicYear,
    NOHours,
  } = req.body;

  // Check if moduleCode already exists
  const existingModule = await Module.findOne({ moduleCode });
  if (existingModule) {
    return res.status(409).json({ message: "Module already exists" });
  }

  // Create a new module
  const newModule = new Module({
    moduleCode,
    moduleName,
    moduleType,
    semester,
    academicYear,
    NOHours,
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
    moduleType,
    semester,
    academicYear,
    NOHours,
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
    moduleType,
    semester,
    academicYear,
    NOHours,
    _id: id,
  };
  await Module.findByIdAndUpdate(id, updatedModule, { new: true });
  res.json({ message: "Module updated successfully" });
};
module.exports = {
  addNewModule,
  deleteModule,
  getModules,
  updateModule,
};
