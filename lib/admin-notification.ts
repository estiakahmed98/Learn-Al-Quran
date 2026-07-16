import nodemailer from "nodemailer";

type NotificationValue = string | number | null | undefined;

interface AdminNotification {
  subject: string;
  heading: string;
  fields: Record<string, NotificationValue>;
}

function escapeHtml(value: NotificationValue) {
  return String(value ?? "Not provided")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendAdminNotification({ subject, heading, fields }: AdminNotification) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || user;
  const from = process.env.SMTP_FROM_EMAIL || user;

  if (!user || !pass || !recipient || !from) {
    console.error("Admin notification skipped: SMTP configuration is incomplete.");
    return;
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const rows = Object.entries(fields)
    .map(
      ([label, value]) => `
        <tr>
          <th style="padding:10px;text-align:left;border:1px solid #ddd;background:#f7f7f7">${escapeHtml(label)}</th>
          <td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: recipient,
      subject,
      text: [heading, ...Object.entries(fields).map(([key, value]) => `${key}: ${value ?? "Not provided"}`)].join("\n"),
      html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h2>${escapeHtml(heading)}</h2><table style="width:100%;border-collapse:collapse">${rows}</table></div>`,
    });
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
}
