import React from "react";
import "../styles/Registerstyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Update to match backend port (8080)
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(`${API_BASE_URL}/api/v1/user/login`, values);
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login successful");
        navigate("/");
      } else {
        message.error(res.data.message || "Login failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      console.log("Login error:", error);
      message.error(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        onFinish={onFinishHandler}
        className="register-form"
      >
        <h3 className="text-center">Login Form</h3>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" />
        </Form.Item>

        <Link to="/register" className="login-link">
          Not a user? Register here
        </Link>

        <Form.Item>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
