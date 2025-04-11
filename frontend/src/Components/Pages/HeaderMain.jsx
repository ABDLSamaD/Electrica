import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const HeaderMain = () => {
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  // Function to check user authentication based on cookies
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/auth/check-userlogin`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsAuthenticatedUser(response.data.isAuthenticated);
      }
    } catch (error) {
      setIsAuthenticatedUser(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Toggle for the mobile navigation sidebar
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 shadow-sm h-auto">
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
              Contract
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
            <NavLink
              to="/complain"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              Complain
            </NavLink>
          </nav>
        </div>
        <div className="md:hidden">
          <button onClick={toggleNav} className="text-gray-200">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>
        {!isNavOpen && (
          <div className="hidden md:block">
            {isAuthenticatedUser ? (
              <button className="button-86 hidden md:block">
                <Link to="/db-au-user">Dashboard</Link>
              </button>
            ) : (
              <button className="button-86 hidden md:block">
                <Link to="/signin">Sign In</Link>
              </button>
            )}
          </div>
        )}
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
        <div className="logo pt-10 pl-3">
          <h2 className="text-gray-200 text-2xl hover:text-gray-300 transition-all">
            <Link to="/">
              Electrica
              <span className="text-sm text-cyan-200 relative top-3 -left-2">
                web
              </span>
            </Link>
          </h2>
        </div>
        <ul className="flex flex-col mt-20 space-y-4 p-4 z-50">
          <li>
            <NavLink
              to="/"
              onClick={toggleNav}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={toggleNav}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/project-details"
              onClick={toggleNav}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              Contract
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service"
              onClick={toggleNav}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/complain"
              onClick={toggleNav}
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400"
                  : "text-gray-300 hover:text-indigo-400"
              }
            >
              Complain
            </NavLink>
          </li>
          {isAuthenticatedUser ? (
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

export default HeaderMain;
