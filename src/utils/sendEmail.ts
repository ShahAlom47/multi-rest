
import nodemailer from "nodemailer";
import { google } from "googleapis";

// OAuth2 Client সেটআপ
const oAuth2Client = new google.auth.OAuth2(
  process.env.MAIL_GOOGLE_CLIENT_ID,
  process.env.MAIL_GOOGLE_CLIENT_SECRET,
  process.env.MAIL_GOOGLE_REDIRECT_URI
);

// Refresh token সেট করুন
oAuth2Client.setCredentials({ refresh_token: process.env.MAIL_GOOGLE_REFRESH_TOKEN });

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    // Access token নিন
    const accessToken = await oAuth2Client.getAccessToken();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_USER,
        clientId: process.env.MAIL_GOOGLE_CLIENT_ID,
        clientSecret: process.env.MAIL_GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.MAIL_GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken?.token || "",
      },
    });

    // Email পাঠানো
  await transporter.sendMail({
      from: `"TekzoBD" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    // console.log("✅ Email sent successfully:", res);
  } catch (error) {
    console.error("❌ Failed to send email................:", error);
  }
};





// import nodemailer from "nodemailer";

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//  await transporter.sendMail({
//     from: `"TekzoBD" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     html,
//   });

//   // console.log("Email sent: %s", info.messageId);
// };