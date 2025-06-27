import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No auth token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/user/getAllDoctors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", res.data); // Debug log
      if (res.data.success) {
        setDoctors(res.data.data || []); // Default to empty array
      } else {
        setError(res.data.message || "Failed to fetch doctors.");
      }
    } catch (err) {
      setError("Server error while fetching doctors.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>
      <Row>
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorList key={doctor._id} doctor={doctor} />
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </Row>
      {loading && <p>Loading doctors...</p>}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
    </Layout>
  );
};

export default HomePage;
