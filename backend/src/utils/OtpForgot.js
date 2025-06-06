const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config({path: "../../../.env"});

const sendForgotOtpEmail = async (userEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "GMAIL",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: userEmail,
    subject: "Your OTP for Password Reset",
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
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

module.exports = { sendForgotOtpEmail };
