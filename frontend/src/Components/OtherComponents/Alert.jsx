import React, { useEffect, useState } from "react";
import "./extracss.css"

const Alert = ({ type = "info", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeClasses = {
    success: "bg-green-100 border-green-400 text-green-700 shadow-green-400",
    error: "bg-red-100 border-red-400 text-red-700 shadow-red-400",
    info: "bg-blue-100 border-blue-400 text-blue-700 shadow-blue-400",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700 shadow-yellow-400",
  };

  return (
    <div
      className={`fixed top-4 z-50 left-1/2 transform -translate-x-1/2 px-4 py-3 w-80 h-auto rounded-xl border shadow-2xl animate-slide-in scale-100 ${typeClasses[type]}`}
      role="alert"
    >
      <p className="text-lg font-bold tracking-wider">{message}</p>
      <div className="absolute -inset-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl blur-3xl animate-pulse" />
    </div>
  );
};

export default Alert;
