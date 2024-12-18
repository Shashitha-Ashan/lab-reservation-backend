const express = require("express");
const router = express.Router();

const {
  login,
  addAdmin,
  removeAdmin,
  getUsercredintials,
  selfRegister,
  getAllAdminUsers,
} = require("../controllers/adminController");

const verifyToken = require("../middlewares/verifyToken");
const { superAdmin } = require("../middlewares/verifyRole");
const { isAdmin } = require("../middlewares/verifyAdmin");

router.post("/login", login);
router.post("/add", verifyToken, superAdmin, addAdmin);
router.delete("/remove", verifyToken, superAdmin, removeAdmin);
router.get("/profile", verifyToken, isAdmin, getUsercredintials);
router.post("/selfregister", selfRegister);
router.get("/all", verifyToken, isAdmin, getAllAdminUsers);

module.exports = router;
