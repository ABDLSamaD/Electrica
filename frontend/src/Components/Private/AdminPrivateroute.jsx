import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoaderAll from "../OtherComponents/LoaderAll";

const AdminPrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(
          `${electricaURL}/api/adminauth/check-adminauth`,
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoaderAll />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/admn-sign" replace />;
};

export default AdminPrivateRoute;
