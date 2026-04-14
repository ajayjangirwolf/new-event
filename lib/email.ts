import nodemailer from "nodemailer";

const transport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })
  : nodemailer.createTransport({ jsonTransport: true });

export async function sendTicketEmail({
  to,
  eventTitle,
  qrCode,
}: {
  to: string;
  eventTitle: string;
  qrCode: string;
}) {
  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "tickets@example.com",
    to,
    subject: `Your ticket for ${eventTitle}`,
    html: `<h2>Ticket Confirmed</h2><p>Thanks for your purchase.</p><p>Event: <b>${eventTitle}</b></p><p>Show this QR code at entry:</p><img src="${qrCode}" alt="QR Code" />`,
  });
}
