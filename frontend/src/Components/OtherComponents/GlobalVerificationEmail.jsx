import React from "react";
import Alert from "./Alert";
import { Link } from "react-router-dom";
import LoginLoader from "./LoginLoader";

const GlobalVerificationEmail = ({
  alert,
  setAlert,
  handleOtpForm,
  otp,
  handleChange,
  resendOtp,
  resendForgotOtp,
  loading,
  onkeyDown,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-orange-500 opacity-30 blur-2xl"></div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="relative bg-gray-800/90 text-white shadow-2xl rounded-lg p-8 w-full max-w-md backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-3">OTP Verification</h1>
          <p className="text-gray-400 text-sm">
            Enter the OTP we sent to your email. The OTP is valid for 10
            minutes.
          </p>
        </div>

        <form onSubmit={handleOtpForm} className="mt-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                required
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => onkeyDown(e, index)}
                className="w-12 h-12 text-center text-xl bg-gray-700/70 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-gray-800 placeholder-gray-400"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold p-3 rounded-lg transition-all transform hover:scale-105 focus:scale-105"
            disabled={loading}
          >
            {loading ? <LoginLoader /> : "Confirm OTP"}
          </button>
        </form>

        <div className="mt-6 h-auto bg-gray-700/40 p-4 rounded-lg text-sm">
          <p>
            <span className="font-semibold text-orange-500">Note:</span> If you
            did not receive the OTP, please check your spam folder or click the
            button below to resend it.
          </p>
          <Link
            to="https://mail.google.com/mail"
            className="underline"
            target="_blank"
          >
            Gmail
          </Link>
        </div>

        <div className="mt-4">
          <button
            onClick={resendOtp || resendForgotOtp}
            className="button-86 active:scale-105"
          >
            <span className="text-white">
              {loading ? "Otp resend" : "Resend OTP"}
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full blur-3xl opacity-20"></div>
    </div>
  );
};

export default GlobalVerificationEmail;
