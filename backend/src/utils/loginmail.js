const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config({path: "../../../.env"});

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
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; color: #333333; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="min-width: 100%; background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center" valign="top">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="padding: 30px 40px; background-color: #2d3748; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">Security Alert</h1>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin: 8px 0 0; font-size: 16px; color: #e2e8f0; font-weight: 400;">New login detected on your Electrica account</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 40px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4a5568;">
                          Hi <span style="font-weight: 600; color: #2d3748;">${
                            userDetails.name
                          }</span>,
                        </p>
                        <p style="margin: 0 0 25px; font-size: 16px; line-height: 1.5; color: #4a5568;">
                          We detected a new sign-in to your Electrica account. Please review the details below:
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Login Details -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #5a67d8;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="120" style="font-size: 14px; color: #718096; font-weight: 500;">Email:</td>
                                  <td style="font-size: 14px; color: #2d3748; font-weight: 500;">${
                                    userDetails.email
                                  }</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="120" style="font-size: 14px; color: #718096; font-weight: 500;">Login Time:</td>
                                  <td style="font-size: 14px; color: #2d3748; font-weight: 500;">${
                                    userDetails?.loginAttempt.at(-1)
                                      ?.timestamp || "Unknown"
                                  }</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="120" style="font-size: 14px; color: #718096; font-weight: 500;">Device:</td>
                                  <td style="font-size: 14px; color: #2d3748; font-weight: 500;">${deviceInfoText}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="120" style="font-size: 14px; color: #718096; font-weight: 500;">IP Address:</td>
                                  <td style="font-size: 14px; color: #2d3748; font-weight: 500;">${
                                    userDetails?.loginAttempt.at(-1)
                                      ?.ipAddress || "Unknown"
                                  }</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Action Section -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #4a5568;">
                          If this was you, no further action is required. If you don't recognize this activity, please take immediate action to secure your account:
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding: 10px 0 20px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="background-color: #5a67d8; border-radius: 6px; text-align: center;">
                              <a href="https://electricaapp.vercel.app/forgot_password" target="_blank" style="display: inline-block; padding: 14px 30px; font-size: 16px; color: #ffffff; font-weight: 600; text-decoration: none;">Reset Password</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #718096; text-align: center;">
                          Or copy and paste this URL into your browser:<br>
                          <a href="https://electricaapp.vercel.app/forgot_password" target="_blank" style="color: #5a67d8; text-decoration: none; word-break: break-all;">https://electricaapp.vercel.app/forgot_password</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Security Tips -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 30px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 15px; font-size: 16px; font-weight: 600; color: #2d3748;">Security Tips:</p>
                        <ul style="margin: 0; padding: 0 0 0 20px; list-style-type: disc;">
                          <li style="margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: #4a5568;">Use a strong, unique password for your Electrica account</li>
                          <li style="margin: 0 0 10px; font-size: 14px; line-height: 1.5; color: #4a5568;">Enable two-factor authentication for additional security</li>
                          <li style="margin: 0 0 0; font-size: 14px; line-height: 1.5; color: #4a5568;">Never share your login credentials with anyone</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #718096; line-height: 1.5;">
                          If you have any questions or concerns, please contact us at<br>
                          <a href="mailto:absamadkhan878@gmail.com" style="color: #5a67d8; text-decoration: none; font-weight: 500;">absamadkhan878@gmail.com</a>
                        </p>
                        <p style="margin: 0; font-size: 13px; color: #a0aec0; line-height: 1.5;">
                          &copy; ${new Date().getFullYear()} Electrica. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
