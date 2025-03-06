const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema({
  complainId: { type: String, required: true, unique: true, index: true }, // Indexed for faster queries
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // User reference
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  status: {
    type: String,
    enum: ["submitted", "in-progress", "approved", "rejected"],
    default: "submitted",
  },
  urgencyLevel: { type: String, enum: ["medium", "High"], default: "medium" },

  karigarId: { type: mongoose.Schema.Types.ObjectId, ref: "Karigar" }, // Assigned Karigar
  createdDate: { type: Date, default: Date.now }, // Auto-sets current date

  attachments: [String],

  rating: { type: Number, min: 0, max: 5, default: 0 }, // 0 to 5 star rating
  feedback: { type: String, trim: true }, // Fixed typo (feedBack → feedback)
});

const Complain = mongoose.model("Complain", complainSchema);
module.exports = Complain;
