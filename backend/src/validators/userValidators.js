// validators/userValidators.js
const { body, validationResult } = require("express-validator");

exports.registerValidation = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit"),
];
exports.registerAdminValidation = [
  body("username").not().isEmpty().withMessage("username is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

exports.registerPasswordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit"),
];

exports.passwordValidation = [
  body("password").not().isEmpty().withMessage("Password is required"),
];

exports.validateUserDetails = [
  body("profileImg")
    .isURL()
    .withMessage("Profile image must be a valid URL"),
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("phone")
    .isMobilePhone("any")
    .withMessage("Phone number must be a valid mobile number"),
  body("city").notEmpty().withMessage("City is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
