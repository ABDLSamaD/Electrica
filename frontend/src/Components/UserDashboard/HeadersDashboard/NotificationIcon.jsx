import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import NotificationPanel from "./NotificationPanel";

const NotificationIcon = ({ electricaURL }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/auth/get-notification`,
        { withCredentials: true }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const notificationBadge =
    unreadCount > 9 ? "9+" : unreadCount > 0 ? unreadCount : null;

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative text-white text-2xl p-2"
      >
        <Bell className="w-6 h-6 text-white" />
        {notificationBadge && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs font-bold text-white w-5 h-5 flex items-center justify-center rounded-full">
            {notificationBadge}
          </span>
        )}
      </button>

      {showNotifications && (
        <NotificationPanel
          electricaURL={electricaURL}
          notifications={notifications}
          setNotifications={setNotifications} // Pass to update after read
        />
      )}
    </div>
  );
};

export default NotificationIcon;
