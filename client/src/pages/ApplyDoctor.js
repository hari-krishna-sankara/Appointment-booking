import React from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, message, Row, TimePicker } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";

const ApplyDoctor = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      // Format timings first
      const formattedValues = {
        ...values,
        timings: [
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ],
        userId: user._id,
      };

      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        formattedValues,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message || "Application failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Apply Doctor</h1>
      <Form layout="vertical" onFinish={handleFinish}>
        {/* Personal Details */}
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input type="text" placeholder="Your first name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input type="text" placeholder="Your last name" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input type="text" placeholder="Your phone number" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input type="email" placeholder="Your email" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Website" name="website">
              <Input type="text" placeholder="Your website (optional)" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input type="text" placeholder="Your address" />
            </Form.Item>
          </Col>
        </Row>

        {/* Professional Details */}
        <h4>Professional Details:</h4>
        <Row gutter={16}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Specialization"
              name="specialization"
              rules={[
                { required: true, message: "Specialization is required" },
              ]}
            >
              <Input type="text" placeholder="e.g., Cardiologist" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Input type="text" placeholder="e.g., 5 years" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Fee Per Consultation"
              name="feePerConsultation"
              rules={[{ required: true, message: "Fee is required" }]}
            >
              <Input type="number" placeholder="e.g., 500" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Timings"
              name="timings"
              rules={[{ required: true, message: "Work timings are required" }]}
            >
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
