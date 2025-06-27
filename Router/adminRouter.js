const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeDoctorStatusController,
} = require("../controllers/adminController");

// @route   GET /api/v1/admin/getAllUsers
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// @route   GET /api/v1/admin/getAllDoctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// @route   POST /api/v1/admin/changeDoctorStatus
router.post(
  "/changeDoctorStatus",
  authMiddleware,
  changeDoctorStatusController
);

module.exports = router;
