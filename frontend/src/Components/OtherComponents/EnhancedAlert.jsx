"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  X,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";

const EnhancedAlert = ({
  id,
  type = "info",
  title,
  message,
  duration = 5000,
  position = "bottom-right",
  size = "medium",
  showProgress = true,
  dismissible = true,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(duration);

  // Position configurations
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  // Size configurations
  const sizeClasses = {
    small: "max-w-sm p-3",
    medium: "max-w-md p-4",
    large: "max-w-lg p-6",
  };

  // Type configurations
  const typeConfig = {
    success: {
      icon: CheckCircle,
      accentIcon: Star,
      gradient: "from-emerald-500/20 via-green-500/10 to-emerald-600/20",
      border: "border-emerald-400/30",
      iconColor: "text-emerald-400",
      progressColor: "bg-emerald-500",
      glowColor: "shadow-emerald-500/20",
      particleColor: "bg-emerald-400",
    },
    error: {
      icon: XCircle,
      accentIcon: Zap,
      gradient: "from-red-500/20 via-rose-500/10 to-red-600/20",
      border: "border-red-400/30",
      iconColor: "text-red-400",
      progressColor: "bg-red-500",
      glowColor: "shadow-red-500/20",
      particleColor: "bg-red-400",
    },
    info: {
      icon: Info,
      accentIcon: Sparkles,
      gradient: "from-blue-500/20 via-cyan-500/10 to-blue-600/20",
      border: "border-blue-400/30",
      iconColor: "text-blue-400",
      progressColor: "bg-blue-500",
      glowColor: "shadow-blue-500/20",
      particleColor: "bg-blue-400",
    },
    warning: {
      icon: AlertTriangle,
      accentIcon: Zap,
      gradient: "from-amber-500/20 via-yellow-500/10 to-amber-600/20",
      border: "border-amber-400/30",
      iconColor: "text-amber-400",
      progressColor: "bg-amber-500",
      glowColor: "shadow-amber-500/20",
      particleColor: "bg-amber-400",
    },
  };

  const config = typeConfig[type];
  const MainIcon = config.icon;
  const AccentIcon = config.accentIcon;

  // Timer management
  useEffect(() => {
    if (duration === 0) return;

    const startTimer = () => {
      const startTime = Date.now();
      const updateProgress = () => {
        if (isPaused) return;

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, remainingTimeRef.current - elapsed);
        const progressPercent = (remaining / duration) * 100;

        setProgress(progressPercent);

        if (remaining <= 0) {
          handleClose();
        } else {
          timerRef.current = requestAnimationFrame(updateProgress);
        }
      };

      timerRef.current = requestAnimationFrame(updateProgress);
    };

    if (!isPaused) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [duration, isPaused]);

  const handleMouseEnter = () => {
    if (duration > 0) {
      setIsPaused(true);
      remainingTimeRef.current = (progress / 100) * duration;
    }
  };

  const handleMouseLeave = () => {
    if (duration > 0) {
      setIsPaused(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  // Animation variants
  const alertVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: position.includes("top") ? -50 : 50,
      x: position.includes("left") ? -50 : position.includes("right") ? 50 : 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: position.includes("top") ? -50 : 50,
      x: position.includes("left") ? -50 : position.includes("right") ? 50 : 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 600,
        damping: 25,
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const progressVariants = {
    initial: { scaleX: 1 },
    animate: {
      scaleX: progress / 100,
      transition: {
        duration: 0.1,
        ease: "linear",
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${positionClasses[position]} pointer-events-auto`}
          variants={alertVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className={`
              relative overflow-hidden rounded-2xl backdrop-blur-3xl border
              ${sizeClasses[size]} ${config.border} ${config.glowColor}
              bg-gradient-to-br ${config.gradient}
              shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]
              hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.16)]
              transition-all duration-300
            `}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 ${config.particleColor} rounded-full opacity-30`}
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                />
              ))}
            </div>

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />

            {/* Progress bar */}
            {showProgress && duration > 0 && (
              <motion.div
                className={`absolute bottom-0 left-0 h-1 ${config.progressColor} origin-left`}
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
            )}

            {/* Content */}
            <div className="relative z-10 flex items-start space-x-4">
              {/* Icon section */}
              <div className="flex-shrink-0 relative">
                <motion.div
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-2xl
                    bg-white/10 backdrop-blur-xl border border-white/20
                  `}
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                >
                  {/* Pulsing ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl border-2 ${config.border}`}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  <MainIcon
                    className={`w-6 h-6 ${config.iconColor} relative z-10`}
                  />

                  {/* Accent icon */}
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    <AccentIcon className={`w-3 h-3 ${config.iconColor}`} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Text content */}
              <motion.div
                className="flex-1 min-w-0"
                variants={textVariants}
                initial="initial"
                animate="animate"
              >
                {title && (
                  <motion.h4
                    className="text-white font-semibold text-sm mb-1 leading-tight"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {title}
                  </motion.h4>
                )}
                <motion.p
                  className="text-white/80 text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {message}
                </motion.p>
              </motion.div>

              {/* Close button */}
              {dismissible && (
                <motion.button
                  onClick={handleClose}
                  className={`
                    flex-shrink-0 p-1.5 rounded-lg transition-all duration-200
                    ${config.iconColor} hover:bg-white/10 hover:scale-110
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  `}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.2 }}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Pause indicator */}
            {isPaused && duration > 0 && (
              <motion.div
                className="absolute top-2 right-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <div
                  className={`w-2 h-2 ${config.particleColor} rounded-full animate-pulse`}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedAlert;
// This component can be used in your application to display alerts with enhanced animations and styles.
