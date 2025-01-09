const express = require("express");
const routes = express.Router();
const {
  signUp,
  verifyOtp,
  resendOtp,
  login,
  getLoginHistory,
  logout,
  setLogoutTime,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
  getUserDetails,
  checkAuth,
} = require("../controllers/userController");
const {
  someProtectedController,
} = require("../controllers/protectedController");
const {
  registerValidation,
  loginValidation,
  validateUserDetails,
  // registerPasswordValidation,
} = require("../validators/userValidators");
const validateRequest = require("../middleware/validationMiddleware");
const fetchUser = require("../middleware/authMiddleware");
const sessionAuth = require("../middleware/sessionAuth");
const { rateLimit } = require("express-rate-limit");
const {
  userDetail,
  changepassword,
  updateUserDetails,
  profileImage,
  activityLog,
} = require("../controllers/userSettings");
const {
  project,
  getProjectDetails,
  sendMessageToAdmin,
  clientConfirmStageCompletion,
  removeClientConfirmation,
  removeProject,
  approveMaterials,
  specifyStartDate,
} = require("../controllers/userProject");
// const { requestUser } = require("../controllers/userRequest");
const decodeToken = require("../middleware/decodedtoken");

const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts, please try again later.",
});
const signupRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many signup attempts, please try again later.",
});

// routes
routes.post(
  "/signup",
  registerValidation,
  validateRequest,
  signupRateLimiter,
  signUp
);
routes.post("/verify-otp", verifyOtp);
routes.post("/resend-otp", resendOtp);
routes.post(
  "/signin",
  loginValidation,
  validateRequest,
  loginRateLimiter,
  login
);
routes.get("/check-auth", sessionAuth, checkAuth);
routes.get("/login-history/:userId", getLoginHistory);
routes.get("/protected-endpoint", sessionAuth, someProtectedController);
routes.post("/logout", sessionAuth, logout);
routes.post("/set-logout-time", sessionAuth, setLogoutTime);
routes.post("/forgot-password", forgotPassword);
routes.post("/verify-forgototp", verifyForgotOtp);
routes.post("/reset-password", resetPassword);
routes.post("/adduser-details", decodeToken, userDetail);
routes.put("/updateuser-details", decodeToken, updateUserDetails);
routes.post("/adduser-profileImg", decodeToken, profileImage);
routes.post("/change-password", decodeToken, changepassword);
routes.get("/user-info", decodeToken, getUserDetails);
routes.post("/project", decodeToken, project); //add project details
routes.post("/remove-project", decodeToken, removeProject); //add project details
routes.get("/project-details", decodeToken, getProjectDetails); // get project details from admin add
routes.post("/client-confirmation", decodeToken, clientConfirmStageCompletion); // client confirmation for dalay work of stages
routes.post(
  "/removeClient-confirmation",
  decodeToken,
  removeClientConfirmation
); // remove client confirmation for dalay work of stages
routes.post("/messageAdmin", decodeToken, sendMessageToAdmin); // User sends message to admin
routes.post("/approve-material", decodeToken, approveMaterials); // client approved materials bill
routes.post("/specifydate-material", decodeToken, specifyStartDate); // specify date  approved materials
routes.post("/user_activity", decodeToken, activityLog);
routes.post("/user_activity", decodeToken, activityLog);
// routes.post("/user_request", sessionAuth, requestUser);

module.exports = routes;
