const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mail");
// const user = require("../models/user");

exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Create a new admin
    const admin = new Admin({
      username,
      email,
      password,
    });
    await admin.save();

    const subject = "Admin",
      text = `${subject} ${username} has been registered successfull`;

    sendEmail(email, subject, text);

    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    if (req.session.admin) {
      return res.status(400).json({ message: "Already logged in" });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    req.session.admin = {
        id: admin._id,
        username: admin.username,
        email: admin.email
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const subject = "Admin",
      text = `${subject} ${
        admin.username
      } has Login successfully.  ${Date.now().toLocaleString()}`;

    sendEmail(email, subject, text);

    admin.token = token;
    await admin.save();

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.logoutAdmin = (req, res) => {
    if (req.session.admin) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie("connect.sid"); // Clear session cookie
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(400).json({ message: "No active session found" });
    }
  };
  