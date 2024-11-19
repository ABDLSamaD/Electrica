const bcrypt = require("bcrypt");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

// Add Some User Details
exports.userDetail = async (req, res) => {
  try {
    const { fullName, address, phone, city } = req.body;

    const user = await User.findById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ type: "error", message: "Something Occured!" });

    // add some details of user
    user.fullName = fullName;
    user.address = address;
    user.phone = phone;
    user.city = city;

    await user.save();

    res.status(200).json({
      type: "success",
      message: "Details added successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ type: "error", message: "Internal server error" });
  }
};

// change password after SIGNIN
exports.changepassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ type: "error", message: "Old password is incorrect" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        type: "error",
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter and one digit.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    await user.save();

    res
      .status(200)
      .send({ type: "success", message: "Password has been Changed." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ type: "error", message: "Internal Server Error" });
  }
};

// update user details
exports.updateUserDetails = async (req, res) => {
  try {
    const { fullName, address, phone, city } = req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ type: "error", message: "Unauthorized access" });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ type: "error", message: "Something Occured!" });

    user.fullName = fullName || user.fullName;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.city = city || user.city;

    await user.save();

    res
      .status(200)
      .json({ type: "success", message: "Update user details successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ type: "error", message: "Internal Server Error" });
  }
};

// add profile image
exports.profileImage = async (req, res) => {
  try {
    const { profileImg } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ type: "error", message: "Something Occured!" });

    if (profileImg) {
      user.profileImg = profileImg; // Assuming you have a `picture` field in your User model
    }
    user.profileImg = profileImg;
    await user.save();
    res.status(200).json({ type: "success", message: "Image has been saved" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ type: "error", message: "Internal Server Error" });
  }
};
