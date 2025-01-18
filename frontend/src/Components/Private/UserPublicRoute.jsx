import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderAll from "../OtherComponents/LoaderAll";
import axios from "axios";

const UserPublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const baseURL = "http://localhost:5120";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/auth/check-auth`, {
          withCredentials: true,
        });

        // Check the response from the server
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsAuthenticated(true);
          navigate("/db-au-user");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
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

  return isAuthenticated === false ? children : null;
};

export default UserPublicRoute;
