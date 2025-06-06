const jwt = require("jsonwebtoken");

const adminAuths = (req, res, next) => {
  // Get token from headers
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ error: "Please authenticate using a valid token!" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to the request object
    req.admin = decoded;

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = adminAuths;
