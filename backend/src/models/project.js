const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  removeProject: { type: Boolean, default: false },
  clientName: String,
  clientNumber: { type: Number, required: true },
  projectDescription: { type: String, required: true },
  projectName: { type: String, required: true },
  projectAddress: { type: String, required: true },
  projectCity: { type: String, required: true },
  projectPics: [String], // General project images
  status: {
    type: String,
    enum: ["submitted", "pending", "approved", "rejected"],
    default: "submitted",
  },
  statusChangedAt: { type: Date, default: Date.now },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  statusChangeReason: { type: String },
  completeProject: { type: Boolean, default: false },
  startStage: { type: Boolean, default: false },
  startStageMessage: String,
  stages: [
    {
      name: { type: String, required: true },
      mainMaterial: { type: String },
      updates: [
        new mongoose.Schema(
          {
            date: { type: Date, default: Date.now, required: true },
            details: { type: String },
            materialsUsed: [
              {
                name: { type: String },
                materialId: mongoose.Schema.Types.ObjectId,
                quantity: { type: Number },
              },
            ],
            workers: [
              {
                name: { type: String, required: true },
                dailyWage: { type: Number, required: true },
              },
            ],
            images: [String],
          },
          { _id: false } // Prevent automatic generation of `_id` for updates
        ),
      ],
      materials: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          isApproved: { type: Boolean, default: false }, // Client approval status
          approvedDate: { type: Date }, // When the client approved
          finished: { type: Boolean, default: false },
        },
      ],
      isCompleted: { type: Boolean, default: false },
      canStart: { type: Boolean, default: false }, // Determines if the stage can start
      clientConfirmation: {
        isConfirmed: { type: Boolean, default: false }, // Tracks client confirmation
        emergencyMessage: String,
        date: { type: Date }, // Client's preferred start date
      },
      stageCost: { type: Number, default: 0 },
      stageLabourCost: { type: Number, default: 0 },
    },
  ],
  totalCost: { type: Number, default: 0 }, // Running total of project costs
  contractorMessageOfBill: { type: String, default: "" },
  contractorBill: { type: Number, default: 0 }, // For customized billing at the end
  contractorBillDiscount: { type: Number, default: 0 }, // For customized billing at the end
  discountAppliedDate: { type: Date, default: null },
  clientMessages: [
    {
      message: { type: String, required: true }, // Client's message
      sentAt: { type: Date, default: Date.now },
    },
  ],
  adminMessages: {
    message: { type: String }, // Client's message
    sentAt: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const project = mongoose.model("Project", projectSchema);
module.exports = project;
