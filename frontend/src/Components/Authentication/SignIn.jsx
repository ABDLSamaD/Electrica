"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../OtherComponents/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import InputForm from "./InputForm";
import { UAParser } from "ua-parser-js";
import LoaderAll from "../OtherComponents/LoaderAll";

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
  const [miniLoader, setMiniLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setMiniLoader(true);
    setLoading(true);

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
        setMiniLoader(false);
        setLoginSuccess(true);
        setAlert({ type: data.type, message: data.message });

        setTimeout(() => {
          navigate("/db-au-user");
          setLoading(false);
          setLoginSuccess(false);
        }, 1500);
      } else {
        setLoading(false);
        setMiniLoader(false);
        setAlert({ type: data.type, message: data.message });
      }
    } catch (err) {
      setLoading(false);
      setMiniLoader(false);
      setAlert({
        type: err.response?.data?.type || "error",
        message: err.response?.data?.message || "Network Error",
      });
    }
  };

  return (
    <div
      id="signin"
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 sm:p-8"
    >
      {/* Show loader when login is successful */}
      {loginSuccess && (
        <div className="fixed inset-0 flex items-start pt-[20%] justify-center z-50 backdrop-blur-md">
          <LoaderAll />
        </div>
      )}

      {/* Alert notification */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Main form container */}
      <div
        className={`w-full max-w-md relative bg-gray-800/90 text-white shadow-2xl rounded-xl p-8 backdrop-blur-md border border-gray-700/50 ${
          loginSuccess ? "opacity-50 pointer-events-none filter blur-sm" : ""
        }`}
      >
        <div className="mb-6">
          <Link
            to="/"
            className="inline-block text-blue-400 hover:text-blue-300 transition-colors"
            title="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your Electrica dashboard
          </p>
        </div>

        <InputForm
          hanldeLogin={handleSignin}
          onChange={onChange}
          credential={credentials}
          passLink={"/forgot_password"}
          miniLoader={miniLoader}
          disabled={loading || loginSuccess}
        />

        <div className="mt-6 h-auto bg-gray-700/40 p-4 rounded-lg text-sm">
          <p className="text-center text-gray-300">
            Not a member?{" "}
            <Link
              to="/signup"
              className={`text-blue-400 hover:text-blue-300 font-medium hover:underline ${
                loading || loginSuccess ? "pointer-events-none opacity-60" : ""
              }`}
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
