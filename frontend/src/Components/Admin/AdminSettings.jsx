import axios from "axios";
import React from "react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Alert from "../OtherComponents/Alert";

const AdminSettings = () => {
  const { admin, electricaURL } = useOutletContext();

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setALert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${electricaURL}/api/adminauth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setALert({ type: response.data.type, message: response.data.message });
        setCurrentPassword("");
        setNewPassword("");

        setLoading(false);
      } else {
        setALert({ type: response.data.type, message: response.data.message });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setALert({
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-2 lg:p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="w-full max-w-4xl bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl lg:p-8 p-3 border border-white/10">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Admin Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-md border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  value={admin.username}
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={admin.email}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg mt-4 transition-all duration-300">
                Update Account
              </button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-md border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Preferences
            </h2>
            <div className="space-y-4">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  Enable Notifications
                </span>
                <button
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    notifications ? "bg-green-500" : "bg-gray-600"
                  }`}
                  onClick={() => setNotifications(!notifications)}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      notifications ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Dark Mode</span>
                <button
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    darkMode ? "bg-green-500" : "bg-gray-600"
                  }`}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      darkMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Auto Update Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto Update</span>
                <button
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    autoUpdate ? "bg-green-500" : "bg-gray-600"
                  }`}
                  onClick={() => setAutoUpdate(!autoUpdate)}
                >
                  <span
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      autoUpdate ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-md mt-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-white">Security</h2>
          <form className="space-y-4" onSubmit={handleChangePassword}>
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setALert(null)}
              />
            )}
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Current Password
              </label>
              <input
                id="current-password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                New Password
              </label>
              <input
                id="new-password"
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <button
              className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg mt-4 transition-all duration-300"
              type="submit"
              disabled={loading}
            >
              {loading ? " Updated Password.." : " Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
