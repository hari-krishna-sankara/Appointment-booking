const User = require("../models/userModel");
const AppointmentModel = require("../models/ApponimentModel");
const Doctor = require("../models/doctorModel"); // ✅ Import doctor model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error during login",
        error: error.message,
      });
  }
};

// ✅ REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error during registration",
        error: error.message,
      });
  }
};

// ✅ AUTH CONTROLLER
const authController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    }

    res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).send({ success: false, message: "Auth error" });
  }
};

// ✅ APPLY DOCTOR CONTROLLER (stub)
const applyDoctorController = async (req, res) => {
  res.status(200).json({ success: true, message: "Apply Doctor (stub)" });
};

// ✅ NOTIFICATIONS STUBS
const getAllNotificationController = (req, res) => {
  res.status(200).send({ success: true, message: "Get notifications (stub)" });
};

const markAllNotificationReadController = (req, res) => {
  res.status(200).send({ success: true, message: "Mark all as read (stub)" });
};

const deleteAllReadNotificationController = (req, res) => {
  res.status(200).send({ success: true, message: "Delete all read (stub)" });
};

const markOneNotificationReadController = (req, res) => {
  res.status(200).send({ success: true, message: "Mark one read (stub)" });
};

// ✅ REAL GET ALL DOCTORS CONTROLLER
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" }); // Fetch only approved doctors
    res.status(200).send({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("❌ Get All Doctors Error:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

// ✅ BOOK APPOINTMENT CONTROLLER
const bookAppointmentControllers = async (req, res) => {
  try {
    req.body.status = "pending";
    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();

    const user = await User.findOne({ _id: req.body.userId });
    user.notification.push({
      type: "New-Appointment-request",
      message: `A new appointment request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error: error.message,
    });
  }
};

// ✅ EXPORT CONTROLLERS
module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  markAllNotificationReadController,
  deleteAllReadNotificationController,
  markOneNotificationReadController,
  getAllDoctorsControllers,
  bookAppointmentControllers,
};
