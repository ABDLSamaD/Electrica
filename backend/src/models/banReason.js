const mongoose = require("mongoose");

const banReasonSchema = new mongoose.Schema({
  reason: { type: String, required: true }, // Description of the ban reason
  createdAt: { type: Date, default: Date.now }, // Time when the reason was created
});

const BanReason = mongoose.model("BanReason", banReasonSchema);
module.exports = BanReason;
