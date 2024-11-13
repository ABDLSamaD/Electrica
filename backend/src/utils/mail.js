const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (userEmail, subject, text) => {
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
    subject: subject,
    text: text,
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

module.exports = { sendEmail };
