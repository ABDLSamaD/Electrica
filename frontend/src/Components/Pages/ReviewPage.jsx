"use client";

import { useState } from "react";
import {
  Star,
  Send,
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
  Zap,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderMain from "./HeaderMain";
import { Link } from "react-router-dom";
import axios from "axios";
import Miniloader from "../OtherComponents/Miniloader";

const ReviewPage = () => {
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    occupation: "",
    images: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submission logic here
    setSubmitted(true);
    setLoading(true);
    const { name, email, message, occupation, images } = formData;
    try {
      const response = await axios.post(
        `${electricaURL}/api/reviews/create-review`,
        {
          name,
          email,
          message,
          occupation,
          images,
          rating,
        }
      );
      if (response.status === 200) {
        setSubmitted(false);
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            message: "",
            occupation: "",
            images: [],
          });
          setLoading(false);
        }, 3000);
      } else {
        setSubmitted(false);
      }
    } catch (error) {
      setSubmitted(false);
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused("");
  };

  return (
    <>
      <HeaderMain />
      <div className="min-h-screen bg-black text-gray-300 py-16 relative top-16 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="0.5"
            ></path>
            <path d="M0,50 L100,50" stroke="#4f46e5" strokeWidth="0.5"></path>
            <path d="M50,0 L50,100" stroke="#4f46e5" strokeWidth="0.5"></path>
            <path
              d="M25,0 L25,100"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
            <path
              d="M75,0 L75,100"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
            <path
              d="M0,25 L100,25"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
            <path
              d="M0,75 L100,75"
              stroke="#4f46e5"
              strokeWidth="0.5"
              strokeDasharray="4,2"
            ></path>
          </svg>
        </div>

        {/* Animated gradient blobs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-2xl mx-auto px-4 relative">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 p-8 rounded-t-2xl">
              <div className="absolute -inset-[10px] blur-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-20"></div>
              <div className="relative flex items-center justify-center">
                <div className="relative h-12 w-12 mr-4">
                  <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm"></div>
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white">
                  Share Your Experience with Electrica
                </h1>
              </div>
              <p className="text-blue-200 text-center mt-4 max-w-lg mx-auto">
                Your feedback helps us improve our services and assists other
                customers in making informed decisions.
              </p>
            </div>

            {/* Form content */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-b-2xl border border-gray-800">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    {/* Rating Stars */}
                    <div>
                      <p className="text-gray-300 mb-3 text-lg">
                        How would you rate your experience?
                      </p>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="focus:outline-none transition-all duration-200"
                          >
                            <Star
                              className={`w-10 h-10 ${
                                star <= (hoverRating || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-600"
                              } transition-colors duration-200`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      <div className="h-6 mt-2">
                        {rating > 0 && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-cyan-400 font-medium"
                          >
                            {rating === 5
                              ? "Excellent!"
                              : rating === 4
                              ? "Very Good!"
                              : rating === 3
                              ? "Good"
                              : rating === 2
                              ? "Fair"
                              : "Poor"}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      {/* Name Input */}
                      <div
                        className={`relative ${
                          focused === "name" ? "z-10" : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-cyan-500/20 rounded-lg blur-md transition-opacity duration-300 ${
                            focused === "name" ? "opacity-100" : "opacity-0"
                          }`}
                        ></div>
                        <div className="relative">
                          <label
                            htmlFor="name"
                            className="text-gray-300 font-medium mb-2 flex items-center"
                          >
                            <User className="w-4 h-4 mr-2 text-cyan-400" />
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus("name")}
                            onBlur={handleBlur}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      {/* Email Input */}
                      <div
                        className={`relative ${
                          focused === "email" ? "z-10" : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-cyan-500/20 rounded-lg blur-md transition-opacity duration-300 ${
                            focused === "email" ? "opacity-100" : "opacity-0"
                          }`}
                        ></div>
                        <div className="relative">
                          <label
                            htmlFor="email"
                            className="text-gray-300 font-medium mb-2 flex items-center"
                          >
                            <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus("email")}
                            onBlur={handleBlur}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Occupation Input */}
                      <div
                        className={`relative ${
                          focused === "occupation" ? "z-10" : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-cyan-500/20 rounded-lg blur-md transition-opacity duration-300 ${
                            focused === "occupation"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        ></div>
                        <div className="relative">
                          <label
                            htmlFor="occupation"
                            className="text-gray-300 font-medium mb-2 flex items-center"
                          >
                            <User className="w-4 h-4 mr-2 text-cyan-400" />
                            Occupation
                          </label>
                          <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus("occupation")}
                            onBlur={handleBlur}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder="Enter Occupation"
                            required
                          />
                        </div>
                      </div>

                      {/* Images Input */}
                      <div
                        className={`relative ${
                          focused === "images" ? "z-10" : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-cyan-500/20 rounded-lg blur-md transition-opacity duration-300 ${
                            focused === "images" ? "opacity-100" : "opacity-0"
                          }`}
                        ></div>
                        <div className="relative">
                          <label
                            htmlFor="images"
                            className="text-gray-300 font-medium mb-2 flex items-center"
                          >
                            <Image className="w-4 h-4 mr-2 text-cyan-400" />
                            Images
                          </label>
                          <input
                            type="file"
                            id="images"
                            name="images"
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* Message Input */}
                      <div
                        className={`relative ${
                          focused === "message" ? "z-10" : ""
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-cyan-500/20 rounded-lg blur-md transition-opacity duration-300 ${
                            focused === "message" ? "opacity-100" : "opacity-0"
                          }`}
                        ></div>
                        <div className="relative">
                          <label
                            htmlFor="message"
                            className="text-gray-300 font-medium mb-2 flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" />
                            Your Review
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            onFocus={() => handleFocus("message")}
                            onBlur={handleBlur}
                            rows="5"
                            className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                            placeholder="Share your experience with our electrical services..."
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                      >
                        <div className="relative flex items-center justify-center py-3 text-white font-semibold">
                          {!loading && (
                            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                          )}
                          {loading ? <Miniloader /> : "Submit Review"}
                        </div>
                      </button>

                      <p className="text-gray-500 text-sm text-center mt-4">
                        By submitting, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="text-cyan-400 hover:underline"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-cyan-400 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Thank You for Your Review!
                    </h2>
                    <p className="text-gray-400 text-center max-w-md">
                      Your feedback has been submitted successfully. We
                      appreciate you taking the time to share your experience
                      with Electrica.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Review Guidelines */}
          <div className="mt-8 bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-3">
              Review Guidelines
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                Share your personal experience with our electrical services
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                Be specific about what you liked or areas where we can improve
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                Keep your review honest, respectful, and constructive
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                Avoid including personal information or contact details
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewPage;
