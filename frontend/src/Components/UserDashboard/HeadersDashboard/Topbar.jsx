import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faRightFromBracket,
  faUser,
  faChevronDown,
  faBolt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";
import LoaderAll from "../../OtherComponents/LoaderAll";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

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

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };
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
      setLogout(false);
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
      <div
        className="backdrop-blur-3xl shadow rounded-lg"
        style={{ background: "hsl(242deg 88.4% 66.3% / 12%)" }}
      >
        {logout && <LoaderAll />}
        <div className="h-16 flex items-center justify-between px-2 relative text-white">
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
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className="hidden md:flex space-x-4">
              <SidebarLink to="/db-au-user" label="Home" end />
              <SidebarLink to="/db-au-user/db-au-profile" label="Account" />
              <SidebarLink to="/db-au-user/checkstatus" label="Status" />
              <SidebarLink to="/db-au-user/project" label="Project" />
              <SidebarLink to="/db-au-user/db-au-setting" label="Settings" />
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {showMobileNav && (
                <motion.nav
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute top-0 -left-3 right-20 w-full bg-gradient-to-r from-gray-900/80 to-blue-950 backdrop-blur-3xl shadow-lg text-white flex flex-col py-4 px-6 space-y-4 z-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold tracking-wide">
                      Menu
                    </h1>
                    <button
                      onClick={toggleMobileNav}
                      className="text-white p-2 rounded-full hover:bg-indigo-700 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <SidebarLink
                    to="/db-au-user"
                    label="Home"
                    end
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-pages"
                    label="Pages"
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/db-au-profile"
                    label="Account"
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/checkstatus"
                    label="Status"
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/project"
                    label="Project"
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                  <SidebarLink
                    to="/db-au-user/db-au-setting"
                    label="Settings"
                    onClick={toggleMobileNav}
                    className="hover:bg-indigo-700 px-4 py-2 rounded-lg transition text-sm"
                  />
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* image down ref */}
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
                  className="absolute right-0 top-14 bg-gradient-to-br from-gray-900/90 to-gray-950/60 backdrop-blur-2xl shadow-lg rounded-2xl z-50 w-72 border border-white/20"
                >
                  <div className="flex flex-col items-center text-center p-6">
                    <img
                      src={user.profileImg}
                      alt="Profile"
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
                      onClick={() => {
                        setTimeout(() => {
                          setModal(true);
                        }, 350);
                      }}
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
      {/* modal for logout */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(255,255,255,0.1)] backdrop-blur-xl min-h-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-96 bg-white p-6 rounded-lg shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Are you sure you want to logout?
            </h2>
            <p className="text-gray-500 text-center mt-2">
              You will be redirected to the sign-in page.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={hanldeLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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

const SidebarLink = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center text-sm rounded-full md:px-5 md:py-2 px-3 py-2 hover:text-cyan-700 transition-all ${
        isActive ? "text-cyan-500 text-md tracking-wider " : ""
      }`
    }
  >
    {label}
  </NavLink>
);
export default Topbar;
