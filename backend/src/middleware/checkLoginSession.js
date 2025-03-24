const User = require("../models/user");

const checkLoginSession = async (req, res, next) => {
  try {
    const { userId } = req.session;
    if (!userId) return next(); // No user session found, continue

    const user = await User.findById(userId);
    if (!user) {
      // 🔴 Destroy session only when user is not found in DB
      req.session.destroy((err) => {
        if (err) console.error("Error destroying session:", err);
      });
      return res.status(401).json({ type: "error", message: "User not found" });
    }

    // Check if user is already logged in on another platform
    const currentSession = user.sessions.find(
      (s) => s.sessionId === req.sessionID
    );

    if (!currentSession) {
      return res.status(403).json({
        type: "error",
        message:
          "Your account is logged in on another platform. Please sign in again.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkLoginSession middleware:", error);
    res.status(500).json({ type: "error", message: "Internal Server Error" });
  }
};

module.exports = checkLoginSession;
