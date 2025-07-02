"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  FolderOpenDot,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const menuItems = [
  {
    id: 1,
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/db_au_admn",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/20",
    borderColor: "border-blue-400/30",
    description: "Overview & Analytics",
  },
  {
    id: 2,
    label: "Users",
    icon: Users,
    link: "/db_au_admn/userprofile",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    hoverColor: "hover:bg-green-500/20",
    borderColor: "border-green-400/30",
    description: "User Management",
  },
  {
    id: 3,
    label: "Projects",
    icon: FolderOpenDot,
    link: "/db_au_admn/projectusers",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    hoverColor: "hover:bg-purple-500/20",
    borderColor: "border-purple-400/30",
    description: "Project Overview",
  },
  {
    id: 4,
    label: "Settings",
    icon: Settings,
    link: "/db_au_admn/admn-setting",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    hoverColor: "hover:bg-orange-500/20",
    borderColor: "border-orange-400/30",
    description: "System Configuration",
  },
];

const Sidebar = ({ connection, admin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

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
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Enhanced Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-3xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Enhanced Logo/Brand Section */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {admin?.username || "Admin Panel"}
                </h1>
                <p className="text-sm text-white/70 font-medium tracking-wide">
                  Administrator Dashboard
                </p>
              </div>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            {!isMobile && (
              <motion.nav
                className="hidden lg:flex items-center space-x-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  >
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        `group relative flex flex-col items-center px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                          isActive
                            ? `bg-white/15 text-white shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/30 backdrop-blur-xl`
                            : `text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border hover:border-white/20 hover:backdrop-blur-xl`
                        }`
                      }
                      end={item.link === "/db_au_admn"}
                    >
                      <div className="relative">
                        <item.icon className="w-6 h-6 mb-2 transition-transform duration-300 group-hover:scale-110 text-white" />
                        {isActive(item.link) && (
                          <motion.div
                            className={`absolute -inset-2 bg-gradient-to-r ${item.color} opacity-10 rounded-xl blur-sm`}
                            layoutId="activeGlow"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-white tracking-wide">
                        {item.label}
                      </span>
                      <span className="text-xs text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.description}
                      </span>

                      {/* Remove the hoveredItem effect that was causing conflicts */}

                      {/* Simplified active background - no conflicts with hover */}
                      {isActive(item.link) && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-5 rounded-2xl pointer-events-none`}
                          layoutId="activeBackground"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            )}

            {/* Enhanced Right Section */}
            <div className="flex items-center space-x-4">
              {/* Enhanced Desktop Logout Button */}
              {!isMobile && (
                <motion.button
                  className="group relative flex items-center px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-white border border-red-400/30 hover:border-red-400/50 rounded-2xl transition-all duration-500 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(239,68,68,0.1)] hover:shadow-[0_12px_40px_0_rgba(239,68,68,0.2)] transform hover:scale-105"
                  onClick={() => setShowModal(true)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300 text-white" />
                  <span className="text-sm font-semibold text-white">
                    Logout
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              )}

              {/* Enhanced Mobile Menu Button */}
              {isMobile && (
                <motion.button
                  onClick={toggleMobileMenu}
                  className="relative flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <AnimatePresence mode="wait">
                    {showMobileMenu ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X className="w-6 h-6 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobile && showMobileMenu && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            <motion.div
              className="fixed top-20 lg:top-24 right-4 w-80 max-w-[calc(100vw-2rem)] bg-black/30 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-[0_20px_40px_0_rgba(0,0,0,0.5)] z-50 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]"></div>
              <div className="relative p-6">
                <div className="space-y-3">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <NavLink
                        to={item.link}
                        className={({ isActive }) =>
                          `group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 ${
                            isActive
                              ? `${item.bgColor} text-white border ${item.borderColor} shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]`
                              : `text-white/80 hover:text-white ${item.hoverColor} hover:border hover:${item.borderColor}`
                          }`
                        }
                        end={item.link === "/db_au_admn"}
                        onClick={toggleMobileMenu}
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-2 ${item.bgColor} rounded-xl mr-4 border ${item.borderColor}`}
                          >
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold text-white block">
                              {item.label}
                            </span>
                            <span className="text-xs text-white/60">
                              {item.description}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-300" />
                      </NavLink>
                    </motion.div>
                  ))}

                  <motion.div
                    className="pt-4 mt-4 border-t border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <button
                      className="group flex items-center justify-between w-full px-5 py-4 bg-red-500/10 hover:bg-red-500/20 text-white border border-red-400/30 hover:border-red-400/50 rounded-2xl transition-all duration-500 backdrop-blur-xl"
                      onClick={() => {
                        setShowModal(true);
                        setShowMobileMenu(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-red-500/20 rounded-xl mr-4 border border-red-400/30">
                          <LogOut className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">
                            Logout
                          </span>
                          <span className="text-xs text-white/60">
                            Sign out of admin panel
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-300" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ultra Enhanced Logout Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/40 backdrop-blur-3xl p-10 rounded-3xl shadow-[0_20px_40px_0_rgba(0,0,0,0.5)] text-center max-w-md w-full border border-white/20 relative overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]"></div>
              <div className="relative z-10">
                <motion.div
                  className="flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-3xl mx-auto mb-6 border border-red-400/30 backdrop-blur-xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <LogOut className="w-10 h-10 text-red-400" />
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Confirm Logout
                </motion.h2>
                <motion.p
                  className="text-white/70 mb-8 leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Are you sure you want to log out of your admin session?
                </motion.p>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <motion.button
                    onClick={handleLogout}
                    className="flex-1 px-8 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-xl shadow-[0_8px_32px_0_rgba(239,68,68,0.2)] text-white"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Yes, Logout
                  </motion.button>
                  <motion.button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white hover:text-white rounded-2xl transition-all duration-300 font-semibold backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20 lg:h-24"></div>
    </>
  );
};

export default Sidebar;
