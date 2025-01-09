const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ error: "Please authenticate using a valid token!" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
};

module.exports = fetchUser;
