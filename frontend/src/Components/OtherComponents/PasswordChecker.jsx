import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PasswordChecker = ({ password, passwordRules }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="password-checker w-auto h-auto p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Password must have:
        </h3>
        <ul className="space-y-3">
          {passwordRules.map((rule) => (
            <motion.li
              key={rule.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: rule.id * 0.1 }}
              className={`flex items-center ${
                rule.test(password) ? "text-green-400" : "text-red-400"
              }`}
            >
              <span
                className={`mr-3 w-2 h-2 rounded-full ${
                  rule.test(password) ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>
              <span className="text-sm">{rule.label}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordChecker;
