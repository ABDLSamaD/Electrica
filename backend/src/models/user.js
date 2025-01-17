const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // Login time
  device: { type: Object }, // Device details (e.g., 'Chrome on Windows')
  ipAddress: { type: String }, // IP address of the user
  location: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
  }, // Optional: location info if available
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"], // Restrict to specific roles
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    profileImg: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png",
    },
    isBlocked: { type: Boolean, default: false }, // For blocking users
    banDetails: {
      reason: { type: mongoose.Schema.Types.ObjectId, ref: "BanReason" }, // Reason for banning the user
      imposedAt: { type: Date }, // Date when the ban was imposed
      warnings: { type: Number, default: 0 },
    },
    activityLog: [
      {
        action: { type: String, required: true }, // Description of the action
        timestamp: { type: Date, default: Date.now },
      },
    ],
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
