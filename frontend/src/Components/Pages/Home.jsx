import {
  Zap,
  Lightbulb,
  SmilePlus,
  CheckCircle2,
  Clock3,
  Wrench,
  Shield,
  Cpu,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import HeaderMain from "./HeaderMain";
import AdvancedFuturisticCards from "./AdvancedFuturisticCards";
import Footer from "./Footer";
import ContactCTA from "./ContactCTA";

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Home = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" ref={ref}>
      <HeaderMain />
      <section className="flex-grow relative top-36">
        <div className="min-h-screen text-white overflow-hidden">
          <div className="container mx-auto px-4 py-12 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <motion.h1
                  className="text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  WELCOME TO{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                    Electrica
                  </span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Powering Tomorrow's Innovation with Advanced Electrical
                  Solutions
                </motion.p>
                <motion.p
                  className="text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  From residential installations to industrial automation, we
                  deliver cutting-edge electrical solutions that transform
                  spaces and empower businesses.
                </motion.p>

                {/* Stats Grid */}
                <motion.div
                  className="grid grid-cols-3 gap-4 mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <FeatureCard
                    icon={<SmilePlus className="w-8 h-8" />}
                    title="100%"
                    subtitle="Client Satisfaction"
                  />
                  <FeatureCard
                    icon={<CheckCircle2 className="w-8 h-8" />}
                    title="900+"
                    subtitle="Completed Projects"
                  />
                  <FeatureCard
                    icon={<Clock3 className="w-8 h-8" />}
                    title="25+"
                    subtitle="Years Experience"
                  />
                </motion.div>
              </motion.div>

              {/* Right Content - Image & Floating Icons */}
              <motion.div style={{ opacity, scale }} className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80"
                  alt="Electrical Solutions"
                  loading="lazy"
                  className="rounded-2xl w-full object-cover shadow-2xl shadow-cyan-500/20"
                  style={{ filter: "brightness(0.8) contrast(1.2)" }}
                />

                {/* Floating Icons */}
                <motion.div
                  variants={floatingAnimation}
                  animate="animate"
                  className="absolute -left-8 top-1/4"
                >
                  <Zap className="w-12 h-12 text-cyan-400" />
                </motion.div>

                <motion.div
                  variants={floatingAnimation}
                  animate="animate"
                  transition={{ delay: 0.5 }}
                  className="absolute -right-8 top-3/4"
                >
                  <Lightbulb className="w-12 h-12 text-cyan-400" />
                </motion.div>
              </motion.div>
            </div>

            {/* Services Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-32"
            >
              <h2 className="text-4xl font-bold text-center mb-16">
                Our <span className="text-cyan-400">Services</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ServiceCard
                  icon={<Wrench className="w-10 h-10" />}
                  title="Electrical Installation"
                  description="Professional installation services for residential and commercial properties with the latest safety standards."
                />
                <ServiceCard
                  icon={<Shield className="w-10 h-10" />}
                  title="Safety Inspections"
                  description="Comprehensive electrical safety audits and certifications to ensure your peace of mind."
                />
                <ServiceCard
                  icon={<Cpu className="w-10 h-10" />}
                  title="Smart Systems"
                  description="Integration of smart electrical systems for enhanced efficiency and automation."
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="mb-10">
          <AdvancedFuturisticCards />
        </div>
        <div className="mb-64">
          <ContactCTA />
        </div>
      </section>
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, subtitle }) => (
  <motion.div
    className="flex flex-col items-center p-8 bg-gray-800/50 rounded-xl backdrop-blur-sm md:p-6"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="text-cyan-400 mb-3 text-3xl">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
    <p className="text-gray-400 text-sm">{subtitle}</p>
  </motion.div>
);

const ServiceCard = ({ icon, title, description }) => (
  <motion.div
    className="p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50"
    whileHover={{ y: -10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="text-cyan-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default Home;
