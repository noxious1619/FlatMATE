import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${email}`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"FlatMATE" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: "flatMATE: Verify your email",
    html: `
    <p>Click the link below to verify your email:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
    <p>or copy and paste the following URL into your browser:</p>
    <p>${verifyUrl}</p>
    <hr/>
    <p>If you did not request this, please ignore this email.</p>
  `,
  });
}
