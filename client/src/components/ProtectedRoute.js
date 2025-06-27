import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

// ✅ Define API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, redirecting...");
        setIsCheckingAuth(false);
        return;
      }

      try {
        dispatch(showLoading());

        const res = await axios.post(
          `${API_BASE_URL}/api/v1/user/getUserData`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(hideLoading());

        console.log("✅ getUser response:", res.data);

        if (res.data.success) {
          dispatch(setUser(res.data.data));
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error("🔥 getUser error:", error);

        if (error.response) {
          console.error("❗ Server responded with error:", error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          console.error("❗ No response received:", error.request);
        } else {
          console.error("❗ Request setup error:", error.message);
        }

        localStorage.removeItem("token");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (!user && localStorage.getItem("token")) {
      getUser();
    } else {
      setIsCheckingAuth(false);
    }
  }, [user, dispatch]);

  if (isCheckingAuth) {
    return <p>Loading user authentication...</p>;
  }

  if (!localStorage.getItem("token") || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
