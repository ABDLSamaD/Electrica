"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Shield,
  CheckCircle,
} from "lucide-react";

const InputForm = ({
  hanldeLogin,
  onChange,
  credential,
  passLink,
  miniLoader,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="w-full mx-auto">
      {/* Enhanced glassmorphism container */}
      <motion.div
        className="bg-white/[0.02] backdrop-blur-3xl rounded-3xl p-8 border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] relative overflow-hidden"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01] rounded-3xl"></div>

        <div className="relative z-10">
          <form className="space-y-6" onSubmit={hanldeLogin}>
            {/* Enhanced Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 shadow-lg border border-white/20">
                <Shield className="w-8 h-8 text-white/80" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                Sign in to your account to access your dashboard and manage your
                projects
              </p>
            </motion.div>

            {/* Enhanced Email Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    focusedField === "email" ? "opacity-100" : ""
                  }`}
                ></div>
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === "email"
                        ? "text-blue-400"
                        : "text-white/40"
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 placeholder-white/40 transition-all duration-300 hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email address"
                    onChange={onChange}
                    name="email"
                    value={credential.email}
                    autoComplete="email"
                    required
                    disabled={miniLoader}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Enhanced Password Field */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    focusedField === "password" ? "opacity-100" : ""
                  }`}
                ></div>
                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === "password"
                        ? "text-purple-400"
                        : "text-white/40"
                    }`}
                  />
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-white/[0.03] backdrop-blur-xl text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 placeholder-white/40 transition-all duration-300 hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                    onChange={onChange}
                    name="password"
                    value={credential.password}
                    autoComplete="current-password"
                    required
                    disabled={miniLoader}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-300 disabled:opacity-50"
                    disabled={miniLoader}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {isPasswordVisible ? (
                        <motion.div
                          key="eye-off"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <EyeOff className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Options Row */}
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    onChange={onChange}
                    checked={credential.rememberMe}
                    disabled={miniLoader}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                      credential.rememberMe
                        ? "bg-blue-500 border-blue-500"
                        : "border-white/30 hover:border-white/50"
                    } ${
                      miniLoader
                        ? "opacity-50 cursor-not-allowed"
                        : "group-hover:border-blue-400"
                    }`}
                  >
                    <AnimatePresence>
                      {credential.rememberMe && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <span
                  className={`ml-3 text-sm text-white/70 transition-colors duration-300 ${
                    miniLoader ? "opacity-50" : "group-hover:text-white"
                  }`}
                >
                  Remember me for 30 days
                </span>
              </label>

              <Link
                to={passLink}
                className={`text-sm font-medium transition-all duration-300 ${
                  miniLoader
                    ? "text-white/30 pointer-events-none"
                    : "text-blue-400 hover:text-blue-300 hover:underline"
                }`}
              >
                Forgot password?
              </Link>
            </motion.div>

            {/* Enhanced Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                type="submit"
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden group ${
                  miniLoader
                    ? "bg-white/10 cursor-not-allowed border border-white/20"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_0_rgba(59,130,246,0.4)] border border-blue-500/50 hover:border-blue-400/50"
                }`}
                disabled={miniLoader}
                whileHover={!miniLoader ? { scale: 1.02 } : {}}
                whileTap={!miniLoader ? { scale: 0.98 } : {}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <AnimatePresence mode="wait">
                    {miniLoader ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <span>Sign In</span>
                        <LogIn className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="text-xs text-white/50 leading-relaxed">
                Your information is protected with enterprise-grade security
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default InputForm;
