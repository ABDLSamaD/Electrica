import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  FolderOpenDot,
  LogOut,
  Menu,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/db_au_admn",
  },
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const handleLogout = async () => {
    try {
      setShowModal(false);
      const response = await axios.post(
        `${connection}/api/adminauth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/admn-sign");
      }
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileMenu(false); // Close mobile menu when resizing to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Sidebar Header */}
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
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 ${
                      isActive
                        ? "bg-cyan-600 text-white"
                        : "hover:bg-white/10 hover:text-gray-50"
                    } transition-colors rounded-lg`
                  }
                  end={item.link === "/db_au_admn"}
                >
                  <item.icon size={20} />
                  <span className="ml-2 text-base text-gray-300">
                    {item.label}
                  </span>
                </NavLink>
              ))}

              <button
                className="flex items-center px-4 py-2 text-white hover:bg-white/10 transition-colors rounded-lg bg-gray-900"
                onClick={() => setShowModal(true)}
              >
                <LogOut size={20} />
                <span className="ml-2 text-base text-red-600">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
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
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 ${
                        isActive
                          ? "bg-cyan-600 text-white"
                          : "hover:bg-white/10 hover:text-gray-50"
                      } transition-colors rounded-lg`
                    }
                    end={item.link === "/db_au_admn"}
                    onClick={() => setShowMobileMenu(false)} // Close mobile menu on click
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
                  className="flex items-center w-full px-4 py-3 text-white hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => setShowModal(true)}
                >
                  <LogOut size={20} />
                  <span className="ml-4 text-base text-red-600">Logout</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-4 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl text-center max-w-sm w-full border border-white/20"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-white">Confirm Logout</h2>
              <p className="text-gray-300 mt-2">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg text-white"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 transition rounded-lg text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
