import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginLoader from "../../OtherComponents/LoginLoader";
import { useAlert } from "../../OtherComponents/AlertProvider";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { success, error, warning } = useAlert();

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const resetToken = localStorage.getItem("reset_token_forgot");
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        success(response.data.message);
        setLoading(false);
        setTimeout(() => {
          navigate("/signin");
        }, 1200);
      } else {
        setLoading(false);
        warning(response.data.message);
      }
    } catch (err) {
      setLoading(false);
      error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 p-8"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FontAwesomeIcon
              icon={faLock}
              size="3x"
              className="text-blue-600 mb-4"
            />
          </motion.div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Reset Your Password
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Create a new password that's at least 8 characters long.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative"
          >
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            disabled={loading}
          >
            {loading ? <LoginLoader /> : "Reset Password"}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-center mt-4"
          >
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 transition-all flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Login
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
