import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_KEY   = Deno.env.get("RESEND_API_KEY")!;
const OWNER_EMAIL  = Deno.env.get("NOTIFY_EMAIL") ?? "niharikaakashyap@gmail.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const { name, email, phone, dob, tob, pob, serviceType, otherDesc, paymentId } = await req.json();

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const firstName   = name.split(" ")[0];

    const row = (label: string, value: string) =>
      value
        ? `<tr>
            <td style="padding:8px 0;color:#9a8060;width:150px;vertical-align:top;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">${label}</td>
            <td style="padding:8px 0;color:#1a1206;">${value}</td>
           </tr>`
        : "";

    // ── Admin email ───────────────────────────────────────────
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #e8d8b0;border-radius:4px;overflow:hidden;">
        <div style="background:#1a1206;padding:24px 32px;">
          <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b8860b;">Vedic Saar</p>
          <h2 style="margin:8px 0 0;color:#f5ede0;font-weight:400;font-size:20px;">New Booking Received</h2>
        </div>
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${row("Name",          name)}
            ${row("Email",         email)}
            ${row("Phone",         phone)}
            ${row("Service",       serviceType)}
            ${row("Date of Birth", dob)}
            ${row("Time of Birth", tob)}
            ${row("Place of Birth",pob)}
            ${row("Details",       otherDesc)}
            ${row("Payment ID",    `<span style="color:#2a7a2a;font-weight:600;">✓ ${paymentId || "N/A"}</span>`)}
            ${row("Amount Paid",   "₹500")}
          </table>
          <p style="margin-top:20px;padding-top:14px;border-top:1px solid #e8d8b0;color:#b8a882;font-size:11px;">
            Received ${submittedAt} IST
          </p>
        </div>
      </div>`;

    // ── User confirmation email ────────────────────────────────
    const userHtml = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #e8d8b0;border-radius:4px;overflow:hidden;">
        <div style="background:#1a1206;padding:24px 32px;">
          <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b8860b;">Vedic Saar</p>
          <h2 style="margin:8px 0 0;color:#f5ede0;font-weight:400;font-size:20px;">Booking Confirmed</h2>
        </div>
        <div style="padding:32px;">
          <p style="color:#1a1206;font-size:16px;line-height:1.7;margin:0 0 16px;">Dear ${firstName},</p>
          <p style="color:#3a2e1e;font-size:15px;line-height:1.8;margin:0 0 16px;">
            Thank you for booking a <strong>${serviceType}</strong> consultation with Vedic Saar.
            Your payment of <strong>₹500</strong> has been received successfully.
          </p>
          <p style="color:#3a2e1e;font-size:15px;line-height:1.8;margin:0 0 24px;">
            Pt. Manish Malhotra will personally review your details and reach out to you shortly
            to schedule your session at a time that suits you.
          </p>
          <div style="background:#f5ede0;border-left:3px solid #b8860b;padding:14px 18px;margin-bottom:24px;">
            <p style="margin:0;font-size:12px;color:#6b5d45;line-height:1.7;">
              For any queries, visit <a href="https://vedicsaar.com" style="color:#b8860b;">vedicsaar.com</a>
            </p>
          </div>
          <p style="color:#9a8c7a;font-size:13px;line-height:1.7;margin:0;">
            With cosmic blessings,<br/>
            <strong style="color:#1a1206;">Pt. Manish Malhotra</strong><br/>
            Vedic Saar
          </p>
        </div>
        <div style="background:#f5ede0;padding:14px 32px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9a8c7a;">Vedic Saar · vedicsaar.com</p>
        </div>
      </div>`;

    // Send both emails in parallel
    const [adminRes, userRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: "Vedic Saar <onboarding@resend.dev>",
          to: [OWNER_EMAIL],
          subject: `New Booking — ${serviceType} — ${name}`,
          html: adminHtml,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
        body: JSON.stringify({
          from: "Vedic Saar <onboarding@resend.dev>",
          to: [email],
          subject: "Your Consultation is Booked — Vedic Saar",
          html: userHtml,
        }),
      }),
    ]);

    if (!adminRes.ok) {
      const d = await adminRes.json();
      throw new Error(d.message ?? "Admin email failed");
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: (err as Error).message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
