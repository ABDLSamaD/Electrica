import React from "react";
import { motion } from "framer-motion";

const ProgressIndicator = ({ stages, activeStage }) => {
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 ml-4 z-50">
      <div className="flex flex-col items-center space-y-4">
        {Array.from({ length: stages }).map((_, index) => (
          <React.Fragment key={index}>
            <motion.div
              className={`w-4 h-4 rounded-full ${
                index <= activeStage ? "bg-cyan-900" : "bg-gray-400"
              }`}
              initial={false}
              animate={{
                scale: index === activeStage ? 1.5 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            {index < stages - 1 && (
              <motion.div
                className="w-1 h-8 bg-gray-400"
                initial={false}
                animate={{
                  backgroundColor:
                    index < activeStage ? "#f97316aa" : "#9ca3afaa",
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
