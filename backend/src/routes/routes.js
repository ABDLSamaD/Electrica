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
} = require("../controllers/userSettings");

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

// routes
routes.post(
  "/signup",
  registerValidation,
  validateRequest,
  signupRateLimiter,
  signUp
);
routes.post("/verify-otp", fetchUser, verifyOtp);
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
routes.post("/adduser-details", fetchUser, userDetail);
routes.put("/updateuser-details", fetchUser, updateUserDetails);
routes.post("/adduser-profileImg", fetchUser, profileImage);
routes.post("/change-password", fetchUser, changepassword);
routes.get("/user-info", fetchUser, getUserDetails);

module.exports = routes;
