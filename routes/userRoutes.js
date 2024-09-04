const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  login,
  register,
  getUsercredintials,
  verifyUser,
  addUserFromAdmin,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getUsercredintials);
router.post("/verify", verifyToken, isAdmin, verifyUser);
router.post("/add", verifyToken, isAdmin, addUserFromAdmin);

module.exports = router;
