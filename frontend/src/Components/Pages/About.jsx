import React from "react";
import Header from "./header";
import { FaLightbulb, FaUsers, FaCogs, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <Header />
      <section className="relative top-24 flex flex-col items-center justify-center text-white py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12">
          About <span className="text-yellow-200">Electrica</span>
        </h1>

        <div className="container max-w-7xl px-6 md:px-12">
          {/* Mission Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 mb-16">
            <div className="w-full md:w-1/2 p-6 bg-black bg-opacity-50 rounded-3xl transform transition-all hover:scale-105 hover:shadow-2xl">
              <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                At Electrica, we strive to deliver the most innovative,
                efficient, and safe electrical solutions for homes and
                businesses. Our team is dedicated to pushing the boundaries of
                technology while ensuring the highest standards of service.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="https://thumbs.dreamstime.com/b/cartoon-electrician-working-meter-box-young-man-wearing-hard-hat-goggles-electrical-wiring-339592162.jpg"
                alt="Mission is impossible what image shown"
                className="w-full h-auto rounded-3xl shadow-lg"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaLightbulb className="text-6xl text-yellow-200" />
              <h3 className="text-2xl font-semibold">Innovation</h3>
              <p>
                We prioritize cutting-edge technology to ensure efficiency and
                sustainability in all our solutions.
              </p>
            </div>
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaUsers className="text-6xl text-yellow-200" />
              <h3 className="text-2xl font-semibold">Customer-Centric</h3>
              <p>
                We are committed to providing exceptional service, tailored to
                each client's unique needs and preferences.
              </p>
            </div>
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaCogs className="text-6xl text-yellow-200" />
              <h3 className="text-2xl font-semibold">Advanced Systems</h3>
              <p>
                Our electrical systems are designed to be robust, reliable, and
                scalable to meet the demands of modern living.
              </p>
            </div>
            <div className="feature-card p-6 bg-black bg-opacity-40 rounded-xl transform transition-all hover:scale-110 hover:shadow-2xl text-center space-y-4">
              <FaRocket className="text-6xl text-yellow-200" />
              <h3 className="text-2xl font-semibold">Future-Ready</h3>
              <p>
                We are always ahead of the curve, offering solutions that are
                ready for the future of technology and infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="w-full bg-black bg-opacity-60 p-12 mt-20 rounded-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-200 mb-6">
            Join Us on Our Journey
          </h2>
          <p className="text-lg mb-8">
            Together, we can electrify the world with sustainable and
            groundbreaking electrical solutions. Let's make a difference!
          </p>
          <Link
            className="px-8 py-3 bg-cyan-600 rounded-full text-xl font-semibold hover:bg-cyan-700 transform transition-all hover:scale-105"
            to="/signin"
          >
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
};

export default About;
