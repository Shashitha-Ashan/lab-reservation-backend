const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  login,
  register,
  getUsercredintials,
} = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getUsercredintials);

module.exports = router;
