import React, { useEffect } from "react";
import { motion } from "framer-motion";
import HeaderMain from "./HeaderMain";
import AnimatedFooter from "./Footer";

const ElectricalServicePage = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut", when: "beforeChildren" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const services = [
    {
      title: "Residential Electrical Services",
      description:
        "Safe and reliable electrical installations, repairs, and upgrades for your home.",
      icon: "🏡",
    },
    {
      title: "Commercial Electrical Services",
      description:
        "Comprehensive electrical solutions for businesses of all sizes.",
      icon: "🏢",
    },
    {
      title: "Emergency Repairs",
      description:
        "24/7 emergency electrical services to restore power quickly.",
      icon: "⚡",
    },
    {
      title: "Energy Efficiency Solutions",
      description:
        "Upgrade to energy-efficient systems and save on electricity costs.",
      icon: "🌱",
    },
  ];

  return (
    <>
      <HeaderMain />
      <motion.div
        className="text-gray-100 relative top-40"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center py-16"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Your Trusted Electrical Services Provider
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Providing top-notch electrical solutions for homes, businesses, and
            beyond. Reliable, efficient, and safe.
          </p>
        </motion.div>

        {/* Services Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4 text-white text-3xl">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 bg-white/5 backdrop-blur-md text-center py-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { duration: 1 } }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white">
            Ready to Experience Excellence?
          </h2>
          <p className="text-gray-300 mt-2">
            Contact us today and let us handle your electrical needs.
          </p>
          <motion.button
            className="mt-6 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
            whileHover={{ scale: 1.1 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
        <div className="relative top-20">
          <AnimatedFooter />
        </div>
      </motion.div>
    </>
  );
};

export default ElectricalServicePage;
