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

const Topbar = ({ user }) => {
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
        "http://localhost:5120/api/auth/logout",
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
              <SidebarLink to="/db-au-pages" label="Pages" />
              <SidebarLink to="/db-au-user/db-au-profile" label="Account" />
              <SidebarLink to="/db-au-user/checkstatus" label="Status" />
              <SidebarLink to="/db-au-user/project" label="Project" />
              <SidebarLink to="/db-au-user/db-au-setting" label="Settings" />
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {showMobileNav && (
                <motion.nav
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={navVariants}
                  className="absolute top-16 left-0 right-0 bg-[rgba(255,255,255,0.95)] backdrop-blur-lg shadow-md text-gray-900 flex flex-col p-4 space-y-4 z-50 md:z-50 md:hidden"
                >
                  <SidebarLink
                    to="/db-au-user"
                    label="Home"
                    end
                    onClick={toggleMobileNav}
                  />
                  <SidebarLink
                    to="/db-au-pages"
                    label="Pages"
                    onClick={toggleMobileNav}
                  />
                  <SidebarLink
                    to="/db-au-user/db-au-profile"
                    label="Account"
                    onClick={toggleMobileNav}
                  />
                  <SidebarLink
                    to="/db-au-user/checkstatus"
                    label="Status"
                    onClick={toggleMobileNav}
                  />
                  <SidebarLink
                    to="/db-au-user/project"
                    label="Project"
                    onClick={toggleMobileNav}
                  />
                  <SidebarLink
                    to="/db-au-user/db-au-setting"
                    label="Settings"
                    onClick={toggleMobileNav}
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
                  className="absolute right-0 top-14 bg-[rgba(255,255,255,0.2)] backdrop-blur-lg text-gray-800 shadow-lg rounded-lg z-50 w-64"
                >
                  <div className="flex flex-col items-center text-center p-4">
                    <img
                      src={user.profileImg}
                      alt="Profile"
                      className="w-16 h-16 rounded-full shadow-md border-2 border-gray-200"
                    />
                    <h2 className="mt-2 font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">@mail: {user.email}</p>
                  </div>
                  <div className="w-full h-px bg-gray-300"></div>
                  <div className="flex flex-col py-2">
                    <Link
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 transition-all rounded-lg"
                      to="/db-au-user/db-au-setting"
                    >
                      <FontAwesomeIcon icon={faCog} />
                      <span>Settings</span>
                    </Link>
                    <Link
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 transition-all rounded-lg"
                      to="/db-au-user/db-au-profile"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      <span>Profile</span>
                    </Link>
                    <button
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 transition-all rounded-lg"
                      onClick={() => {
                        setTimeout(() => {
                          setModal(true);
                        }, 350);
                      }}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      <span>Logout</span>
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
