import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../Private/apiClient";

const Header = ({ isAuthenticatedAdmin }) => {
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); // State for sidebar
  const localhost = "http://localhost:5120";

  // for checking user auth
  useEffect(() => {
    if (!document.cookie.includes("connect.sid")) {
      // Skip API call if no session cookie is present
      setIsAuthenticatedUser(false);
      return;
    }
    const checkAuth = async () => {
      try {
        const response = await apiClient.get("api/auth/check-auth");
        if (response.status === 200) {
          if (response.data.isAuthenticated) {
            setIsAuthenticatedUser(true);
          }
        } else {
          setIsAuthenticatedUser(false);
        }
      } catch {
        setIsAuthenticatedUser(false);
      }
    };

    checkAuth();
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
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
            <Link to="/" className="text-gray-300 hover:text-indigo-400">
              Home
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-indigo-400">
              About
            </Link>
            <Link
              to="/project-details"
              className="text-gray-300 hover:text-indigo-400"
            >
              Project
            </Link>
            <Link to="/service" className="text-gray-300 hover:text-indigo-400">
              Services
            </Link>
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
      </div>
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleNav}
        ></div>
      )}
      <nav
        className={`fixed top-0 left-0 w-64 h-full bg-gray-900/10 backdrop-blur-md text-white transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
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
          <li>
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
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
