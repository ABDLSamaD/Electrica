import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const AnimatedFooter = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300 py-8">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
        animate-gradient-x opacity-20 pointer-events-none"
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Footer Content */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-white">Electrica</h2>
            <p className="mt-2 text-sm">
              Your trusted partner for innovative and reliable electrical
              solutions.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-6 text-2xl">
            <Link
              to="https://www.facebook.com/profile.php?id=100023065290541"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition transform hover:scale-110"
            >
              <FaFacebook />
            </Link>
            <Link
              to="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition transform hover:scale-110"
            >
              <FaTwitter />
            </Link>
            <Link
              to="https://www.linkedin.com/in/abdul-samad-421793309/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition transform hover:scale-110"
            >
              <FaLinkedin />
            </Link>
            <Link
              to="https://github.com/ABDLSamaD/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500 transition transform hover:scale-110"
            >
              <FaGithub />
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Electrica. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link
              to="/"
              className="hover:text-white transition hover:underline"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-white transition hover:underline"
            >
              About Us
            </Link>
            <Link
              to="/service"
              className="hover:text-white transition hover:underline"
            >
              Services
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AnimatedFooter;
