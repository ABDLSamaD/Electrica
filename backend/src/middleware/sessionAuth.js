const User = require("../models/user");

const sessionAuth = async (req, res, next) => {
  try {
    if (!req.session.user || !req.session.token) {
      return res.status(401).json({ error: "Unauthorized access for user." });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const currentTime = Date.now();
    const sessionExpirationTime = req.session.cookie.expires
      ? new Date(req.session.cookie.expires).getTime()
      : currentTime + (user.logoutTime || 86400000); // Default to 1 day if not set

    if (currentTime > sessionExpirationTime) {
      // Invalidate session
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Could not log out" });
        }
        return res
          .status(401)
          .json({ error: "Session expired. Please log in again." });
      });
    } else {
      req.session.cookie.maxAge = user.logoutTime || 86400000; // Reset session maxAge based on user setting
      req.user = req.session.user; // Attach user information to the request object
      next(); // Proceed to the next middleware or route handler
    }
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Internal server error during session validation." });
  }
};

module.exports = sessionAuth;
