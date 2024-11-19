import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5120/api/auth/check-auth",
          {
            withCredentials: true, // Ensure cookies are sent
          }
        );
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error(
          "Session validation failed:",
          error.response?.data || error.message
        );
        setIsAuthenticated(false);
      }
    };
    validateSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
