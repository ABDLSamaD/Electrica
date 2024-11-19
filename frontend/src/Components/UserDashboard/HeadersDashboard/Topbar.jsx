import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faCog,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";

const Topbar = ({ toggleSidebar, user }) => {
  const navigate = useNavigate();

  // states start
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // states end

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

  // logout function
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
        navigate("/signin");
        localStorage.clear();
      } else {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
      setType(error.response?.data?.type);
      setAlert(error.response?.data?.type, error.response?.data?.message);
    }
  };

  return (
    <>
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}
      <div className="h-16 bg-gray-100 shadow flex items-center justify-between md:px-4 px-1 relative">
        <div className="flex items-center space-x-2 md:space-x-9">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} className="text-lg" />
          </button>

          {/* Search Bar */}
          <div className="flex items-center md:p-2 bg-gray-200 rounded-md p-2">
            <FontAwesomeIcon icon={faSearch} className="text-gray-800 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent focus:outline-none w-32"
            />
          </div>
        </div>

        {/* Right Section - Profile Icon */}
        <div className="relative" ref={dropdownRef}>
          <img
            src={user.profileImg}
            alt="Image does'nt show"
            className="cursor-pointer w-12 h-12 rounded-3xl object-cover"
            onClick={toggleDropdown}
          />

          {/* drop down */}
          {isDropdownOpen && (
            <div
              id="profiledisplay"
              className="section-display bg-white shadow-lg absolute top-14 right-0 rounded z-50"
            >
              <div className="text py-4 px-3 w-full mr-28">
                <h2 className="mb-1 w-full">{user.name}</h2>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div
                style={{ borderBottom: "1px solid grey" }}
                className="line w-full h-auto"
              ></div>
              <div className="links flex flex-col m-2 justify-center">
                <Link
                  className="hover:bg-red-100 rounded transition-all p-2 flex items-center"
                  to="/db-au-user/db-au-setting"
                >
                  <FontAwesomeIcon icon={faCog} style={{ color: "#B197FC" }} />
                  <span className="ml-2 text-base">Settings</span>
                </Link>
                <Link
                  className="hover:bg-red-100 rounded transition-all p-2 flex items-center"
                  to="/db-au-user/db-au-profile"
                >
                  <FontAwesomeIcon icon={faUser} style={{ color: "#B197FC" }} />
                  <span className="ml-2 text-base">Profile</span>
                </Link>
                <Link
                  className="hover:bg-red-100 transition-all rounded p-2 flex items-center"
                  onClick={hanldeLogout}
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    style={{ color: "#B197FC" }}
                  />
                  <span className="ml-2 text-base">Logout</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Topbar;
