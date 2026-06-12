export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, phone, dob, tob, pob, serviceType, otherDesc, paymentId } = req.body;

  try {
    await Promise.all([
      sendEmail({
        to: 'niharikaakashyap@gmail.com',
        subject: `New Booking: ${serviceType} — ${name}`,
        html: adminHtml({ name, email, phone, dob, tob, pob, serviceType, otherDesc, paymentId }),
      }),
      sendEmail({
        to: email,
        subject: 'Your Consultation is Booked — Vedic Saar',
        html: userHtml({ name, serviceType }),
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function sendEmail({ to, subject, html }) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Vedic Saar <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  });
  if (!r.ok) {
    const d = await r.json();
    throw new Error(d.message || 'Email failed');
  }
}

function adminHtml({ name, email, phone, dob, tob, pob, serviceType, otherDesc, paymentId }) {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #e8d9b5;border-radius:4px;overflow:hidden;">
    <div style="background:#1a1206;padding:28px 36px;">
      <p style="margin:0;font-family:'Arial',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8860b;">Vedic Saar</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#f5ede0;font-weight:400;">New Booking Received</h1>
    </div>
    <div style="padding:32px 36px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:10px 0;color:#9a8c7a;width:140px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Name</td><td style="padding:10px 0;color:#1a1206;font-weight:600;">${name}</td></tr>
        <tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Email</td><td style="padding:10px 0;color:#1a1206;">${email}</td></tr>
        <tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Phone</td><td style="padding:10px 0;color:#1a1206;">${phone}</td></tr>
        <tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Date of Birth</td><td style="padding:10px 0;color:#1a1206;">${dob}</td></tr>
        ${tob ? `<tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Time of Birth</td><td style="padding:10px 0;color:#1a1206;">${tob}</td></tr>` : ''}
        ${pob ? `<tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Place of Birth</td><td style="padding:10px 0;color:#1a1206;">${pob}</td></tr>` : ''}
        <tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Service</td><td style="padding:10px 0;color:#b8860b;font-weight:600;">${serviceType}</td></tr>
        ${otherDesc ? `<tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Details</td><td style="padding:10px 0;color:#1a1206;">${otherDesc}</td></tr>` : ''}
        <tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Payment ID</td><td style="padding:10px 0;color:#2a7a2a;font-weight:600;">✓ ${paymentId}</td></tr>
        <tr style="border-top:1px solid #f0e8d8;"><td style="padding:10px 0;color:#9a8c7a;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Amount Paid</td><td style="padding:10px 0;color:#1a1206;font-weight:600;">₹500</td></tr>
      </table>
    </div>
    <div style="background:#f5ede0;padding:16px 36px;text-align:center;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9a8c7a;">Vedic Saar · vedicsaar.com</p>
    </div>
  </div>`;
}

function userHtml({ name, serviceType }) {
  const firstName = name.split(' ')[0];
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#fffdf7;border:1px solid #e8d9b5;border-radius:4px;overflow:hidden;">
    <div style="background:#1a1206;padding:28px 36px;">
      <p style="margin:0;font-family:'Arial',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8860b;">Vedic Saar</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#f5ede0;font-weight:400;">Booking Confirmed</h1>
    </div>
    <div style="padding:36px;">
      <p style="color:#1a1206;font-size:16px;line-height:1.7;margin:0 0 20px;">Dear ${firstName},</p>
      <p style="color:#3a2e1e;font-size:15px;line-height:1.8;margin:0 0 20px;">
        Thank you for booking a <strong>${serviceType}</strong> consultation with Vedic Saar. Your payment of <strong>₹500</strong> has been received successfully.
      </p>
      <p style="color:#3a2e1e;font-size:15px;line-height:1.8;margin:0 0 28px;">
        Pt. Manish Malhotra will personally review your details and reach out to you shortly to schedule your session at a time that suits you.
      </p>
      <div style="background:#f5ede0;border-left:3px solid #b8860b;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6b5d45;line-height:1.7;">
          If you have any questions in the meantime, you can reach us at <a href="mailto:vedicsaar@gmail.com" style="color:#b8860b;">vedicsaar@gmail.com</a>
        </p>
      </div>
      <p style="color:#9a8c7a;font-size:13px;line-height:1.7;margin:0;">
        With cosmic blessings,<br/>
        <strong style="color:#1a1206;">Pt. Manish Malhotra</strong><br/>
        Vedic Saar
      </p>
    </div>
    <div style="background:#f5ede0;padding:16px 36px;text-align:center;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#9a8c7a;">Vedic Saar · vedicsaar.com</p>
    </div>
  </div>`;
}
