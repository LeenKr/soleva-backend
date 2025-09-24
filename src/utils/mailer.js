import nodemailer from "nodemailer";

export async function sendContactEmail(data) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,   // <-- match Render
      pass: process.env.EMAIL_PASS,   // <-- match Render
    },
  });

  await transporter.sendMail({
    from: `"Soleva Contact" <${process.env.EMAIL_USER}>`, // Gmail requires this to match
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `New contact from ${data.name}`,
    text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Project: ${data.projectType}
Budget: ${data.budget}
Message: ${data.message}
    `,
  });
}
