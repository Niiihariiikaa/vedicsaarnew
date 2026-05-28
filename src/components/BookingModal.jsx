import { useState, useEffect, useRef } from "react";

const SERVICES = [
  {
    group: "Specialties",
    items: [
      "Numerology",
      "Vastu",
      "Vedic Astrology",
      "Birth Time Rectification",
      "Love Compatibility Check",
      "Gemstone Recommendation",
      "Mantra Guide",
    ],
  },
  {
    group: "Life Areas",
    items: [
      "Love & Marriage",
      "Business & Career",
      "Wealth & Finance",
      "Education",
      "Health (Medical Astrology)",
      "Progeny & Children",
      "House & Property",
      "Litigation (Court Matters)",
      "Relationship & Compatibility",
      "Investment Astrology (Stock Market / Real Estate)",
      "Foreign Travel",
      "Love & Romance",
    ],
  },
  {
    group: "Other",
    items: ["Other (specify below)"],
  },
];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function BookingModal({ isOpen, onClose, preselectedService = "" }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    serviceType: preselectedService,
    otherDesc: "",
  });

  useEffect(() => {
    if (preselectedService) setForm((f) => ({ ...f, serviceType: preselectedService }));
  }, [preselectedService]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(1);
      setError("");
      setForm({ name: "", email: "", phone: "", dob: "", tob: "", pob: "", serviceType: preselectedService, otherDesc: "" });
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) return "Please enter a valid phone number.";
    if (!form.dob) return "Please enter your date of birth.";
    if (!form.serviceType) return "Please select a topic of interest.";
    if (form.serviceType === "Other (specify below)" && !form.otherDesc.trim()) return "Please describe your specific concern.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-booking-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .bm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(10,7,2,0.75);
          display: flex; align-items: center; justify-content: center;
          padding: 20px; backdrop-filter: blur(3px);
        }
        .bm-modal {
          background: white; width: 100%; max-width: 500px;
          max-height: 90vh; overflow-y: auto; border-radius: 2px;
          position: relative;
          scrollbar-width: thin; scrollbar-color: rgba(184,134,11,0.25) transparent;
          border: 1px dashed rgba(184,134,11,1);
        }
        .bm-modal::-webkit-scrollbar { width: 3px; }
        .bm-modal::-webkit-scrollbar-thumb { background: rgba(184,134,11,0.25); }
        .bm-header {
          padding: 44px 44px 26px;
          border-bottom: 1px solid rgba(184,134,11,0.15);
          position: sticky; top: 0; background: white; z-index: 2;
        }
        .bm-close {
          position: absolute; top: 18px; right: 18px;
          background: none; border: none; cursor: pointer;
          color: #b8a882; padding: 6px; line-height: 1;
          transition: color 200ms;
        }
        .bm-close:hover { color: #1a1206; }
        .bm-eyebrow {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
          color: #b8860b; display: flex; align-items: center; gap: 10px;
          margin-bottom: 12px;
        }
        .bm-eyebrow::before, .bm-eyebrow::after {
          content: ''; display: block; width: 20px; height: 1px; background: #b8860b;
        }
        .bm-title {
          font-family: 'Ibarra Real Nova', serif;
          font-size: clamp(26px, 4vw, 34px); font-weight: 400;
          color: #1a1206; line-height: 1.1; margin: 0;
        }
        .bm-title em { color: #b8860b; font-style: italic; }
        .bm-body { padding: 34px 44px 44px; }
        .bm-field { margin-bottom: 20px; }
        .bm-label {
          display: block;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #9a8c7a; margin-bottom: 7px;
        }
        .bm-req { color: #b8860b; margin-left: 2px; }
        .bm-input, .bm-select {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 2px; padding: 13px 15px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 14px; color: #1a1206; outline: none;
          transition: border-color 220ms, background 220ms;
          appearance: none; -webkit-appearance: none;
        }
        .bm-input:focus, .bm-select:focus {
          border-color: #b8860b; background: #fff;
          box-shadow: 0 0 0 3px rgba(184,134,11,0.08);
        }
        .bm-input::placeholder { color: #c5b8a5; }
        .bm-input[type="date"] { color: #1a1206; }
        .bm-select {
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8860b' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 15px center;
          padding-right: 38px; cursor: pointer;
        }
        .bm-select option { color: #1a1206; background: #faf6ef; }
        .bm-select optgroup { color: #b8860b; font-size: 11px; }
        .bm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .bm-divider { height: 1px; background: rgba(184,134,11,0.12); margin: 26px 0; }
        .bm-error {
          background: rgba(160,40,20,0.06); border: 1px solid rgba(160,40,20,0.18);
          border-radius: 2px; padding: 10px 14px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 13px; color: #8b2012; margin-bottom: 18px;
          display: flex; align-items: center; gap: 8px;
        }
        .bm-submit {
          width: 100%; padding: 16px; background: #1a1206;
          border: 1px dashed white; border-radius: 2px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
          color: #f5ede0; cursor: pointer;
          transition: background 250ms; margin-top: 4px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .bm-submit:hover:not(:disabled) { background: #b8860b; }
        .bm-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .bm-spinner {
          width: 13px; height: 13px;
          border: 1.5px solid rgba(245,237,224,0.25);
          border-top-color: #f5ede0; border-radius: 50%;
          animation: bm-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes bm-spin { to { transform: rotate(360deg); } }
        .bm-success { padding: 64px 44px; text-align: center; }
        .bm-success-ring {
          width: 60px; height: 60px;
          border: 1px solid rgba(184,134,11,0.35); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 22px; color: #b8860b;
        }
        .bm-success-title {
          font-family: 'Ibarra Real Nova', serif;
          font-size: 28px; font-weight: 400; color: #1a1206; margin-bottom: 14px;
        }
        .bm-success-text {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 14px; color: #6b5d45; line-height: 1.75; margin-bottom: 34px;
        }
        .bm-success-btn {
          background: none; border: 1px solid rgba(184,134,11,0.35);
          border-radius: 2px; padding: 12px 36px;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #b8860b; cursor: pointer; transition: background 200ms;
        }
        .bm-success-btn:hover { background: rgba(184,134,11,0.06); }
        @media (max-width: 520px) {
          .bm-header, .bm-body { padding-left: 24px; padding-right: 24px; }
          .bm-row { grid-template-columns: 1fr; }
          .bm-success { padding: 44px 24px; }
        }
      `}</style>

      <div
        className="bm-overlay"
        ref={overlayRef}
        onClick={(e) => e.target === overlayRef.current && onClose()}
      >
        <div className="bm-modal" role="dialog" aria-modal="true">

          {step === 1 && (
            <>
              <div className="bm-header">
                <button className="bm-close" onClick={onClose} aria-label="Close">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <p className="bm-eyebrow">Begin Your Journey</p>
                <h2 className="bm-title">Book a Consultation</h2>
              </div>

              <div className="bm-body">
                <form onSubmit={handleSubmit} noValidate>

                  <div className="bm-field">
                    <label className="bm-label">Full Name <span className="bm-req">*</span></label>
                    <input className="bm-input" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" autoComplete="name" />
                  </div>

                  <div className="bm-row">
                    <div className="bm-field">
                      <label className="bm-label">Email <span className="bm-req">*</span></label>
                      <input className="bm-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                    </div>
                    <div className="bm-field">
                      <label className="bm-label">Phone <span className="bm-req">*</span></label>
                      <input className="bm-input" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" autoComplete="tel" />
                    </div>
                  </div>

                  <div className="bm-row">
                    <div className="bm-field">
                      <label className="bm-label">Date of Birth <span className="bm-req">*</span></label>
                      <input className="bm-input" name="dob" type="date" value={form.dob} onChange={handleChange} />
                    </div>
                    <div className="bm-field">
                      <label className="bm-label">Time of Birth</label>
                      <input className="bm-input" name="tob" type="time" value={form.tob} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="bm-field">
                    <label className="bm-label">Place of Birth</label>
                    <input className="bm-input" name="pob" value={form.pob} onChange={handleChange} placeholder="City, State, Country" autoComplete="off" />
                  </div>

                  <div className="bm-divider" />

                  <div className="bm-field">
                    <label className="bm-label">Topic of Interest <span className="bm-req">*</span></label>
                    <select className="bm-select" name="serviceType" value={form.serviceType} onChange={handleChange}>
                      <option value="">— Select a topic —</option>
                      {SERVICES.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.items.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {form.serviceType === "Other (specify below)" && (
                    <div className="bm-field">
                      <label className="bm-label">Describe Your Concern <span className="bm-req">*</span></label>
                      <textarea
                        className="bm-input"
                        name="otherDesc"
                        value={form.otherDesc}
                        onChange={handleChange}
                        placeholder="Briefly describe what you'd like guidance on..."
                        rows={3}
                        style={{ resize: "vertical", minHeight: 80, fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14 }}
                      />
                    </div>
                  )}

                  {error && (
                    <div className="bm-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{flexShrink:0}}>
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {error}
                    </div>
                  )}

                  <button className="bm-submit" type="submit" disabled={loading}>
                    {loading
                      ? <><span className="bm-spinner" /> Sending...</>
                      : "Request Consultation"
                    }
                  </button>

                </form>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="bm-success">
              <div className="bm-success-ring">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="bm-success-title">Request Received</h2>
              <p className="bm-success-text">
                Thank you, {form.name.split(" ")[0]}.<br />
                We'll be in touch with you soon.
              </p>
              <button className="bm-success-btn" onClick={onClose}>Close</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}