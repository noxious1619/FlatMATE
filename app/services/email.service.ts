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
  subject: "FlatMATE: Verify your email",
  html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Email</title>

    <!-- Dark Mode Support -->
    <style>
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f172a !important;
        }
        .container {
          background-color: #020617 !important;
        }
        .text {
          color: #e5e7eb !important;
        }
        .muted {
          color: #9ca3af !important;
        }
        .divider {
          border-top: 1px solid #1f2937 !important;
        }
        .url-box {
          background-color: #020617 !important;
          border: 1px solid #1f2937 !important;
          color: #e5e7eb !important;
        }
      }
    </style>
  </head>

  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0"
            class="container"
            style="max-width:520px; background:#ffffff; border-radius:10px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <img
                  src="https://res.cloudinary.com/ddzypmodn/image/upload/v1768290424/FLARMATE_LOGO_r0coly.png"
                  alt="FlatMATE"
                  width="120"
                  style="display:block;"
                />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding-bottom:12px;">
                <h2 class="text" style="margin:0; color:#111827;">
                  Verify your email
                </h2>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td class="text" style="color:#374151; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 16px;">
                  Welcome to <strong>FlatMATE</strong>!  
                  Please confirm your email address by clicking the button below.
                </p>

                <!-- Button -->
                <p style="text-align:center; margin:24px 0;">
                  <a
                    href="${verifyUrl}"
                    style="
                      background-color:#2563eb;
                      color:#ffffff;
                      text-decoration:none;
                      padding:12px 26px;
                      border-radius:6px;
                      display:inline-block;
                      font-weight:600;
                    "
                  >
                    Verify Email
                  </a>
                </p>

                <p class="muted" style="margin:0 0 12px; font-size:13px; color:#6b7280;">
                  This link will expire in <strong>24 hours</strong>.
                </p>

                <p class="text" style="margin:16px 0 8px; font-size:13px;">
                  If the button doesn’t work, copy and paste this URL:
                </p>

                <!-- URL Box -->
                <p
                  class="url-box"
                  style="
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                    padding:12px;
                    border-radius:6px;
                    font-size:12px;
                    word-break:break-all;
                    color:#1f2937;
                  "
                >
                  ${verifyUrl}
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:24px 0;">
                <hr class="divider" style="border:none; border-top:1px solid #e5e7eb;" />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td class="muted" style="font-size:12px; color:#6b7280; text-align:center;">
                <p style="margin:0;">
                  If you did not request this email, you can safely ignore it.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
  `,
});

}
