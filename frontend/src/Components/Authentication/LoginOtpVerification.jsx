"use client";

import { useRef, useEffect } from "react";
import Miniloader from "../OtherComponents/Miniloader";

export default function LoginOtpVerification({
  handleOtpSubmit,
  setOtp,
  otp,
  loading,
}) {
  const inputRefs = useRef([]);

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted content is a number and has correct length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6);
      const newOtp = [...otp];

      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });

      setOtp(newOtp);

      // Focus on the appropriate input after paste
      if (digits.length < 6 && inputRefs.current[digits.length]) {
        inputRefs.current[digits.length].focus();
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative bg-gradient-to-br from-gray-900 to-gray-800 border border-solid border-gray-700 text-white shadow-2xl rounded-xl p-8 backdrop-blur-md">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="inline-block text-blue-400 hover:text-blue-300 transition-colors"
          title="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>

        <div className="text-sm text-gray-400">Secure Login</div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Verification Code
        </h1>
        <p className="text-gray-400 text-sm">
          We've sent a 6-digit code to your email
        </p>
      </div>
      <form onSubmit={handleOtpSubmit}>
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className="sm:w-12 w-8 h-12 text-center text-xl font-bold p-2 text-white bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : null}
                disabled={loading}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Miniloader /> : "Verify & Continue"}
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-gray-500">
        By continuing, you agree to our
        <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">
          Terms of Service
        </a>
      </div>
    </div>
  );
}
