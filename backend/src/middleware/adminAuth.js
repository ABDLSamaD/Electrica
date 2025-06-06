const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const adminAuth = async (req, res, next) => {
  const token = req.cookies.admin_auth;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || decoded.role !== "admin") {
      return res
        .status(403)
        .json({ type: "error", message: "Access denied. Not an admin." });
    }
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res
        .status(404)
        .json({ type: "error", message: "Admin not found." });
    }

    req.admin = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ type: "error", message: "Invalid token." });
  }
};

module.exports = adminAuth;
