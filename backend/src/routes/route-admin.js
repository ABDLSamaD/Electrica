const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdmin,
  getAllUser,
  getAllUserActivity,
  forgotPassword,
  resetPassword,
  verifyForgotOtp,
  resendOTP,
  checkAdminAuth,
  changePassword,
  removeUser,
} = require("../controllers/adminController");
// const adminAuth = require("../middleware/adminAuth");
const {
  registerAdminValidation,
  loginValidation,
} = require("../validators/userValidators");
const validateRequest = require("../middleware/validationMiddleware");
const adminAuth = require("../middleware/adminAuth");
const adminAuths = require("../middleware/adminAuths");
const {
  blockUser,
  unbanUser,
  getBanReasons,
  updateProjectStatus,
  addDailyUpdate,
  addStageToProject,
  completeStage,
  clearStage,
  notifyClient,
  calculateStageCost,
  addContractorBill,
  stageData,
  startStaged,
  projectComplete,
  addStageMaterials,
  removeStageMaterial,
  sendMessageUser,
  getProjectDetails,
  confirmCashOnHandPayment,
  confirmOnlinePayment,
} = require("../controllers/stageControllers");
const sessionAdminAuth = require("../middleware/sessionAdminAuth");

const router = express.Router();

router.post("/signup", registerAdminValidation, validateRequest, registerAdmin);
router.post("/signin", loginValidation, validateRequest, loginAdmin);
router.get("/check-adminauth", sessionAdminAuth, checkAdminAuth); // check session authorization
router.post("/forgt-paswrd", forgotPassword);
router.post("/resend-otp", resendOTP);
router.post("/verify-forgotOTP", adminAuths, verifyForgotOtp); // and adminAuth is checking token inside of cookies
router.post("/reset-paswrd", adminAuths, resetPassword);
router.post("/logout", sessionAdminAuth, logoutAdmin);
router.post("/change-password", adminAuth, changePassword);
router.get("/get_admin", adminAuth, getAdmin); //get admin details
router.get("/get_all_users", adminAuth, getAllUser); // fetech all user
router.post("/remove-user", adminAuth, removeUser); // remove user
router.get("/:id/activity", adminAuth, getAllUserActivity);
router.post("/project-status", adminAuth, updateProjectStatus); // admin approved client project request
router.post("/start-project", adminAuth, startStaged); // admin approved client project then start add details
router.post("/add-material", adminAuth, addStageMaterials); // admin add materials for each stage for  client project then start add details
router.post("/remove-material", adminAuth, removeStageMaterial); // admin remove materials for each stage for client project
router.post("/projectdaily-update", adminAuth, addDailyUpdate); // add daily project details for user
router.get("/project-details", adminAuth, getProjectDetails); // get project details
router.post("/project-stage", adminAuth, addStageToProject); // admin add stage of client project
router.post("/complete-stage", adminAuth, completeStage); // complete project stage
router.post("/message-client", adminAuth, sendMessageUser); // send message to user
router.post("/getstage", adminAuth, stageData); // find stage data of each find
router.post("/notify-client", adminAuth, notifyClient); // add daily project details for user
router.post("/remove-stage", adminAuth, clearStage); // add daily project details for user
router.post("/calculate-stagecost", adminAuth, calculateStageCost); // calculate each stage cost
router.post("/add-contractorbill", adminAuth, addContractorBill); // add contractor bill with dicount in 24 hour
router.post("/complete-project", adminAuth, projectComplete); // complete project
router.post("/payment-cash", adminAuth, confirmCashOnHandPayment); // complete project
router.post("/payment-online", adminAuth, confirmOnlinePayment); // complete project
router.patch("/:id/ban", blockUser);
router.patch("/:id/unban", unbanUser);
router.get("/ban-reasons", getBanReasons);
router.get("/pending_request", getBanReasons);

module.exports = router;
