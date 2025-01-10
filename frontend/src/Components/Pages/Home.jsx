import React from "react";
import Header from "./header";
import { FaRegSmileBeam, FaCheckCircle, FaClock } from "react-icons/fa";

const Home = ({ isAuthenticatedAdmin }) => {
  return (
    <>
      <Header isAuthenticatedAdmin={isAuthenticatedAdmin} />
      <section id="home" className="relative top-36">
        <div className="container flex justify-center flex-wrap relative">
          <div className="row mb-9">
            <div className="col-1 text-gray-300">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                WELCOME TO{" "}
                <span className="text-cyan-100 tracking-widest">Electrica</span>
              </h1>
              <h2 className="md:w-3/4 text-xl md:text-2xl mt-4">
                Fulfilling Electrical Solutions for a Bright Future.
              </h2>
            </div>
            <div className="col-2 mt-16 flex md:justify-between justify-around items-center p-2 text-gray-200">
              <div className="client-satisfaction flex flex-col items-center space-y-2">
                <FaRegSmileBeam className="text-4xl text-cyan-100" />
                <h2 className="text-3xl font-bold">
                  100 <span className="text-gray-100">%</span>
                </h2>
                <p>Client Satisfaction</p>
              </div>
              <div className="completed-projects flex flex-col items-center space-y-2">
                <FaCheckCircle className="text-4xl text-cyan-100" />
                <h2 className="text-3xl font-bold">
                  900 <span className="text-gray-100">+</span>
                </h2>
                <p>Completed Projects</p>
              </div>
              <div className="years-experience flex flex-col items-center space-y-2">
                <FaClock className="text-4xl text-cyan-100" />
                <h2 className="text-3xl font-bold">
                  25 <span className="text-gray-100">+</span>
                </h2>
                <p>Years Of Experience</p>
              </div>
            </div>
          </div>
          <div className="row grid grid-cols-1 md:grid-cols-3 h-auto gap-10 relative p-3">
            <div className="cards p-6 transform transition-all hover:scale-105 hover:shadow-2xl rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white space-y-4">
              <h2 className="text-2xl font-semibold mb-3">
                Empowering Electrical Solutions
              </h2>
              <p className="leading-6 tracking-normal">
                Our meticulously designed electrical solutions are tailored to
                meet your needs, ensuring efficiency and safety. From
                installations to maintenance, we deliver reliable and
                sustainable power systems for your peace of mind.
              </p>
            </div>
            <div className="cards bg-[rgba(255, 255, 255, 0.1)] backdrop-blur rounded-3xl p-6 transform transition-all hover:scale-105 hover:shadow-2xl text-white space-y-4">
              <h2 className="text-2xl font-semibold mb-3">
                Illuminating Excellence: Electrical Services
              </h2>
              <p className="leading-6 tracking-normal">
                Experience the brilliance of our electrical services as we
                illuminate your spaces with cutting-edge solutions. Our
                commitment to excellence ensures that every connection lights up
                your vision for a brighter future.
              </p>
            </div>
            <div className="cards bg-[rgba(255, 255, 255, 0.1)] backdrop-blur rounded-3xl p-6 transform transition-all hover:scale-105 hover:shadow-2xl text-white space-y-4">
              <h2 className="text-2xl font-semibold mb-3">
                Wired for Success: Electrical Expertise
              </h2>
              <p className="leading-6 tracking-normal">
                Experience the brilliance of our electrical services as we
                illuminate your spaces with cutting-edge solutions. Our
                commitment to excellence ensures that every connection lights up
                your vision for a brighter future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
