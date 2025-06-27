const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
const { getDoctorByIdController } = require("../controllers/doctorController");

// @route   GET /api/v1/doctor/getDoctorInfoById/:id
// @desc    Get doctor profile by doctor ID
// @access  Private
router.get("/getDoctorInfoById/:id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   PUT /api/v1/doctor/updateProfile
// @desc    Update doctor profile by logged-in user
// @access  Private
router.put(
  "/updateProfile",
  authMiddleware,
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("specialization").notEmpty().withMessage("Specialization is required"),
    body("experience").notEmpty().withMessage("Experience is required"),
    body("feesPerConsultation")
      .notEmpty()
      .withMessage("Fees per consultation is required")
      .isNumeric()
      .withMessage("Fees must be a number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: errors.array()[0].msg });
    }

    const {
      firstName,
      lastName,
      phone,
      email,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      timings,
    } = req.body;

    try {
      // Use userId instead of _id to find the doctor
      const doctor = await Doctor.findOne({ userId: req.user.id });

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      // Update fields
      doctor.firstName = firstName || doctor.firstName;
      doctor.lastName = lastName || doctor.lastName;
      doctor.phone = phone || doctor.phone;
      doctor.email = email || doctor.email;
      doctor.website = website || doctor.website;
      doctor.address = address || doctor.address;
      doctor.specialization = specialization || doctor.specialization;
      doctor.experience = experience || doctor.experience;
      doctor.feesPerConsultation =
        feesPerConsultation || doctor.feesPerConsultation;
      doctor.timings = timings || doctor.timings;

      const updatedDoctor = await doctor.save();
      res.status(200).json({ success: true, data: updatedDoctor });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// @route   POST /api/v1/doctor/getDoctorById
// @desc    Get doctor by userId
// @access  Private
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

module.exports = router;
