import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRedo, FaWifi } from "react-icons/fa";

const OfflineScreen = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: "-100vh" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100vh" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="bg-gradient-to-br from-red-950/60 to-red-900/60 backdrop-blur-3xl h-screen fixed inset-0 text-white flex flex-col items-center justify-center text-center p-6 z-50"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
      >
        <FaWifi className="text-7xl text-red-200 animate-pulse" />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
        className="text-4xl font-bold mt-4"
      >
        No Internet Connection
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeInOut" }}
        className="text-lg mt-2 text-red-300"
      >
        Oops! It looks like you've lost your internet connection.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeInOut" }}
        className="text-md text-red-400"
      >
        Please check your network and try again.
      </motion.p>

      {/* Try Again Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.location.reload()}
        className="mt-6 bg-gradient-to-br from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all"
      >
        <FaRedo />
        Try Again
      </motion.button>
    </motion.div>
  );
};

export default OfflineScreen;
