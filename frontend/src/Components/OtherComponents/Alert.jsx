import React, { useEffect, useState } from "react";
import "../../styles.css";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Alert = ({ type = "info", message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      styles: "bg-emerald-50 border-emerald-200 text-emerald-800",
      iconColor: "text-emerald-500",
      progressBar: "bg-emerald-500",
    },
    error: {
      icon: XCircle,
      styles: "bg-rose-50 border-rose-200 text-rose-800",
      iconColor: "text-rose-500",
      progressBar: "bg-rose-500",
    },
    info: {
      icon: Info,
      styles: "bg-sky-50 border-sky-200 text-sky-800",
      iconColor: "text-sky-500",
      progressBar: "bg-sky-500",
    },
    warning: {
      icon: AlertCircle,
      styles: "bg-amber-50 border-amber-200 text-amber-800",
      iconColor: "text-amber-500",
      progressBar: "bg-amber-500",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-4 left-4 z-50"
        >
          <div
            className={`relative flex items-center w-auto max-w-md px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${config.styles}`}
          >
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${config.progressBar}`}
                style={{ transformOrigin: "left" }}
              />
            )}

            <Icon className={`w-5 h-5 ${config.iconColor} shrink-0`} />

            <p className="mx-3 font-medium text-sm flex-1">{message}</p>

            <button
              onClick={handleClose}
              className={`shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
              aria-label="Close alert"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Subtle glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
