import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import axios from "axios";
import { Lock } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";

const ResetAdminPassword = () => {
  const navigate = useNavigate();
  const resetToken = localStorage.getItem("admn_resttokn");
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminAuth/reset-paswrd`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
        localStorage.clear();
        setTimeout(() => {
          navigate("/admn-sign");
        }, 1450);
      } else {
        setMessage(response.data.message);
        setType(response.data.type);
        setAlert(response.data.type, response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.error?.message);
      setType(error.response?.error?.type);
      setAlert(
        error.response?.error?.type,
        error.response?.error?.message || "Internal Server Error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        {alert && (
          <Alert type={type} message={message} onClose={() => setAlert(null)} />
        )}
        <div className="flex flex-col items-center justify-center space-y-4">
          <Lock size={32} className="text-orange-500" />

          <h2 className="text-3xl font-bold text-orange-500">Reset Password</h2>
          <p className="text-gray-300">Must be at least 8 characters</p>
        </div>
        <form onSubmit={handleResetPassword} className="mt-6 space-y-6">
          <input
            type="password"
            value={newPassword}
            name="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Reset Password
          </button>
          <div className="flex items-center justify-center mt-4">
            <Link
              to="/signin"
              className="flex items-center text-gray-300 hover:text-orange-500 transition duration-300"
            >
              <FaArrowLeft className="h-3 w-3 text-gray-400" />
              <span className="ml-2">Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetAdminPassword;
