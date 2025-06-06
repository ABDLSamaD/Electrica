import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const VerificationReminder = ({ email, onClose, createdAt }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });
  const reminderRef = useRef(null);

  // Calculate time left based on when the account was created
  useEffect(() => {
    const calculateTimeLeft = () => {
      const creationTime = createdAt
        ? new Date(createdAt).getTime()
        : Date.now();
      const expiryTime = creationTime + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const now = Date.now();
      const difference = expiryTime - now;

      if (difference <= 0) {
        // Time expired
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // If time expired, you might want to handle it
      if (
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  // Shake animation every 5 minutes if not expanded
  useEffect(() => {
    if (!isExpanded && timeLeft.minutes % 5 === 0 && timeLeft.seconds === 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }
  }, [timeLeft, isExpanded]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reminderRef.current &&
        !reminderRef.current.contains(event.target) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleVerifyNow = () => {
    navigate("/otpverify");
  };

  const handleRemoveAccount = () => {
    // Here you would call your API to remove the account
    Cookies.remove("signup_email");
    Cookies.remove("signup_time");
    setIsExpanded(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Format time with leading zeros
  const formatTime = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <div
      ref={reminderRef}
      className={`
        fixed z-50 transition-all duration-300 ease-in-out
        ${
          isExpanded
            ? "top-28 right-4 sm:top-24 sm:right-6 w-full max-w-xs sm:max-w-sm"
            : "top-28 right-4 w-auto"
        }
      `}
    >
      {!isExpanded ? (
        // Collapsed state - small notification pill
        <button
          onClick={toggleExpand}
          className={`
            flex items-center space-x-2 bg-blue-800/70 
            text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl
            transition-all duration-300 group
            ${isShaking ? "animate-shake" : ""}
          `}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-400">
            Verify your email
          </span>
          <div className="hidden group-hover:block text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
            {formatTime(timeLeft.seconds)}
          </div>
        </button>
      ) : (
        // Expanded state - full notification card
        <div className="bg-gray-900/20 border border-solid backdrop-blur-2xl border-gray-800 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300">
          {/* Header with gradient */}
          <div className="bg-blue-950 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-white font-medium">
                Email Verification Required
              </h3>
            </div>
            <button
              onClick={toggleExpand}
              className="text-white/80 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 text-gray-300">
            <div className="mb-4">
              <p className="text-sm">
                Your account requires verification. Please verify your email{" "}
                <strong className="text-blue-400">{email}</strong> to access all
                features.
              </p>

              {/* Countdown timer */}
              <div className="mt-3 bg-gray-700/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">
                  Time remaining to verify:
                </p>
                <div className="flex justify-center space-x-2 text-white">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-white">
                      {formatTime(timeLeft.hours)}
                    </span>
                    <span className="text-xs text-gray-400">hours</span>
                  </div>
                  <span className="text-xl font-bold text-gray-300">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-white">
                      {formatTime(timeLeft.minutes)}
                    </span>
                    <span className="text-xs text-gray-400">minutes</span>
                  </div>
                  <span className="text-xl font-bold text-gray-300">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-white">
                      {formatTime(timeLeft.seconds)}
                    </span>
                    <span className="text-xs text-gray-400">seconds</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={handleVerifyNow}
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium rounded-md hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
              >
                Verify Now
              </button>

              <button
                onClick={toggleExpand}
                className="w-full py-2 px-4 bg-gray-800 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-700 transition-colors"
              >
                Remind Me Later
              </button>

              <div className="pt-2 border-t border-gray-800 mt-2">
                <button
                  onClick={handleRemoveAccount}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center justify-center w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReminder;
