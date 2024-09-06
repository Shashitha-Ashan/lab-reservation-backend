const express = require("express");
const router = express.Router();

const {
  addNewFocusArea,
  deleteFocusArea,
  getFocusAreas,
  updateFocusArea,
} = require("../controllers/focusAreaController");

router.get("/", getFocusAreas);
router.post("/", addNewFocusArea);
router.put("/:id", updateFocusArea);
router.delete("/:id", deleteFocusArea);

module.exports = router;
