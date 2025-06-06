import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faRightFromBracket,
  faUser,
  faChevronDown,
  faBolt,
  faBars,
  faTimes,
  faHome,
  faUserCircle,
  faChartLine,
  faProjectDiagram,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";
import LoaderAll from "../../OtherComponents/LoaderAll";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NotificationIcon from "./NotificationIcon";

const Topbar = ({ user, electricaURL }) => {
  const navigate = useNavigate();

  // states start
  const [alert, setAlert] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const [modal, setModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  // states end

  const dropdownRef = useRef(null);

  const toggleMobileNav = () => {
    setShowMobileNav((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Close mobile nav when navigating to another page
    setShowMobileNav(false);
  }, [navigate]);

  const hanldeLogout = async () => {
    try {
      setLogout(true);
      const response = await axios.post(
        `${electricaURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/signin");
      } else {
        setLogout(false);
      }
    } catch (error) {
      setLogout(false);
    }
  };

  if (alert) {
    return (
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(null)}
      />
    );
  }

  return (
    <header className="relative">
      <div className="backdrop-blur-sm rounded-lg fixed top-0 left-0 right-0 z-50">
        {logout && (
          <div className="absolute top-1/2 left-1/2 right-0 min-h-screen">
            <LoaderAll />
          </div>
        )}
        <div className="h-16 flex items-center justify-between px-4 md:px-6 relative text-white">
          <div className="flex items-center space-x-3">
            <Link to="/db-au-user" className="w-auto block">
              <div className="py-4 px-2 md:px-4 font-bold text-centerborder-b border-gray-700 flex items-center justify-center">
                <FontAwesomeIcon icon={faBolt} className="text-red-100" />
                <p className="ml-1 text-cyan-300 text-2xl">
                  ELEC<span className="text-red-400">TRICA</span>
                </p>
              </div>
            </Link>
            {/* Mobile Nav Toggle */}
            <button
              className="md:hidden text-white text-2xl"
              onClick={toggleMobileNav}
            >
              <FontAwesomeIcon icon={showMobileNav ? faTimes : faBars} />
            </button>
            <div className="hidden md:flex space-x-4">
              <SidebarLink to="/db-au-user" label="Home" icon={faHome} end />
              <SidebarLink
                to="/db-au-user/db-au-profile"
                label="Account"
                icon={faUserCircle}
              />
              <SidebarLink
                to="/db-au-user/checkstatus"
                label="Status"
                icon={faChartLine}
              />
              <SidebarLink
                to="/db-au-user/project"
                label="Project"
                icon={faProjectDiagram}
              />
              <SidebarLink
                to="/db-au-user/db-au-setting"
                label="Settings"
                icon={faCogs}
              />
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {showMobileNav && (
                <motion.nav
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="fixed top-16 -left-4 right-0 w-full bg-gray-950/95 backdrop-blur-xl shadow-lg shadow-cyan-950/55 rounded-2xl text-white flex flex-col py-4 px-6 space-y-4 z-50"
                >
                  <SidebarLink
                    to="/db-au-user"
                    label="Home"
                    icon={faHome}
                    end
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/db-au-profile"
                    label="Account"
                    icon={faUserCircle}
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/checkstatus"
                    label="Status"
                    icon={faChartLine}
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/project"
                    label="Project"
                    icon={faProjectDiagram}
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/db-au-setting"
                    label="Settings"
                    icon={faCogs}
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Icon */}
          <NotificationIcon electricaURL={electricaURL} />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer flex items-center gap-3 p-2 rounded-full bg-white/20 hover:bg-white/30"
              onClick={toggleDropdown}
            >
              <LazyLoadImage
                src={user.profileImg}
                alt="Profile"
                loading="lazy"
                effect="blur"
                className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
              />
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 top-14 bg-gradient-to-br from-gray-900/95 to-gray-950 backdrop-blur-2xl shadow-lg rounded-2xl z-50 w-72 border border-solid border-white/20"
                >
                  <div className="flex flex-col items-center text-center p-6">
                    <LazyLoadImage
                      src={user.profileImg}
                      alt="Profile"
                      effect="blur"
                      className="w-20 h-20 rounded-full shadow-md border-4 border-white/50"
                    />
                    <h2 className="mt-3 text-lg font-semibold text-white">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-300">@mail: {user.email}</p>
                  </div>
                  <div className="w-full h-px bg-white/20 my-2"></div>
                  <div className="flex flex-col py-2">
                    <Link
                      className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-600/50 transition-all rounded-xl"
                      to="/db-au-user/db-au-setting"
                    >
                      <FontAwesomeIcon
                        icon={faCog}
                        className="text-indigo-400"
                      />
                      <span className="text-gray-200 font-medium">
                        Settings
                      </span>
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-6 py-3 hover:bg-indigo-600/50 transition-all rounded-xl"
                      to="/db-au-user/db-au-profile"
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-indigo-400"
                      />
                      <span className="text-gray-200 font-medium">Profile</span>
                    </Link>
                    <button
                      className="flex items-center gap-3 px-6 py-3 hover:bg-red-800/50 transition-all rounded-xl"
                      onClick={() => setModal(true)}
                    >
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="text-red-400"
                      />
                      <span className="text-red-300 font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm min-h-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-96 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg shadow-xl border border-white/10"
          >
            <h2 className="text-2xl font-semibold text-white text-center">
              Are you sure you want to logout?
            </h2>
            <p className="text-gray-300 text-center mt-2">
              You will be redirected to the sign-in page.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={hanldeLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                No, Stay
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
};

const SidebarLink = ({ to, label, icon, end = false, onClick, className }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center text-sm rounded-full md:px-5 md:py-2 px-3 py-2 hover:text-cyan-700 transition-all ${
        isActive ? "text-cyan-500 text-md tracking-wider " : ""
      } ${className}`
    }
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className="mr-2" />
    {label}
  </NavLink>
);

export default Topbar;
