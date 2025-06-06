// utils/notificationHelper.js
const User = require("../models/user");

const addNotification = async (userId, message, type = "info") => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.notifications.push({ message, type, createdAt: new Date() });
    await user.save();
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

module.exports = addNotification;
