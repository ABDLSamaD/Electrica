import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Mail, ShieldQuestion } from "lucide-react";
import Alert from "./Alert";

const ForgotPassword = ({
  alert,
  handleForgotPassword,
  linkprevious,
  email,
  setEmail,
  setAlert,
  loading,
}) => {
  const [focusedInput, setFocusedInput] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for the gradient effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a7e] px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `radial-gradient(
              circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(99, 102, 241, 0.35) 0%,
              rgba(99, 102, 241, 0) 50%
            )`,
          }}
        />
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -10, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <AnimatePresence>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-8 relative overflow-hidden border border-white/10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.1,
          }}
        >
          {/* Animated border gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="flex items-center justify-center flex-col gap-4 mb-8">
            <motion.div
              className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-full border border-white/10"
              whileHover={{
                rotate: 360,
                scale: 1.1,
                boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
              }}
              transition={{ duration: 0.5 }}
            >
              <ShieldQuestion className="h-8 w-8 text-indigo-300" />
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-center text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Recover Access
            </motion.h2>

            <motion.p
              className="text-gray-300 text-center max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We'll send you instructions to reset your password
            </motion.p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className="text-sm text-indigo-300 font-medium mb-1 block"
              >
                Email Address
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 blur-sm transition-all duration-300 ${
                    focusedInput ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
                <div className="absolute inset-0.5 rounded-[7px] bg-[#0f172a] z-0"></div>
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    focusedInput ? "text-indigo-400" : "text-gray-400"
                  } h-5 w-5 transition-colors duration-200 z-10`}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput(true)}
                  onBlur={() => setFocusedInput(false)}
                  placeholder="Enter your email"
                  required
                  className="w-full p-3 pl-10 bg-transparent text-white placeholder-gray-400 border border-white/10 rounded-lg transition duration-200 outline-none relative z-10"
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold transition duration-200 relative overflow-hidden group bg-blue-200/20 shadow"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Button background with animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"></div>

              {/* Animated glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-md rounded-lg"></div>
              </div>

              {/* Animated shine effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="absolute inset-0 w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              {/* Button content */}
              <span className="relative flex items-center justify-center text-white z-10">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  "Send Recovery Link"
                )}
              </span>
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to={linkprevious}
              className="inline-flex items-center text-sm text-indigo-300 hover:text-white transition duration-200 group"
            >
              <motion.span
                className="mr-2 bg-white/5 rounded-full p-1"
                whileHover={{ x: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowLeft className="h-4 w-4 group-hover:text-indigo-400" />
              </motion.span>
              Return to login
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
