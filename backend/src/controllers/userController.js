const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOtpEmail } = require("../utils/otpService");
const { loginMail } = require("../utils/loginmail");
const { sendEmail } = require("../utils/mail");
const Project = require("../models/project");
const mongoose = require("mongoose");
// const cron = require("node-cron");
const addNotification = require("./addNotification");
const encryptData = require("../validators/encryptData");
require("dotenv").config();

// otp generator
const generateOTP = () => {
  const otp = (crypto.randomBytes(3).readUIntBE(0, 3) % 900000) + 100000;
  return otp.toString(); // Generates a 6-digit OTP
};

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, termsAndCondition } = req.body;

    if (!termsAndCondition) {
      return res.status(400).json({
        type: "error",
        message: "You must accept the Terms and Conditions.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ type: "error", message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isFirstTime: true,
      termsAndCondition: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ type: "error", message: "Something Occured!" });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;

    sendEmail(
      user.email,
      "OTP VERIFICATION",
      `${user.name} Your OTP code is (${otp}). It is valid for 10 minutes.`
    );

    const data = { user: { email } };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.token = token;

    await user.save();

    await addNotification(
      user._id,
      `Welcome! ${user.name} Your account has been created.`,
      "success"
    );

    res.status(200).json({
      type: "success",
      message: "Please verify with OTP sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", messsage: "Internal server error" });
  }
};

