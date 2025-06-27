import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, DatePicker, TimePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const dispatch = useDispatch();

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const getDoctor = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No auth token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/doctor/getDoctorInfoById/${params.doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data);
        setError("");
      } else {
        setError(res.data.message || "Failed to fetch doctor info.");
      }
    } catch (err) {
      setError("Server error while fetching doctor info.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===================== Booking
  const handleBooking = async () => {
    if (!user || !user._id) {
      message.error("User not authenticated. Please log in.");
      return;
    }
    if (!date || !time) {
      message.error("Please select a date and time.");
      return;
    }

    try {
      dispatch(showLoading());
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/book-appointment`,
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message || "Booking failed.");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Booking error:", error);
      message.error("Something went wrong during booking.");
    }
  };

  useEffect(() => {
    getDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Layout>
        <h2>Loading doctor info...</h2>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h2>Error: {error}</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Booking Page</h1>
      {doctor && (
        <div className="container">
          <h2>
            Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <p>
            <b>Specialization:</b> {doctor.specialization}
          </p>
          <p>
            <b>Experience:</b> {doctor.experience} years
          </p>
          <p>
            <b>Consultation Fee:</b> ₹{doctor.feesPerConsultation}
          </p>
          <p>
            <b>Timings:</b> {doctor.timings?.[0]} - {doctor.timings?.[1]}
          </p>

          <div
            className="d-flex flex-column mt-4"
            style={{ maxWidth: "300px" }}
          >
            <DatePicker
              format="DD-MM-YYYY"
              onChange={(value) => setDate(moment(value).format("DD-MM-YYYY"))}
            />
            <TimePicker
              format="HH:mm"
              className="mt-2"
              onChange={(value) => setTime(moment(value).format("HH:mm"))}
            />
            <Button type="primary" className="mt-3">
              Check Availability
            </Button>
            <Button
              type="primary"
              className="mt-3"
              onClick={handleBooking}
              loading={loading}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BookingPage;
