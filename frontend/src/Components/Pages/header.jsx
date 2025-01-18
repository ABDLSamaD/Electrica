import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Header = () => {
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const localhost = "http://localhost:5120";

  // Function to check user authentication based on cookies
  const checkAuth = async () => {
    try {
      const userAuthToken = document.cookie.includes("auth_token");
      if (!userAuthToken) {
        setIsAuthenticatedUser(false);
        return;
      }
      // Make an API request to check user authentication status
      const response = await axios.get(`${localhost}/api/auth/check-auth`, {
        withCredentials: true,
      });

      if (response.status === 200 && document.cookie.includes("auth_token")) {
        setIsAuthenticatedUser(true);
      } else {
        setIsAuthenticatedUser(false);
      }
    } catch (error) {
      setIsAuthenticatedUser(false);
    }
  };

  // Function to check admin authentication based on cookies
  const checkAdminAuth = async () => {
    // Check if admin_auth_token is present in cookies first
    const adminAuthToken = document.cookie.includes("admin_auth");
    if (!adminAuthToken) {
      setIsAuthenticatedAdmin(false);
      return;
    }
    try {
      const response = await axios.get(
        `${localhost}/api/adminauth/check-adminauth`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 && document.cookie.includes("admin_auth")) {
        setIsAuthenticatedAdmin(true);
      } else {
        setIsAuthenticatedAdmin(false);
      }
    } catch (error) {
      setIsAuthenticatedAdmin(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    checkAdminAuth();
  }, []);

  // Toggle for the mobile navigation sidebar
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear cookies
    document.cookie = "auth_token=; max-age=0"; // User token
    document.cookie = "admin_auth_token=; max-age=0"; // Admin token

    // Reset authentication states
    setIsAuthenticatedUser(false);
    setIsAuthenticatedAdmin(false);

    // Optionally, navigate to home page or sign-in page after logout
    window.location.href = "/signin"; // Redirect to sign-in page
  };

  return (
    <header className="fixed top-8 left-0 right-0 z-50 shadow-sm w-full h-auto">
      <div className="container p-3 flex items-center justify-between font-sans rounded-xl backdrop-blur-lg bg-[hsla(242,88.4%,66.3%,0.12)]">
        <div className="logo">
          <h2 className="text-gray-200 text-2xl hover:text-gray-300 transition-all">
            <Link to="/">
              Electrica
              <span className="text-sm text-cyan-200 relative top-3 -left-2">
                web
              </span>
            </Link>
          </h2>
        </div>
        <div className="hidden md:block">
          <nav className="flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/project-details"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              Project
            </NavLink>
            <NavLink
              to="/service"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              Services
            </NavLink>
          </nav>
        </div>
        <div className="md:hidden">
          <button onClick={toggleNav} className="text-gray-900">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>
        {isAuthenticatedAdmin ? (
          <button className="button-86 hidden md:block">
            <Link to="/db_au_admn">Admin</Link>
          </button>
        ) : isAuthenticatedUser ? (
          <button className="button-86 hidden md:block">
            <Link to="/db-au-user">Dashboard</Link>
          </button>
        ) : (
          <button className="button-86 hidden md:block">
            <Link to="/signin">Sign In</Link>
          </button>
        )}
        {isAuthenticatedUser || isAuthenticatedAdmin ? (
          <button className="hidden md:block" onClick={handleLogout}>
            Logout
          </button>
        ) : null}
      </div>

      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleNav}
        ></div>
      )}

      <nav
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900/10 backdrop-blur-md text-white transform z-50 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button onClick={toggleNav} className="absolute top-4 right-4">
          <FontAwesomeIcon icon={faBars} className="text-white text-2xl" />
        </button>
        <ul className="flex flex-col mt-20 space-y-4 p-4">
          <li>
            <Link
              to="/"
              onClick={toggleNav}
              className="text-white hover:text-indigo-400"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={toggleNav}
              className="text-white hover:text-indigo-400"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/project-details"
              onClick={toggleNav}
              className="text-white hover:text-indigo-400"
            >
              Project
            </Link>
          </li>
          <li>
            <Link
              to="/service"
              onClick={toggleNav}
              className="text-white hover:text-indigo-400"
            >
              Services
            </Link>
          </li>
          {isAuthenticatedAdmin ? (
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleNav}
            >
              <Link to="/db_au_admn">Admin</Link>
            </button>
          ) : isAuthenticatedUser ? (
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleNav}
            >
              <Link to="/db-au-user">Dashboard</Link>
            </button>
          ) : (
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleNav}
            >
              <Link to="/signin">Sign In</Link>
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
