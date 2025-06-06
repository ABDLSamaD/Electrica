import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const introText = [
  "Welcome to Electrica",
  "Powering your Digital Experience",
  "Secure • Fast • Smart",
  "Let's Get Started...",
];

export default function Intro({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const firstTime = document.cookie.includes("firstTime=true");
    if (firstTime) {
      // Check if onFinish exists before calling it
      if (typeof onFinish === "function") {
        onFinish();
      }
    }
  }, [onFinish]);

  useEffect(() => {
    if (index < introText.length) {
      const timeout = setTimeout(() => setIndex(index + 1), 2000);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        document.cookie = "firstTime=true; max-age=31536000; path=/";
        setShow(false);
        // Check if onFinish exists before calling it
        if (typeof onFinish === "function") {
          setTimeout(onFinish, 800);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [index, onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center"
        >
          {/* Animated background grid - reduced opacity for better contrast */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4">
              {Array.from({ length: 144 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-yellow-400/10 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: Math.random() * 0.3 + 0.1,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Electric circuit lines - reduced opacity */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"
                style={{
                  top: `${15 + i * 20}%`,
                  left: 0,
                  right: 0,
                }}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.5, 0],
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: i * 0.8,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Main content container - MUCH darker background for better contrast */}
          <motion.div
            className="relative w-full max-w-2xl px-8 py-12 backdrop-blur-xl bg-black rounded-2xl border-2 border-yellow-400/50 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Animated energy orb - reduced brightness */}
            <motion.div
              className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 opacity-50 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Progress bar */}
            <motion.div
              className="absolute left-0 bottom-0 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600"
              style={{
                width: `${(index / introText.length) * 100}%`,
                filter: "drop-shadow(0 0 8px rgba(250,204,21,0.5))",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(index / introText.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="space-y-10">
              {introText.slice(0, index + 1).map((text, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                >
                  <div className="flex items-start gap-5">
                    {/* Animated dot */}
                    <motion.div
                      className="relative w-4 h-4 mt-2 flex-shrink-0"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-yellow-400"
                        animate={{
                          boxShadow:
                            i === index
                              ? [
                                  "0 0 0px rgba(250,204,21,0.5)",
                                  "0 0 15px rgba(250,204,21,0.8)",
                                  "0 0 5px rgba(250,204,21,0.5)",
                                ]
                              : "0 0 5px rgba(250,204,21,0.5)",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      />
                      {i === index && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-yellow-400"
                          initial={{ scale: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Text with character animation - MUCH improved visibility */}
                    <div className="overflow-hidden">
                      <motion.h2
                        className={`text-2xl md:text-3xl font-bold tracking-wide ${
                          i === index
                            ? "text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                            : "text-white"
                        }`}
                        style={{
                          textShadow:
                            i === index
                              ? "0 0 15px rgba(250,204,21,0.8), 0 0 5px rgba(250,204,21,0.5), 0 1px 3px rgba(0,0,0,1)"
                              : "0 1px 0 #000, 0 2px 5px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)",
                        }}
                        initial={{ y: 40 }}
                        animate={{ y: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          staggerChildren: 0.03,
                          delayChildren: 0.1,
                        }}
                      >
                        {text.split("").map((char, charIndex) => (
                          <motion.span
                            key={charIndex}
                            className="inline-block text-white"
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: charIndex * 0.03,
                            }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                      </motion.h2>
                    </div>
                  </div>

                  {/* Animated line connector - brighter */}
                  {i < index && (
                    <motion.div
                      className="absolute left-2 top-6 w-px bg-gradient-to-b from-yellow-300 to-yellow-500/30"
                      style={{ height: "calc(100% + 1.5rem)" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Side indicators - brighter */}
            <div className="absolute -right-3 top-0 h-full flex flex-col items-center justify-between py-8">
              {introText.map((_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      i <= index ? "bg-yellow-300" : "bg-gray-600"
                    }`}
                    animate={{
                      boxShadow:
                        i <= index ? "0 0 8px rgba(250,204,21,0.7)" : "none",
                    }}
                  />
                  {i < introText.length - 1 && (
                    <motion.div
                      className={`absolute top-3 left-1/2 -translate-x-1/2 w-px h-12 ${
                        i < index
                          ? "bg-gradient-to-b from-yellow-300 to-yellow-500/20"
                          : "bg-gray-700"
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: i < index ? 1 : 0.3 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
