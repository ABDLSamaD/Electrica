"use client";

import { useEffect, useRef } from "react";
import {
  FaEnvelope,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const GlobalVerificationEmail = ({
  handleOtpForm,
  otp,
  handleChange,
  resendOtp,
  loading,
  onkeyDown,
  loadingResend,
}) => {
  // Create refs for each input
  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp.length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.3; }
      }
      .animate-pulse {
        animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    `;
      document.head.appendChild(style);

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Main card */}
      <div className="relative border-solid bg-gray-900/80 text-white shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-md backdrop-blur-md border border-gray-700/50 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
            <FaEnvelope className="text-blue-500 text-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-white">
            Verify Your Email
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the 6-digit code we sent to your email.
            <br />
            The code is valid for 10 minutes.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleOtpForm} className="mt-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                required
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => onkeyDown(e, index)}
                className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl bg-gray-700/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800/90 placeholder-gray-400 border border-gray-600/50 transition-all"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all transform hover:scale-[1.02] focus:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* Resend button */}
        <div className="mt-6 text-center">
          <button
            id="resendOtpButton"
            onClick={resendOtp}
            disabled={loadingResend}
            className="resend-otp-button relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-500 transition duration-300 ease-out border border-gray-500/30 rounded-lg shadow-md group"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
              <FaEnvelope className="mr-2" />
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
              {loadingResend ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Resend Code"
              )}
            </span>
            <span className="relative invisible">Resend Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalVerificationEmail;
