import React from "react";
import Header from "./Header";
import { FaRegSmileBeam, FaCheckCircle, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import AdvancedFuturisticCards from "./AdvancedFuturisticCards";

const Home = ({ isAuthenticatedAdmin }) => {
  return (
    <>
      <Header isAuthenticatedAdmin={isAuthenticatedAdmin} />
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
