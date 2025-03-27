import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoaderAll from "../OtherComponents/LoaderAll";

const AdminPublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If cookie exists, verify session with the API
        const response = await axios.get(
          `${electricaURL}/api/adminauth/check-adminauth`,
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache", // ✅ Prevent cached response
            },
          }
        );

        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
          navigate("/db_au_admn"); // Redirect to dashboard if authenticated
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Handle API errors gracefully
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show a loader while determining authentication status
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  // If authenticated, redirect to the dashboard; otherwise, render children
  return isAuthenticated === false ? children : null;
};

export default AdminPublicRoute;
