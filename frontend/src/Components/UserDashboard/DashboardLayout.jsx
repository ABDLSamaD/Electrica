import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Topbar from "./HeadersDashboard/Topbar";
// import { Outlet, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from "axios";

const DashboardLayout = () => {
  const [user, setUser] = useState({});
  const [userProject, setUserProject] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // fetch user function and fetch also user project details
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5120/api/auth/user-info",
        {
          withCredentials: true,
        }
      );
      const result = await response.data;
      if (response.status === 200) {
        setUser(result);
        if (result.project) {
          setUserProject(result.project || "Create an project first");
        }
      } else {
        setUser({});
        setUserProject([]);
      }
    } catch (error) {
      setUser({});
      setUserProject([]);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      fetchUser();
      userProject.map((data) => setUserProject(data));
    }, 3000);
  }, []);

  return (
    <div className="relative">
      {/* Main content area */}
      <div className="relative w-full">
        {/* topbar */}
        <div className="sticky top-0 z-40">
          <Topbar toggleSidebar={toggleSidebar} user={user} />
        </div>
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative top-7">
            <Outlet context={{ user, userProject, fetchUser }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
