"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import "./css.css";

// Custom Card components to replace shadcn components
const Card = ({ className, children }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-xl shadow-xl ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div
    className={`px-4 py-3 border-b border-gray-200 dark:border-gray-800 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-lg font-semibold ${className} text-blue-400`}>
    {children}
  </h3>
);

const CardContent = ({ className, children }) => (
  <div className={className}>{children}</div>
);

// Button component
const Button = ({ variant, size, className, onClick, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "ghost":
        return "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800";
      default:
        return "bg-blue-500 text-white hover:bg-blue-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "icon":
        return "p-1";
      default:
        return "px-4 py-2";
    }
  };

  return (
    <button
      className={`rounded-md transition-colors ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
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

  return (
    <Card className="absolute sm:right-0 -right-20 top-14 w-[320px] sm:w-[380px] md:w-[420px] border border-solid border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950 z-auto">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No new notifications
          </div>
        ) : (
          <div className="max-h-[350px] overflow-auto custom-scrollbar">
            <ul className="py-2 px-2">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`mb-2 p-3 flex justify-between items-start rounded-lg transition-all duration-300 ${
                    notif.isRead
                      ? "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                      : "bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700"
                  } ${
                    removing === notif._id ? "translate-x-32 opacity-0" : ""
                  }`}
                >
                  <div
                    className="flex items-start space-x-2 cursor-pointer"
                    onClick={() => markAsRead(notif._id)}
                  >
                    {!notif.isRead && (
                      <span className="mt-1.5 flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.message}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 flex-shrink-0 -mt-1"
                    onClick={() => removeNotification(notif._id)}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove notification</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
