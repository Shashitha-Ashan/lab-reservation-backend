const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");
const {
  getModules,
  addNewModule,
  updateModule,
  deleteModule,
  getModule,
  addBulkModules,
} = require("../controllers/moduleController");

router.use(isAdmin);

router.get("/", getModules);
router.post("/", addNewModule);
router.post("/:id", updateModule);
router.delete("/:id", deleteModule);
router.get("/:id", getModule);
router.post("/add/bulk", addBulkModules);

module.exports = router;
