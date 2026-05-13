import nodemailer from "nodemailer";

const EMAIL_TIMEOUT_MS = 4000;

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const withTimeout = (promise) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Email send timed out")), EMAIL_TIMEOUT_MS);
    }),
  ]);

export const sendAccountCreatedEmail = async ({ to, name }) => {
  if (!isEmailConfigured()) {
    return { skipped: true, reason: "SMTP is not configured" };
  }

  const appName = process.env.APP_NAME || "Interview Companion";
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || "";
  const loginUrl = frontendUrl ? `${frontendUrl.replace(/\/$/, "")}/login` : "";
  const from =
    process.env.SMTP_FROM ||
    `"${appName}" <${process.env.SMTP_USER}>`;

  const mail = {
    from,
    to,
    subject: `Welcome to ${appName}`,
    text: [
      `Hi ${name || "there"},`,
      "",
      `Your ${appName} account has been created successfully.`,
      "You can now upload your resume, analyze role readiness, and practice targeted mock interviews.",
      loginUrl ? `Login here: ${loginUrl}` : "",
      "",
      "Best,",
      `${appName} Team`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Welcome to ${appName}</h2>
        <p>Hi ${name || "there"},</p>
        <p>Your account has been created successfully.</p>
        <p>You can now upload your resume, analyze role readiness, and practice targeted mock interviews.</p>
        ${
          loginUrl
            ? `<p><a href="${loginUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 16px;border-radius:10px;text-decoration:none;">Open ${appName}</a></p>`
            : ""
        }
        <p style="margin-top: 24px;">Best,<br/>${appName} Team</p>
      </div>
    `,
  };

  await withTimeout(getTransporter().sendMail(mail));
  return { skipped: false };
};
