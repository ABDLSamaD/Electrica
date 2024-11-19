import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./HeadersDashboard/Sidebar";
import Topbar from "./HeadersDashboard/Topbar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";

const DashboardLayout = () => {
  // fetch user details
  const auth = localStorage.getItem("dshbrd_usr_tkn");
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // fetch user function
  const fetchUser = async () => {
    const response = await axios.get(
      "http://localhost:5120/api/auth/user-info",
      {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      },
      {
        withCredentials: true,
      }
    );
    const result = await response.data;
    if (response.status === 200) {
      setUser(result);
    } else {
      setUser("");
      console.log("error");
    }
  };
  useEffect(() => {
    if (!auth) {
      navigate("/signin");
    } else {
      setTimeout(() => {
        fetchUser();
      }, 3000);
    }
  }, [auth, navigate]);

  return (
    <div className="flex">
      {isSidebarOpen && <Sidebar user={user} />}

      {/* Main content area */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-32 md:ml-64" : "ml-0"}`}>
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Topbar toggleSidebar={toggleSidebar} user={user} />
          <div className="p-6">
            {!user ? (
              <p>Loading user data...</p>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome, {user?.name || "User"}!
                </h1>
                <p className="mt-2 text-gray-600">
                  This is your dashboard. Use the navigation links on the
                  sidebar to explore the app.
                </p>
              </div>
            )}
          </div>
          <Outlet context={{ user }} />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
