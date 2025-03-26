"use client";

import {
  Zap,
  Lightbulb,
  SmilePlus,
  CheckCircle2,
  Clock3,
  Wrench,
  Shield,
  Cpu,
  Star,
  Award,
  Sparkles,
  BarChart3,
  Plug,
  Building2,
  Factory,
  HomeIcon,
  ChevronRight,
  Users,
  Briefcase,
  PenToolIcon as Tool,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import HeaderMain from "./HeaderMain";
import AdvancedFuturisticCards from "./AdvancedFuturisticCards";
import Footer from "./Footer";
import ContactCTA from "./ContactCTA";
// images start
import HomeImage from "../../assets/homeimage.avif";
import ProjectImageOne from "../../assets/project_1.avif";
import ProjectImageTwo from "../../assets/project_2.avif";
import ProjectImageThree from "../../assets/project_3.avif";
// images end

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
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

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);

    // Set visibility for animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
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
                src={HomeImage}
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

        {/* NEW SECTIONS START HERE */}

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-200">
                Why <span className="text-cyan-400">Choose Us</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                At Electrica, we combine technical expertise with innovative
                solutions to deliver exceptional electrical services that exceed
                expectations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.isArray(whyChooseUs) && whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-solid border-gray-700 hover:border-cyan-500/50 group"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-all duration-300">
                    <span className="text-cyan-400">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Showcase */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold mb-4 text-gray-200"
              >
                Our <span className="text-cyan-400">Projects</span>
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 max-w-2xl mx-auto"
              >
                Explore our portfolio of successful electrical projects across
                various industries and applications.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                      <div className="flex items-center mb-2">
                        <span className="text-cyan-400 mr-2">
                          {project.icon}
                        </span>
                        <span className="text-sm font-medium text-cyan-300">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {project.description}
                      </p>
                      <div className="flex items-center text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Project</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center mx-auto">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Stats & Facts Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-200">
                Our <span className="text-cyan-400">Impact</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Measurable results that demonstrate our commitment to excellence
                and innovation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-cyan-400">{stat.icon}</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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

// Data for new sections
const whyChooseUs = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Certified Experts",
    description:
      "Our team consists of certified electrical professionals with years of industry experience.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Innovative Solutions",
    description:
      "We implement cutting-edge technologies and innovative approaches to electrical challenges.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Safety First",
    description:
      "We prioritize safety in every project, adhering to the highest industry standards.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Energy Efficiency",
    description:
      "Our solutions are designed to optimize energy consumption and reduce environmental impact.",
  },
];

const projects = [
  {
    image: ProjectImageOne,
    icon: <Building2 className="w-4 h-4" />,
    category: "Commercial",
    title: "Office Tower Automation",
    description:
      "Complete electrical system upgrade and smart automation for a 20-story office building.",
  },
  {
    image: ProjectImageTwo,
    icon: <Factory className="w-4 h-4" />,
    category: "Industrial",
    title: "Manufacturing Plant Retrofit",
    description:
      "Energy-efficient electrical system retrofit for a large manufacturing facility.",
  },
  {
    image: ProjectImageThree,
    icon: <HomeIcon className="w-4 h-4" />,
    category: "Residential",
    title: "Smart Home Integration",
    description:
      "Comprehensive smart home electrical system with voice control and energy monitoring.",
  },
];

const stats = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "1200+",
    label: "Satisfied Clients",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    value: "800+",
    label: "Projects Completed",
  },
  {
    icon: <Tool className="w-6 h-6" />,
    value: "20+",
    label: "Expert Technicians",
  },
  {
    icon: <Clock3 className="w-6 h-6" />,
    value: "20+",
    label: "Years of Experience",
  },
];

export default Home;
