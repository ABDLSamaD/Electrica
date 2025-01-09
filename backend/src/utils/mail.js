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

  const currentDateTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: userEmail,
    subject: subject,
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="100%" style="max-width: 600px; margin: auto; background-color: #1c1c1c; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; background: linear-gradient(135deg, #6a0dad, #ff1493);">
                            <h1 style="color: #fff; font-size: 28px; margin: 0; letter-spacing: 1px; text-transform: uppercase;">Electrica Notifications</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            <p style="font-size: 16px; color: #e0e0e0; margin-bottom: 20px; line-height: 1.6;">
                                ${text}
                            </p>
                            <p style="font-size: 14px; margin-bottom: 15px; color: #b0b0b0;">
                                <strong style="color: #ff1493;">Sent on:</strong> ${currentDateTime}
                            </p>
                            <p style="font-size: 14px; color: #b0b0b0; line-height: 1.4;">
                                For further assistance, feel free to contact us at:<br>
                                <a href="mailto:absamadkhan878@gmail.com" style="color: #ff1493; text-decoration: none; font-weight: bold;">absamadkhan878@gmail.com</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Call to Action -->
                    <tr>
                        <td align="center" style="padding: 0 25px 30px;">
                            <table cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="background-color: #ff1493; border-radius: 4px; padding: 12px 24px;">
                                        <a href="#" style="color: #ffffff; font-size: 16px; text-decoration: none; font-weight: bold; display: inline-block;">Learn More</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #181818; padding: 20px; text-align: center; border-top: 1px solid #333;">
                            <p style="font-size: 12px; color: #999; margin: 0; line-height: 1.4;">
                                © ${new Date().getFullYear()} <span style="color: #ff1493; font-weight: bold;">Electrica</span>. All rights reserved.<br>
                                <a href="#" style="color: #b0b0b0; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #b0b0b0; text-decoration: none;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
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

module.exports = { sendEmail };
