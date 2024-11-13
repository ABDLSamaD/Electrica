const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// 1- verify if Login and sending a message
const verifyLogin = async (name, email, token) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  // mail set user details
  const mailOption = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Token of Login USER",
    html: `<p>${name} Successfully Login and </p><p>Your token is <br> <span style="color: #333; cursor:pointer; background: #ddf;"> ${token} </span></p><p style="font-size: 2vw; color: red;">Keep It Secret Don't Share anyone!</p>`,
  };

  const sendMail = await transporter.sendMail(mailOption);
  console.log(sendMail.response);
};

module.exports = verifyLogin;
