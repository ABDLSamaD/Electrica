import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import LoaderAll from "../OtherComponents/LoaderAll";

const AdminPublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const localhost = "http://localhost:5120";

  useEffect(() => {
    const checkAuth = async () => {
      // Check if the session cookie exists
      if (document.cookie.includes("admin.sid")) {
        // If no cookie, user is not logged in
        setIsAuthenticated(false);
        return;
      }
      console.log("Cookies:", document.cookie); // Debugging statement

      try {
        // If cookie exists, verify session with the API
        const response = await axios.get(
          `${localhost}/api/adminauth/check-adminauth`,
          { withCredentials: true }
        );

        if (response.data.isAuthenticated) {
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
  return isAuthenticated ? null : children;
};

export default AdminPublicRoute;
