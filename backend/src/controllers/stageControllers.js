const User = require("../models/user");
const BanReasons = require("../models/banReason");
const { sendEmail } = require("../utils/mail");
const Admin = require("../models/admin");
const Project = require("../models/project");

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
      return res.status(200).json({
        type: "info",
        message: "Rejected your request and removed the project.",
      });
    }

    await project.save();
    sendEmail(
      user.email,
      "Accepted",
      "Your request for the project has been accepted."
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

    // Validate approved materials
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
      // Calculate daily labor cost
      const laborCost = workers.reduce((sum, worker) => {
        if (!worker.dailyWage) {
          throw new Error(`Worker ${worker.name} is missing a daily wage.`);
        }
        return sum + worker.dailyWage;
      }, 0);
      totalDailyCost += laborCost;

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
    res.status(200).json(project);
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
      `Your project "${project.clientName}" has successfully completed stage "${stageName}". You can now proceed to the next stage.`
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
    const { projectId, stageName } = req.body;

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
    sendEmail(
      user.email,
      "Inform Stage",
      `Client notified for stage ${stageName}. then our work is complete in stage${stageName} we want to go next step with your confirmation`
    );

    res.send({ message: `Client notified for stage ${stageIndex}` });
  } catch (error) {
    console.error(error.message);
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
    const { projectId, contractorBill, contractorMessage, discountRequest } =
      req.body;

    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );

    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    let discount = 0;
    const currentDate = new Date();

    // Check if discount is requested
    if (discountRequest) {
      const lastDiscountDate = project.discountAppliedDate || null;

      if (
        !lastDiscountDate ||
        currentDate - new Date(lastDiscountDate) >= ONE_DAY_MS
      ) {
        // Apply 8% discount if no discount applied in the last 24 hours
        discount = contractorBill * 0.08; // 8% discount
        project.contractorBillDiscount = discount;
        project.discountAppliedDate = currentDate; // Save discount application date
      } else {
        return res.status(400).json({
          message: "Discount already applied within the last 24 hours.",
        });
      }
    } else {
      project.contractorBillDiscount = 0; // No discount
    }

    // Update contractor bill and message
    project.contractorBill = contractorBill - discount;
    project.contractorMessageOfBill =
      contractorMessage || "No message provided";

    sendEmail(
      user.email,
      "Contractor Bill",
      `Dear ${user.name} the ${contractorMessage} and total bill is ${contractorBill}`
    );

    await project.save();

    res.status(200).json({
      message: "Contractor bill added successfully",
      contractorBill: project.contractorBill,
      contractorMessageOfBill: project.contractorMessageOfBill,
      discountApplied: discount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller_1_Project_14: Admin calculates and sends final bill
exports.calculateFinalBill = async (req, res) => {
  try {
    const { projectId } = req.body;

    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }

    // Calculate total material and labor costs
    let totalMaterialCost = 0;
    let totalLaborCost = 0;

    project.stages.forEach((stage) => {
      stage.updates.forEach((update) => {
        update.materials.forEach((material) => {
          totalMaterialCost += material.cost * material.quantity;
        });
        update.workers.forEach((worker) => {
          totalLaborCost += worker.dailyWage;
        });
      });
    });

    const totalCost = totalMaterialCost + totalLaborCost;

    // Send final bill to client
    sendEmail(
      user.email,
      "Final Bill for Your Project",
      `Dear ${user.name},\n\n` +
        `Your project "${project.projectName}" has been completed.\n\n` +
        `**Total Material Cost:** $${totalMaterialCost}\n` +
        `**Total Labor Cost:** $${totalLaborCost}\n` +
        `**Total Cost:** $${totalCost}\n\n` +
        `Thank you for choosing our services!\n\n` +
        `Best regards,\n` +
        `Electrica`
    );

    res.status(200).json({
      message: "Final bill calculated and sent successfully.",
      totalMaterialCost,
      totalLaborCost,
      totalCost,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// Controller_1_Project_15: all stage is complete
exports.projectComplete = async (req, res) => {
  try {
    const { projectId, stageId, completeProject } = req.body;

    const adminId = req.admin.id;

    const { user, project, error } = await getProjectAndStage(
      adminId,
      projectId
    );
    if (error) {
      return res.status(400).json({ type: "error", message: error }); // Handle error if returned from helper
    }
    const stageIndex = project.stages.findIndex(
      (index) => index._id.toString() === stageId
    );
    if (stageIndex === -1) {
      return res
        .status(401)
        .json({ type: "error", message: "Stage not found." });
    }
    // Update the stage's isComplete to true
    const selectedStage = project.stages[stageIndex];
    if (!selectedStage.isCompleted) {
      selectedStage.isCompleted = true;
    } else {
      return res
        .status(400)
        .json({ message: "Stage is already marked as complete." });
    }
    const allStagesCompleted = project.stages.every(
      (stage) => stage.isCompleted
    );
    if (!completeProject) {
      return res
        .status(402)
        .json({ type: "error", message: "user project is not completed yet" });
    }

    if (allStagesCompleted) {
      project.isCompleted = true; // Mark the project as complete
      project.completeProject = true; // Mark the project as complete

      return res.status(200).json({
        type: "success",
        message: "All stages are complete. Project marked as complete.",
        project,
        bill: {
          total: project.totalCost, // Include bill details if needed
          breakdown: project.stages.map((stage) => ({
            stageName: stage.name,
            amount: project.totalCost || 0, // Assume `amount` exists in stage
          })),
        },
      });
    } else {
      return res.status(200).json({
        type: "success",
        message: `Stage ${selectedStage.name} marked as complete. Remaining stages are incomplete.`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
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
