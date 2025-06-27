import React from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { TabPane } = Tabs;

const NotificationPage = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Mark All Notifications As Read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/mark-all-notification-as-read",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload(); // ✅ Refresh to reflect changes
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong while marking all as read");
    }
  };

  // ✅ Delete All Read Notifications
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-read-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong while deleting read notifications");
    }
  };

  // ✅ Mark individual as read when clicked
  const handleNotificationClick = async (notification) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/mark-single-notification-as-read",
        {
          userId: user._id,
          notification,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        navigate(notification.data.onClickPath);
      } else {
        message.error("Could not mark notification as read");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Unread" key="1">
          <div className="d-flex justify-content-end">
            <h4
              className="p-2"
              style={{ cursor: "pointer" }}
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </h4>
          </div>
          {user?.notification?.map((notification, index) => (
            <div
              key={index}
              className="card p-2 mb-2"
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => handleNotificationClick(notification)}
            >
              {notification.message}
            </div>
          ))}
        </TabPane>

        <TabPane tab="Read" key="2">
          <div className="d-flex justify-content-end">
            <h4
              className="p-2"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteAllRead}
            >
              Delete All Read
            </h4>
          </div>
          {user?.seenNotification?.map((notification, index) => (
            <div key={index} className="card p-2 mb-2">
              {notification.message}
            </div>
          ))}
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
