import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Topbar from "./HeadersDashboard/Topbar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import FirstTimeInstruction from "../Pages/FirstTimeInstruction";
import DecryptData from "./Setting/DecryptData";

const DashboardLayout = () => {
  const [user, setUser] = useState({});
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [iseFirstTimeUser, setIsFirstTimeUser] = useState(null);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // fetch user function and fetch also user project details
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${electricaURL}/api/auth/user-info`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.encryptedData) {
        const decryptedUser = DecryptData(response.data.encryptedData);
        setUser(decryptedUser);
        setIsFirstTimeUser(response.data.isFirstTime);
      } else {
        setUser({});
        setIsFirstTimeUser(false);
      }
    } catch (error) {
      setUser({});
      setIsFirstTimeUser(false);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/auth/project-details`,
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.encryptedData) {
        const decryptedUser = DecryptData(response.data.encryptedData);
        setProjects(decryptedUser);
      } else {
        setProjects([]);
      }
    } catch (error) {
      setProjects([]);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchProject();
  }, []);

  // Function to update isFirstTime in backend and frontend state
  const handleCompleteOnboarding = async () => {
    try {
      await axios.post(
        `${electricaURL}/api/auth/updateFirstTime`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsFirstTimeUser(false); // Hide onboarding after completion
    } catch (error) {
      console.error("Error updating first-time status:", error);
    }
  };

  // **Prevent rendering until user info is loaded**
  if (iseFirstTimeUser === null) {
    return null; // Prevent any UI flickering until isFirstTimeUser is determined
  }
  return (
    <div className="relative">
      {/* Show FirstTimeInstruction only if it's the user's first time */}
      {iseFirstTimeUser ? (
        <FirstTimeInstruction handleSkip={handleCompleteOnboarding} />
      ) : (
        <>
          {/* Topbar */}
          <div className="sticky top-0 z-40">
            <Topbar
              toggleSidebar={toggleSidebar}
              user={user}
              electricaURL={electricaURL}
            />
          </div>
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative top-7">
              <Outlet
                context={{
                  user,
                  fetchUser,
                  projects,
                  fetchProject,
                  electricaURL,
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
