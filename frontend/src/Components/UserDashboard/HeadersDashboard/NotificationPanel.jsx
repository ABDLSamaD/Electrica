import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import axios from "axios";

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
        Array.isArray(prev)
          ? prev.map((notif) =>
              notif._id === notificationId ? { ...notif, isRead: true } : notif
            )
          : []
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
          Array.isArray(prev)
            ? prev.filter((notif) => notif._id !== notificationId)
            : []
        );
      } catch (error) {
        console.error("Error removing notification:", error);
      }
    }, 300); // Delay for animation
  };

  return (
    <div className="absolute -right-6 top-14 md:w-96 w-72 bg-gray-700/90 backdrop-blur-xl border border-solid border-gray-200/20 shadow-xl rounded-xl text-white p-4">
      <div className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400 py-4">No new notifications</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-3 flex justify-between items-center rounded-lg transition-all duration-300 cursor-pointer ${
                notif.isRead
                  ? "bg-transparent"
                  : "bg-white/10 border border-white/20"
              } hover:bg-white/20 ${
                removing === notif._id ? "translate-x-32 opacity-0" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                {!notif.isRead && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
                <div onClick={() => markAsRead(notif._id)}>
                  <p className="text-sm font-medium">{notif.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notif._id)}
                className="p-1 bg-red-500/30 hover:bg-red-500/50 rounded-full transition-all duration-300"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
