import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../OtherComponents/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import InputForm from "../OtherComponents/InputForm";
import Loader from "../OtherComponents/Loader";
import { UAParser } from "ua-parser-js";

const Signin = () => {
  // naviagation
  const navigate = useNavigate();

  // States start
  const [alert, setAlert] = useState(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loader, setLoader] = useState(false);
  // States end

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox input
    }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoader(false);
    const { email, password, rememberMe } = credentials;

    try {
      // / Step 1: Get IP address from a public API
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipResponse.data.ip;

      // Step 2: Get device details using UAParser
      const parser = new UAParser();
      const userAgent = navigator.userAgent;
      const deviceInfo = parser.setUA(userAgent).getResult();

      const response = await axios.post(
        "http://localhost:5120/api/auth/signin",
        {
          email,
          password,
          rememberMe,
          ipAddress,
          deviceInfo,
        },
        { withCredentials: true }
      );
      const data = await response.data;
      if (response.status === 200) {
        setLoader(true);
        // localStorage.setItem("dshbrd_usr_tkn", data.token);
        setAlert({ type: data.type, message: data.message });
        setTimeout(() => {
          navigate("/db-au-user");
        }, 5000);
      } else {
        setLoader(false);
        setAlert({ type: data.type, message: data.message });
      }
    } catch (err) {
      setLoader(false);
      setAlert({
        type: err.response?.data?.type || "error",
        message: err.response?.data?.message || "Network Error",
      });
    }
  };

  return (
    <>
      {loader === true ? <Loader /> : null}
      <div id="signin">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <div className="back relative w-full text-3xl pt-2 transition-all text-gray-200">
          <Link to="/" className="mx-2" title="Go back">
            <FontAwesomeIcon icon={faArrowLeft} size="2xs" />
          </Link>
        </div>
        <div className="w-90 relative h-full flex items-center justify-center flex-col">
          <InputForm
            hanldeLogin={handleSignin}
            onChange={onChange}
            credential={credentials}
            passLink={"/forgot_password"}
          />
          <p className="mt-4 text-center text-sm text-gray-400">
            Not a member?
            <Link
              to="/signup"
              className="text-cyan-600 ml-1 font-bold text-sm hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signin;
