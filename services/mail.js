import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const sendEmail = async (to, data) => {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hotels Packard</title>
    </head>
    <body>
      <div style="text-align:center;font-family:sans-serif">
        <img src="https://iili.io/389IoWN.jpg" alt="Hotel" height="100" />
        <h3>Welcome to Ikorodu Hotel Packard</h3>
        <p>${data.message}</p>
        <p>Thanks,<br />Ikorodu Hotel Team</p>
        <p>
          For enquiries:
          <a href="mailto:enquiry@example.com">enquiry@example.com</a>
        </p>
      </div>
    </body>
  </html>
  `;

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_USER || "hello@example.com",
          name: "Hotel App",
        },
        to: [{ email: to }],
        subject: data.subject || "Hotels Packard Notification",
        htmlContent: htmlTemplate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API,
        },
      }
    );

    console.log(process.env.BREVO_API)
    console.log("Email sent successfully:", response.data);
    return true;
  } catch (err) {
    console.error("Brevo email error:", err.response?.data || err.message);
    return false;
  }
};
