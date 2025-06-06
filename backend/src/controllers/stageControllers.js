const User = require("../models/user");
const BanReasons = require("../models/banReason");
const { sendEmail } = require("../utils/mail");
const Admin = require("../models/admin");
const Project = require("../models/project");
const addNotification = require("./addNotification");
const encryptData = require("../validators/encryptData");

// Controller_1: get ban reasons
exports.getBanReasons = async (req, res) => {
  try {
    const reasons = await BanReasons.find();
    res.status(200).json(reasons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ban reasons", error });
  }
};

//  Controller_2: Block/Unblock a user:
exports.blockUser = async (req, res) => {
  try {
    const { reasonId } = req.body; // Reason for the ban
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    }

    const reason = await BanReasons.findById(reasonId);
    if (!reason) {
      return res.status(404).json({ message: "Ban reason not found" });
    }

    // Update block status and add reason
    user.isBlocked = true;
    user.banDetails = {
      reason,
      imposedAt: new Date(),
    };
    await user.save();

    res.status(200).json({
      message: "User banned successfully",
      banDetails: user.banDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Error banning user", error });
  }
};

//  Controller_3: unblock user
exports.unbanUser = async (req, res) => {
  try {
    const { reasonId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBlocked) {
      return res
        .status(400)
        .json({ message: "User is not currently  blocked" });
    }

    if (reasonId) {
      const newReason = await BanReasons.findById(reasonId);
      if (!newReason) {
        return res.status(404).json({ message: "New ban reason not found" });
      }
      user.banDetails.reason = newReason._id;
    } else {
      user.isBlocked = false; // Unban the user
      user.banDetails = { reason: null, imposedAt: null, warnings: 0 };
    }
    await user.save();
    res.status(200).json({
      message: reasonId
        ? "Ban reason updated successfully"
        : "User unbanned successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ type: "error", message: "Error unbanning user", error });
  }
};

//  Controller_1_Project_1: update request of user project to change the status of project
exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId, status, reason } = req.body;

    const adminId = req.admin.id;
    if (!adminId) {
      return res
        .status(400)
        .json({ type: "error", message: "Admin not found" });
    }
    if (
      !projectId ||
      !status ||
      !["approved", "pending", "rejected"].includes(status)
    ) {
      return res.status(400).json({
        type: "warning",
        message: "Invalid request. Check projectId and status.",
      });
    }
    if (!isValidObjectId(projectId)) {
      return { error: "Invalid project ID" };
    }
    const project = await Project.findOne({ _id: projectId }).populate(
      "user",
      "name email role"
    );
    if (!project) {
      return res
        .status(400)
        .json({ type: "error", message: "Project not found" });
    }

    // Verify the user who created the project
    const user = project.user;
    if (!user) {
      return {
        error: "User not found",
      };
    }
    if (user.role !== "user") {
      return { error: "Only standard users can access this project." };
    }

    // Update the project status and admin info
    project.status = status;
    project.statusChangedAt = new Date();
    project.admin = adminId;
    project.statusChangeReason = reason || "";

    if (project.status === "pending") {
      await project.save();
      sendEmail(
        user.email,
        "Pending",
        "Your request of project has pending please wait..."
      );
      await addNotification(
        user._id,
        `${user.name} Your request of project has pending please wait....`,
        "success"
      );
      return res.status(200).json({
        type: "info",
        message: "Your request of project has pending please wait..",
      });
    }
    if (project.status === "rejected") {
      await Project.deleteOne({ _id: projectId });
      sendEmail(
        user.email,
        "Rejected",
        "Your request of project has rejected please try another project"
      );
      await addNotification(
        user._id,
        `${user.name} Your request of project has rejected please try another project`,
        "success"
      );
      return res.status(200).json({
        type: "info",
        message: "Rejected your request and removed the project.",
      });
    }

    await project.save();
    sendEmail(
      user.email,
      "Project Accepted",
      `Your request for the project has been accepted, & Contractor visit your site tommorrow ${user.name}`
    );
    await addNotification(
      user._id,
      `${user.name} Your request for the project has been accepted, & Contractor visit your site tommorrow `,
      "success"
    );

    res.status(200).json({
      type: "success",
      message: "Project status updated successfully.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_2: add stage data // in this time that the stageadd controller no need to use by chance any stage remove then this method to add stage by admin
exports.addStageToProject = async (req, res) => {
  try {
    const {
      projectId,
      stageName,
      canStart = false,
      isCompleted = false,
    } = req.body;

    const adminId = req.admin.id;

    if (!projectId || !stageName) {
      return res.status(400).json({
        type: "info",
        message: "Project ID and stage name are required.",
      });
    }

    const { project, error } = await getProjectAndStage(adminId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    // Check if the stage already exists
    const existingStage = project.stages.find(
      (stage) => stage.name === stageName
    );
    if (existingStage) {
      return res.status(400).json({
        type: "info",
        message: `Stage "${stageName}" already exists.`,
      });
    }

    // Add the new stage
    project.stages.push({
      name: stageName,
      canStart,
      isCompleted,
      clientConfirmation: {
        isConfirmed: false,
        date: null,
        emergencyMessage: null,
      },
      updates: [],
    });

    await project.save();

    res.status(200).json({
      type: "success",
      message: `Stage "${stageName}" added successfully.`,
      stages: project.stages,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error." });
  }
};

// Controller_1_Project_3: after approved project start stage with permission:
exports.startStaged = async (req, res) => {
  try {
    const { projectId, startMessage } = req.body;
    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    if (project.startStage) {
      return res
        .status(402)
        .json({ type: "error", message: "Project has already started." });
    }
    project.startStage = true;
    project.startStageMessage = startMessage;
    sendEmail(user.email, "Project starts", `${user.name} ${startMessage}`);
    await project.save();
    await addNotification(
      user._id,
      `${user.name} admin has start  the project.`,
      "success"
    );

    res
      .status(200)
      .json({ type: "success", message: "you can start user project" });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_4: add maeterials to stage
exports.addStageMaterials = async (req, res) => {
  try {
    const { materials, projectId, stageName } = req.body; // Array of materials to add

    if (!Array.isArray(materials) || materials.length === 0) {
      return res.status(400).json({
        type: "error",
        message: "Materials must be a non-empty array.",
      });
    }

    const adminId = req.admin.id;

    const { user, project, stage, error } = await getProjectAndStage(
      adminId,
      projectId,
      stageName
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    // check any material is approved or not
    const approvedMaterials = stage.materials.filter(
      (material) => material.isApproved
    );
    if (approvedMaterials.length > 0) {
      return res.status(400).json({
        message:
          "Materials have already been approved. Further additions are not allowed.",
        type: "error",
      });
    }

    // Check if materials were already added for this stage
    if (stage.materials && stage.materials.length > 0) {
      return res.status(400).json({
        type: "error",
        message: "Materials can only be added once per stage.",
      });
    }

    // Ensure all materials have required properties
    const invalidMaterial = materials.some(
      (material) =>
        !material.name ||
        typeof material.name !== "string" ||
        !material.quantity ||
        typeof material.quantity !== "number" ||
        material.quantity <= 0
    );
    if (invalidMaterial) {
      return res.status(400).json({
        type: "error",
        message: "Each material must have a valid name and positive quantity.",
      });
    }

    // materials
    materials.forEach((material) => {
      // Add to materials
      stage.materials.push({
        name: material.name,
        quantity: material.quantity,
        isApproved: false, // Default to false, waiting for client approval
        status: "waiting", // Add status for dynamic UI handling
      });
    });
    await project.save();

    sendEmail(user.email, "Stage Materials Added", materials);
    await addNotification(
      user._id,
      "Stage Materials Added check you contract status",
      "success"
    );
    res.status(200).json({
      type: "success",
      message: "Material added successfully. Client has been notified",
      materials: stage.materials,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_5: remove stage materials
exports.removeStageMaterial = async (req, res) => {
  try {
    const { materialName, projectId, stageName } = req.body;

    if (!materialName || typeof materialName !== "string") {
      return res.status(400).json({
        type: "error",
        message: "Invalid material name.",
      });
    }

    const adminId = req.admin.id;

    const { user, stage, error } = await getProjectAndStage(
      adminId,
      projectId,
      stageName
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    // Check if the material exists in the stage
    const materialIndex = stage.materials.findIndex(
      (material) => material.name === materialName && !material.isApproved
    );

    if (materialIndex === -1) {
      return res.status(400).json({
        type: "error",
        message: "Material not found or already approved.",
      });
    }

    // Remove the material from the stage.materials array
    const [removedMaterial] = stage.materials.splice(materialIndex, 1);

    // Remove the material from the stage.remainingMaterials array
    const remainingMaterialIndex = stage.remainingMaterials.findIndex(
      (material) => material.name === removedMaterial.name
    );
    if (remainingMaterialIndex !== -1) {
      stage.remainingMaterials.splice(remainingMaterialIndex, 1);
    }

    // Save the updated stage and user
    await project.save();

    res.status(200).json({
      type: "success",
      message: "Material removed successfully.",
      materials: stage.materials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_6: add daily basis project details by admin of client each
exports.addDailyUpdate = async (req, res) => {
  try {
    const { projectId, stageName, updates } = req.body;

    const adminId = req.admin.id;

    const { user, project, stage, error } = await getProjectAndStage(
      adminId,
      projectId,
      stageName
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    if (!stage.canStart) {
      return res.status(400).json({
        type: "success",
        message: `Stage "${stageName}" cannot be started until the previous stage is completed.`,
      });
    }

    // Validation unApproved materials
    const unapprovedMaterials = stage.materials.filter(
      (material) => !material.isApproved
    );
    if (unapprovedMaterials.length > 0) {
      return res.status(400).json({
        type: "error",
        message: "Some materials are not approved.",
      });
    }

    const validUpdates = Array.isArray(updates) ? updates : [];
    let totalDailyCost = 0;
    // Validate updates and calculate costs
    validUpdates.forEach((update) => {
      const {
        details,
        materialsUsed = [],
        workers = [],
        images,
        date,
      } = update;

      // Validate materials used
      if (!materialsUsed || materialsUsed.length === 0) {
        return res.status(400).json({
          type: "error",
          message: "No materials selected for use. Please select materials.",
        });
      }

      const validMaterialsUsed = materialsUsed.filter(
        (material) => material && material.name && material.quantity > 0
      );
      if (validMaterialsUsed.length === 0) {
        throw new Error("Selected materials are invalid or empty.");
      }

      // Calculate daily labor cost
      let laborCost = workers.reduce((sum, worker) => {
        const wage = Number(worker.dailyWage) || 0; // Convert to number
        return sum + wage;
      }, 0);
      totalDailyCost += Number(laborCost) || 0;

      // ✅ Update `stage.stageLabourCost`
      stage.stageLabourCost = (Number(stage.stageLabourCost) || 0) + laborCost;

      // Update stage materials
      validMaterialsUsed.forEach((used) => {
        const stageMaterial = stage.materials.find((m) => m.name === used.name);
        if (stageMaterial) {
          stageMaterial.quantity -= used.quantity;
          if (stageMaterial.quantity < 0) stageMaterial.quantity = 0;

          // Update finished status
          if (stageMaterial.quantity === 0) {
            stageMaterial.finished = true; // Mark material as finished
          }
        }
      });

      // Add the daily update to the stage
      stage.updates.push({
        date: date ? new Date(date) : new Date(),
        details,
        materialsUsed: validMaterialsUsed,
        workers,
        images,
      });
    });

    // Ensure totalCost is a number and valid
    project.totalCost = Number(project.totalCost) || 0;
    project.totalCost += totalDailyCost;

    // Save the updated user
    await project.save();

    // Prepare the response object
    const responseObject = {
      totalDailyCost,
      totalProjectCost: project.totalCost,
      stages: project.stages,
    };

    // Send email notification
    sendEmail(user.email, "Daily Update", responseObject);
    await addNotification(
      user._id,
      `${user.name} admin update your contract daily details`,
      "success"
    );

    // Respond with success message
    res.status(200).json({
      type: "success",
      message: "Daily update added successfully.",
      totalDailyCost,
      totalProjectCost: project.totalCost,
      stages: project.stages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      type: "error",
      message: error.message || "Internal server error",
    });
  }
};

// Controller_1_Project_7: fetch project details
exports.getProjectDetails = async (req, res) => {
  try {
    const adminId = req.admin.id;
    if (!adminId) {
      return res
        .status(401)
        .json({ type: "error", message: "admin not found" });
    }
    const project = await Project.find();
    const encryptedUserData = encryptData(project);
    res.status(200).json({ encryptedData: encryptedUserData });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal sevrer error" });
  }
};

// Controller_1_Project_8: message sending of each stage to user
exports.sendMessageUser = async (req, res) => {
  try {
    const { projectId, stageName, message } = req.body;

    const adminId = req.admin.id;

    const { user, project, stage, error } = await getProjectAndStage(
      adminId,
      projectId,
      stageName
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }
    if (!stage.canStart) {
      return res
        .status(401)
        .json({ type: "error", message: "project does'nt start yet." });
    }
    if (!message) {
      return res
        .status(400)
        .json({ type: "error", message: "requried message" });
    }

    project.adminMessages.push({
      message,
      sentAt: new Date(),
    });
    await project.save();

    sendEmail(user.email, "Message from Admin", message);
    res
      .status(200)
      .json({ type: "success", message: "Message sent to client " });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error!" });
  }
};

// Controller_1_Project_8: complete stage
exports.completeStage = async (req, res) => {
  try {
    const { projectId, stageName } = req.body;
    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    const stageIndex = project.stages.findIndex((s) => s.name === stageName);
    if (stageIndex === -1) {
      return res
        .status(404)
        .json({ type: "error", message: `Stage "${stageName}" not found.` });
    }

    const stage = project.stages[stageIndex];
    // Ensure stage has updates and isn't already completed
    if (stage.isCompleted) {
      return res.status(400).json({
        type: "info",
        message: `Stage "${stageName}" is already completed.`,
      });
    }

    if (!stage.clientConfirmation.isConfirmed) {
      return res.status(400).json({
        type: "info",
        message: `Stage "${stageName}" cannot be completed without client confirmation.`,
      });
    }

    if (
      stage.clientConfirmation.emergencyMessage &&
      !stage.clientConfirmation.isConfirmed
    ) {
      return res.status(400).json({
        type: "info",
        message: `Stage "${stageName}" cannot be completed due to client emergency: ${stage.clientConfirmation.emergencyMessage}.`,
      });
    }

    if (stage.updates.length === 0) {
      return res.status(400).json({
        type: "info",
        message: `Stage "${stageName}" has no updates.`,
      });
    }

    if (stageIndex > 0 && !project.stages[stageIndex - 1].isCompleted) {
      return res.status(400).json({
        type: "error",
        message: `Previous stage "${
          project.stages[stageIndex - 1].name
        }" must be completed first.`,
      });
    }

    // Mark current stage as completed
    stage.isCompleted = true;
    // Allow next stage to start (if exists)
    if (stageIndex + 1 < project.stages.length) {
      project.stages[stageIndex + 1].canStart = true;
    }

    await project.save();

    sendEmail(
      user.email,
      "Stage Completed",
      `Your project "${project.clientName}" has successfully completed of stage "${stageName}". You can now proceed to the next stage.`
    );
    await addNotification(
      user._id,
      `${user.name} Your project has successfully completed of stage "${stageName}". You can now proceed to the next stage`,
      "success"
    );

    res.status(200).json({
      type: "success",
      message: `Stage "${stageName}" marked as complete.`,
      nextStage:
        stageIndex + 1 < project.stages.length
          ? `Proceed to next stage: ${project.stages[stageIndex + 1].name}`
          : "All stages completed.",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_9: after completed and stage get each stage data
exports.stageData = async (req, res) => {
  try {
    const { projectId, stageName } = req.body;
    const adminId = req.admin.id;

    const { project, stage, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    const findStage = project.stages.find((data) => data.name === stageName);
    if (!findStage) {
      return res
        .status(404)
        .json({ type: "error", message: "Stage data not found." });
    }

    res.status(200).json(findStage);
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_10: notify client to an completed or continue work
exports.notifyClient = async (req, res) => {
  try {
    const { projectId, stageName, message } = req.body;

    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    const stageIndex = project.stages.find((s) => s.name === stageName);

    if (stageIndex === -1) {
      return res
        .status(404)
        .json({ type: "error", message: "Stage not found." });
    }

    // Add notification to the latest update
    if (!stageIndex.updates || stageIndex.updates.length === 0) {
      return res.status(400).json({
        type: "error",
        message: `No updates found for stage "${stageName}".`,
      });
    }

    // update nofitfy
    stageIndex.notify = {
      message: message || `The stage "${stageName}" is now complete.`,
      sentAt: new Date(),
      stageDetails: {
        stageName: stageIndex.name,
        isCompleted: true,
      },
    };

    await project.save();

    sendEmail(
      user.email,
      "Inform Stage",
      `Client notified for stage ${stageName}. then our work is complete in stage${stageName}. ${message}`
    );
    await addNotification(
      user._id,
      `Client notified for stage ${stageName}. then our work is complete in stage${stageName}. ${message}`,
      "success"
    );

    res.send({ message: `Client notified for stage ${stageIndex}` });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_11: remove stage with id of slected particular stage
exports.clearStage = async (req, res) => {
  try {
    const { projectId, stageId } = req.body;
    const adminId = req.admin.id;

    const { project, error } = await getProjectAndStage(adminId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    const initialStageNames = [
      "Stage-1 (Electric Roof Pimping)",
      "Stage-2 (Electric insert pimpes concealed fitting)",
      "Stage-3 (Electric troubleshooting, wiring, installation switch boards, pannel boards, etc)",
    ];

    const stageIndex = project.stages.findIndex(
      (stage) => stage._id.toString() === stageId
    );

    if (stageIndex === -1) {
      return res
        .status(404)
        .json({ type: "error", message: "Stage not found." });
    }

    if (initialStageNames.includes(project.stages[stageIndex].name)) {
      return res.status(400).json({
        type: "error",
        message: "You cannot delete or modify the initial stages.",
      });
    }

    const removedStage = project.stages.splice(stageIndex, 1)[0];

    await project.save();

    res.status(200).json({
      type: "success",
      message: "Stage removed successfully.",
      removedStage,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error" });
  }
};

// Controller_1_Project_12: calculate stage cost of each
exports.calculateStageCost = async (req, res) => {
  try {
    const { projectId, stageId } = req.body;
    const adminId = req.admin.id;

    const { project, error } = await getProjectAndStage(adminId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    const stage = project.stages.find(
      (stage) => stage._id.toString() === stageId
    );
    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    // Calculate total material cost
    const materialCost = stage.updates.reduce((sum, update) => {
      const updateCost = update.materials.reduce(
        (matSum, material) => matSum + material.cost * material.quantity,
        0
      );
      return sum + updateCost;
    }, 0);

    // Calculate total worker cost
    const workerCost = stage.updates.reduce((sum, update) => {
      const updateCost = update.workers.reduce(
        (wrkSum, worker) => wrkSum + worker.dailyWage,
        0
      );
      return sum + updateCost;
    }, 0);

    const stageCost = materialCost + workerCost;
    const stagelabourCost = materialCost;

    // Update the stageCost in the project
    stage.stageCost = stageCost;
    stage.stageLabourCost = stagelabourCost;
    await project.save();
    res.status(200).json({
      message: "Stage cost calculated successfully",
      stageCost,
      materialCost,
      workerCost,
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Internal server error." });
  }
};

// Controller_1_Project_13: This controller allows the admin or contractor to add a custom bill at the project completion.
exports.addContractorBill = async (req, res) => {
  try {
    const { projectId, contractorDetails, contractorMessage, discountRequest } =
      req.body;

    // Validate input
    if (!projectId || !contractorDetails || !Array.isArray(contractorDetails)) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid data provided" });
    }

    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    // Calculate costs dynamically
    let totalServiceCost = 0;
    // Initialize individual cost fields
    let mainLabourCost = 0;
    let acPoints = 0;
    let currentPoints = 0;
    let panelBoardType = "Single-Phase";
    let lightningMeters = 0;
    let fanInstallation = 0;
    let earthingCost = 0;
    // calculate billing
    let updatedBilling = contractorDetails.map((item) => {
      let cost = 0;

      if (item.type === "Main labourcost") {
        cost = (item.feet || 0) * 100;
        mainLabourCost += cost; // Store in mainLabourCost
      } else if (item.type === "AC Point") {
        cost = (item.quantity || 0) * 2000;
        acPoints += cost;
      } else if (item.type === "Current Point") {
        cost = (item.quantity || 0) * 350;
        currentPoints += cost;
      } else if (item.type === "Panel Board") {
        cost = item.option === "Three-Phase" ? 9000 : 4000;
        panelBoardType = item.option;
      } else if (item.type === "Lightning") {
        cost = (item.feet || 0) * 20;
        lightningMeters += cost;
      } else if (item.type === "Fan Installation") {
        cost = (item.quantity || 0) * 400;
        fanInstallation += cost;
      } else if (item.type === "Earthing") {
        cost = item.cost || 0;
        earthingCost += cost;
      }

      totalServiceCost += cost;
      return { ...item, calculatedCost: cost };
    });

    let finalAmount = totalServiceCost;
    const DISCOUNT_PERCENTAGE = 8;
    // Apply discount if provided
    if (discountRequest) {
      let discountAmount = (totalServiceCost * DISCOUNT_PERCENTAGE) / 100;
      finalAmount = totalServiceCost - discountAmount;

      // Save discount details in the database
      project.discountRate = `${discountAmount}%`;
      project.discountApplied = true;
    }

    // Update project billing details
    let finalRate = finalAmount - project.totalCost;
    project.contractorBillDetails = updatedBilling;
    project.totalAmount = totalServiceCost;
    project.finalAmount = finalRate;
    project.contractorMessageOfBill = contractorMessage;
    project.billRequired = true;

    // Assign individual costs to project schema
    project.mainLabourCost = mainLabourCost;
    project.acPoints = acPoints;
    project.currentPoints = currentPoints;
    project.panelBoardType = panelBoardType;
    project.lightningMeters = lightningMeters;
    project.fanInstallation = fanInstallation;
    project.earthingCost = earthingCost;

    // Ensure Mongoose detects changes before saving
    project.markModified("contractorBillDetails");
    // Ensure Mongoose detects changes
    project.markModified("discountRate");
    project.markModified("discountApplied");

    await project.save();

    sendEmail(
      user.email,
      "Final Bill",
      `Contractor bill details: ${JSON.stringify(
        project.contractorBillDetails,
        null,
        2
      )} 
        \nTotal Amount: ${project.totalAmount} 
        \nDiscount: ${project.discountRate}% 
        \FinalAmount: ${project.finalAmount}% 
        \nFinal Amount with stage cost minus is: ${finalRate}`
    );

    res.status(200).json({
      type: "success",
      message: "Contractor bill added successfull",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ type: "error", message: "Internal server error." });
  }
};

// // Controller_1_Project_14: Admin calculates and sends final bill
// exports.calculateFinalBill = async (req, res) => {
//   try {
//     const { projectId } = req.body;

//     const adminId = req.admin.id;

//     const { user, project, error } = await getProjectAndStage(
//       adminId,
//       projectId
//     );
//     if (error) {
//       return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
//     }

//     // Calculate total material and labor costs
//     let totalMaterialCost = 0;
//     let totalLaborCost = 0;

//     project.stages.forEach((stage) => {
//       stage.updates.forEach((update) => {
//         update.materials.forEach((material) => {
//           totalMaterialCost += material.cost * material.quantity;
//         });
//         update.workers.forEach((worker) => {
//           totalLaborCost += worker.dailyWage;
//         });
//       });
//     });

//     const totalCost = totalMaterialCost + totalLaborCost;

//     // Send final bill to client
//     sendEmail(
//       user.email,
//       "Final Bill for Your Project",
//       `Dear ${user.name},\n\n` +
//         `Your project "${project.projectName}" has been completed.\n\n` +
//         `**Total Material Cost:** $${totalMaterialCost}\n` +
//         `**Total Labor Cost:** $${totalLaborCost}\n` +
//         `**Total Cost:** $${totalCost}\n\n` +
//         `Thank you for choosing our services!\n\n` +
//         `Best regards,\n` +
//         `Electrica`
//     );

//     res.status(200).json({
//       message: "Final bill calculated and sent successfully.",
//       type: "success",
//     });
//   } catch (error) {
//     res.status(500).json({ type: "error", message: "Internal server error." });
//   }
// };

// Controller_1_Project_15: all stage is complete
exports.projectComplete = async (req, res) => {
  try {
    const { projectId, completeProject } = req.body;
    const adminId = req.admin.id;

    // Fetch project and user details
    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error });
    }

    // Find the first incomplete stage
    const incompleteStage = project.stages.find((stage) => !stage.isCompleted);

    if (!incompleteStage) {
      return res.status(400).json({
        type: "error",
        message: "All stages are already marked as complete.",
      });
    }

    // Mark the first incomplete stage as completed
    incompleteStage.isCompleted = true;

    // Check if all stages are now completed
    const allStagesCompleted = project.stages.every(
      (stage) => stage.isCompleted
    );

    if (!completeProject) {
      return res
        .status(402)
        .json({ type: "error", message: "User project is not completed yet." });
    }

    if (allStagesCompleted) {
      project.completeProject = true; // Mark the project as complete
      project.billRequired = false; // Mark the project as complete
      await project.save();

      sendEmail(
        user.email,
        "Project Complete",
        `${user.name}, your project is completed.`
      );

      return res.status(200).json({
        type: "success",
        message: "All stages are complete. Project marked as complete.",
        project,
      });
    } else {
      await project.save(); // Save progress

      return res.status(200).json({
        type: "warning",
        message: `Stage "${incompleteStage.name}" marked as complete. Remaining stages are incomplete.`,
        project,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller_1_Project_16: Mark Cash on Hand Payment as Paid
exports.confirmCashOnHandPayment = async (req, res) => {
  try {
    const { projectId } = req.body;

    const adminId = req.admin.id;
    const { project, error } = await getProjectAndStage(adminId, projectId);
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    if (project.payment.method !== "cash_on_hand") {
      return res.status(400).json({
        type: "error",
        message: "Invalid payment method for cash on hand confirmation",
      });
    }

    project.payment.cashOnHandDetails.isPaid = true;
    await project.save();

    res.status(200).json({
      type: "success",
      message: "Cash on hand payment confirmed. Project is completed",
    });
  } catch (error) {
    res
      .status(500)
      .json({ type: "error", message: "Internal Server error", error });
  }
};

// Handle Online Payment Success
exports.confirmOnlinePayment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { transactionId, status } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.payment.method !== "online_payment") {
      return res.status(400).json({
        type: "error",
        message: "Invalid payment method for online payment confirmation",
      });
    }

    if (!transactionId || !["successful", "failed"].includes(status)) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid transaction details" });
    }

    project.payment.onlinePaymentDetails.transactionId = transactionId;
    project.payment.onlinePaymentDetails.paymentStatus = status;
    project.payment.onlinePaymentDetails.paidAt =
      status === "successful" ? new Date() : null;

    if (status === "successful") {
      project.completeProject = true; // Mark project as completed
    }

    await project.save();

    res.status(200).json({
      type: "success",
      message:
        status === "successful"
          ? "Online payment successful. Project is completed"
          : "Online payment failed",
    });
  } catch (error) {
    res.status(500).json({ type: "error", message: "Server error", error });
  }
};

// funcion for valid mongoid
function isValidObjectId(id) {
  const mongoose = require("mongoose");
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to get project and stage from user
async function getProjectAndStage(adminId, projectId, stageName) {
  try {
    if (!adminId) {
      return { error: "Admin not found!" };
    }

    if (!isValidObjectId(projectId)) {
      return { error: "Invalid project ID" };
    }

    // Fetch the project and its associated user
    const project = await Project.findOne({
      _id: projectId,
      status: "approved",
    }).populate("user", "name email role isActive");

    if (!project) {
      return { error: "Project not found or not approved." };
    }

    // Verify the user who created the project
    const user = project.user;
    if (!user || !user.isActive) {
      return {
        error: "User associated with the project is not valid or inactive.",
      };
    }

    if (user.role !== "user") {
      return { error: "Only standard users can access this project." };
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
