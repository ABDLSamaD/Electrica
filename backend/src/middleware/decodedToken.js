const jwt = require("jsonwebtoken");

const decodedToken = (req, res, next) => {
  try {
    if (req.session && req.session.user) {
      req.user = req.session.user; // ✅ Fallback: Use session user
      return next();
    }

    const token = req.cookies.auth_token; // Access the token from the cookie

    // If token is not in cookies, check session
    if (!token && req.session.token) {
      token = req.session.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized access. Token missing." });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user details to the request object
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = decodedToken;
