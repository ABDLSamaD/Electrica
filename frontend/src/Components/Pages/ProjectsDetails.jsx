import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import HeaderMain from "./HeaderMain";
import Footer from "./Footer";
import Stage from "./Stage";
import ProgressIndicator from "./ProgressIndicator";
import { stages } from "./data/stages";
import { Link } from "react-router-dom";

const ProjectDetails = () => {
  const [activeStage, setActiveStage] = useState(0);
  const stageRefs = useRef(stages.map(() => React.createRef()));
  const { scrollY } = useScroll();

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPosition = window.scrollY;
      const newActiveStage = Math.floor(
        (currentScrollPosition / pageHeight) * stages.length
      );
      setActiveStage(Math.min(newActiveStage, stages.length - 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribeY = scrollY.on("change", (latest) => {
      stageRefs.current.forEach((ref, index) => {
        if (ref.current) {
          const element = ref.current;
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveStage(index);
          }
        }
      });
    });

    return () => {
      unsubscribeY();
    };
  }, [scrollY]);

  return (
    <>
      <HeaderMain />
      <ProgressIndicator stages={stages.length} activeStage={activeStage} />
      <div className="container mx-auto py-56">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
            Project Details - Electrica
          </h1>
          <p className="text-lg text-gray-300">
            Discover the journey of creating efficient, safe, and reliable
            electrical systems.
          </p>
        </motion.div>

        <div className="relative">
          {stages.map((stage, index) => (
            <div key={stage.id} ref={stageRefs.current[index]}>
              <Stage {...stage} isActive={index === activeStage} />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-24 bg-gray-800 p-8 rounded-lg shadow-lg text-white space-y-6"
        >
          <h2 className="text-3xl font-bold">More About Electrica</h2>
          <p className="text-gray-300">
            Electrica is dedicated to providing top-notch electrical solutions,
            focusing on safety, efficiency, and innovation. Our projects are
            designed to meet the highest standards, ensuring reliability and
            longevity.
          </p>
          <h3 className="text-2xl font-semibold">Our Project Approach</h3>
          <p className="text-gray-300">
            From initial planning to final execution, our approach is
            comprehensive and detail-oriented. We ensure that every aspect of
            the project is carefully managed and executed, resulting in superior
            electrical systems that meet all regulatory standards.
          </p>
          <h3 className="text-2xl font-semibold">Why Choose Us</h3>
          <p className="text-gray-300">
            With years of experience and a team of highly skilled professionals,
            Electrica is your trusted partner for all your electrical needs. We
            pride ourselves on our commitment to quality and customer
            satisfaction.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <Link
            to="/signin"
            className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
          >
            Contact Us Today
          </Link>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetails;
