import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "../OtherComponents/Alert";
import PasswordChecker from "../OtherComponents/PasswordChecker";
import LoginLoader from "../OtherComponents/LoginLoader";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const [credentials, setCredenetials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    {
      id: "length",
      test: (pwd) => pwd.length >= 8,
      label: "At least 8 characters",
    },
    {
      id: "uppercase",
      test: (pwd) => /[A-Z]/.test(pwd),
      label: "One uppercase letter",
    },
    { id: "number", test: (pwd) => /\d/.test(pwd), label: "One number" },
  ];
  const allRequirementsMet = passwordRules.every((rule) =>
    rule.test(credentials.password)
  );

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredenetials({ ...credentials, [name]: value });
  };

  const signupUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { name, email, password } = credentials;
      const response = await axios.post(`${electricaURL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("us-em-temporary", email);
        setAlert({ type: response.data.type, message: response.data.message });
        setTimeout(() => {
          setLoading(false);
          navigate("/otpverify");
        }, 1900);
      } else {
        setLoading(false);
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        type: err.response?.data?.type || "error",
        message: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div
      id="signup"
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
    >
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="w-full max-w-md p-6 bg-white/5 backdrop-blur-lg rounded-lg shadow-md sm:max-w-lg">
        <form onSubmit={signupUser} className="flex flex-col gap-6">
          <Link
            to="/signin"
            title="Go back"
            className="text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </Link>
          <h2 className="text-2xl text-center font-bold text-gray-900">
            Create New Account
          </h2>
          <p className="text-gray-500 text-sm text-center">
            Please register by filling in your personal data.
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-gray-600 text-sm">
              Name
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                id="name"
                name="name"
                required
                className="input_field pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Your name"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-600 text-sm">
              Email
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                id="email"
                name="email"
                required
                className="input_field pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="name@email.com"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-600 text-sm">
              Password
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
              />
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                required
                className="input_field pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Enter your password"
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <FontAwesomeIcon
                icon={isPasswordVisible ? faEyeSlash : faEye}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            </div>
            {isFocused && !allRequirementsMet && (
              <PasswordChecker
                password={credentials.password}
                passwordRules={passwordRules}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="privacy-policy" required />
            <label htmlFor="privacy-policy" className="text-sm text-gray-600">
              I accept the <span className="text-blue-600">Privacy Policy</span>
              .
            </label>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? <LoginLoader /> : "Signup"}
            {!loading && <FontAwesomeIcon icon={faUserPlus} className="ml-2" />}
          </button>
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
