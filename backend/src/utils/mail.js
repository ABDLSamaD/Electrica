const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../.env" });

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
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-family: 'Arial', 'Helvetica', sans-serif; margin: 0; padding: 0; width: 100%;">
      <tr>
        <td align="center" style="padding: 0;">
          <table width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);" cellpadding="0" cellspacing="0" role="presentation">
            <!-- Header -->
            <tr>
              <td style="padding: 30px 24px; text-align: center; background-color: #6a0dad;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">Electrica Notifications</h1>
              </td>
            </tr>

            <!-- Security Badge -->
            <tr>
              <td style="background-color: #f8f8f8; padding: 12px 24px; border-bottom: 1px solid #eeeeee;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="24" style="vertical-align: middle;">
                      <!-- Lock Icon (Unicode character for simplicity and email compatibility) -->
                      <span style="font-size: 18px; color: #6a0dad;">&#128274;</span>
                    </td>
                    <td style="vertical-align: middle; padding-left: 10px;">
                      <p style="font-size: 13px; color: #555555; margin: 0;">
                        <strong>SECURE EMAIL</strong>: This message is protected with end-to-end encryption
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 36px 24px 24px;">
                <p style="font-size: 16px; color: #333333; margin-top: 0; margin-bottom: 24px; line-height: 1.6;">
                  ${text}
                </p>
                <div style="background-color: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; border-left: 4px solid #6a0dad;">
                  <p style="font-size: 14px; margin: 0 0 8px; color: #555555;">
                    <span style="color: #6a0dad; font-weight: 600;">Sent on:</span> ${currentDateTime}
                  </p>
                  <p style="font-size: 14px; margin: 0; color: #555555;">
                    <span style="color: #6a0dad; font-weight: 600;">Recipient:</span> ${userEmail}
                  </p>
                </div>
                <p style="font-size: 14px; color: #666666; line-height: 1.5; margin-bottom: 24px;">
                  For further assistance, feel free to contact us at:
                </p>
                <p style="margin: 0;">
                  <a href="mailto:absamadkhan878@gmail.com" style="color: #ff1493; text-decoration: none; font-weight: 600; font-size: 14px;">absamadkhan878@gmail.com</a>
                </p>
              </td>
            </tr>

            <!-- Call to Action -->
            <tr>
              <td align="center" style="padding: 0 24px 32px;">
                <table cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="background-color: #ff1493; border-radius: 6px;">
                      <a href="https://electricaapp.vercel.app/" style="color: #ffffff; font-size: 15px; text-decoration: none; font-weight: 600; display: inline-block; padding: 12px 28px;">Learn More</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Security Footer -->
            <tr>
              <td style="background-color: #f8f8f8; padding: 16px 24px; border-top: 1px solid #eeeeee;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="text-align: center;">
                      <p style="font-size: 12px; color: #777777; margin: 0 0 8px; line-height: 1.4;">
                        This email was sent securely from Electrica. Please do not reply to this email.
                      </p>
                      <p style="font-size: 12px; color: #777777; margin: 0; line-height: 1.4;">
                        To ensure delivery to your inbox, please add <span style="color: #6a0dad;">noreply@electrica.com</span> to your contacts.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #222222; padding: 24px; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="text-align: center; padding-bottom: 16px;">
                      <!-- Security Verification Badge -->
                      <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="background-color: #333333; border-radius: 4px; padding: 6px 12px;">
                            <p style="font-size: 11px; color: #ffffff; margin: 0;">
                              <span style="color: #00cc00; font-size: 12px;">&#10004;</span> VERIFIED & SECURE
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="font-size: 13px; color: #aaaaaa; margin: 0 0 12px; line-height: 1.4;">
                        © ${new Date().getFullYear()} <span style="color: #ff1493; font-weight: 600;">Electrica</span>. All rights reserved.
                      </p>
                      <p style="margin: 0;">
                        <a href="#" style="color: #aaaaaa; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy Policy</a>
                        <a href="#" style="color: #aaaaaa; text-decoration: none; font-size: 12px; margin: 0 8px;">Unsubscribe</a>
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
