import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  FolderOpenDot,
  HelpCircle,
  LogOut,
  Menu,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const menuItems = [
  { id: 1, label: "Dashboard", icon: LayoutDashboard, link: "/db_au_admn" },
  { id: 2, label: "Users", icon: Users, link: "/db_au_admn/userprofile" },
  {
    id: 3,
    label: "Projects",
    icon: FolderOpenDot,
    link: "/db_au_admn/projectusers",
  },
  {
    id: 4,
    label: "Settings",
    icon: Settings,
    link: "/db_au_admn/admn-setting",
  },
];

const Sidebar = ({ connection, admin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${connection}/api/adminauth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert(response.data.message);
        navigate("/admn-sign");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileMenu(false); // Hide mobile menu on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-lg text-white z-20 border-b border-white/10"
      animate={{ height: showMobileMenu ? "auto" : "60px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
        >
          {admin?.username || "Admin"}
        </motion.h1>
        {isMobile ? (
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Menu size={24} />
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.link}
                className={`flex items-center px-4 py-2 ${
                  isActive(item.link)
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-white/10 hover:text-gray-50"
                } transition-colors rounded-lg`}
              >
                <item.icon size={20} />
                <span className="ml-2 text-base text-gray-300">
                  {item.label}
                </span>
              </NavLink>
            ))}
            <button
              className="flex items-center px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-lg bg-gray-900"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="ml-2 text-base text-red-600">Logout</span>
            </button>
          </div>
        )}
      </div>

      {isMobile && showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 border-t border-white/10"
        >
          <ul className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.link}
                  className={`flex items-center px-4 py-3 ${
                    isActive(item.link)
                      ? "bg-cyan-600 text-white"
                      : "hover:bg-white/10 hover:text-gray-50"
                  } transition-colors rounded-lg`}
                >
                  <item.icon size={20} />
                  <span className="ml-4 text-base text-gray-200">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                className="flex items-center w-full px-4 py-3 text-white hover:bg-white/10 transition-colors rounded-lg bg-gray-900"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="ml-4 text-base text-red-600">Logout</span>
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
