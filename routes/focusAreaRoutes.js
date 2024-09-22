const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");
const {
  addNewFocusArea,
  deleteFocusArea,
  getFocusAreas,
  updateFocusArea,
  getAllFocusAreas,
  updateUserFocusArea,
  getFocusAreasBydepartment,
} = require("../controllers/focusAreaController");

router.get("/selected", getFocusAreas);
router.get("/", isAdmin, getAllFocusAreas);
router.post("/", isAdmin, addNewFocusArea);
router.put("/:id", isAdmin, updateFocusArea);
router.delete("/:id", isAdmin, deleteFocusArea);
router.post("/user", updateUserFocusArea);
router.get("/:departmentId", isAdmin, getFocusAreasBydepartment);

module.exports = router;
