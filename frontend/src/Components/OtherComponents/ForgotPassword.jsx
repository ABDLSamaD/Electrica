import { faArrowLeft, faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert";

const ForgotPassword = ({
  alert,
  handleForgotPassword,
  linkprevious,
  email,
  setEmail,
  setAlert,
}) => {
  return (
    <div className="max-w-md mx-auto p-6 flex h-screen flex-col justify-center">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="w-full bg-orange-200/10 backdrop-blur-md shadow-xl p-4">
        <div className="flex items-center justify-center flex-col gap-2">
          <FontAwesomeIcon icon={faFingerprint} size="4x" color="orange" />
          <h2 className="text-4xl font-bold text-center text-orange-500 mb-5">
            Forgot Password
          </h2>
          <p className="text-orange-200 mb-5">
            No worries, we'll send you reset instruction
          </p>
        </div>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-3 bg-transparent text-white border border-solid border-orange-500 focus:border-orange-700 rounded-lg mb-4"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Send OTP
          </button>
          <div
            className="flex items-center justify-center mt-4"
            title="back to login"
          >
            <Link to={linkprevious}>
              <FontAwesomeIcon icon={faArrowLeft} size="sm" color="orange" />
              <span className="mx-2 text-orange-500">back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
