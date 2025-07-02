"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  UserCircle,
  TrendingUp,
  FolderOpen,
  Cog,
  Bell,
  Mail,
  Calendar,
  Activity,
  Zap,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NotificationIcon from "./NotificationIcon";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";

const navigationItems = [
  {
    to: "/db-au-user",
    label: "Dashboard",
    icon: Home,
    end: true,
    color: "from-blue-500 to-cyan-500",
    description: "Overview & Analytics",
  },
  {
    to: "/db-au-user/db-au-profile",
    label: "Profile",
    icon: UserCircle,
    color: "from-green-500 to-emerald-500",
    description: "Account Management",
  },
  {
    to: "/db-au-user/checkstatus",
    label: "Status",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    description: "Project Status",
  },
  {
    to: "/db-au-user/project",
    label: "Projects",
    icon: FolderOpen,
    color: "from-orange-500 to-red-500",
    description: "Project Management",
  },
  {
    to: "/db-au-user/db-au-setting",
    label: "Settings",
    icon: Cog,
    color: "from-indigo-500 to-purple-500",
    description: "System Configuration",
  },
];

const Topbar = ({ user, electricaURL }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const dropdownRef = useRef(null);

  const toggleMobileNav = () => setShowMobileNav(!showMobileNav);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await axios.post(
        `${electricaURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setShowMobileNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setShowMobileNav(false);
  }, [navigate]);

  return (
    <>
      {/* Enhanced Professional Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-3xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-white/[0.05] to-white/[0.02]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Enhanced Logo Section */}
            <motion.div
              className="flex items-center space-x-3 sm:space-x-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link
                to="/db-au-user"
                className="flex items-center space-x-2 sm:space-x-3 group"
              >
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-300">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-500 rounded-full border-2 border-white/20 animate-pulse"></div>
                </div>
                <div className="hidden xs:block sm:block">
                  <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                    ELEC<span className="text-cyan-400">TRICA</span>
                  </h1>
                  <p className="text-xs text-white/60 font-medium hidden sm:block">
                    User Dashboard
                  </p>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              {isMobile && (
                <motion.button
                  onClick={toggleMobileNav}
                  className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-xl ml-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {showMobileNav ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X className="w-5 h-5 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            {!isMobile && (
              <motion.nav
                className="hidden lg:flex items-center space-x-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `group relative flex flex-col items-center px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                          isActive
                            ? "bg-white/15 text-white shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] border border-white/30 backdrop-blur-xl"
                            : "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] hover:border hover:border-white/20 hover:backdrop-blur-xl"
                        }`
                      }
                    >
                      <div className="relative">
                        <item.icon className="w-5 h-5 mb-1 transition-transform duration-300 group-hover:scale-110 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white tracking-wide">
                        {item.label}
                      </span>
                      <span className="text-xs text-white/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-full whitespace-nowrap">
                        {item.description}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            )}

            {/* Enhanced Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notification Bell */}
              <motion.button
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-xl group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <NotificationIcon electricaURL={electricaURL} />
                {/* <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:animate-pulse" /> 
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white/20 animate-pulse"></div> */}
              </motion.button>

              {/* Enhanced Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 border border-white/20 backdrop-blur-xl group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  <div className="relative">
                    <LazyLoadImage
                      src={
                        user.profileImg || "/placeholder.svg?height=32&width=32"
                      }
                      alt="Profile"
                      loading="lazy"
                      effect="blur"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white/30 group-hover:border-white/50 transition-colors duration-300"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white/20"></div>
                  </div>
                  {!isMobile && (
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-white truncate max-w-24">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/60">Online</p>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3 h-3 sm:w-4 sm:h-4 text-white/60 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Enhanced Profile Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-80 bg-black backdrop-blur-3xl rounded-3xl shadow-[0_2px_10px_0_rgba(20,20,200,0.3)] border border-white/20 overflow-hidden z-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]"></div>

                      {/* Profile Header */}
                      <div className="relative p-6 text-center border-b border-white/10">
                        <div className="relative inline-block">
                          <LazyLoadImage
                            src={
                              user.profileImg ||
                              "/placeholder.svg?height=80&width=80"
                            }
                            alt="Profile"
                            effect="blur"
                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-white/60 flex items-center justify-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </p>
                        <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-white/50">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Member since 2024
                          </div>
                          <div className="flex items-center">
                            <Activity className="w-3 h-3 mr-1" />
                            Active now
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="relative p-2">
                        <Link
                          to="/db-au-user/db-au-profile"
                          className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 group-hover:bg-blue-500/30 transition-colors duration-300">
                            <User className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Profile
                            </p>
                            <p className="text-xs text-white/60">
                              Manage your account
                            </p>
                          </div>
                        </Link>

                        <Link
                          to="/db-au-user/db-au-setting"
                          className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-400/30 group-hover:bg-purple-500/30 transition-colors duration-300">
                            <Settings className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Settings
                            </p>
                            <p className="text-xs text-white/60">
                              Preferences & privacy
                            </p>
                          </div>
                        </Link>

                        <div className="my-2 h-px bg-white/10"></div>

                        <button
                          onClick={() => {
                            setShowLogoutModal(true);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 transition-all duration-300 group"
                        >
                          <div className="p-2 bg-red-500/20 rounded-xl border border-red-400/30 group-hover:bg-red-500/30 transition-colors duration-300">
                            <LogOut className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-white">
                              Sign Out
                            </p>
                            <p className="text-xs text-white/60">
                              Logout from your account
                            </p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isMobile && showMobileNav && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileNav}
            />
            <motion.nav
              className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 bg-black/30 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_20px_40px_0_rgba(0,0,0,0.5)] z-50 overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]"></div>

              {/* Mobile Header */}
              <div className="relative p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Navigation
                      </h3>
                      <p className="text-xs text-white/60">Quick access menu</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleMobileNav}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-300"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="relative p-3 sm:p-4">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `group flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-500 ${
                            isActive
                              ? "bg-white/15 text-white border border-white/30 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
                              : "text-white/80 hover:text-white hover:bg-white/10 hover:border hover:border-white/20"
                          }`
                        }
                        onClick={toggleMobileNav}
                      >
                        <div
                          className={({ isActive }) =>
                            `p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-colors duration-300 ${
                              isActive
                                ? `bg-gradient-to-r ${item.color} bg-opacity-20 border-white/30`
                                : "bg-white/10 border-white/20 group-hover:bg-white/20"
                            }`
                          }
                        >
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm sm:text-base truncate">
                            {item.label}
                          </p>
                          <p className="text-xs text-white/60 truncate">
                            {item.description}
                          </p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-white/60 rotate-[-90deg] flex-shrink-0" />
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Profile Section */}
                <motion.div
                  className="mt-4 pt-4 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="p-3 sm:p-4 bg-white/[0.02] rounded-xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <LazyLoadImage
                        src={
                          user.profileImg ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt="Profile"
                        effect="blur"
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-white/60 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
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
                  Sign Out
                </motion.h2>
                <motion.p
                  className="text-white/70 mb-8 leading-relaxed text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Are you sure you want to sign out of your account?
                </motion.p>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <motion.button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 px-8 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 rounded-2xl transition-all duration-300 font-semibold backdrop-blur-xl shadow-[0_8px_32px_0_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isLoggingOut ? { scale: 1.02 } : {}}
                    whileTap={!isLoggingOut ? { scale: 0.98 } : {}}
                  >
                    {isLoggingOut ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing out...</span>
                      </div>
                    ) : (
                      "Yes, Sign Out"
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => setShowLogoutModal(false)}
                    disabled={isLoggingOut}
                    className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white hover:text-white rounded-2xl transition-all duration-300 font-semibold backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] disabled:opacity-50"
                    whileHover={!isLoggingOut ? { scale: 1.02 } : {}}
                    whileTap={!isLoggingOut ? { scale: 0.98 } : {}}
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

export default Topbar;
