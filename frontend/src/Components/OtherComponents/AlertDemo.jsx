"use client";
import { motion } from "framer-motion";
import { useAlert } from "./AlertProvider";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const AlertDemo = () => {
  const { success, error, info, warning, showAlert } = useAlert();

  const demoAlerts = [
    {
      type: "success",
      title: "Project Created Successfully!",
      message:
        "Your electrical project has been submitted and is now under review by our expert team.",
      icon: CheckCircle,
      color: "from-emerald-500 to-green-500",
    },
    {
      type: "error",
      title: "Upload Failed",
      message:
        "Failed to upload project images. Please check your internet connection and try again.",
      icon: XCircle,
      color: "from-red-500 to-rose-500",
    },
    {
      type: "info",
      title: "New Update Available",
      message:
        "A new version of the application is available with improved features and bug fixes.",
      icon: Info,
      color: "from-blue-500 to-cyan-500",
    },
    {
      type: "warning",
      title: "Budget Limit Reached",
      message:
        "You're approaching your monthly project budget limit. Consider upgrading your plan.",
      icon: AlertTriangle,
      color: "from-amber-500 to-yellow-500",
    },
  ];

  const handleShowAlert = (alertType, options = {}) => {
    const alertData = demoAlerts.find((alert) => alert.type === alertType);

    showAlert({
      type: alertType,
      title: alertData.title,
      message: alertData.message,
      duration: 8000,
      position: "bottom-right",
      size: "medium",
      ...options,
    });
  };

  const positions = [
    { key: "top-left", label: "Top Left" },
    { key: "top-right", label: "Top Right" },
    { key: "top-center", label: "Top Center" },
    { key: "bottom-left", label: "Bottom Left" },
    { key: "bottom-right", label: "Bottom Right" },
    { key: "bottom-center", label: "Bottom Center" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 border border-white/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Enhanced Alert System
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Experience our advanced alert component with smooth animations,
            multiple variants, and intelligent positioning
          </p>
        </motion.div>

        {/* Alert Type Demos */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {demoAlerts.map((alert, index) => (
            <motion.div
              key={alert.type}
              className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-6 border border-white/[0.08] hover:bg-white/[0.05] transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${alert.color} bg-opacity-20 mb-4`}
              >
                <alert.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2 capitalize">
                {alert.type} Alert
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {alert.message.substring(0, 80)}...
              </p>
              <button
                onClick={() => handleShowAlert(alert.type)}
                className={`w-full py-2 px-4 rounded-xl bg-gradient-to-r ${alert.color} bg-opacity-20 hover:bg-opacity-30 text-white font-medium transition-all duration-300 border border-white/20 hover:border-white/30`}
              >
                Show {alert.type}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Position Demo */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-8 border border-white/[0.08] mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Position Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {positions.map((position) => (
              <button
                key={position.key}
                onClick={() =>
                  handleShowAlert("info", {
                    position: position.key,
                    message: `Alert from ${position.label}`,
                  })
                }
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                {position.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-8 border border-white/[0.08]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <button
                onClick={() =>
                  showAlert({
                    type: "success",
                    title: "Persistent Alert",
                    message:
                      "This alert won't auto-dismiss. Click the X to close it.",
                    duration: 0,
                    dismissible: true,
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-white font-medium transition-all duration-300 border border-emerald-400/30"
              >
                Persistent Alert
              </button>

              <button
                onClick={() =>
                  showAlert({
                    type: "warning",
                    title: "Large Alert",
                    message:
                      "This is a large-sized alert with more content space for detailed messages and information.",
                    size: "large",
                    duration: 10000,
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-white font-medium transition-all duration-300 border border-amber-400/30"
              >
                Large Size Alert
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() =>
                  showAlert({
                    type: "info",
                    title: "No Progress Bar",
                    message: "This alert doesn't show a progress bar.",
                    showProgress: false,
                    duration: 5000,
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-white font-medium transition-all duration-300 border border-blue-400/30"
              >
                No Progress Bar
              </button>

              <button
                onClick={() =>
                  showAlert({
                    type: "error",
                    title: "Non-Dismissible",
                    message: "This alert cannot be manually closed.",
                    dismissible: false,
                    duration: 3000,
                  })
                }
                className="w-full py-3 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white font-medium transition-all duration-300 border border-red-400/30"
              >
                Non-Dismissible
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlertDemo;
