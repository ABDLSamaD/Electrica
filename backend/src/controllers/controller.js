const Review = require("../models/review");
const sendEmail = require("../utils/mail")

exports.createReview = async (req, res) => {
  try {
    const { name, email, occupation, message, image, rating } = req.body;
    const review = await Review.create({
      name,
      email,
      occupation,
      message,
      image,
      rating,
    });
    sendEmail(email,"Review Submitted",`${name} you review is submitted success thankyou for your support or feedback to our team and mamnagment.`)
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get latest 5 reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().select("-email");
    // find latest 3 reviews
    const latestReviews = reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);
    res.status(200).json(latestReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Get liked reviews from cookies (if available)
    let likedReviews = req.cookies.jsxa24jsxd__2jala
      ? JSON.parse(req.cookies.likedReviews)
      : [];

    // Check if the review was already liked
    if (likedReviews.includes(id)) {
      return res
        .status(400)
        .json({ message: "You have already liked this review" });
    }

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
    // Store the liked review in cookies
    likedReviews.push(id);
    res.cookie("jsxa24jsxd__2jala", JSON.stringify(likedReviews), {
      httpOnly: true,
      secure: true, // Ensure cookies work over HTTPS
      sameSite: "None", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(200).json(updatedReview);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
