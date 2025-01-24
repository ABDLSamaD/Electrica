import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const resetToken = localStorage.getItem("reset_token_forgot");
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${electricaURL}/api/auth/reset-password`,
        {
          newPassword,
          resetToken,
        }
      );
      if (response.status === 200) {
        localStorage.clear();
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        setMessage(message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
      setType(err.response?.data?.type);
      setAlert(
        err.response?.data?.type,
        err.response?.data?.message || "Failed to reset password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {alert && (
          <Alert type={type} message={message} onClose={() => setAlert(null)} />
        )}
        <div className="flex flex-col items-center text-center">
          <FontAwesomeIcon
            icon={faLock}
            size="3x"
            className="text-blue-600 mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Reset Your Password
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Create a new password that's at least 8 characters long.
          </p>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="relative">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Reset Password
          </button>
          <div className="text-center mt-4">
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 transition-all flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
