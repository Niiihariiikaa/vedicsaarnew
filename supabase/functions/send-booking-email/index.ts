import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_KEY   = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "niharikaakashyap@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, dob, tob, pob, serviceType, otherDesc } = await req.json();

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const row = (label: string, value: string) =>
      value
        ? `<tr>
            <td style="padding:8px 0;color:#9a8060;width:150px;vertical-align:top;">${label}</td>
            <td style="padding:8px 0;color:#1a1206;">${value}</td>
           </tr>`
        : "";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#fdf9f3;border:1px solid #e8d8b0;">
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#b8860b;">VedicSaar</p>
        <h2 style="margin:0 0 20px;color:#1a1206;border-bottom:1px solid #e8d8b0;padding-bottom:14px;">
          New Booking Request
        </h2>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Name",          name)}
          ${row("Email",         email)}
          ${row("Phone",         phone)}
          ${row("Service",       serviceType)}
          ${row("Date of Birth", dob)}
          ${row("Time of Birth", tob)}
          ${row("Place of Birth",pob)}
          ${row("Details",       otherDesc)}
        </table>
        <p style="margin-top:24px;padding-top:14px;border-top:1px solid #e8d8b0;color:#b8a882;font-size:11px;">
          Submitted ${submittedAt} IST
        </p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: "VedicSaar Bookings <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: `New Booking: ${serviceType} — ${name}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Resend error");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
