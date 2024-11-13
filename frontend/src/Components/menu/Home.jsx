import React from "react";
import Header from "../header/header";

const Home = () => {
  return (
    <>
    <Header />
    <section id="home" className="relative top-14">
      <div className="container flex justify-center flex-wrap relative">
        <div className="row mb-9">
          <div className="col-1">
            <h1>
              WELCOME TO <span>Electrica</span>
            </h1>
            <h2 className="md:w-3/4">Fulfilling Electrical Solutions for a Bright Future.</h2>
          </div>
          <div className="col-2 mt-16 flex md:justify-between justify-around items-center p-2">
            <div className="client-satisfaction">
              <h2>
                100 <span>%</span>
              </h2>
              <p>Client Satisfaction</p>
            </div>
            <div className="completed-projects">
              <h2>
                900 <span>+</span>
              </h2>
              <p>Completed Projects</p>
            </div>
            <div className="years-experience">
              <h2>
                25 <span>+</span>
              </h2>
              <p>Years Of Experience</p>
            </div>
          </div>
        </div>
        <div className="row grid grid-cols-1 md:grid-cols-3 h-64 gap-3 relative p-3">
          <div className="cards p-3 will-change-transform">
            <h2 className="md:text-xl mb-5 text-cyan-900 text-xl">
              Empowering Electrical Solutions
            </h2>
            <p className="text-wrap leading-6 tracking-normal">
              Our merticulously designed electrical solutions are tailored to
              meet your needs, ensuring efficiency and safety. From
              installations to maintenance, we deliver reliable and sustainable
              power systems for your peace of mind.
            </p>
          </div>
          <div className="cards bg-[rgba(255, 255, 255, 0.1)] backdrop-blur rounded-3xl p-3 will-change-transform">
            <h2 className="md:text-xl mb-5 text-cyan-900 text-xl">
              Illuminating Excellence: Electrical Services
            </h2>
            <p className="text-wrap leading-6 tracking-normal">
              Experience the brilliance of our electrical services as we
              illuminate your spaces with cutting-edge solutions. Our commitment
              to excellence ensures that every connection lights up your vision
              for a brighter future.
            </p>
          </div>
          <div className="cards bg-[rgba(255, 255, 255, 0.1)] backdrop-blur rounded-3xl p-3 will-change-transform">
            <h2 className="md:text-xl mb-5 text-cyan-900 text-xl">
              Wired for Success: Electrical Expertise
            </h2>
            <p className="text-wrap leading-6 tracking-normal">
              perience the brilliance of our electrical services as we
              illuminate your spaces with cutting-edge solutions. Our commitment
              to excellence ensures that every connection lights up your vision
              for a brighter future.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Home;
