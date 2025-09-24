import nodemailer from "nodemailer";

export async function sendContactEmail(data) {
  const port = Number(process.env.SMTP_PORT || 587);
  // sensible default: 465 => secure TLS; 587/25 => STARTTLS (secure:false)
  const secure =
    process.env.SMTP_SECURE !== undefined
      ? String(process.env.SMTP_SECURE).toLowerCase() === "true"
      : port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure, // false for 587 (STARTTLS), true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromAddr = process.env.MAIL_FROM || `"Soleva Contact" <${process.env.SMTP_USER}>`;
  const toAddr = process.env.MAIL_TO || process.env.SMTP_USER;

  // Optional one-time check during deploy:
  // await transporter.verify();

  return transporter.sendMail({
    from: fromAddr,          // must be the authenticated Gmail (or its alias)
    to: toAddr,
    replyTo: data.email,     // so you can reply directly to the sender
    subject: `New contact from ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.projectType ? `Project: ${data.projectType}` : null,
      data.budget ? `Budget: ${data.budget}` : null,
      "",
      data.message,
    ].filter(Boolean).join("\n"),
  });
}
