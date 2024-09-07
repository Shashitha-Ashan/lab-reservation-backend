const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/verifyAdmin");

const {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  updateDepartment,
} = require("../controllers/departmentController");
router.use(isAdmin);
router.get("/", getAllDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
