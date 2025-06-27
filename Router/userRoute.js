const express = require("express");
const router = express.Router();

const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  markAllNotificationReadController,
  deleteAllReadNotificationController,
  markOneNotificationReadController,
  getAllDoctorsControllers, // Plural to match export
  bookAppointmentControllers, // Plural to match export
} = require("../controllers/userControllers");

const authMiddleware = require("../middleware/authMiddleware");

// Validate controllers
const controllers = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  markAllNotificationReadController,
  deleteAllReadNotificationController,
  markOneNotificationReadController,
};

for (const [key, controller] of Object.entries(controllers)) {
  if (typeof controller !== "function") {
    console.error(`Error: ${key} is not a function, got ${typeof controller}`);
    throw new Error(`Controller ${key} is not a function`);
  }
}

// Routes
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, (req, res, next) => {
  console.log("✅ /getUserData route hit");
  return authController(req, res, next);
});
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);
router.post(
  "/mark-all-notification-read",
  authMiddleware,
  markAllNotificationReadController
);
router.post(
  "/delete-all-read-notification",
  authMiddleware,
  deleteAllReadNotificationController
);
router.post(
  "/mark-one-notification-read",
  authMiddleware,
  markOneNotificationReadController
);

// GET ALL DOC
router.get("/getAllDoctors", authMiddleware, getAllDoctorsControllers); // Changed to plural

// Book appointment
router.post("/book-appointment", authMiddleware, bookAppointmentControllers); // Changed to plural

module.exports = router;
