const express = require("express");
const { registerAdmin, loginAdmin, logoutAdmin } = require("../controllers/adminController");
// const adminAuth = require("../middleware/adminAuth");
const {
    registerAdminValidation,
    loginValidation,
  } = require("../validators/userValidators");
  const validateRequest = require("../middleware/validationMiddleware");

const router = express.Router();

router.post("/signup", registerAdminValidation, validateRequest, registerAdmin);
router.post("/signin", loginValidation, validateRequest, loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
