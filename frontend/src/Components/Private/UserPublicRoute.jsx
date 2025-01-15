import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderAll from "../OtherComponents/LoaderAll";
import apiClient from "./apiClient"; // Import the Axios instance

const UserPublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const baseURL = "http://localhost:5120";

  useEffect(() => {
    const checkAuth = async () => {
      if (!document.cookie.includes("connect.sid")) {
        // Skip API call if no session cookie is present
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await apiClient.get("api/auth/check-auth");
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          navigate("/db-au-admn");
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false); // Silently handle errors
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderAll />
      </div>
    );
  }

  return isAuthenticated ? null : children;
};

export default UserPublicRoute;
