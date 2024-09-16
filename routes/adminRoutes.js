const express = require("express");
const router = express.Router();

const {
  login,
  addAdmin,
  removeAdmin,
  getUsercredintials,
} = require("../controllers/adminController");

const verifyToken = require("../middlewares/verifyToken");
const { superAdmin } = require("../middlewares/verifyRole");
const { isAdmin } = require("../middlewares/verifyAdmin");

router.post("/login", login);
router.post("/add", verifyToken, superAdmin, addAdmin);
router.delete("/remove", verifyToken, superAdmin, removeAdmin);
router.get("/profile", verifyToken, isAdmin, getUsercredintials);

module.exports = router;