// change email in email verification
exports.changeEmail = async (req, res) => {
  try {
    const { email, newEmail } = req.body;

    if (!newEmail) {
      return res
        .status(400)
        .json({ type: "warning", message: "New email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }
    user.email = newEmail;
    sendEmail(user.email, "EMAIL CHANGING", "email changed.");

    // Check if OTP is correct (Assuming OTP is stored in DB)
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid or expired OTP" });
    }

    // Update the email after OTP verification
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpAttempts = 0;

    await user.save();

    return res.status(200).json({
      type: "success",
      message: "Email changed successfully and otp sended to you mail.",
    });
  } catch (error) {
    console.error("Error changing email:", error);
    return res
      .status(500)
      .json({ type: "error", message: "Internal server error" });
  }
};

// verify email otp service
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ type: "error", message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ type: "error", message: "User is already verified" });
    }

    if (!user.otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ type: "error", message: "OTP is invalid or expired" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();

      if (user.otpAttempts >= 5) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(429).json({
          type: "error",
          message: "Too many attempts. OTP invalidated. Request a new one.",
        });
      }

      return res.status(400).json({
        type: "error",
        message: `Incorrect OTP. Attempt ${user.otpAttempts}/3`,
      });
    }

    // ✅ OTP is correct, mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();
    await addNotification(user._id, "Verifying OTP successfully.", "success");

    sendEmail(user.email, "Account Verified", "Your account has been verified");

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Store in session
    req.session.token = token;
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "user",
    };

    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .json({ type: "error", message: "Session error" });
      }

      // ✅ Set HTTP-only cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        type: "success",
        message: "Account verified successfully.",
        redirectUrl: "/db-au-user",
      });
    });
  } catch (error) {
    console.error("verifyOtp error:", error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// resend otp
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }

    // Resend only if not verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ type: "info", message: "User is already verified" });
    }

    // Resend OTP and reset attempts
    await sendOtpEmail(user);
    user.otpAttempts = 0; // Reset attempts on OTP resend
    await user.save();

    res
      .status(200)
      .json({ type: "success", message: "New OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// login an user using post
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe, ipAddress, deviceInfo, otp } =
      req.body;

    const users = await User.findOne({ email });
    if (!users) {
      return res
        .status(404)
        .json({ type: "error", message: "User not found", field: "email" });
    }

    if (!users.isVerified) {
      return res
        .status(400)
        .json({ type: "error", message: "Verify your account first" });
    }

    if (users.isBlocked) {
      return res.status(403).json({
        type: "error",
        message: "Your account is blocked. Please contact support.",
        banDetails: users.banDetails,
      });
    }

    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.status(400).json({
        type: "error",
        message: "Invalid credentials!",
        field: "password",
      });
    }

    // Helper function of loginAttempt saved
    const saveLoginAttempt = (users, deviceInfo, ipAddress) => {
      const now = Date.now();
      users.loginAttempt = users.loginAttempt.filter(
        (attempt) =>
          new Date(attempt.timestamp).getTime() > now - 30 * 24 * 60 * 60 * 1000
      );

      if (users.loginAttempt.length >= 10) {
        users.loginAttempt.shift();
      }

      users.loginAttempt.push({
        device: deviceInfo,
        ipAddress,
        timestamp: new Date(),
      });
    };

    // 🟢 Step 1: First-time login (Allow without OTP)
    if (users.sessions.length === 0) {
      if (!users.sessions.some((s) => s.sessionId === req.sessionID)) {
        users.sessions.push({
          sessionId: req.sessionID,
          loginTime: new Date(),
        });
      }

      const clientIp =
        ipAddress ||
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress;

      saveLoginAttempt(users, deviceInfo, clientIp);

      req.session.user = {
        id: users.id,
        name: users.name,
        email: users.email,
        role: "user",
      };

      await users.save();
      // ✅ Session manually save karo (important step)
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return reject(err);
          }
          resolve();
        });
      });
      const data = { user: { id: users.id } };
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      req.session.token = token;

      // Set session expiration
      const sessionMaxAge = rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 24 * 60 * 60 * 1000; // 1 day

      req.session.cookie.maxAge = sessionMaxAge;

      // ✅ Authentication cookie set karo
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        maxAge: sessionMaxAge, // 1 day
      });
      await addNotification(
        users._id,
        `${users.name} You sign in successfully.`
      );
      return res
        .status(200)
        .json({ type: "success", message: "Login successfull" });
    }
    await users.populate("sessions");

    // Check if session already exists (same device)
    const existingSession = users.sessions.find(
      (s) => s.sessionId === req.sessionID
    );

    // Check if user is already logged in from another device
    if (!existingSession) {
      if (!otp) {
        const newOtp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        users.otp = newOtp;
        users.otpExpires = otpExpires;
        users.otpAttempts = 0;

        const clientIp =
          ipAddress ||
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.connection.remoteAddress;
        saveLoginAttempt(users, deviceInfo, clientIp);

        await users.save();
        await addNotification(
          users._id,
          `${users.name} you signed in successfully, from another platform and your ip is: ${ipAddress}`,
          "success"
        );

        sendEmail(
          users.email,
          "OTP VERIFICATION",
          `${users.name} Your OTP code is ${newOtp}. It is valid for 10 minutes.`
        );

        return res.status(200).json({
          type: "otp_required",
          message: "OTP verification required. Check your email.",
        });
      }

      // verify otp
      if (users.otp !== otp && users.otpExpires > Date.now()) {
        return res.status(400).json({
          type: "error",
          message: "Invalid or Expired OTP",
        });
      }

      users.otp = null;
      users.otpExpires = null;
      users.otpAttempts = 0;
    }

    // ✅ Step 3: Add new session and allow login
    if (!users.sessions.some((s) => s.sessionId === req.sessionID)) {
      users.sessions.push({ sessionId: req.sessionID, loginTime: new Date() });
    }
    await users.save();

    // Generate JWT token (adjust expiration based on `rememberMe`)
    const tokenExpiry = rememberMe ? "30d" : "1d";
    const data = { user: { id: users.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry,
    });

    users.token = token;

    // Set session expiration
    const sessionMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 24 * 60 * 60 * 1000; // 1 day

    req.session.cookie.maxAge = sessionMaxAge;

    // ✅ Set authentication cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      maxAge: sessionMaxAge,
    });

    // ✅ Store user session data
    req.session.token = token;
    req.session.user = {
      id: users.id,
      name: users.name,
      email: users.email,
      role: "user",
    };
    // ✅ Send login email notification
    await loginMail(users);

    await users.save();
    res.status(200).json({ type: "success", message: "Login successful" });
  } catch (error) {
    console.error("[ERROR] Login failed:", error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// check auth user
exports.checkAuth = async (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.session.user,
      role: "user",
    });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
};
exports.checkAuthIfLoggedIn = (req, res) => {
  if (!req.session.user) {
    return res.status(204).end(); // No response if the user is not logged in
  }

  return res.status(200).json({
    isAuthenticated: true,
    user: req.session.user,
    role: "user",
  });
};
// update first time user first time login
exports.updateFirstTime = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { isFirstTime: false });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// logout functionallity
exports.logout = async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ type: "error", message: "Unauthorized. No active session." });
  }
  try {
    const user = await User.findById(req.session.user.id);
    user.token = null;
    // Remove only the current session (not all)
    user.sessions = user.sessions.filter((s) => s.sessionId !== req.sessionID);
    await user.save();
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ type: "error", message: "Could not log out" });
      }

      // Optionally, clear the cookie
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.clearCookie("electrica", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      // Return a success message
      res
        .status(200)
        .json({ type: "success", message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Error during logout:", error.message);
    return res
      .status(500)
      .json({ type: "error", message: "Internal server error" });
  }
};

// Customlogout functionallity
exports.setLogoutTime = async (req, res) => {
  try {
    const { logoutTime } = req.body; // Expecting time in milliseconds
    const userId = req.user.id; // Get the user's ID from the request (assuming user is attached)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }

    user.logoutTime = logoutTime;
    await user.save();

    res.status(200).json({
      type: "success",
      message: "Logout time updated successfully",
      logoutTime,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// forgot_Functionallity
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const data = {
      user: {
        id: user.$isDeleted,
      },
    };
    const resetToken = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000;

    await sendEmail(user.email, "Forgot OTP", `your forgot otp is: ${otp}`);
    await user.save();

    res.status(200).json({
      type: "success",
      message: "OTP has been sent to your email.",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { otp, resetToken, email } = req.body;

    if (!otp || !resetToken) {
      return res
        .status(400)
        .json({ type: "error", message: "OTP and resetToken are required." });
    }

    const user = await User.findOne({
      email,
    });

    if (!user.otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ type: "error", message: "OTP is invalid or expired" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();

      if (user.otpAttempts >= 3) {
        // Invalidate OTP after max attempts
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpAttempts = 0;
        await user.save();
        return res.status(429).json({
          type: "error",
          message: "Too many attempts. OTP invalidated. Request a new one.",
        });
      }

      return res.status(400).json({
        type: "info",
        message: `Incorrect OTP. Attempt ${user.otpAttempts}/3`,
      });
    }

    // OTP is correct, reset attempts and OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    res
      .status(200)
      .json({ type: "success", message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, resetToken } = req.body;

    if (!newPassword) {
      return res
        .status(400)
        .json({ type: "error", message: "New password is required." });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        type: "error",
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter and one digit.",
      });
    }

    const user = await User.findOne({
      resetToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid or expired reset token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    sendEmail(
      user.email,
      "Password Reset",
      `${user.name} you changed your password.`
    );
    await user.save();

    res.status(200).json({
      type: "success",
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    res.status(500).json({ type: "er  ror", message: "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ type: "error", message: "Unauthorized" });
    }
    const user = await User.findById(req.user.id).select(
      "-password -resetToken -resetTokenExpires -otp -otpAttempts -otpExpires"
    );

    if (!user) {
      return res
        .status(401)
        .json({ type: "error", message: "User not found!" });
    }
    // Encrypt user data sending to response
    const encryptedUserData = encryptData({
      ...user.toObject(),
    });

    res.json({
      encryptedData: encryptedUserData,
      isFirstTime: user.isFirstTime,
    });
  } catch (error) {
    console.error("getUserDetails error:", error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller Notification
exports.markAsRead = async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;

  try {
    const user = await User.findById(userId);
    const notification = user.notifications.id(notificationId);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });

    notification.isRead = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.deleteNotification = async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;

  try {
    const user = await User.findById(userId);
    user.notifications = user.notifications.filter(
      (notif) => notif._id.toString() !== notificationId
    );
    await user.save();

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.getNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId).select("notifications");
    const encryptedUserData = encryptData(user.notifications);
    res.status(200).json({ encryptedData: encryptedUserData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// delete account of user
exports.deleteAccount = async (req, res) => {
  const { userId, prompt } = req.body;
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        type: "error",
        message: "User not found.",
      });
    }

    const project = await Project.find({ user: userId });
    if (!project) {
      return res.status(404).json({
        type: "error",
        message: "Project not found.",
      });
    }

    // Generate the correct prompt (e.g., using the username or a fixed phrase)
    const expectedPrompt = `Delete my account ${user.name}`;

    // Validate the prompt
    if (prompt !== expectedPrompt) {
      return res.status(400).json({
        type: "error",
        message: "Invalid prompt. Please try again.",
      });
    }

    // before deleting user
    await Project.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          type: "error",
          message: "An error occurred while deleting the account.",
        });
      }

      // Clear cookies
      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      });
      res.clearCookie("electrica", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      });

      // Send a success response
      return res.status(200).json({
        type: "success",
        message:
          "Your account has been deleted successfully, and cookies have been removed.",
      });
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      type: "error",
      message:
        "An error occurred while deleting the account. Please try again later.",
    });
  }
};

exports.checkDatabaseAndSession = (req, res) => {
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(500)
      .json({ type: "error", message: "Database Disconnected" });
  }

  // Check if user is logged in via session
  if (!req.session || !req.session.user) {
    return res
      .status(401)
      .json({ type: "error", message: "Unauthorized: Please log in" });
  }

  // If database is connected and user is authenticated
  res.status(200).json({
    type: "success",
    message: "Database connected, user authenticated",
    user: req.session.user,
  });
};
