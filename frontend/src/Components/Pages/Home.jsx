import HeaderMain from "./HeaderMain";
import { Zap, Lightbulb, SmilePlus, CheckCircle2, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import AdvancedFuturisticCards from "./AdvancedFuturisticCards";
import Footer from "./Footer";
import { useEffect } from "react";

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
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
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
                  Fulfilling Electrical Solutions for a Bright Future.
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
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
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
          </div>
        </div>
        <div className="mb-64">
          <AdvancedFuturisticCards />
        </div>
      </section>
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, subtitle }) => (
  <motion.div
    className="flex flex-col items-center p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="text-cyan-400 mb-3 text-3xl">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
    <p className="text-gray-400 text-sm">{subtitle}</p>
  </motion.div>
);

export default Home;
