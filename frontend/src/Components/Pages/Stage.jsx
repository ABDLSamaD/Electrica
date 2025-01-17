import React from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const Stage = ({ title, description, detailedDescription, icon, image }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center sticky top-0">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 w-full h-screen flex items-center justify-center p-6 bg-gray-800"
      >
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="rounded-lg shadow-lg w-full max-h-[80%] object-cover"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 w-full min-h-screen flex flex-col justify-center p-6 text-white bg-gray-900"
      >
        <div className="flex items-center mb-6">
          {icon}
          <h2 className="text-3xl font-semibold ml-4">{title}</h2>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed mb-4">
          {description}
        </p>
        <p className="text-gray-400 text-base leading-relaxed">
          {detailedDescription}
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="mt-8 text-center"
        >
          <FaArrowDown size={24} className="mx-auto text-orange-500" />
          <span className="text-sm text-gray-400">Scroll for next stage</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Stage;
