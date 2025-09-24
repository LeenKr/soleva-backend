import nodemailer from 'nodemailer';

export async function sendContactEmail(data) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
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
