import React from "react";
import { motion } from "framer-motion";

const AnimatedIntro = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center h-screen bg-gray-900"
    >
      <div className="text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-orange-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Electrica
        </motion.h1>
        <motion.p
          className="text-gray-300 mt-4 text-lg md:text-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Innovating Electrical Solutions
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AnimatedIntro;
