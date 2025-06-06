const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Admin = require("../models/admin");
const { sendEmail } = require("../utils/mail");
const User = require("../models/user");
const encryptData = require("../validators/encryptData");

exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res
        .status(400)
        .json({ type: "error", message: "Admin already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });
    if (!admin)
      return res
        .status(404)
        .json({ type: "error", message: "Something Occured!" });

    const data = { admin: { email } };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
    admin.token = token;
    await admin.save();

    const subject = "Admin",
      text = `${subject} ${username} has been registered successfull`;

    sendEmail(email, subject, text);

    res.status(201).json({
      type: "success",
      message: "Admin registered successfully.",
      token,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    if (req.session.admin) {
      return res
        .status(400)
        .json({ type: "error", message: "Already logged in" });
    }

    const { email, username, password } = req.body;

    const admin = await Admin.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (!admin) {
      return res
        .status(404)
        .json({ type: "error", message: "Username or Email not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ type: "error", message: "Wrong Password!" });
    }

    const data = { id: admin.id, role: "admin" };

    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    admin.token = token;

    res.cookie("admin_auth", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // Use secure cookies in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days or session-only
    });

    req.session.token = token;
    req.session.admin = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: "admin",
    };

    const subject = "Admin",
      text = `${subject} ${admin.username} has Login successfully.  
      ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;

    sendEmail(email, subject, text);

    await admin.save();

    res.status(200).json({ type: "success", message: "Login successfull" });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

exports.checkAdminAuth = (req, res) => {
  if (req.session.admin) {
    res
      .status(200)
      .json({ isAuthenticated: true, admin: req.session.admin, role: "admin" });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
};

// login admin
exports.logoutAdmin = async (req, res) => {
  if (req.session.admin) {
    try {
      const adminId = req.session.admin.id;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      admin.token = "";
      await admin.save();

      // Destroy the session and clear cookies
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie("electrica"); // Clear session cookie
        res.clearCookie("admin_auth"); // Clear session cookie
        res.status(200).json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging out", error });
    }
  } else {
    res.status(400).json({ message: "No active session found" });
  }
};

// forgot password admin
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(400)
        .json({ type: "error", message: "Admin Does'nt exists." });

    const payload = { id: admin._id, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const randomOtp = crypto.randomInt(100000, 1000000);
    admin.otp = randomOtp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    admin.resetToken = token;

    sendEmail(admin.email, "FORGOT OTP", randomOtp);

    await admin.save();

    res.status(200).json({
      type: "success",
      message: "OTP has been sent to your email",
      token,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
// resend otp of forgot password
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res
        .status(400)
        .json({ type: "error", message: "Admin Does'nt exists." });

    const payload = { id: admin._id, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const randomOtp = crypto.randomInt(100000, 1000000);
    admin.otp = randomOtp;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    admin.resetToken = token;
    await admin.save();
    res.status(200).json({
      type: "success",
      message: "OTP has been sent to your email",
      token,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

exports.verifyForgotOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const admin = req.admin;

    if (!otp) {
      return res
        .status(400)
        .json({ type: "error", message: "OTP not provided" });
    }
    const storedAdmin = await Admin.findById(admin.id);
    if (!storedAdmin) {
      return res
        .status(404)
        .json({ type: "error", message: "Admin not found" });
    }
    // Check if OTP is expired
    const now = new Date();
    if (!storedAdmin.otp || storedAdmin.otpExpires < now) {
      return res.status(400).json({
        type: "error",
        message: "OTP has expired. Request a new one.",
      });
    }

    if (storedAdmin.otp !== parseInt(otp, 10)) {
      storedAdmin.otpAttempts += 1;
      await storedAdmin.save();

      if (storedAdmin.otpAttempts >= 5) {
        storedAdmin.otp = null;
        storedAdmin.otpExpires = null;
        storedAdmin.otpAttempts = 0;
        await storedAdmin.save();
        return res.status(429).json({
          type: "error",
          message: "Too many attempts. OTP invalidated. Request a new one.",
        });
      }
      return res.status(400).json({
        type: "info",
        message: `Incorrect OTP. Attempt ${storedAdmin.otpAttempts}/5`,
      });
    }

    storedAdmin.otp = null;
    storedAdmin.otpExpires = null;
    storedAdmin.otpAttempts = 0;
    await storedAdmin.save();

    res
      .status(200)
      .json({ type: "success", message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server errors" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin)
      return res
        .status(404)
        .json({ type: "error", message: "Admin not found!" });

    if (!newPassword)
      return res
        .status(404)
        .json({ type: "error", message: "Password required!" });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        type: "error",
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter and one digit.",
      });
    }

    const salt = await bcrypt.genSalt(10),
      hashPassword = await bcrypt.hash(newPassword, salt);
    admin.password = hashPassword;
    admin.resetToken = null;
    await admin.save();
    res
      .status(200)
      .json({ type: "success", message: "Password has been changed." });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    let adminId = req.admin.id;
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin)
      return res
        .status(401)
        .json({ type: "error", message: "admin not found!" });
    const encryptedUserData = encryptData(admin);
    res.status(200).json({ encryptedData: encryptedUserData });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// get all users
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name email profileImg activityLog isBlocked createdAt isVerified loginAttempt project totalCost contractorMessageOfBill contractorBill contractorBillDiscount discountAppliedDate address city phone fullName token"
    );
    const encryptedUserData = encryptData(users);
    res.status(200).json({ encryptedData: encryptedUserData });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// get all users activity log
exports.getAllUserActivity = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "username activityLog");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ email: user.email, activityLog: user.activityLog });
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity log", error });
  }
};

// Change password function
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.admin.id; // Assuming `req.user` is populated with user data after authentication

  try {
    // Fetch the admin user from the database
    const admin = await Admin.findById(userId);

    if (!admin) {
      return res
        .status(404)
        .json({ type: "error", message: "Admin not found" });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ type: "error", message: "Incorrect current password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    admin.password = hashedPassword;
    sendEmail(
      admin.email,
      "Password change",
      "Password has been changed success"
    );
    await admin.save();

    res
      .status(200)
      .json({ type: "success", message: "Password updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      type: "error",
      message: "An error occurred. Please try again later.",
    });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { userId, remove } = req.body;
    const adminId = req.admin.id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(400)
        .json({ type: "error", message: "Admin not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ type: "error", message: "User not found" });
    }

    if (remove) {
      const removedUser = {
        name: user.name,
        email: user.email,
        removedAt: new Date(),
      };
      admin.removedUsers.push(removedUser);
      await admin.save();

      await User.findByIdAndDelete(userId);
      res.status(200).json({ type: "success", message: "User removed" });
    } else {
      res.status(200).json({ type: "info", message: "User not removed" });
    }
  } catch (error) {
    res.status(500).json({ type: "error", message: error.message });
  }
};
