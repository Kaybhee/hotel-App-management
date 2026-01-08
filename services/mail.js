import dotenv from 'dotenv';
import { MailtrapClient } from 'mailtrap';
dotenv.config();
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API);
const client = new MailtrapClient({
  token : process.env.MAILTRAP_API
})

export const sendEmail = async(to, data) => {
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
        <img src="https://iili.io/389IoWN.jpg" alt="Hotel" height="100">
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
            >enquiry@example.com</a>
        </p>
      </div>
    </body>
  </html>
  `;
  const msg = {
    to: to, 
    from: process.env.EMAIL_USER,
    subject: data.subject || "Hotels Packard Notification",
    html: htmlTemplate,
}

try {
  await client.send(msg);
  console.log("Email sent successfully!");
  return true;
} catch (err) {
  console.error("Mailtrap error:", err);
  if (err.response) {
    console.error("Mailtrap response error: ", err.response.body);
  }
  return false;
}
}