import React, { useEffect, useState } from "react";
import "../../index.css";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa"; // Import icons from react-icons
import { motion } from "framer-motion";

const Alert = ({ type = "info", message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeConfig = {
    success: {
      bg: "bg-[rgb(8 235 85 / 33%)] border-green-700 text-green-700",
      icon: (
        <FaCheckCircle className="text-green-500 text-2xl drop-shadow-md" />
      ),
    },
    error: {
      bg: "bg-red-100 border-red-400 text-red-700",
      icon: <FaTimesCircle className="text-red-500 text-2xl drop-shadow-md" />,
    },
    info: {
      bg: "bg-blue-100 border-blue-400 text-blue-700",
      icon: <FaInfoCircle className="text-blue-500 text-2xl drop-shadow-md" />,
    },
    warning: {
      bg: "bg-yellow-100 border-yellow-400 text-yellow-700",
      icon: (
        <FaExclamationCircle className="text-yellow-500 text-2xl drop-shadow-md" />
      ),
    },
  };

  const { bg, icon } = typeConfig[type] || typeConfig.info;

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 px-5 py-2 flex justify-between items-center w-96 h-auto rounded-md border ${bg} backdrop-blur-sm`}
      role="alert"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        borderWidth: "2px",
        borderStyle: "solid",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="icon-container">{icon}</div>
        <p className="text-base capitalize tracking-wide">{message}</p>
      </div>
      {/* Optional glow effect */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl blur-3xl animate-pulse" />
    </motion.div>
  );
};

export default Alert;
