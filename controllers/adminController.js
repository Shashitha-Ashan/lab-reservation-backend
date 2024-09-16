const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminUserModel");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.username, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const password = genarateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword, role: "admin" });
    await admin.save();
    res.json({ message: "Admin added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const genarateRandomPassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    await Admin.findOneAndDelete({ email });
    res.json({ message: "Admin removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUsercredintials = async (req, res) => {
  try {
    await Admin.findById(req.user._id);
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { login, addAdmin, removeAdmin, getUsercredintials };
