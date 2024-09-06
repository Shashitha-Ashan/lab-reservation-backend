const express = require("express");
const router = express.Router();

const {
  addNewDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} = require("../controllers/departmentController");

router.get("/", getDepartments);
router.post("/", addNewDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
