import React from "react";
import "../styles/Layout.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // Prevent layout rendering if user is not yet loaded
  if (!user) {
    return <div>Loading...</div>;
  }

  // Doctor Menu
  const doctorMenu = [
    {
      name: "HOME",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctors/profile/${user.doctorId}`, // Fixed: Changed "doctor" to "doctors"
      icon: "fa-solid fa-user",
    },
  ];

  // Determine sidebar menu
  const sidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="main">
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <h6>Appointment Booking</h6>
          </div>
          <div className="menu">
            {sidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`menu-item ${isActive ? "active" : ""}`}
                  key={menu.path}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}

            {/* Logout */}
            <div
              className="menu-item"
              onClick={handleLogout}
              key="logout"
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <div className="header">
            <div className="header-content">
              {/* Notification Bell */}
              <div
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => navigate("/notification")}
              >
                <Badge count={user?.notification?.length || 0}>
                  <i
                    className="fa-solid fa-bell"
                    style={{ fontSize: "20px" }}
                  ></i>
                </Badge>
              </div>

              {/* Fixed Profile Link */}
              <Link
                to={`/doctors/profile/${user.doctorId}`} // Fixed: Changed "doctor" to "doctors"
                style={{ marginLeft: "15px" }}
              >
                {user.name}
              </Link>
            </div>
          </div>

          {/* Main Page Content */}
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
