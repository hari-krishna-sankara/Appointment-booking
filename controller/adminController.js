const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

// GET ALL USERS
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

// GET ALL DOCTORS
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors data fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error,
    });
  }
};

// CHANGE DOCTOR STATUS (Approve/Reject)
const changeDoctorStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });

    const user = await userModel.findOne({ _id: doctor.userId });

    const notification = {
      type: "doctor-status-change",
      message: `Your doctor application has been ${status}`,
      onClickPath: "/notification",
    };

    user.notification.push(notification);

    if (status === "approved") {
      user.isDoctor = true;
    } else {
      user.isDoctor = false;
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "Doctor status updated",
      data: doctor,
    });
  } catch (error) {
    console.error("Error changing doctor status:", error);
    res.status(500).send({
      success: false,
      message: "Error while updating doctor status",
      error,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllDoctorsController,
  changeDoctorStatusController,
};
