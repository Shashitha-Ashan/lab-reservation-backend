const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");
const {
  addNewFocusArea,
  deleteFocusArea,
  getFocusAreas,
  updateFocusArea,
} = require("../controllers/focusAreaController");

router.use(isAdmin);
router.get("/", getFocusAreas);
router.post("/", addNewFocusArea);
router.put("/:id", updateFocusArea);
router.delete("/:id", deleteFocusArea);

module.exports = router;
