"use client";

import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  User,
  Settings,
  Shield,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

function Alert({ type, message, onClose }) {
  const alertStyles = {
    success: "bg-green-500/20 border-green-400/30 text-green-100",
    error: "bg-red-500/20 border-red-400/30 text-red-100",
    warning: "bg-yellow-500/20 border-yellow-400/30 text-yellow-100",
    info: "bg-blue-500/20 border-blue-400/30 text-blue-100",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Settings className="w-5 h-5" />,
  };

  return (
    <motion.div
      className={`flex items-center space-x-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${alertStyles[type]}`}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {icons[type]}
      <span className="font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

const AdminSettings = () => {
  const { admin, electricaURL } = useOutletContext();
  const [activeTab, setActiveTab] = useState("account");

  // Account Settings
  const [username, setUsername] = useState(admin?.username || "");
  const [email, setEmail] = useState(admin?.email || "");

  // Preferences
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // System Settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [logLevel, setLogLevel] = useState("info");

  // Loading and Alert States
  const [loading, setLoading] = useState({
    account: false,
    preferences: false,
    security: false,
    system: false,
  });
  const [alert, setAlert] = useState(null);

  const tabs = [
    {
      id: "account",
      label: "Account",
      icon: User,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Settings,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "system",
      label: "System",
      icon: Server,
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, account: true });

    try {
      const response = await axios.put(
        `${electricaURL}/api/admin/update-account`,
        { username, email },
        { withCredentials: true }
      );

      setAlert({ type: "success", message: "Account updated successfully!" });
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to update account",
      });
    } finally {
      setLoading({ ...loading, account: false });
    }
  };

  const handleUpdatePreferences = async () => {
    setLoading({ ...loading, preferences: true });

    try {
      const response = await axios.put(
        `${electricaURL}/api/admin/update-preferences`,
        {
          darkMode,
          notifications,
          emailNotifications,
          autoUpdate,
          autoBackup,
        },
        { withCredentials: true }
      );

      setAlert({
        type: "success",
        message: "Preferences updated successfully!",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update preferences",
      });
    } finally {
      setLoading({ ...loading, preferences: false });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "New passwords do not match!" });
      return;
    }

    if (newPassword.length < 8) {
      setAlert({
        type: "error",
        message: "Password must be at least 8 characters long!",
      });
      return;
    }

    setLoading({ ...loading, security: true });

    try {
      const response = await axios.post(
        `${electricaURL}/api/admin/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      setAlert({ type: "success", message: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to change password",
      });
    } finally {
      setLoading({ ...loading, security: false });
    }
  };

  const handleUpdateSystemSettings = async () => {
    setLoading({ ...loading, system: true });

    try {
      const response = await axios.put(
        `${electricaURL}/api/admin/system-settings`,
        {
          maintenanceMode,
          debugMode,
          logLevel,
        },
        { withCredentials: true }
      );

      setAlert({
        type: "success",
        message: "System settings updated successfully!",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update system settings",
      });
    } finally {
      setLoading({ ...loading, system: false });
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/10 hover:bg-white/[0.05] transition-all duration-300">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        <p className="text-white/60 text-sm mt-1">{description}</p>
      </div>
      <button
        className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
          enabled ? "bg-green-500" : "bg-white/20"
        }`}
        onClick={onToggle}
      >
        <motion.span
          className="w-5 h-5 bg-white rounded-full shadow-md"
          animate={{ x: enabled ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-8 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Admin Settings
                </h1>
                <p className="text-white/60 text-lg">
                  Manage your account, preferences, and system configuration
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert */}
        <AnimatePresence>
          {alert && (
            <motion.div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-6 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] overflow-hidden">
              <AnimatePresence mode="wait">
                {/* Account Settings */}
                {activeTab === "account" && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <User className="w-6 h-6 text-blue-400" />
                      <h2 className="text-2xl font-bold text-white">
                        Account Settings
                      </h2>
                    </div>

                    <form onSubmit={handleUpdateAccount} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Username
                          </label>
                          <div className="relative">
                            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                              placeholder="Enter username"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading.account}
                          className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 rounded-xl transition-all duration-300 font-medium backdrop-blur-xl disabled:opacity-50"
                        >
                          {loading.account ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          <span>
                            {loading.account ? "Updating..." : "Update Account"}
                          </span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Preferences */}
                {activeTab === "preferences" && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-6 h-6 text-green-400" />
                        <h2 className="text-2xl font-bold text-white">
                          Preferences
                        </h2>
                      </div>
                      <button
                        onClick={handleUpdatePreferences}
                        disabled={loading.preferences}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 text-green-300 hover:text-green-200 rounded-xl transition-all duration-300 font-medium backdrop-blur-xl disabled:opacity-50"
                      >
                        {loading.preferences ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>
                          {loading.preferences ? "Saving..." : "Save Changes"}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={darkMode}
                        onToggle={() => setDarkMode(!darkMode)}
                        label="Dark Mode"
                        description="Enable dark theme for better viewing experience"
                      />

                      <ToggleSwitch
                        enabled={notifications}
                        onToggle={() => setNotifications(!notifications)}
                        label="Push Notifications"
                        description="Receive real-time notifications for important events"
                      />

                      <ToggleSwitch
                        enabled={emailNotifications}
                        onToggle={() =>
                          setEmailNotifications(!emailNotifications)
                        }
                        label="Email Notifications"
                        description="Get email alerts for critical system events"
                      />

                      <ToggleSwitch
                        enabled={autoUpdate}
                        onToggle={() => setAutoUpdate(!autoUpdate)}
                        label="Auto Updates"
                        description="Automatically install system updates when available"
                      />

                      <ToggleSwitch
                        enabled={autoBackup}
                        onToggle={() => setAutoBackup(!autoBackup)}
                        label="Auto Backup"
                        description="Automatically backup system data daily"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Security */}
                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center space-x-3 mb-8">
                      <Shield className="w-6 h-6 text-purple-400" />
                      <h2 className="text-2xl font-bold text-white">
                        Security Settings
                      </h2>
                    </div>

                    <div className="space-y-8">
                      {/* Password Change */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Change Password
                        </h3>
                        <form
                          onSubmit={handleChangePassword}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) =>
                                  setCurrentPassword(e.target.value)
                                }
                                className="w-full pl-10 pr-12 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white/80 mb-2">
                                New Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  className="w-full pl-10 pr-12 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                                  placeholder="Enter new password"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                  }
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                  ) : (
                                    <Eye className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white/80 mb-2">
                                Confirm Password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  className="w-full pl-10 pr-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                                  placeholder="Confirm new password"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading.security}
                            className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 hover:border-purple-400/50 text-purple-300 hover:text-purple-200 rounded-xl transition-all duration-300 font-medium backdrop-blur-xl disabled:opacity-50"
                          >
                            {loading.security ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                            <span>
                              {loading.security
                                ? "Updating..."
                                : "Change Password"}
                            </span>
                          </button>
                        </form>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="border-t border-white/10 pt-6">
                        <ToggleSwitch
                          enabled={twoFactorAuth}
                          onToggle={() => setTwoFactorAuth(!twoFactorAuth)}
                          label="Two-Factor Authentication"
                          description="Add an extra layer of security to your account"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* System Settings */}
                {activeTab === "system" && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <Server className="w-6 h-6 text-orange-400" />
                        <h2 className="text-2xl font-bold text-white">
                          System Settings
                        </h2>
                      </div>
                      <button
                        onClick={handleUpdateSystemSettings}
                        disabled={loading.system}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 hover:border-orange-400/50 text-orange-300 hover:text-orange-200 rounded-xl transition-all duration-300 font-medium backdrop-blur-xl disabled:opacity-50"
                      >
                        {loading.system ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>
                          {loading.system ? "Saving..." : "Save Changes"}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      <ToggleSwitch
                        enabled={maintenanceMode}
                        onToggle={() => setMaintenanceMode(!maintenanceMode)}
                        label="Maintenance Mode"
                        description="Put the system in maintenance mode for updates"
                      />

                      <ToggleSwitch
                        enabled={debugMode}
                        onToggle={() => setDebugMode(!debugMode)}
                        label="Debug Mode"
                        description="Enable detailed logging for troubleshooting"
                      />

                      <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Log Level
                        </label>
                        <select
                          value={logLevel}
                          onChange={(e) => setLogLevel(e.target.value)}
                          className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all duration-300"
                        >
                          <option value="error" className="bg-gray-800">
                            Error
                          </option>
                          <option value="warn" className="bg-gray-800">
                            Warning
                          </option>
                          <option value="info" className="bg-gray-800">
                            Info
                          </option>
                          <option value="debug" className="bg-gray-800">
                            Debug
                          </option>
                        </select>
                        <p className="text-white/60 text-sm mt-2">
                          Set the minimum level for system logging
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
