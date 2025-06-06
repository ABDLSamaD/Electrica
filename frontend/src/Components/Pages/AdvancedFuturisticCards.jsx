import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaLightbulb, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdvancedFuturisticCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      title: "Empowering Electrical Solutions",
      description:
        "Our meticulously designed electrical solutions are tailored to meet your needs, ensuring efficiency and safety. From installations to maintenance, we deliver reliable and sustainable power systems for your peace of mind.",
      icon: FaBolt,
      color: "#00ffff",
    },
    {
      title: "Illuminating: Electrical Services",
      description:
        "Experience the brilliance of our electrical services as we illuminate your spaces with cutting-edge solutions. Our commitment to excellence ensures that every connection lights up your vision for a brighter and amazing future.",
      icon: FaLightbulb,
      color: "#ff00ff",
    },
    {
      title: "Wired for Success: Electrical Expertise",
      description:
        "Leverage our electrical expertise to power your success. With cutting-edge technology and skilled professionals, we ensure that your electrical infrastructure is optimized for peak performance and better reliability.",
      icon: FaCog,
      color: "#00ff00",
    },
  ];

  return (
    <section className="p-2">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-black/60 border border-gray-800"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
              <div className="relative p-8 h-full w-full flex flex-col justify-between z-10">
                <div>
                  <motion.div
                    className="text-6xl mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2 + index * 0.2,
                    }}
                    style={{ color: card.color }}
                  >
                    <card.icon />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {card.title}
                  </h2>
                  <p className="text-gray-400">{card.description}</p>
                </div>
                <motion.button
                  className="mt-6 px-6 py-3 bg-transparent border border-gray-700 text-white rounded-full hover:bg-gray-800 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/project-details">Explore</Link>
                </motion.button>
              </div>
              <AnimatePresence>
                {hoveredCard === index && (
                  <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-50" />
                    <div className="absolute inset-0 backdrop-filter backdrop-blur-sm" />
                    <svg
                      className="absolute inset-0 w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id={`grid-${index}`}
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke={card.color}
                            strokeWidth="0.5"
                            opacity="0.3"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#grid-${index})`}
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${card.color}33 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedFuturisticCards;
