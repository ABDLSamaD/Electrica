import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AnimatedFooter = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative bg-gray-900/30 pt-16 pb-8 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gray-950 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,183,155,0.15),rgba(0,0,0,0))]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">Electrica</h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for innovative and reliable electrical
              solutions. Powering tomorrow's technology today.
            </p>
            <div className="flex space-x-4 text-2xl pt-4">
              <motion.a
                href="https://www.facebook.com/profile.php?id=100023065290541"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/abdul-samad-421793309/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="https://github.com/ABDLSamaD/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["About", "Service", "Project-Details", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
                    >
                      <span className="h-px w-4 bg-cyan-400/50"></span>
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Electrical Installation",
                "Smart Home Automation",
                "Industrial Solutions",
                "Energy Management",
                "Safety Inspections",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/service"
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <span className="h-px w-4 bg-cyan-400/50"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Info
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <span className="text-white">Badin, Sindh, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-white">+92 330 5786110</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-white">absamadkhan878@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-white">Mon-Fri: 8AM - 5PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Electrica. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <Link
              to="/privacy-policy"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-cyan-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AnimatedFooter;
