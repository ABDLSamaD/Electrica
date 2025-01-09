import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  FolderOpenDot,
  HelpCircle,
  LogOut,
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
  { id: 4, label: "Settings", icon: Settings, link: "/settings" },
  { id: 5, label: "Help", icon: HelpCircle, link: "/help" },
];

const Sidebar = ({ connection, admin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

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

  return (
    <motion.div
      className="fixed top-0 left-0 h-screen bg-black/50 backdrop-blur-lg text-white z-20 border-r border-white/10"
      animate={{ width: isOpen ? "210px" : "70px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {isOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
            >
              {admin?.username || "Admin"}
            </motion.h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>

        <nav className="flex-1 mt-6">
          <ul>
            {menuItems.map((item) => {
              const end = false;
              return (
                <li
                  key={item.id}
                  className={`flex items-center px-4 py-3 ${
                    isActive(item.link)
                      ? "bg-cyan-600 text-white"
                      : "hover:bg-white/10 hover:text-gray-50"
                  } transition-colors`}
                >
                  <NavLink
                    to={item.link}
                    end={end}
                    className="flex items-center px-4 py-3 text-white hover:bg-white/10 hover:text-gray-50 transition-colors"
                  >
                    <item.icon size={20} />
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-4 text-white text-base"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4">
          <button
            className="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition-colors rounded"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-4 text-lg text-cyan-300"
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
