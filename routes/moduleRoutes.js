const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const {
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");

router.use(verifyToken);
router.use(isAdmin);

router.get("/", getModules);
router.get("/:id", getModule);
router.post("/", createModule);
router.post("/:id", updateModule);
router.delete("/:id", deleteModule);

module.exports = router;
