import React from 'react';
import '../styles/Registerstyles.css';
import { Form, Input, message } from 'antd';
import axios from 'axios'; // ✅ Fixed typo here
import { Link, useNavigate } from 'react-router-dom'; // ✅ Combined imports
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const Register = () => {
  const navigate = useNavigate(); // ✅ Corrected hook name
  const dispatch = useDispatch()

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/v1/user/register', values); // ✅ Fixed axios spelling
      dispatch(hideLoading())
      if (res.data.success) {
        message.success('Registered Successfully');
        navigate('/login');
      } else {
        message.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error);
      message.error('Something Went Wrong');
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
        <h3 className="text-center">Register Form</h3>

        <Form.Item label="Name" name="name">
          <Input type="text" required />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>

        <Link to="/login" className="login-link">Already a user? Login here</Link>

        <Form.Item>
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
