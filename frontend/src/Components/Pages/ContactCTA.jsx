import { motion } from "framer-motion";
import { Phone, Mail, Clock } from "lucide-react";
import TestimonialSection from "./TestimonialSection";

const ContactCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 z-0" /> */}

      <div className="mx-auto px-4 relative z-10">
        <div className="backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-solid border-gray-700">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your
                <span className="block text-cyan-400">Electrical Systems?</span>
              </h2>

              <p className="text-gray-300 mb-8">
                Contact us today for a free consultation and discover how we can
                help modernize your electrical infrastructure.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-400/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Call us at</p>
                    <p className="text-white font-semibold">+92 330 5786110</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-cyan-400/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Email us at</p>
                    <p className="text-white font-semibold">
                      absamadkhan878@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-cyan-400/20 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400">Business Hours</p>
                    <p className="text-white font-semibold">
                      Mon-Sat: 8AM - 5PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 p-6 rounded-xl backdrop-blur-sm">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <TestimonialSection />
    </section>
  );
};

export default ContactCTA;
