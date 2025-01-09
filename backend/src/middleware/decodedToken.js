const jwt = require("jsonwebtoken");

const decodeToken = (req, res, next) => {
  try {
    const token = req.cookies.auth_token; // Access the token from the cookie

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

module.exports = decodeToken;
