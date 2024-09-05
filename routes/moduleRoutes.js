const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/verifyAdmin");
const {
  getModules,
  addNewModule,
  updateModule,
  deleteModule,
} = require("../controllers/moduleController");

router.use(verifyToken);
router.use(isAdmin);

router.get("/", getModules);
router.post("/", addNewModule);
router.post("/:id", updateModule);
router.delete("/:id", deleteModule);

module.exports = router;
