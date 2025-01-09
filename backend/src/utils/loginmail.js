const nodemailer = require("nodemailer");
require("dotenv").config();

const loginMail = async (userDetails) => {
  const lastDevice = userDetails?.loginAttempt.at(-1)?.device;

  const deviceInfoText = lastDevice
    ? `Browser: ${lastDevice.browser?.name || "Unknown"}, Version: ${
        lastDevice.browser?.version || "Unknown"
      }, OS: ${lastDevice.os?.name || "Unknown"}`
    : "Unknown";

  const transporter = nodemailer.createTransport({
    service: "GMAIL",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: userDetails.email,
    subject: "Electrica Login Notification",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            padding: 20px;
          }
          .header {
            background-color: #4CAF50;
            padding: 10px 20px;
            color: #ffffff;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .info {
            margin: 10px 0;
            font-size: 16px;
          }
          .info strong {
            color: #4CAF50;
          }
          .footer {
            margin-top: 20px;
            padding: 10px 20px;
            text-align: center;
            background: #f0f0f0;
            border-top: 1px solid #ddd;
            font-size: 14px;
            color: #555;
          }
          .footer a {
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Electrica Login Notification</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userDetails.name}</strong>,</p>
            <p>We noticed a login to your Electrica account with the following details:</p>
            <div class="info">
              <p><strong>Email:</strong> ${userDetails.email}</p>
              <p><strong>Login Time:</strong> ${
                userDetails?.loginAttempt.at(-1)?.timestamp || "Unknown"
              }</p>
             <p><strong>Device info:</strong> ${deviceInfoText}</p>
              <p><strong>IP Address:</strong> ${
                userDetails?.loginAttempt.at(-1)?.ipAddress || "Unknown"
              }</p>
              <p><strong>Location longitude:</strong> ${
                userDetails?.loginAttempt.at(-1)?.location.longitude ||
                "Unknown"
              }</p>
              <p><strong>Location latitude:</strong> ${
                userDetails?.loginAttempt.at(-1)?.location.latitude || "Unknown"
              }</p>
            </div>
            <p>If this was you, you can safely ignore this email. If you didn’t log in, please <a href="https://electrica.example.com/reset-password" target="_blank">reset your password</a> immediately.</p>
          </div>
          <div class="footer">
            <p>If you have any questions or concerns, feel free to contact us at <a href="mailto:absamadkhan878@gmail.com">support@electrica.com</a>.</p>
            <p>&copy; ${new Date().getFullYear()} Electrica. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
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

module.exports = { loginMail };
