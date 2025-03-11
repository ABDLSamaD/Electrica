const Review = require("../models/review");
const { sendEmail } = require("../utils/mail");

exports.createReview = async (req, res) => {
  try {
    const { name, email, occupation, message, images, rating } = req.body;
    const review = await Review.create({
      name,
      email,
      occupation,
      message,
      images,
      rating,
    });
    sendEmail(
      email,
      "Review Created",
      `${name} you just add your review on Electrica web app`
    );
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get latest 5 reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    // find latest 5 reviews
    const latestReviews = reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);
    res.status(200).json(latestReviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

exports.likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if review exists and update likes count
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      {
        new: true, // Return updated document
        runValidators: true,
      }
    );
    // If review not found
    if (!updatedReview) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error liking review" });
  }
};

exports.dislikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: -1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedReview) {
      return res.status(404).json({
        status: "fail",
        message: "Review not found",
      });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error disliking review" });
  }
};
