import React, { useEffect, useState, useCallback } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Button } from "antd";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    specialization: "",
    experience: "",
    feesPerConsultation: "",
    timings: { start: "", end: "" },
  });

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getProfileData = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/v1/doctor/getDoctorInfoById/${user.doctorId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setProfile(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      message.error("Something went wrong");
    }
  }, [user?.doctorId]);

  useEffect(() => {
    if (user?.doctorId) {
      getProfileData();
    }
  }, [getProfileData, user?.doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "timings[start]" || name === "timings[end]") {
      setProfile((prev) => ({
        ...prev,
        timings: { ...prev.timings, [name.split("[")[1].split("]")[0]]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put("/api/v1/doctor/updateProfile", profile, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        message.success("Profile updated successfully");
        navigate("/"); // ✅ redirect
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Something went wrong while updating profile");
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h1>Manage Profile</h1>
        <div className="card p-4">
          <div className="row mb-3">
            <div className="col-md-4">
              <label>* First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label>* Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label>* Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>* Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label>Website</label>
              <input
                type="text"
                name="website"
                value={profile.website}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label>* Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>* Specialization</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label>* Experience</label>
              <input
                type="text"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label>* Fees</label>
              <input
                type="number"
                name="feesPerConsultation"
                value={profile.feesPerConsultation}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label>* Timings</label>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="time"
                    name="timings[start]"
                    value={profile.timings.start}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="time"
                    name="timings[end]"
                    value={profile.timings.end}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-end">
            <Button type="primary" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
