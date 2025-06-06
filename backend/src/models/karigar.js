const mongoose = require("mongoose");

const karigarSchema = new mongoose.Schema({
  karigarId: { type: String, required: true, unique: true, index: true }, // Indexed for better performance
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true }, // Ensure unique emails
  phone: { type: String, required: true },
  image: { type: String, default: "" }, // Profile Image URL

  location: { type: String, default: "" },
  isActive: { type: Boolean, default: false }, // Active status

  chargesPerHour: { type: Number, default: 0, min: 0 }, // Cannot be negative
  education: {
    type: String,
    enum: ["None", "High School", "Diploma", "Graduate", "Postgraduate"],
    default: "None",
  },
  skills: { type: String, default: "" },
  workingExperience: { type: Number, default: 0, min: 0 }, // Cannot be negative

  feedback: { type: String, default: "" },
  ratings: { type: Number, default: 0, min: 0, max: 5 }, // Store average rating

  rating: [
    {
      complainId: { type: mongoose.Schema.Types.ObjectId, ref: "Complain" }, // Linked complaint
      ratingValue: { type: Number, min: 1, max: 5, required: true }, // Individual rating
      message: { type: String, trim: true },
      additionalAttachments: [String],
    },
  ],
});

// Middleware to update the average rating dynamically
karigarSchema.pre("save", function (next) {
  if (this.rating.length > 0) {
    this.ratings =
      this.rating.reduce((acc, item) => acc + item.ratingValue, 0) /
      this.rating.length;
  } else {
    this.ratings = 0;
  }
  next();
});

const Karigar = mongoose.model("Karigar", karigarSchema);
module.exports = Karigar;
