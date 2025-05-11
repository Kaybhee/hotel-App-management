import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
// import fs from "fs";
// import path from "path";
// import handlebars from "handlebars";

export const sendEmail = async(to, data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
// console.log("EMAIL_USER:",process.env.EMAIL_HOST, "EMAIL_PORT:", process.env.EMAIL_PASSWORD)
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hotels packard</title>
    </head>
  
    <body>
      <div class="body" style="text-align: center; font-family: sans-serif">
        <img src="https://freeimage.host/i/389IoWN" alt="Hotel" height="100">
        <h3>Welcome to Ikorodu Hotel packard.</h3>
        <p>
          ${data.message}
        </p>
        <p>Thanks, <br />Ikorodu Hotel Team</p>
        <p>
          For more details or enquiry, please email us at
          <a
            style="text-decoration: none"
            href="mailto:enquiry@example.com"
            >enquiry@example.com</a
          >
        </p>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: data.subject || "Hotels Packard Notification",
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}