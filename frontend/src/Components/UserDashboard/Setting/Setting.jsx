import axios from "axios";
import React, { useState } from "react";
import Alert from "../../OtherComponents/Alert";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiBell,
  FiKey,
  FiLock,
  FiMail,
  FiSmartphone,
} from "react-icons/fi";
import DeleteAccount from "./DeleteAccount";
import { useOutletContext } from "react-router-dom";
import { useAlert } from "../../OtherComponents/AlertProvider";

const ToggleSwitch = ({ checked, label }) => (
  <label className="flex items-center justify-between cursor-pointer group">
    <span className="text-gray-300">{label}</span>
    <div className="relative">
      <input type="checkbox" checked={checked} className="sr-only" />
      <div
        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-indigo-600" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
    </div>
  </label>
);
const AnimatedInput = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-1 w-full"
    >
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}

      <motion.input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/5 rounded-lg border ${
          error ? "border-red-500" : "border-white/10"
        } focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all`}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-500 text-sm mt-1"
        >
          <FiAlertCircle className="flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

const Setting = () => {
  const { user } = useOutletContext();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const { success, error } = useAlert();
  // State for notifications
  const [emailNotifications, setEmailNotifications] = useState({
    productUpdates: true,
    securityUpdates: false,
  });
  const [phoneNotifications, setPhoneNotifications] = useState({
    email: true,
    securityUpdates: false,
  });

  // State for password fields
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Validation and submission for passwords
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    const validationErrors = {};
    if (!passwords.oldPassword)
      validationErrors.oldPassword = "Old password is required.";
    if (!passwords.newPassword)
      validationErrors.newPassword = "New password is required.";
    if (passwords.newPassword !== passwords.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    const { oldPassword, newPassword } = passwords;
    e.preventDefault();
    if (validatePasswords()) {
      // Submit password change logic
      try {
        const response = await axios.post(
          `${electricaURL}/api/auth/change-password`,
          {
            oldPassword,
            newPassword,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          success(response.data.message);
          setPasswords("");
        } else {
          error(response.data.message);
        }
      } catch (err) {
        error(err.response?.data?.message);
      }
    }
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6 space-y-8 relative top-8 min-h-screen mb-16"
      >
        {/* Header */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Account Settings
          </h1>
          <p className="text-gray-400">Manage your account preferences</p>
        </motion.div>

        {/* Notifications Section */}
        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiBell className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-300">
                <FiMail className="w-5 h-5" />
                <h3 className="font-medium">Email</h3>
              </div>
              <ToggleSwitch
                label="Product Updates"
                checked={emailNotifications.productUpdates}
              />
              <ToggleSwitch
                label="Security Updates"
                checked={emailNotifications.securityUpdates}
              />
            </div>

            {/* Phone Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-300">
                <FiSmartphone className="w-5 h-5" />
                <h3 className="font-medium">Phone</h3>
              </div>
              <ToggleSwitch
                label="Email Notifications"
                checked={phoneNotifications.email}
              />
              <ToggleSwitch
                label="Security Updates"
                checked={phoneNotifications.securityUpdates}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Save Preferences
          </motion.button>
        </motion.section>

        {/* Password Section */}
        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <FiLock className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold">Password Security</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <AnimatedInput
              type="password"
              name="oldPassword"
              label="Current Password"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              error={errors.oldPassword}
              icon={FiLock}
            />

            <AnimatedInput
              type="password"
              name="newPassword"
              label="New Password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
              icon={FiKey}
            />

            <AnimatedInput
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
              icon={FiKey}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              Update Password
            </motion.button>
          </form>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-red-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <FiAlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <DeleteAccount userId={user._id} name={user.name} />
          </div>
        </motion.section>
      </motion.div>
    </React.Fragment>
  );
};

export default Setting;
