const express = require("express");
const multer = require("multer");
const routes = express.Router();
const {
  signUp,
  verifyOtp,
  resendOtp,
  login,
  logout,
  setLogoutTime,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
  getUserDetails,
  checkAuth,
  deleteAccount,
  updateFirstTime,
  checkAuthIfLoggedIn,
  checkDatabaseAndSession,
  getNotification,
  deleteNotification,
  markAsRead,
} = require("../controllers/userController"); // user controller
const {
  someProtectedController,
} = require("../controllers/protectedController"); // protected controller
const {
  registerValidation,
  loginValidation,
  validateUserDetails,
  // registerPasswordValidation,
} = require("../validators/userValidators");
const validateRequest = require("../middleware/validationMiddleware");
// const fetchUser = require("../middleware/authMiddleware");
const sessionAuth = require("../middleware/sessionAuth");
const { rateLimit } = require("express-rate-limit");
const {
  userDetail,
  changepassword,
  updateUserDetails,
  profileImage,
  activityLog,
  contactForm,
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
  markMessageAsShown,
  getUnreadMessages,
  setPaymentMethod,
} = require("../controllers/userProject");
const decodedToken = require("../middleware/decodedToken");
const {
  createComplain,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complainController");
const checkLoginSession = require("../middleware/checkLoginSession");

const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 10 requests per windowMs
  message: "Too many login attempts, please try again later.",
});
const signupRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 10 requests per windowMs
  message: "Too many signup attempts, please try again later.",
});

// Multer storage (Temporary for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// routes
routes.post(
  "/signup",
  registerValidation,
  validateRequest,
  signupRateLimiter,
  signUp
); // signup
routes.post("/verify-otp", verifyOtp);
routes.post("/resend-otp", resendOtp);
routes.post(
  "/signin",
  loginValidation,
  validateRequest,
  loginRateLimiter,
  checkLoginSession,
  login
); // signin
routes.get("/check-auth", sessionAuth, checkAuth); // check auth
routes.get("/check-db-session", checkDatabaseAndSession); // check database and session
routes.get("/check-userlogin", checkAuthIfLoggedIn); // check user login
routes.post("/updateFirstTime", decodedToken, updateFirstTime); // update first time
routes.get("/protected-endpoint", sessionAuth, someProtectedController); // protected endpoint
routes.post("/logout", sessionAuth, logout); // logout
routes.post("/set-logout-time", sessionAuth, setLogoutTime);
routes.post("/forgot-password", forgotPassword);
routes.post("/verify-forgototp", verifyForgotOtp);
routes.post("/reset-password", resetPassword);
routes.post("/delete-account", deleteAccount);
routes.post("/adduser-details", decodedToken, userDetail);
routes.put("/updateuser-details", decodedToken, updateUserDetails);
routes.post("/adduser-profileImg", decodedToken, profileImage);
routes.post("/change-password", decodedToken, changepassword);
routes.get("/user-info", decodedToken, getUserDetails);

// Notification routes start
routes.get("/get-notification", decodedToken, getNotification);
routes.delete(
  "/delete-notification/:notificationId",
  decodedToken,
  deleteNotification
);
routes.post("/read-notification/:notificationId", decodedToken, markAsRead);
// Notification routes end

routes.post("/project", decodedToken, upload.array("projectPics", 5), project); //add project details
routes.post("/remove-project", decodedToken, removeProject); //add project details
routes.get("/project-details", decodedToken, getProjectDetails); // get project details from admin add
routes.post("/client-confirmation", decodedToken, clientConfirmStageCompletion); // client confirmation for dalay work of stages
routes.post(
  "/removeClient-confirmation",
  decodedToken,
  removeClientConfirmation
); // remove client confirmation for dalay work of stages
routes.post("/messageAdmin", decodedToken, sendMessageToAdmin); // User sends message to admin
routes.post("/unread", decodedToken, markMessageAsShown); // markAsShown messages
routes.post("/mark-shown", decodedToken, getUnreadMessages); // un read messages
routes.post("/approve-material", decodedToken, approveMaterials); // client approved materials bill
routes.post("/specifydate-material", decodedToken, specifyStartDate); // specify date  approved materials
routes.post("/select-paymentmethod", decodedToken, setPaymentMethod); // specify date  approved materials
routes.post("/user_activity", decodedToken, activityLog);
// routes.post("/user_request", sessionAuth, requestUser);

// Complain Routes Start
routes.post("/createcomplain", createComplain);
routes.post("/contact-form", contactForm);
routes.get("/:id", getComplaintById);
routes.put("/:id/status", updateComplaintStatus);
routes.delete("/:id", deleteComplaint);
// Complain Routes End

module.exports = routes;
