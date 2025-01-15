import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
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
        <p>Loading...</p>
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/admn-sign" replace />;
};

export default AdminPrivateRoute;
