import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../OtherComponents/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import InputForm from "../OtherComponents/InputForm";
import Loader from "../OtherComponents/Loader";
import { UAParser } from "ua-parser-js";

const SignIn = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  // States
  const [alert, setAlert] = useState(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [miniLoader, setMiniLoader] = useState(false); // Mini loader for button

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox input
    }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setMiniLoader(true); // Start mini loader

    const { email, password, rememberMe } = credentials;

    try {
      // Step 1: Get IP address
      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = ipResponse.data.ip;

      // Step 2: Get device details using UAParser
      const parser = new UAParser();
      const userAgent = navigator.userAgent;
      const deviceInfo = parser.setUA(userAgent).getResult();

      // Step 3: Hit API
      const response = await axios.post(
        `${electricaURL}/api/auth/signin`,
        { email, password, rememberMe, ipAddress, deviceInfo },
        { withCredentials: true }
      );

      const data = response.data;

      if (response.status === 200) {
        setMiniLoader(false); // Stop mini loader
        setAlert({ type: data.type, message: data.message });

        setTimeout(() => {
          navigate("/db-au-user");
        }, 3000);
      } else {
        setMiniLoader(false); // Stop mini loader
        setAlert({ type: data.type, message: data.message });
      }
    } catch (err) {
      setMiniLoader(false); // Stop mini loader
      setAlert({
        type: err.response?.data?.type || "error",
        message: err.response?.data?.message || "Network Error",
      });
    }
  };

  return (
    <>
      <div
        id="signin"
        className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8"
      >
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <div className="w-full max-w-md form_container rounded-xl p-6 sm:p-8">
          <div className="back relative w-full text-3xl pt-2 transition-all text-gray-200">
            <Link to="/" className="mx-2 text-gray-200" title="Go back">
              <FontAwesomeIcon icon={faArrowLeft} size="2xs" color="gray" />
            </Link>
          </div>
          <InputForm
            hanldeLogin={handleSignin}
            onChange={onChange}
            credential={credentials}
            passLink={"/forgot_password"}
            miniLoader={miniLoader}
          />
          <p className="mt-4 text-center text-sm text-gray-400">
            Not a member?
            <Link
              to="/signup"
              className={`text-cyan-600 ml-1 font-bold text-sm hover:underline ${
                miniLoader ? "pointer-events-none opacity-60" : ""
              }`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
