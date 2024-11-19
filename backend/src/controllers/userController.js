const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOtpEmail } = require("../utils/otpService");
const { sendForgotOtpEmail } = require("../utils/OtpForgot");
const { loginMail } = require("../utils/loginmail");
require("dotenv").config();

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
    });

    if (!user)
      return res
        .status(404)
        .json({ type: "error", message: "Something Occured!" });

    await sendOtpEmail(user);

    const data = { user: { email } };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
    user.token = token;

    await user.save();

    res.status(200).json({
      type: "success",
      token,
      message:
        "Account Created Successfully. Please verify with OTP sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", messsage: "Internal server error" });
  }
};

// verify email otp service
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      console.log("User not found.");
      return res.status(400).json({ type: "error", message: "User not found" });
    }

    if (!user.otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ type: "error", message: "OTP is invalid or expired" });
    }

    // Check if OTP matches and attempt count is within limits
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();

      if (user.otpAttempts >= 5) {
        // Invalidate OTP after max attempts
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

    // OTP is correct, so verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    res
      .status(200)
      .json({ type: "success", message: "Account verified successfully." });
  } catch (error) {
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
    const { email, password, rememberMe } = req.body;

    if (req.session.user) {
      return res
        .status(400)
        .json({ type: "info", message: "User is already logged in." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ type: "error", message: "User not found?" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ type: "error", message: "Password is wrong?" });
    }

    const deviceInfo = req.headers["user-agent"] || "Unknown device";
    const ipAddress = req.ip;

    user.loginAttempt.push({
      device: deviceInfo,
      ipAddress,
      location: "Location (if available)",
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user.token = token;

    // If authentication is successful, adjust session settings based on "Remember Me"
    if (rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Set cookie lifespan to 30 days
    } else {
      req.session.cookie.expires = false; // Session expires on browser close
    }

    req.session.token = token; // Store the token in the session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    // Send login email notification (catch potential errors)
    try {
      await loginMail(user);
    } catch (mailError) {
      console.error("Error sending login email:", mailError.message);
    }

    await user.save();
    res
      .status(200)
      .json({ type: "success", message: "Login successfully", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// check auth user
exports.checkAuth = (req, res) => {
  res.status(200).json({ isAuthenticated: true, user: req.session.user });
};

exports.getLoginHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, "loginAttempts");

    if (!user) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }

    res.status(200).json({ type: "success", loginHistory: user.loginAttempt });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// logout functionallity
exports.logout = (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ type: "error", message: "Unauthorized. No active session." });
  }
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ type: "error", message: "Could not log out" });
    }

    // Optionally, clear the cookie
    res.clearCookie("connect.sid"); // This is the default cookie name for express-session

    // Return a success message
    res
      .status(200)
      .json({ type: "success", message: "Logged out successfully" });
  });
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

    await sendForgotOtpEmail(user.email, otp);
    await user.save();

    res.status(200).json({
      type: "success",
      message: "OTP has been sent to your email.",
      resetToken,
    });
  } catch (error) {
    // console.error(error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
exports.verifyForgotOtp = async (req, res) => {
  try {
    const { otp, resetToken } = req.body;

    if (!otp || !resetToken) {
      return res
        .status(400)
        .json({ type: "error", message: "OTP and resetToken are required." });
    }

    const user = await User.findOne({
      resetToken,
      otp,
      otpExpires: { $gt: Date.now() },
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
    console.error(error.message);
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
      console.log("error");
      return res
        .status(400)
        .json({ type: "error", message: "Invalid or expired reset token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.status(200).json({
      type: "success",
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .select("-resetToken")
      .select("-resetTokenExpires")
      .select("-otp")
      .select("-otpAttempts")
      .select("-otpExpires");
    if (!user)
      return res
        .status(401)
        .json({ type: "error", message: "user not found!" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
