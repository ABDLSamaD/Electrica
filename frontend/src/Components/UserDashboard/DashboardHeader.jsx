import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faHome,
  // faFileAlt,
  // faCog,
  // faPalette,
  // faChartLine,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Alert from "../OtherComponents/Alert";
import "./dashboard.css";

const DashboardHeader = (props) => {
  const { user } = props;
  const navigate = useNavigate(); // for navigation

  // States dealing start
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  // States dealing end

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

  return (
    <>
      {alert && (
        <Alert type={type} message={message} onClose={() => setAlert(null)} />
      )}

      <div className="relative">
        <div className="row relative left-36 bg-red-600 flex items-center justify-between">
          <div className="bar cursor-pointer">
            <FontAwesomeIcon
              icon={faBars}
              size="sm"
              style={{ color: "#B197FC" }}
            />
          </div>
          <div className="search">
            <p>search here</p>
          </div>
        </div>
        <div className="row w-10 md:w-20 ">
          <div className="p-4 text-xl font-bold text-center border-b border-gray-700">
            My Dashboard
          </div>

          <nav className="relative"></nav>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
