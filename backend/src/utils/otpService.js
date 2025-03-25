const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../.env" });

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOtpEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "GMAIL",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  user.otp = otp;
  user.otpExpires = otpExpires;
  user.otpAttempts = 0;
  await user.save();

  const mailOptions = {
    to: user.email,
    subject: "Account Verification - Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);

  transporter.verify((error, success) => {
    if (error) {
      console.log("Error with transporter:", error);
    } else {
      console.log("Server is ready to send messages", success);
    }
  });
};

module.exports = { sendOtpEmail };
