const Doctor = require("../models/doctorModel");

const getDoctorInfoByIdController = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getDoctorInfoByIdController:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor info",
      error,
    });
  }
};

//get post
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: res.body.doctorId });
    res.status(200).send({
      success: true,
      message: "doc info fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error while fetching the doc info",
    });
  }
};
module.exports = { getDoctorInfoByIdController, getDoctorByIdController };
