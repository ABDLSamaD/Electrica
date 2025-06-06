"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

// Import icons from react-icons
import {
  FaArrowLeft,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import Alert from "../OtherComponents/Alert";

// Password Checker component
const PasswordChecker = ({ password, passwordRules }) => {
  return (
    <div className="mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <p className="text-sm font-medium mb-2 text-gray-300">
        Password must have:
      </p>
      <ul className="space-y-1">
        {passwordRules.map((rule) => {
          const passed = rule.test(password);
          return (
            <li key={rule.id} className="flex items-center text-sm">
              {passed ? (
                <FaCheckCircle className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <FaExclamationCircle className="mr-2 h-4 w-4 text-gray-500" />
              )}
              <span className={passed ? "text-green-400" : "text-gray-400"}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Mini loader component
const Miniloader = () => {
  return (
    <div className="flex justify-center">
      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
    </div>
  );
};

// Unique loader component for Electrica
const LoaderAll = ({ message, progress }) => {
  return (
    <div className="fixed inset-0 flex items-start pt-[20%] justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-blue-500/30 flex flex-col items-center max-w-sm w-full">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
            <div className="text-blue-500 text-2xl">⚡</div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
        <p className="text-gray-400 text-center mb-4">
          Setting up your energy management dashboard...
        </p>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full animate-pulse"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    termsAndCondition: false,
  });
  const [alert, setAlert] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Processing Your Request"
  );

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
    const { name, type, checked, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Simulate loading progress
  const simulateProgress = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  };

  const signupUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage("Validating Your Information");

    // Start the loading animation
    const clearProgressInterval = simulateProgress();

    try {
      const { name, email, password, termsAndCondition } = credentials;

      // After 1 second, update the loading message
      setTimeout(() => {
        setLoadingMessage("Creating Your Account");
        setLoadingProgress(30);
      }, 1000);

      const response = await axios.post(`${electricaURL}/api/auth/signup`, {
        name,
        email,
        password,
        termsAndCondition,
      });

      if (response.status === 200) {
        Cookies.set("signup_email", email, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });

        Cookies.set("signup_time", Date.now().toString(), {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        }); // store signup time

        // Update loading message and progress
        setLoadingMessage("Account Created Successfully!");
        setLoadingProgress(100);
        setSignupSuccess(true);
        setAlert({ type: response.data.type, message: response.data.message });

        setTimeout(() => {
          setIsLoading(false);
          clearProgressInterval();
          navigate("/otpverify");
        }, 1500);
      } else {
        setIsLoading(false);
        clearProgressInterval();
        setAlert({ type: response.data.type, message: response.data.message });
      }
    } catch (err) {
      setIsLoading(false);
      clearProgressInterval();
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
      {isLoading && (
        <LoaderAll message={loadingMessage} progress={loadingProgress} />
      )}

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-2xl sm:max-w-lg border border-blue-500/20">
        <form
          onSubmit={signupUser}
          className={`flex flex-col gap-6 ${
            isLoading ? "opacity-50 pointer-events-none filter blur-sm" : ""
          }`}
        >
          <Link
            to="/signin"
            className="text-blue-400 hover:text-blue-300 transition-colors w-fit"
            aria-label="Go back to sign in"
          >
            <FaArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">
              Join Electrica
            </h1>
            <p className="text-gray-400 text-sm">
              Create your account to manage your energy consumption and save
              costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <FaCheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Real-time Monitoring
                </h3>
                <p className="text-xs text-gray-400">
                  Track energy usage instantly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <FaCheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Cost Savings</h3>
                <p className="text-xs text-gray-400">
                  Reduce your energy bills
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-gray-300 text-sm">
              Name
            </label>
            <div className="relative">
              <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isLoading}
                className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-300 text-sm">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isLoading}
                className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-300 text-sm">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-10 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {isPasswordVisible ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {isFocused && !allRequirementsMet && (
              <PasswordChecker
                password={credentials.password}
                passwordRules={passwordRules}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="privacy-policy"
              required
              disabled={isLoading}
              name="termsAndCondition"
              onChange={onChange}
              checked={credentials.termsAndCondition}
              className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="privacy-policy" className="text-sm text-gray-400">
              I accept the{" "}
              <Link
                to="/privacy-policy"
                className="text-blue-400 hover:text-blue-300"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Miniloader />
            ) : (
              <>
                Sign Up
                <FaUserPlus className="ml-2 inline-block h-4 w-4" />
              </>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300">
                Login
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              After signup, you'll receive an OTP to verify your email
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
