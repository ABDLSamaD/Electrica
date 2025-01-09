import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5120/api/auth/check-auth",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
