import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaUsers, FaCogs, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";
import HeaderMain from "./HeaderMain";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <HeaderMain />
      <motion.section
        className="relative top-24 flex flex-col items-center justify-center text-white py-16 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-12"
          variants={itemVariants}
        >
          About <span className="text-yellow-200">Electrica</span>
        </motion.h1>

        <motion.div className="w-full md:w-3/4 mb-16" variants={itemVariants}>
          <img
            src="https://thumbs.dreamstime.com/b/cartoon-electrician-working-meter-box-young-man-wearing-hard-hat-goggles-electrical-wiring-339592162.jpg"
            alt="Electrica's mission visualization"
            className="w-full h-auto rounded-3xl shadow-lg"
          />
        </motion.div>

        <motion.div className="container max-w-7xl px-6 md:px-12">
          {/* Mission Section */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 mb-16"
            variants={itemVariants}
          >
            <div className="w-full p-6 bg-black bg-opacity-50 rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl">
              <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                At Electrica, we strive to deliver the most innovative,
                efficient, and safe electrical solutions for homes and
                businesses. Our team is dedicated to pushing the boundaries of
                technology while ensuring the highest standards of service. We
                aim to revolutionize the electrical industry by integrating
                smart technologies, renewable energy sources, and sustainable
                practices into every project we undertake.
              </p>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={itemVariants}
          >
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaLightbulb className="text-6xl text-yellow-200 mx-auto" />
              <h3 className="text-2xl font-semibold">Innovation</h3>
              <p>
                We prioritize cutting-edge technology to ensure efficiency and
                sustainability in all our solutions. Our R&D team constantly
                explores new technologies and methodologies to stay ahead in the
                electrical industry.
              </p>
            </div>
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaUsers className="text-6xl text-yellow-200 mx-auto" />
              <h3 className="text-2xl font-semibold">Customer-Centric</h3>
              <p>
                We are committed to providing exceptional service, tailored to
                each client's unique needs and preferences. Our team of experts
                works closely with clients to understand their requirements and
                deliver personalized solutions.
              </p>
            </div>
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaCogs className="text-6xl text-yellow-200 mx-auto" />
              <h3 className="text-2xl font-semibold">Advanced Systems</h3>
              <p>
                Our electrical systems are designed to be robust, reliable, and
                scalable to meet the demands of modern living. We integrate
                smart home technologies, energy management systems, and IoT
                devices to create intelligent electrical ecosystems.
              </p>
            </div>
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaRocket className="text-6xl text-yellow-200 mx-auto" />
              <h3 className="text-2xl font-semibold">Future-Ready</h3>
              <p>
                We are always ahead of the curve, offering solutions that are
                ready for the future of technology and infrastructure. Our
                systems are designed with adaptability in mind, ensuring they
                can integrate with emerging technologies seamlessly.
              </p>
            </div>
          </motion.div>

          {/* Additional Details */}
          <motion.div
            className="mt-16 p-6 bg-black bg-opacity-50 rounded-3xl"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold mb-4">
              Our Commitment to Sustainability
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              At Electrica, we're not just about providing electrical solutions;
              we're committed to creating a sustainable future. Our approach
              integrates eco-friendly practices and renewable energy sources
              into every project we undertake.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                We prioritize the use of energy-efficient components and systems
              </li>
              <li>
                Our solutions often incorporate solar panels and other renewable
                energy sources
              </li>
              <li>
                We offer smart energy management systems to optimize power
                consumption
              </li>
              <li>
                Our team is trained in the latest green technologies and
                sustainable practices
              </li>
            </ul>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="mt-16 p-6 bg-black bg-opacity-50 rounded-3xl"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              Our success is driven by our team of highly skilled professionals
              who bring years of experience and expertise to every project.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                { name: "John Doe", role: "Chief Electrical Engineer" },
                { name: "Jane Smith", role: "Renewable Energy Specialist" },
                { name: "Mike Johnson", role: "Smart Home Systems Expert" },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full mb-4"></div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          className="w-full bg-black bg-opacity-60 p-12 mt-20 rounded-3xl text-center"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-200 mb-6">
            Join Us on Our Electrifying Journey
          </h2>
          <p className="text-lg mb-8">
            Together, we can revolutionize the world with sustainable and
            groundbreaking electrical solutions. Let's illuminate the future and
            make a lasting impact!
          </p>
          <Link
            className="inline-block px-8 py-3 bg-cyan-600 rounded-full text-xl font-semibold hover:bg-cyan-700 transform transition-all hover:scale-105"
            to="/signin"
          >
            Get Started Now
          </Link>
        </motion.div>
      </motion.section>
    </>
  );
};

export default About;
