// server/routes/bookings.js
// Install dependencies: npm install express mongoose nodemailer dotenv

import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const router = express.Router();

// ─────────────────────────────────────────
// MONGOOSE SCHEMA
// ─────────────────────────────────────────
const bookingSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    dob:         { type: String, default: "" },
    birthTime:   { type: String, default: "" },
    birthPlace:  { type: String, default: "" },
    serviceType: { type: String, required: true },
    message:     { type: String, default: "" },
    status:      { type: String, enum: ["pending", "confirmed", "completed"], default: "pending" },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// ─────────────────────────────────────────
// NODEMAILER TRANSPORTER
// ─────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",  // or "zoho", "outlook", etc.
  auth: {
    user: process.env.EMAIL_FROM,    // your Gmail address
    pass: process.env.EMAIL_PASS,    // Gmail App Password (NOT your login password)
  },
});

// ─────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────
function ownerEmailHTML(booking) {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1206;">
      <div style="border-bottom: 2px solid #b8860b; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-weight: 400; color: #b8860b;">New Consultation Request</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.8;">
        <tr><td style="color: #6b5d45; width: 150px; padding: 6px 0;">Name</td><td><strong>${booking.name}</strong></td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Phone</td><td>${booking.phone}</td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Email</td><td>${booking.email}</td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Service</td><td><strong style="color: #b8860b;">${booking.serviceType}</strong></td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Date of Birth</td><td>${booking.dob || "—"}</td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Birth Time</td><td>${booking.birthTime || "—"}</td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Birth Place</td><td>${booking.birthPlace || "—"}</td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0; vertical-align: top;">Message</td><td>${booking.message || "—"}</td></tr>
        <tr><td style="color: #6b5d45; padding: 6px 0;">Received</td><td>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
      </table>
    </div>
  `;
}

function clientEmailHTML(name, service) {
  return `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1206;">
      <div style="border-bottom: 2px solid #b8860b; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="margin: 0; font-weight: 400; color: #b8860b;">Your Request Has Been Received</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.8;">Dear <strong>${name}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.8; color: #4a3f2f;">
        Thank you for reaching out. We have received your consultation request for
        <strong style="color: #b8860b;">${service}</strong> and will be in touch within 24 hours to confirm your appointment.
      </p>
      <p style="font-size: 14px; line-height: 1.8; color: #4a3f2f;">
        If you have any urgent questions, please reply to this email.
      </p>
      <p style="font-size: 14px; color: #6b5d45; margin-top: 32px;">
        With cosmic blessings,<br/>
        <strong>${process.env.ASTROLOGER_NAME || "Your Astrologer"}</strong>
      </p>
    </div>
  `;
}

// ─────────────────────────────────────────
// POST /api/bookings
// ─────────────────────────────────────────
router.post("/", async (req, res) => {
  const { name, phone, email, dob, birthTime, birthPlace, serviceType, message } = req.body;

  // Basic server-side validation
  if (!name || !phone || !email || !serviceType) {
    return res.status(400).json({ message: "Name, phone, email and service are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
    // 1. Save to MongoDB
    const booking = await Booking.create({ name, phone, email, dob, birthTime, birthPlace, serviceType, message });

    // 2. Email to YOU (the astrologer)
    await transporter.sendMail({
      from: `"${process.env.ASTROLOGER_NAME || "Booking System"}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,   // your personal/business email
      subject: `✨ New Consultation Request — ${serviceType} — ${name}`,
      html: ownerEmailHTML(booking),
    });

    // 3. Confirmation email to CLIENT
    await transporter.sendMail({
      from: `"${process.env.ASTROLOGER_NAME || "Booking System"}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Your Consultation Request — ${serviceType}`,
      html: clientEmailHTML(name, serviceType),
    });

    return res.status(201).json({ success: true, bookingId: booking._id });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// GET /api/bookings  (optional — for your admin panel)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(100);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;