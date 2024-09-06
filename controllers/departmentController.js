const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No department with that id");
  const department = await Department.findById(id);
  res.json(department);
};

const createDepartment = async (req, res) => {
  const { departmentName } = req.body;
  const existingDepartment = await Department.findOne({ departmentName });
  if (existingDepartment) {
    return res.status(409).json({ message: "Department already exists" });
  }
  const newDepartment = new Department({ departmentName });
  try {
    await newDepartment.save();
    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { departmentName } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No department with that id");
  }
  await Department.findByIdAndUpdate(id, { departmentName });
  res.json({ message: "Department updated successfully" });
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No department with that id");
  await Department.findByIdAndRemove(id);
  res.json({ message: "Department deleted successfully" });
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
