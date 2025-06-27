import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const changeDoctorStatus = async (doctorId, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeDoctorStatus",
        { doctorId, status },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc._id === doctorId ? { ...doc, status } : doc
          )
        );
      }
    } catch (error) {
      console.error("Error changing doctor status:", error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">All Doctors</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc._id}>
              <td>
                {doc.firstName} {doc.lastName}
              </td>
              <td>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </td>
              <td>{doc.phone}</td>
              <td>
                {doc.status === "pending" ? (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => changeDoctorStatus(doc._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => changeDoctorStatus(doc._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`badge bg-${
                      doc.status === "approved" ? "success" : "danger"
                    }`}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Doctors;
