"use client";

import { useState } from "react";
import {
  ArrowLeftCircle,
  MailCheck,
  MapPinCheck,
  MessageSquareCode,
  PhoneCall,
} from "lucide-react";
import { FaTwitter } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Sidebar */}
        <div className="bg-gradient-to-b from-blue-600 to-purple-600 text-white p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold">Electrica</h3>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">Chat with us</h4>
              <p className="text-sm opacity-80 mb-4">
                Speak to our friendly team via live chat.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MessageSquareCode size={18} />
                  <span>Start a live chat</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MailCheck size={18} />
                  <span>Shoot us an email</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaTwitter size={18} />
                  <span>Message us on Twitter</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Call us</h4>
              <p className="text-sm opacity-80 mb-4">
                Call our team Mon-Sat from 8am to 5pm.
              </p>
              <div className="flex items-center space-x-3">
                <PhoneCall size={18} />
                <span>+92 330 5786110</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Visit us</h4>
              <p className="text-sm opacity-80 mb-4">
                Chat to us in person at our HQ.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPinCheck size={18} />
                  <span>Ward 2 Shahbaz road, Badin, 72200</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinCheck size={18} />
                  <span>128 Clarence Street, Sydney NSW 2000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              How do we get in touch?
            </h2>
            <p className="text-sm text-gray-600">
              Leave us your details and we'll reach out within 24 hours!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone number
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center px-4 bg-gray-100">
                  <span className="text-sm">US</span>
                  <span className="ml-2 text-gray-500">▼</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Leave us a message..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeftCircle size={18} />
                <span>Go back</span>
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Finish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
