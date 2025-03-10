import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import LoaderAll from "../OtherComponents/LoaderAll";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await axios.get(
          `${electricaURL}/api/auth/check-auth`,
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
        document.body.innerHTML += `<p className="flex items-center justify-center text-xl mt-32">${error.response?.data?.message}</p>`;
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
