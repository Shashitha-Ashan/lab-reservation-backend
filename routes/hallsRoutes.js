const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");

const {
  getHalls,
  createHall,
  updateHall,
  deleteHall,
} = require("../controllers/hallsController");
router.use(isAdmin);

router.get("/", getHalls);
router.post("/", createHall);
router.patch("/:id", updateHall);
router.delete("/:id", deleteHall);

module.exports = router;
