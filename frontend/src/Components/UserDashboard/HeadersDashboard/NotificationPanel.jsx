"use client";

import { useState } from "react";
import { X, Bell, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Enhanced Card components with glassmorphism
const Card = ({ className, children }) => (
  <motion.div
    className={`bg-indigo-950/90 backdrop-blur-3xl rounded-3xl border border-white/[0.08] shadow-[0_20px_40px_0_rgba(0,0,0,0.3)] overflow-hidden ${className}`}
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]"></div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const CardHeader = ({ className, children }) => (
  <div className={`px-6 py-4 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
      <Bell className="w-5 h-5 text-blue-400" />
    </div>
    <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={`relative ${className}`}>{children}</div>
);

// Enhanced Button component
const Button = ({ variant, size, className, onClick, children, disabled }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "ghost":
        return "bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/30 text-white/70 hover:text-red-300";
      default:
        return "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "icon":
        return "p-2 w-8 h-8";
      default:
        return "px-4 py-2";
    }
  };

  return (
    <motion.button
      className={`rounded-xl transition-all duration-300 backdrop-blur-xl font-medium ${getVariantClasses()} ${getSizeClasses()} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
};

const NotificationPanel = ({
  electricaURL,
  notifications,
  setNotifications,
}) => {
  const [removing, setRemoving] = useState(null);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${electricaURL}/api/auth/read-notification/${notificationId}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Remove notification with animation
  const removeNotification = async (notificationId) => {
    setRemoving(notificationId);
    setTimeout(async () => {
      try {
        await axios.delete(
          `${electricaURL}/api/auth/delete-notification/${notificationId}`,
          { withCredentials: true }
        );
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== notificationId)
        );
      } catch (error) {
        console.error("Error removing notification:", error);
      }
    }, 300); // Delay for animation
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getNotificationBorderColor = (type, isRead) => {
    if (isRead) return "border-white/10";

    switch (type) {
      case "success":
        return "border-green-400/30";
      case "warning":
        return "border-yellow-400/30";
      case "error":
        return "border-red-400/30";
      default:
        return "border-blue-400/30";
    }
  };

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) return "bg-white/[0.02]";

    switch (type) {
      case "success":
        return "bg-green-500/10";
      case "warning":
        return "bg-yellow-500/10";
      case "error":
        return "bg-red-500/10";
      default:
        return "bg-blue-500/10";
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <Card className="absolute right-0 top-14 w-[320px] sm:w-[400px] md:w-[450px] z-50">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between w-full">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <motion.div
                className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <span className="text-xs font-semibold text-blue-300">
                  {unreadCount} new
                </span>
              </motion.div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <motion.div
            className="py-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-4 border border-white/20">
              <Bell className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              All caught up!
            </h3>
            <p className="text-white/60 text-sm">
              No new notifications at the moment
            </p>
          </motion.div>
        ) : (
          <div className="max-h-[400px] overflow-auto">
            <div className="p-4 space-y-3">
              <AnimatePresence>
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif._id}
                    className={`group relative p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${getNotificationBgColor(
                      notif.type,
                      notif.isRead
                    )} ${getNotificationBorderColor(
                      notif.type,
                      notif.isRead
                    )} ${
                      removing === notif._id ? "translate-x-full opacity-0" : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => markAsRead(notif._id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>

                      {/* Unread Indicator */}
                      {!notif.isRead && (
                        <motion.div
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium leading-relaxed ${
                            notif.isRead ? "text-white/70" : "text-white"
                          }`}
                        >
                          {notif.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="w-3 h-3 text-white/40" />
                          <span className="text-xs text-white/50">
                            {new Date(notif.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif._id);
                          }}
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">Remove notification</span>
                        </Button>
                      </motion.div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <motion.div
                className="p-4 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <button
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    onClick={() => {
                      // Mark all as read functionality
                      notifications.forEach((notif) => {
                        if (!notif.isRead) markAsRead(notif._id);
                      });
                    }}
                  >
                    Mark all as read
                  </button>
                  <button
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    onClick={() => {
                      // Clear all functionality
                      notifications.forEach((notif) =>
                        removeNotification(notif._id)
                      );
                    }}
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
