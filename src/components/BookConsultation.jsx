import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM',
];

const services = [
  'Birth Chart Reading',
  'Gemstone Recommendation',
  'Career & Finance',
  'Love & Marriage',
  'Vastu Consultation',
  'Health Reading',
  'Foreign Travel',
  'Annual Horoscope',
];

export default function BookConsultation({ onClose, preselectedGem = '' }) {
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);
  const [step, setStep]       = useState(1); // 1=details, 2=confirm, 3=success
  const [selected, setSelected] = useState({
    name: '', email: '', phone: '', dob: '', tob: '', pob: '',
    service: preselectedGem ? 'Gemstone Recommendation' : '',
    date: '', slot: '', notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(panelRef.current,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.2)' }
    );
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
    gsap.to(panelRef.current, { y: 30, opacity: 0, duration: 0.25, onComplete: onClose });
  };

  const validate = () => {
    const e = {};
    if (!selected.name.trim())  e.name  = 'Required';
    if (!selected.email.trim()) e.email = 'Required';
    if (!selected.phone.trim()) e.phone = 'Required';
    if (!selected.dob.trim())   e.dob   = 'Required';
    if (!selected.service)      e.service = 'Please select a service';
    if (!selected.date)         e.date  = 'Required';
    if (!selected.slot)         e.slot  = 'Please pick a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(2); };
  const handleConfirm = () => setStep(3);

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div className="flex flex-col gap-1">
      <label style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a8060' }}>
        {label}
      </label>
      <input
        type={type}
        value={selected[field]}
        onChange={e => setSelected(p => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: errors[field] ? '1px solid #c0392b' : '1px solid rgba(184,134,11,0.25)',
          borderRadius: 2,
          padding: '10px 14px',
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 15,
          color: '#1a1206',
          outline: 'none',
          width: '100%',
        }}
      />
      {errors[field] && <span style={{ fontSize: 11, color: '#c0392b', fontFamily: "'Jost',sans-serif" }}>{errors[field]}</span>}
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,6,2,0.82)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === overlayRef.current && close()}
    >
      <div
        ref={panelRef}
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 640,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#fdf8f0',
          borderRadius: 4,
          border: '1px solid rgba(184,134,11,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-8 py-5"
          style={{ background: '#1a1206', borderBottom: '1px solid rgba(184,134,11,0.2)' }}
        >
          <div>
            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 3 }}>
              Vedic Saar
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: '#f5ede0', lineHeight: 1 }}>
              Book a Consultation
            </h2>
          </div>
          <button onClick={close} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#f5ede0', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-8 py-4" style={{ borderBottom: '1px solid rgba(184,134,11,0.12)' }}>
          {['Your Details', 'Review', 'Confirmed'].map((s, i) => (
            <div key={s} className="flex items-center gap-0 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 26, height: 26,
                    background: step > i + 1 ? '#b8860b' : step === i + 1 ? '#1a1206' : 'transparent',
                    border: step >= i + 1 ? 'none' : '1px solid rgba(184,134,11,0.3)',
                    transition: 'all 0.3s',
                  }}
                >
                  <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, color: step >= i + 1 ? '#f5ede0' : '#9a8060' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </span>
                </div>
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: step === i + 1 ? '#1a1206' : '#9a8060' }}>
                  {s}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: 'rgba(184,134,11,0.2)', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Details ── */}
        {step === 1 && (
          <div className="px-8 py-6 flex flex-col gap-5">
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#9a7b6a', marginBottom: 4 }}>
              Please fill in your details so our astrologer can prepare a personalized reading for you.
            </p>

            {/* Personal info */}
            <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#b8860b', paddingBottom: 6, borderBottom: '1px solid rgba(184,134,11,0.15)' }}>
              Personal Information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" field="name" placeholder="Your full name" />
              <Field label="Email *" field="email" type="email" placeholder="your@email.com" />
              <Field label="Phone *" field="phone" placeholder="+91 00000 00000" />
              <Field label="Date of Birth *" field="dob" type="date" />
              <Field label="Time of Birth" field="tob" placeholder="e.g. 10:30 AM" />
              <Field label="Place of Birth" field="pob" placeholder="City, Country" />
            </div>

            {/* Service */}
            <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#b8860b', paddingBottom: 6, borderBottom: '1px solid rgba(184,134,11,0.15)', marginTop: 4 }}>
              Service & Schedule
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a8060' }}>Select Service *</label>
              <select
                value={selected.service}
                onChange={e => setSelected(p => ({ ...p, service: e.target.value }))}
                style={{ background: 'rgba(255,255,255,0.7)', border: errors.service ? '1px solid #c0392b' : '1px solid rgba(184,134,11,0.25)', borderRadius: 2, padding: '10px 14px', fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#1a1206', outline: 'none', width: '100%' }}
              >
                <option value="">Choose a service...</option>
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.service && <span style={{ fontSize: 11, color: '#c0392b', fontFamily: "'Jost',sans-serif" }}>{errors.service}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a8060' }}>Preferred Date *</label>
                <input
                  type="date"
                  value={selected.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelected(p => ({ ...p, date: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.7)', border: errors.date ? '1px solid #c0392b' : '1px solid rgba(184,134,11,0.25)', borderRadius: 2, padding: '10px 14px', fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#1a1206', outline: 'none' }}
                />
                {errors.date && <span style={{ fontSize: 11, color: '#c0392b', fontFamily: "'Jost',sans-serif" }}>{errors.date}</span>}
              </div>
            </div>

            {/* Time slots */}
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a8060' }}>Time Slot *</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelected(p => ({ ...p, slot }))}
                    style={{
                      padding: '8px 16px',
                      fontFamily: "'Jost',sans-serif",
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      background: selected.slot === slot ? '#1a1206' : 'rgba(255,255,255,0.7)',
                      color: selected.slot === slot ? '#f5ede0' : '#6b5a40',
                      border: selected.slot === slot ? '1px solid #1a1206' : '1px solid rgba(184,134,11,0.25)',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.slot && <span style={{ fontSize: 11, color: '#c0392b', fontFamily: "'Jost',sans-serif" }}>{errors.slot}</span>}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a8060' }}>Additional Notes</label>
              <textarea
                value={selected.notes}
                onChange={e => setSelected(p => ({ ...p, notes: e.target.value }))}
                placeholder="Any specific questions or concerns..."
                rows={3}
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(184,134,11,0.25)', borderRadius: 2, padding: '10px 14px', fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#1a1206', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button
              onClick={handleNext}
              className="hover:opacity-90 transition-opacity"
              style={{ background: '#1a1206', color: '#f5ede0', fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '15px', border: 'none', cursor: 'pointer', marginTop: 4 }}
            >
              Continue to Review →
            </button>
          </div>
        )}

        {/* ── STEP 2: Review ── */}
        {step === 2 && (
          <div className="px-8 py-6 flex flex-col gap-5">
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#9a7b6a' }}>
              Please review your details before confirming.
            </p>

            {[
              { label: 'Name', value: selected.name },
              { label: 'Email', value: selected.email },
              { label: 'Phone', value: selected.phone },
              { label: 'Date of Birth', value: selected.dob },
              { label: 'Time of Birth', value: selected.tob || '—' },
              { label: 'Place of Birth', value: selected.pob || '—' },
              { label: 'Service', value: selected.service },
              { label: 'Date', value: selected.date },
              { label: 'Time Slot', value: selected.slot },
              { label: 'Notes', value: selected.notes || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start" style={{ borderBottom: '1px solid rgba(184,134,11,0.1)', paddingBottom: 10 }}>
                <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a8060' }}>{label}</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#1a1206', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}

            {/* Fee note */}
            <div style={{ background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 2, padding: '14px 18px' }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: '#6b5a40', lineHeight: 1.7 }}>
                ✦ Consultation fee: <strong>₹1,500 / $20</strong><br />
                Payment will be collected after confirmation via UPI / Card / PayPal.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', color: '#9a8060', fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px', border: '1px solid rgba(184,134,11,0.3)', cursor: 'pointer' }}>
                ← Edit
              </button>
              <button onClick={handleConfirm} className="hover:opacity-90 transition-opacity" style={{ flex: 2, background: '#b8860b', color: '#1a1206', fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Confirm Booking ✦
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="px-8 py-14 flex flex-col items-center text-center gap-5">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, background: '#1a1206', border: '2px solid rgba(184,134,11,0.4)' }}
            >
              <span style={{ fontSize: 28, color: '#b8860b' }}>✦</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: '#1a1206', lineHeight: 1.1 }}>
              Booking Confirmed!
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: '#6b5a40', lineHeight: 1.8, maxWidth: 380 }}>
              Thank you, <strong>{selected.name}</strong>. Your consultation has been booked for <strong>{selected.date}</strong> at <strong>{selected.slot}</strong>. A confirmation has been sent to <strong>{selected.email}</strong>.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: '#9a7b6a' }}>
              Our astrologer will reach out within 24 hours to finalize payment and session details.
            </p>
            <button onClick={close} style={{ background: '#1a1206', color: '#f5ede0', fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}