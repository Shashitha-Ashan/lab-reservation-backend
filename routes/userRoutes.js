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
  getLecturers,
  forgetPassword,
  resetPassword,
  passwordConfirmation,
} = require("../controllers/userController");
const { isAdmin } = require("../middlewares/verifyAdmin");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getUsercredintials);
router.post("/verify", verifyToken, isAdmin, verifyUser);
router.post("/add", verifyToken, isAdmin, addUserFromAdmin);
router.get("/confirm/:token", userConfirmation);
router.get("/users", verifyToken, isAdmin, getUsers);
router.get("/lecturers", verifyToken, isAdmin, getLecturers);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", verifyToken, resetPassword);
router.post("/password-confirmation", verifyToken, passwordConfirmation);

module.exports = router;
