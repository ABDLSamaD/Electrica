const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // Login time
  device: { type: String }, // Device details (e.g., 'Chrome on Windows')
  ipAddress: { type: String }, // IP address of the user
  location: { type: String }, // Optional: location info if available
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImg: String,
    fullName: String,
    address: String,
    phone: String,
    city: String,
    loginAttempt: [loginAttemptSchema],
    logoutTime: { type: Number, default: 86400000 },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    token: String,
    Date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
