const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  removeProject: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }, // Tracks if the project is currently active
  clientName: String,
  clientNumber: { type: Number, required: true },
  projectDescription: { type: String, required: true },
  projectName: { type: String, required: true },
  projectAddress: { type: String, required: true },
  projectCity: { type: String, required: true },
  category: {
    type: String,
    enum: ["Residential", "Commercial", "Industrial"],
    required: true,
  },
  voltageType: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  projectPics: [String], // General project images
  status: {
    type: String,
    enum: ["submitted", "pending", "approved", "rejected"],
    default: "submitted",
  },
  statusChangedAt: { type: Date, default: Date.now },
  phases: { type: Number, enum: [1, 3], required: true },
  estimatedBudget: { type: Number, required: true },
  advancePaid: { type: Number, default: 0 },
  contractorBudgetCall: { type: Boolean, default: false },
  contractorBudget: { type: Number, default: 0 },
  contractorBudgetStatus: {
    type: String,
    enum: ["rejected", "approved"],
    default: null,
  },
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
      notify: {
        message: { type: String, default: "" },
        sentAt: { type: Date, default: Date.now },
        stageDetails: {
          stageName: { type: String, default: "" }, // Name of the stage
          isCompleted: { type: Boolean, default: false }, // Whether the stage is completed
        },
      },

      isCompleted: { type: Boolean, default: false },
      canStart: { type: Boolean, default: false }, // Determines if the stage can start
      clientConfirmation: {
        isConfirmed: { type: Boolean, default: false }, // Tracks client confirmation
        emergencyMessage: String,
        date: { type: Date }, // Client's preferred start date
      },
      stageLabourCost: { type: Number, default: 0 },
    },
  ],
  totalCost: { type: Number, default: 0 }, // Running total of project costs
  // Billing Details
  mainLabourCost: { type: Number, default: 0 }, // Main labour cost (each by meaurement of meter)
  acPoints: { type: Number, default: 0 }, // AC Point (₹2000 each)
  currentPoints: { type: Number, default: 0 }, // Current Point (₹350 each)
  panelBoardType: {
    type: String,
    enum: ["Three-Phase", "Single-Phase"],
    default: "Single-Phase",
  },
  lightningMeters: { type: Number, default: 0 }, // ₹10 per meter for lighting
  fanInstallation: { type: Number, default: 0 }, // ₹400 per fan
  earthingCost: { type: Number, default: 0 }, // Custom cost for earthing
  // Auto-Generated Total
  totalAmount: { type: Number, default: 0 },
  discountApplied: { type: Boolean, default: false },
  discountRate: { type: String, default: "" },
  finalAmount: { type: Number, default: 0 },
  contractorMessageOfBill: String,
  isPaid: { type: Boolean, default: false },
  billRequired: { type: Boolean, default: false },

  // Payment details
  payment: {
    method: {
      type: String,
      enum: ["cash_on_hand", "online_payment"],
      // required: true,
    },
    cashOnHandDetails: {
      payDate: { type: Date }, // Required if method is "cash_on_hand"
      isPaid: { type: Boolean, default: false },
    },
    onlinePaymentDetails: {
      transactionId: { type: String },
      paymentStatus: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending",
      },
      paidAt: { type: Date },
    },
  },

  // client and admin messaging detailing
  clientMessages: [
    {
      message: { type: String }, // Client's message
      sentAt: { type: Date, default: Date.now },
      isShownToAdmin: { type: Boolean, default: false }, // Indicates if admin has seen it
      shownAt: { type: Date }, // Timestamp when the message was marked as shown
    },
  ],
  adminMessages: [
    {
      message: { type: String }, // Admin's message
      sentAt: { type: Date, default: Date.now },
      isShownToClient: { type: Boolean, default: false }, // Indicates if client has seen it
      shownAt: { type: Date }, // Timestamp when the message was marked as shown
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const project = mongoose.model("Project", projectSchema);
module.exports = project;
