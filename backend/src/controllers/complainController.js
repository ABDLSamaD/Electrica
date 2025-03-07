const Complain = require("../models/complain");
const Karigar = require("../models/karigar");
const { v4: uuidv4 } = require("uuid");

// Create a complaint (Logged-in or Guest)
exports.createComplain = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get io instance
    const user = req.user; // Assuming you have authentication middleware
    const {
      name,
      email,
      phone,
      address,
      urgencyLevel,
      karigarId,
      attachments,
    } = req.body;

    // Generate unique complaint ID
    const complainId = uuidv4();

    // If user is not logged in, only complainId will be stored
    let complainData = { complainId };

    if (user) {
      // If user is logged in, store full complaint details
      complainData = {
        complainId,
        userId: user._id,
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address,
        status: "submitted",
        urgencyLevel,
        karigarId,
        attachments,
      };
    }

    const newComplain = new Complain(complainData);
    await newComplain.save();

    io.emit("complainUpdated", newComplain); // 🔥 Notify all clients

    res.status(200).json({
      type: "success",
      success: true,
      message: "Complaint submitted successfully",
      data: newComplain,
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all complaints (Admin or logged-in users)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complain.find().populate("karigarId userId");
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complain.findOne({ complainId: id }).populate(
      "karigarId userId"
    );

    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ type: "success", success: true, data: complaint });
  } catch (error) {
    res
      .status(500)
      .json({ type: "error", success: false, message: error.message });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get io instance
    const { id } = req.params;
    const { status } = req.body;

    if (
      !["submitted", "in-progress", "approved", "rejected"].includes(status)
    ) {
      return res
        .status(400)
        .json({ type: "warning", success: false, message: "Invalid status" });
    }

    const updatedComplaint = await Complain.findOneAndUpdate(
      { complainId: id },
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        type: "error",
        success: false,
        message: "Complaint not found",
      });
    }
    io.emit("complainUpdated", updatedComplaint); // 🔥 Notify all clients

    res.status(200).json({
      type: "success",
      success: true,
      message: "Complaint status updated",
      data: updatedComplaint,
    });
  } catch (error) {
    res
      .status(500)
      .json({ type: "error", success: false, message: error.message });
  }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get io instance
    const { id } = req.params;
    const deletedComplaint = await Complain.findOneAndDelete({
      complainId: id,
    });

    if (!deletedComplaint) {
      return res.status(404).json({
        type: "error",
        success: false,
        message: "Complaint not found",
      });
    }
    io.emit("complainDeleted", id); // 🔥 Notify all clients

    res.status(200).json({
      type: "success",
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ type: "error", success: false, message: error.message });
  }
};

// create an karigar through an admin
exports.createKarigar = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      image,
      location,
      isActive,
      chargesPerHour,
      education,
      skills,
      workingExperience,
      feedback,
      ratings,
    } = req.body;

    if (!req.admin.id) {
      return res.status(403).json({
        type: "error",
        success: false,
        message: "Unauthorized: Only admins can create Karigar profiles",
      });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({
        type: "error",
        success: false,
        message: "Name, email, and phone are required",
      });
    }

    const existingKarigar = await Karigar.findOne({ email });
    if (existingKarigar) {
      return res.status(400).json({
        type: "error",
        success: false,
        message: "Email already exists",
      });
    }

    const newKarigar = new Karigar({
      name,
      email,
      phone,
      image: image || "",
      location: location || "",
      isActive: isActive || false,
      chargesPerHour: chargesPerHour || 0,
      education: education || "None",
      skills: skills || "",
      workingExperience: workingExperience || 0,
      feedback: feedback || "",
      ratings: ratings || 0,
    });

    await newKarigar.save();

    res.status(201).json({
      type: "success",
      success: true,
      message: "Karigar created successfully",
      karigar: newKarigar,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      type: "error",
      success: false,
      message: error.message,
    });
  }
};

// Karigar update isActive
exports.isActiveKarigar = async (req, res) => {
  try {
    const { karigarId } = req.body;
    const adminId = req.admin?.id;

    // Check if request is from an admin
    if (!adminId) {
      return res.status(403).json({
        type: "error",
        success: false,
        message: "Unauthorized: Only admins can update Karigar status.",
      });
    }

    // Validate the ObjectId format
    if (!isValidObjectId(karigarId)) {
      return { error: "Invalid project ID" };
    }

    // Find Karigar by _id
    const karigar = await Karigar.findById(karigarId);
    if (!karigar) {
      return res.status(404).json({
        type: "error",
        success: false,
        message: "Karigar not found",
      });
    }

    // Toggle isActive status
    karigar.isActive = !karigar.isActive;

    // Save the updated document
    await karigar.save();

    // Emit real-time update via Socket.io
    const io = req.app.get("io");
    io.emit("karigarStatusUpdated", {
      karigarId: karigar._id,
      isActive: karigar.isActive,
    });

    res.status(200).json({
      type: "success",
      success: true,
      message: `Karigar status updated successfully to ${
        karigar.isActive ? "Active" : "Inactive"
      }.`,
      karigar,
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      success: false,
      message: error.message,
    });
  }
};

// funcion for valid mongoid
function isValidObjectId(id) {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
}
