import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const localhost = `http://localhost:5120`;
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(
          `${localhost}/api/adminauth/check-adminauth`,
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setMessage(response.data.message);
        } else {
          setIsAuthenticated(false);
          setMessage(response.data.message);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setMessage(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
        <p className="text-2xl text-black mt-2">{message}</p>
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/admn-sign" replace />;
};

export default AdminPrivateRoute;
