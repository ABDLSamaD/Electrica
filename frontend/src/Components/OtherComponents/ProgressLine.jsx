import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const ProgressLine = ({ sections }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollProgress =
          (scrollTop / (scrollHeight - clientHeight)) * 100;
        setProgress(scrollProgress);
      }
    };

    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-auto h-screen">
      {/* Progress Line */}
      <motion.div
        className="absolute top-0 left-0 w-1 bg-orange-500"
        style={{ height: `${progress}%` }}
      />
      {/* Content */}
      <div className="space-y-16">
        {sections.map((section, index) => (
          <div key={section.id} className="relative group">
            {/* Sticky Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              viewport={{ once: true }}
              className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center space-x-4">
                {section.icon}
                <h2 className="text-2xl font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-300">{section.description}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressLine;
