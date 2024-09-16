const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  login,
  register,
  getUsercredintials,
  verifyUser,
  addUserFromAdmin,
  userConfirmation,
  getUsers,
} = require("../controllers/userController");
const { isAdmin } = require("../middlewares/verifyAdmin");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getUsercredintials);
router.post("/verify", verifyToken, isAdmin, verifyUser);
router.post("/add", verifyToken, isAdmin, addUserFromAdmin);
router.get("/confirm/:token", userConfirmation);
router.get("/users", verifyToken, isAdmin, getUsers);

module.exports = router;
