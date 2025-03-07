import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaLightbulb,
  FaUsers,
  FaCogs,
  FaRocket,
  FaLeaf,
  FaSolarPanel,
  FaChartLine,
  FaHandshake,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import HeaderMain from "./HeaderMain";
import AboutImage from "../../assets/cartoon-electrician-working-meter-box-young-man-wearing-hard-hat-goggles-electrical-wiring-339592162.webp";

const About = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 10 },
    },
  };

  return (
    <>
      <HeaderMain />
      <motion.section
        className="relative top-24 flex flex-col items-center justify-center text-white py-20 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.div
          className="w-full max-w-7xl px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 mb-20"
          variants={itemVariants}
        >
          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-8">
            <motion.h1
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-cyan-400"
              variants={itemVariants}
            >
              About <span className="text-white">Electrica</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              At Electrica, we are dedicated to revolutionizing the electrical
              industry by integrating cutting-edge technology, renewable energy,
              and sustainable practices. Our mission is to provide innovative,
              efficient, and safe electrical solutions for homes and businesses,
              ensuring a brighter and greener future for all.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-full text-xl font-semibold hover:from-yellow-500 hover:to-cyan-500 transform transition-all hover:scale-105"
                to="/signin"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div className="w-full md:w-1/2" variants={itemVariants}>
            <img
              src={AboutImage}
              alt="Electrica's mission visualization"
              className="w-full h-auto rounded-3xl shadow-2xl border-2 border-opacity-20 border-white"
            />
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="w-full max-w-7xl px-6 md:px-12 mb-20"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Why Choose Electrica?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLightbulb className="text-6xl text-white mx-auto" />,
                title: "Innovation",
                description:
                  "We leverage cutting-edge technology to deliver efficient and sustainable solutions.",
              },
              {
                icon: <FaUsers className="text-6xl text-white mx-auto" />,
                title: "Customer-Centric",
                description:
                  "Tailored solutions designed to meet your unique needs and preferences.",
              },
              {
                icon: <FaCogs className="text-6xl text-white mx-auto" />,
                title: "Advanced Systems",
                description:
                  "Robust, reliable, and scalable systems for modern living.",
              },
              {
                icon: <FaRocket className="text-6xl text-white mx-auto" />,
                title: "Future-Ready",
                description:
                  "Solutions designed to adapt to emerging technologies and trends.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-2xl border border-opacity-20 border-white transform transition-all hover:scale-105 hover:shadow-3xl text-center space-y-6"
                whileHover={{ y: -10 }}
              >
                {feature.icon}
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sustainability Section */}
        <motion.div
          className="w-full max-w-7xl px-6 md:px-12 mb-20"
          variants={itemVariants}
        >
          <div className="p-8 md:p-12 bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-2xl border border-opacity-20 border-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Our Commitment to Sustainability
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              At Electrica, sustainability is at the core of everything we do.
              We are committed to reducing our carbon footprint and promoting
              eco-friendly practices through innovative electrical solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaLeaf className="text-6xl text-white mx-auto" />,
                  title: "Eco-Friendly",
                  description:
                    "We prioritize energy-efficient components and systems.",
                },
                {
                  icon: (
                    <FaSolarPanel className="text-6xl text-white mx-auto" />
                  ),
                  title: "Renewable Energy",
                  description:
                    "Integration of solar panels and other renewable sources.",
                },
                {
                  icon: <FaChartLine className="text-6xl text-white mx-auto" />,
                  title: "Smart Energy",
                  description:
                    "Optimize power consumption with smart energy management.",
                },
                {
                  icon: <FaHandshake className="text-6xl text-white mx-auto" />,
                  title: "Green Partnerships",
                  description:
                    "Collaborating with eco-conscious brands and organizations.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-2xl border border-opacity-20 border-white transform transition-all hover:scale-105 hover:shadow-3xl text-center space-y-6"
                  whileHover={{ y: -10 }}
                >
                  {feature.icon}
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          className="w-full max-w-7xl px-6 md:px-12"
          variants={itemVariants}
        >
          <div className="p-12 bg-white bg-opacity-5 backdrop-blur-lg rounded-3xl shadow-2xl border border-opacity-20 border-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Us on Our Electrifying Journey
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Together, we can revolutionize the world with sustainable and
              groundbreaking electrical solutions. Let's illuminate the future
              and make a lasting impact!
            </p>
            <Link
              className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-full text-xl font-semibold hover:from-yellow-500 hover:to-cyan-500 transform transition-all hover:scale-105"
              to="/signin"
            >
              Get Started Now
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default About;
