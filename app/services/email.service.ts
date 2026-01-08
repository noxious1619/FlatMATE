import { Resend } from "resend";

const resend=new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}&email=${email}`;

  
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
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