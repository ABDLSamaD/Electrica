import React, { useEffect, useState } from "react";
import HeaderMain from "./HeaderMain";
import { FaRegSmileBeam, FaCheckCircle, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import AdvancedFuturisticCards from "./AdvancedFuturisticCards";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(true); // To handle the loading state
  const navigate = useNavigate();
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token = Cookies.get("admin_auth"); // Get the auth token from cookies
        if (!token) {
          setLoading(false); // No token, just stop loading
          return;
        }
        const response = await axios.get(
          `${electricaURL}/api/adminauth/check-adminauth`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.isAuthenticated) {
          navigate("/db_au_admn"); // Redirect to the admin page
        } else {
          setLoading(false); // Stop loading if the user is not an admin
        }
      } catch (error) {
        setLoading(false);
      }
    };
    checkAdminAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white">Checking authentication...</p>
      </div>
    );
  }
  return (
    <>
      <HeaderMain />
      <section className="relative top-36">
        <div className="container flex justify-center flex-wrap relative">
          <div className="row mb-9">
            <motion.div
              className="col-1 text-gray-300"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                WELCOME TO{" "}
                <span className="text-cyan-100 tracking-widest">Electrica</span>
              </h1>
              <h2 className="md:w-3/4 text-xl md:text-2xl mt-4">
                Fulfilling Electrical Solutions for a Bright Future.
              </h2>
            </motion.div>
            <motion.div
              className="col-2 mt-16 flex md:justify-between justify-around items-center p-2 text-gray-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <FeatureCard
                icon={<FaRegSmileBeam />}
                title="100%"
                subtitle="Client Satisfaction"
              />
              <FeatureCard
                icon={<FaCheckCircle />}
                title="900+"
                subtitle="Completed Projects"
              />
              <FeatureCard
                icon={<FaClock />}
                title="25+"
                subtitle="Years Of Experience"
              />
            </motion.div>
          </div>
        </div>
      </section>
      <div className="relative top-36">
        <AdvancedFuturisticCards />
      </div>

      <div className="relative top-64">
        <Footer />
      </div>
    </>
  );
};
const FeatureCard = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center space-y-2">
    <div className="text-4xl text-cyan-100">{icon}</div>
    <h2 className="text-3xl font-bold">
      {title} <span className="text-gray-100"></span>
    </h2>
    <p>{subtitle}</p>
  </div>
);

export default Home;
