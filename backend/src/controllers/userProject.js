const User = require("../models/user");
const { sendEmail } = require("../utils/mail");
const Admin = require("../models/admin");
const Project = require("../models/project");
const encryptData = require("../validators/encryptData");

// create user project controller
exports.project = async (req, res) => {
  try {
    const {
      clientName,
      clientNumber,
      projectDescription,
      projectAddress,
      projectName,
      projectCity,
      projectPics,
      category,
      voltageType,
      phases,
      estimatedBudget,
      advancePaid,
    } = req.body;

    if (
      !clientName ||
      !clientNumber ||
      !projectDescription ||
      !projectAddress ||
      !projectName ||
      !projectCity ||
      !category ||
      !voltageType ||
      !phases ||
      !estimatedBudget ||
      advancePaid === undefined
    ) {
      return res
        .status(400)
        .json({ type: "error", message: "All fields are required" });
    }

    let userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res.status(400).json({ type: "error", message: "User not found" });

    // Define initial stages there are three main stages of electrica
    const initialStages = [
      {
        name: "Stage-1 (Electric Roof Pimping)",
        canStart: true, // First stage can start immediately
        isCompleted: false,
        clientConfirmation: {
          isConfirmed: false,
          date: null,
          emergencyMessage: null,
        },
        updates: [],
      },
      {
        name: "Stage-2 (Electric insert pimpes concealed fitting)",
        canStart: false,
        isCompleted: false,
        clientConfirmation: {
          isConfirmed: false,
          date: null,
          emergencyMessage: null,
        },
        updates: [],
      },
      {
        name: "Stage-3 (Electric troubleshooting, wiring, installation switch boards, pannel boards, etc)",
        canStart: false,
        isCompleted: false,
        clientConfirmation: {
          isConfirmed: false,
          date: null,
          emergencyMessage: null,
        },
        updates: [],
      },
    ];

    const project = new Project({
      clientName,
      clientNumber,
      projectDescription,
      projectAddress,
      projectName,
      projectCity,
      category,
      voltageType,
      phases,
      estimatedBudget,
      advancePaid,
      projectPics: projectPics || [],
      status: "submitted", // Initially set the status to 'submitted'
      stages: initialStages,
      user: userId, // Reference to the user who created the project
    });

    await project.save();
    await addNotification(
      user._id,
      `${user.name} you have submitted your project ${projectName}, the contractor will contact you soon.`,
      "success"
    );

    let text = `${user.name} your project ${projectName} submited successfully. plesae wait for an admin to approve your project. `;
    sendEmail(user.email, "Project Submission ", text);

    res.status(200).json({
      type: "success",
      message:
        "Project has been submitted successfully. Please wait for an admin to accept your project.",
      project: project,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// remove user project controller
exports.removeProject = async (req, res) => {
  try {
    const { projectId, confirmRemoval = false, reason } = req.body;

    const userId = req.user.id;
    const { user, project, error } = await getProjectAndStage(
      userId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    if (confirmRemoval !== true) {
      return res.status(400).json({
        type: "info",
        message: "Confirmation to remove the project is required.",
      });
    }
    if (!reason) {
      return res
        .status(400)
        .json({ type: "error", message: "reason requried" });
    }

    // Remove the project from the database
    await project.findByIdAndDelete(projectId);

    const admin = await Admin.find();
    sendEmail(
      admin.email,
      "Remove Project",
      `${
        user.name
      } removed his project and reason ${reason} at ${new Date().toLocaleDateString()}`
    );
    await addNotification(
      user._id,
      `${user.name} you have remove your project ${project.projectName}`,
      "success"
    );

    res
      .status(200)
      .json({ type: "success", message: "Project removed successfully." });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// get user project details
exports.getProjectDetails = async (req, res) => {
  try {
    let userId = req.user.id; // Extracted from middleware
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ type: "error", message: "User not found" });
    }
    const project = await Project.find();
    const encryptedUserData = encryptData(project);
    res.status(200).json({ encryptedData: encryptedUserData });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// user send message to admin
exports.sendMessageToAdmin = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const userId = req.user.id;

    const { project, error } = await getProjectAndStage(userId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }
    project.clientMessages.push({
      message,
      sentAt: new Date(),
    });

    await project.save();

    res.status(200).json({
      type: "success",
      message: "Message sent to admin successfully.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
exports.markMessageAsShown = async (req, res) => {
  try {
    const { projectId, messageId, forAdmin } = req.body; // Indicate if it's for admin or client

    const userId = req.user.id;
    const { project, error } = await getProjectAndStage(userId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    if (forAdmin) {
      const message = project.clientMessages.id(messageId);
      if (message) {
        message.isShownToAdmin = true;
        message.shownAt = new Date();
      } else {
        return res
          .status(404)
          .json({ type: "error", message: "Message not found" });
      }
    } else {
      const message = project.adminMessages.id(messageId);
      if (message) {
        message.isShownToClient = true;
        message.shownAt = new Date();
      } else {
        return res
          .status(404)
          .json({ type: "error", message: "Message not found" });
      }
    }

    await project.save();

    res.status(200).json({
      type: "success",
      message: "Message marked as shown successfully.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};
exports.getUnreadMessages = async (req, res) => {
  try {
    const { projectId, forAdmin } = req.query; // Query for admin or client messages

    const userId = req.user.id;
    const { project, error } = await getProjectAndStage(userId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    const unreadMessages = forAdmin
      ? project.clientMessages.filter((msg) => !msg.isShownToAdmin)
      : project.adminMessages.filter((msg) => !msg.isShownToClient);

    res.status(200).json({
      type: "success",
      unreadMessages,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

exports.clientConfirmStageCompletion = async (req, res) => {
  try {
    const {
      projectId,
      stageName,
      clientConfirmed,
      emergencyMessage,
      startDate,
    } = req.body;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const userId = req.user.id;
    const { user, project, error } = await getProjectAndStage(
      userId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    const stageIndex = project.stages.findIndex((s) => s.name === stageName);
    if (stageIndex === -1) {
      return res
        .status(404)
        .json({ type: "error", message: `Stage "${stageName}" not found.` });
    }

    const stage = project.stages[stageIndex];

    // Update client confirmation and start date
    stage.clientConfirmation.isConfirmed = clientConfirmed || false;
    stage.clientConfirmation.emergencyMessage =
      emergencyMessage || "Continue your work..";
    stage.clientConfirmation.date = clientConfirmed ? startDate : date.now();

    await project.save();

    // send an confirmation email to admin that materials are approved
    try {
      const admin = await Admin.findOne(); // or Admin.find()
      if (!admin || !admin.email) {
        return res
          .status(400)
          .json({ type: "error", message: "Admin email not found." });
      }
      await sendEmail(
        admin.email,
        "Client approved stage material bill",
        `${user.name} approved materials bills list, so ${admin.username} coming tomorrow for stage: ${stageName}`
      );
    } catch (error) {
      return res
        .status(500)
        .json({ type: "error", message: "Failed to send email to admin." });
    }

    res.status(200).json({
      type: "success",
      message: `Client has ${
        clientConfirmed
          ? `confirmed completion of "${stageName}" with a start date: ${startDate}`
          : "requested delay for this stage."
      }`,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// and delete message also
exports.removeClientConfirmation = async (req, res) => {
  try {
    const { projectId, stageName } = req.body;

    const userId = req.user.id;
    const { user, project, stage, error } = await getProjectAndStage(
      userId,
      projectId,
      stageName
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    // Ensure the client has confirmed this stage
    if (!stage.clientConfirmation.isConfirmed) {
      return res.status(400).json({
        type: "info",
        message: `No confirmation exists for Stage "${stageName}".`,
      });
    }

    stage.clientConfirmation = null;

    await project.save();

    const admin = await Admin.find();
    sendEmail(
      admin.email,
      `${user.name} Removed Stage Confirmation`,
      `The ${user.name} has removed their confirmation for stage "${stageName}" in project "${project.clientName}". Please review and take necessary actions.`
    );

    res.status(200).json({
      message: `Client confirmation for Stage "${stageName}" has been removed.`,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// approve materials
exports.approveMaterials = async (req, res) => {
  try {
    const { stageName, projectId, materialId } = req.body;

    const userId = req.user.id;
    const { user, project, error } = await getProjectAndStage(
      userId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    const stageIndex = project.stages.findIndex((s) => s.name === stageName);
    if (stageIndex === -1) {
      return res
        .status(404)
        .json({ type: "error", message: `Stage "${stageName}" not found.` });
    }

    const stage = project.stages[stageIndex];
    // Approve the selected materials
    stage.materials.forEach((material) => {
      if (materialId.includes(material._id.toString())) {
        material.isApproved = true;
        material.approvedDate = new Date();
      }
    });

    await project.save();

    // send an confirmation email to admin that materials are approved
    try {
      const admin = await Admin.findOne(); // or Admin.find()
      if (!admin || !admin.email) {
        return res
          .status(400)
          .json({ type: "error", message: "Admin email not found." });
      }
      await sendEmail(
        admin.email,
        "Client approved stage material bill",
        `${user.name} approved materials list. now you come from tomorrow for work: ${stageName}`
      );
      await addNotification(
        user._id,
        `${user.name} you have aproved materials bill list of ${projectName} of ${stage.name}`,
        "success"
      );
    } catch (error) {
      return res
        .status(500)
        .json({ type: "error", message: "Failed to send email to admin." });
    }

    res.status(200).json({
      type: "success",
      message: "Materials approved successfully",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// start date project
exports.specifyStartDate = async (req, res) => {
  try {
    const { projectId, stageName, startDate, message } = req.body;

    const userId = req.user.id;
    const { project, stage, error } = await getProjectAndStage(
      userId,
      projectId,
      stageName
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    stage.clientConfirmation.isConfirmed = true;
    stage.clientConfirmation.emergencyMessage = message;
    stage.clientConfirmation.date = startDate;

    await project.save();

    res.status(200).json({
      type: "success",
      message: "Start date confirmed. Work can begin.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// payment controller
exports.setPaymentMethod = async (req, res) => {
  try {
    const { projectId, method, payDate } = req.body;

    if (!method || !["cash_on_hand", "online_payment"].includes(method)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const userId = req.user.id;
    const { user, project, error } = await getProjectAndStage(
      userId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    project.payment.method = method;

    if (method === "cash_on_hand") {
      if (!payDate)
        return res
          .status(400)
          .json({ message: "Payment date is required for cash on hand" });
      project.payment.cashOnHandDetails.payDate = payDate;
      await addNotification(
        user._id,
        `${user.name} you have selected (cash_on_hand) payment method of project name: ${projectName} paying date is your ${payDate}`,
        "success"
      );
    }

    const admin = await Admin.findOne();
    sendEmail(
      admin.email,
      "Payment method",
      `${user.name} update (cash_on_hand) payment method. and paying amount will be on ${payDate}`
    );

    await project.save();
    res.status(200).json({
      type: "success",
      message: "Payment method updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: error.message });
  }
};

function isValidObjectId(id) {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to get project and stage from user
async function getProjectAndStage(userId, projectId, stageName) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not found!" };
    }

    if (!isValidObjectId(projectId)) {
      return { error: "Invalid project ID" };
    }
    const project = await Project.findOne({
      _id: projectId,
      status: "approved",
    });
    if (!project) {
      return { error: "Project not found or not approved." };
    }

    if (stageName) {
      // Check for the stage in the project
      const stage = project.stages.find((s) => s.name === stageName);
      if (!stage) {
        return { error: `Stage "${stageName}" not found in the project.` };
      }
      return { project, stage, user };
    }
    return { project, user };
  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
}
