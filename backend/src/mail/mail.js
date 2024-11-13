const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// configure mail and send it to verify it's email
const sendMail = async (name, email, user_id, subject) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    // 2. Configure email content.
    const mailOption = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Email",
      html: `<p> ${name} Verify your email address to complete the signup and login into your account.</p><p>This link is expires at 6 hours.</p><p>Press <a href=${
        currentUrl + `api/auth/verify?id=${user_id}`
      }> here </a> to proceed</p>`,
    };
    const sendmail = await transporter.sendMail(mailOption);
    console.log(sendmail.response);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendMail;
