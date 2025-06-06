import React from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Home,
  Factory,
  Battery,
  Shield,
  Gauge,
  Lightbulb,
  Zap,
  ArrowRight,
} from "lucide-react";
import HeaderMain from "./HeaderMain";
import ServiceImageOne from "../../assets/service_1.avif";
import ServiceImageTwo from "../../assets/service_2.avif";
import ServiceImageThree from "../../assets/service_3.avif";
import ServiceImageFour from "../../assets/service_4.avif";

const ServicesDetails = () => {
  const services = [
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Electrical Installation",
      description:
        "Professional electrical installation services for both residential and commercial properties. We ensure all installations meet the latest safety standards and energy efficiency requirements.",
      features: [
        "Complete wiring solutions",
        "Circuit breaker installation",
        "Electrical panel upgrades",
        "Emergency power systems",
      ],
      image: ServiceImageOne,
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Smart Home Automation",
      description:
        "Transform your home into an intelligent living space with our cutting-edge smart home automation solutions. Control everything from lighting to security with a single touch.",
      features: [
        "Smart lighting control",
        "Automated climate systems",
        "Security integration",
        "Voice-activated controls",
      ],
      image: ServiceImageTwo,
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: "Energy Management",
      description:
        "Optimize your energy consumption and reduce costs with our advanced energy management solutions. We help businesses and homes become more energy-efficient.",
      features: [
        "Energy audits",
        "Consumption monitoring",
        "Renewable integration",
        "Cost optimization",
      ],
      image: ServiceImageThree,
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety Inspections",
      description:
        "Regular safety inspections and maintenance services to ensure your electrical systems are operating safely and efficiently. Prevent potential hazards before they occur.",
      features: [
        "Comprehensive audits",
        "Code compliance checks",
        "Safety certifications",
        "Risk assessment",
      ],
      image: ServiceImageFour,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 relative top-16 overflow-hidden">
      <HeaderMain />
      {/* Background Effects */}
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,183,255,0.15),transparent_50%)]"></div>
      </div> */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Our <span className="text-cyan-400">Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our comprehensive range of electrical services designed to
            meet all your residential, commercial, and industrial needs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-20"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-12 items-center`}
            >
              <div className="lg:w-1/2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-2xl shadow-2xl shadow-cyan-500/20 w-full object-cover aspect-video"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent rounded-2xl opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </motion.div>
              </div>

              <div className="lg:w-1/2 space-y-6">
                <div className="inline-block p-3 bg-cyan-400/20 rounded-xl">
                  {service.icon}
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2 text-cyan-400 font-semibold mt-4"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-12 rounded-3xl border border-cyan-500/20 backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your electrical needs and discover how
              we can help you achieve your goals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Contact Us Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesDetails;
