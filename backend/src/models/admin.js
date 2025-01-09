const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  permissions: { type: Array, default: ["approveRequests", "manageUsers"] },
  otp: { type: Number, default: null },
  otpExpires: { type: Date },
  otpAttempts: { type: Number, default: 0 },
  resendOtp: { type: Number, requried: true },
  resetToken: String,
  logoutTime: { type: Number, default: 86400000 },
  token: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", adminSchema);
