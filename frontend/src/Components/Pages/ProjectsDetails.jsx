import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaTools, FaClipboardCheck, FaLightbulb } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";
import Stage from "./Stage";
import pipingImage from "../../assets/piping.jpg";
import concealedFittingImage from "../../assets/Concealed-wiring.webp";
import panelBoardsImage from "../../assets/Electrical-panel-board-installation-amp_-maintenance.jpg";
import { Link } from "react-router-dom";

const stages = [
  {
    id: 1,
    title: "Piping",
    description:
      "Installation of pipes to securely route electrical cables, ensuring proper wiring pathways.",
    detailedDescription:
      "This stage involves careful planning to ensure that the electrical system is both efficient and safe. Our expert team meticulously designs the piping layout, considering factors such as load distribution, future expansion, and ease of maintenance. We use high-quality materials that meet or exceed industry standards, ensuring longevity and reliability of the electrical infrastructure.",
    icon: <FaTools size={40} className="text-orange-500" />,
    image: pipingImage,
  },
  {
    id: 2,
    title: "Concealed Fitting",
    description:
      "Embedding conduits, boxes, and fittings within walls and ceilings for a clean, finished look.",
    detailedDescription:
      "This process not only enhances aesthetics but also protects the wiring from damage. Our skilled technicians employ advanced techniques to seamlessly integrate electrical components into the building structure. We pay special attention to proper insulation and spacing, ensuring optimal performance and minimizing the risk of electrical hazards. This stage sets the foundation for a safe and visually appealing electrical system.",
    icon: <FaClipboardCheck size={40} className="text-orange-500" />,
    image: concealedFittingImage,
  },
  {
    id: 3,
    title: "Panel Boards & Switchboards",
    description:
      "Installation of panel boards, lighting systems, and switchboards, bringing the project to life.",
    detailedDescription:
      "This stage is crucial for ensuring that the electrical supply is managed safely and effectively. Our team of certified electricians installs state-of-the-art panel boards and switchboards, incorporating the latest in circuit protection technology. We meticulously label and organize all components for easy identification and future maintenance. The lighting systems are carefully integrated, balancing energy efficiency with optimal illumination for each space.",
    icon: <FaLightbulb size={40} className="text-orange-500" />,
    image: panelBoardsImage,
  },
];

const ProjectDetails = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newActiveStage = Math.floor(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          stages.length
      );
      setActiveStage(Math.min(newActiveStage, stages.length - 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-900">
      <Header />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-800 origin-left z-50"
        style={{ scaleX }}
      />
      <div className="container mx-auto py-48">
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
            <Stage key={stage.id} {...stage} />
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
    </div>
  );
};

export default ProjectDetails;
