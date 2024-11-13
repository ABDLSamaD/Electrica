// components/Header.jsx
import {
  faRightFromBracket,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../OtherComponents/Alert";
import { useState } from "react";

const DashboardHeader = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const hanldeLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5120/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 3409);
        localStorage.clear();
        console.log(response.data.message);
      } else {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
        console.error("Logout unsuccessful:", response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
      setType(error.response?.data?.type);
      setAlert(error.response?.data?.type, error.response?.data?.message);
    }
  };

  const showProfile = () => {
    document.querySelector("#dropdown").classList.toggle("showdropdown");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center space-x-4">
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/db-au-user" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link
            to="/db-au-user/about"
            className="text-gray-600 hover:text-blue-600"
          >
            Reports
          </Link>
          <Link to="#/" className="text-gray-600 hover:text-blue-600">
            Settings
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 border rounded-full bg-gray-100 focus:outline-none"
          />
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center focus:outline-none"
            onClick={showProfile}
          >
            <div className="w-8 h-8 rounded-full">
              <FontAwesomeIcon icon={faUserTie} size="2xl" />
            </div>
          </button>
          {/* Dropdown Menu */}
          <div
            id="dropdown"
            className="absolute hidden z-50 right-0 mt-2 w-48 bg-white border rounded-md shadow-lg"
          >
            <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              <span className="text-base mr-2">Profile</span>
              <FontAwesomeIcon icon={faUser} />
            </button>
            <button
              onClick={hanldeLogout}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <span className="mr-2 text-base">Logout</span>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
