import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Stage = ({
  title,
  description,
  detailedDescription,
  icon,
  image,
  isActive,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`min-h-screen flex flex-col md:flex-row items-center ${
        isActive ? "sticky top-0" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full md:w-1/2 h-[70vh] md:h-screen flex items-center justify-center p-4 md:p-6 bg-gray-800">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="rounded-lg shadow-lg w-full max-h-[80%] md:max-h-[90%] object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex flex-col justify-center p-4 md:p-6 text-white bg-gray-900">
        <div className="flex items-center mb-4 md:mb-6">
          {icon}
          <h2 className="text-2xl md:text-3xl font-semibold ml-3 md:ml-4">
            {title}
          </h2>
        </div>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
          {description}
        </p>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {detailedDescription}
        </p>
      </div>
    </motion.div>
  );
};

export default Stage;
