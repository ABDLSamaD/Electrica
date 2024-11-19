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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5120/api/auth/reset-password",
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
      setMessage(err.response?.data?.message || "Failed to send OTP");
      setType(err.response?.data?.type);
      setAlert(err.response?.data?.type, err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 flex h-screen flex-col justify-center">
      <div className="container shadow-xl p-4">
        {alert && (
          <Alert type={type} message={message} onClose={() => setAlert(null)} />
        )}
        <div className="flex items-center justify-center flex-col">
          <FontAwesomeIcon icon={faLock} size="2x" />
          <h2 className="text-4xl font-bold text-gray-800 mb-5 mt-2">
            Reset Password
          </h2>
          <p className="mb-5 text-gray-500">Must be at least 8 characters</p>
        </div>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
          <div
            className="flex items-center justify-center mt-4"
            title="back to login"
          >
            <Link to="/signin">
              <FontAwesomeIcon icon={faArrowLeft} size="sm" />
              <span className="mx-2">back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
