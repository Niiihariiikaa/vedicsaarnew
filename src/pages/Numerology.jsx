import { useState, useEffect, useRef } from "react";
import SplashCursor from "../components/SplashCursor";
import CircularGallery from "../components/CircularGallery";
import { useBooking } from "../components/BookingContext";


/* ── Scroll Manager ─────────────────────────────────────────────────────────── */
let _scrollY = 0;
let _ticking = false;
let _scrollInitialized = false;
const _listeners = new Set();

function subscribeScroll(fn) {
  if (!_scrollInitialized && typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      _scrollY = window.scrollY;
      if (!_ticking) {
        requestAnimationFrame(() => { _listeners.forEach(f => f(_scrollY)); _ticking = false; });
        _ticking = true;
      }
    }, { passive: true });
    _scrollInitialized = true;
  }
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

const gold = "#c9a96e";
const dark = "#1a1410";
const HEADING_SIZE = "clamp(36px,3.8vw,52px)";

const dashedBtn = (color = dark) => ({
  background: "transparent",
  color,
  border: `2px dashed ${color}`,
  fontSize: 12,
  letterSpacing: 2,
  padding: "15px 44px",
  cursor: "pointer",
  textTransform: "uppercase",
  fontFamily: "'Glacial Indifference', sans-serif",
  fontWeight: 500,
  transition: "all 0.3s",
  whiteSpace: "nowrap",
});

const tilt = {
  onMouseEnter(e) { const el = e.currentTarget; el.style.willChange = "transform"; el._tiltRect = el.getBoundingClientRect(); },
  onMouseMove(e) {
    const el = e.currentTarget;
    const r  = el._tiltRect || el.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${y * -12}deg) scale3d(1.025,1.025,1.025)`;
  },
  onMouseLeave(e) {
    const el = e.currentTarget;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    el.style.willChange = "auto"; el._tiltRect = null;
  },
};

function useReveal(ref) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("vis"); obs.unobserve(en.target); } }),
      { threshold: 0.08, rootMargin: "-10px" }
    );
    c.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── GLOBAL CSS ─────────────────────────────────────────────────────────────── */
const globalCss = `
  * { margin:0; padding:0; box-sizing:border-box; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
  body { background:#fff; color:#1a1410; }
  html { scroll-behavior:smooth; }

  @keyframes twinkle  { from { opacity:0.05; } to { opacity:0.6; } }
  @keyframes floatUp  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spinSlow { to { transform:rotate(360deg); } }
  @keyframes drift    { 0%{transform:translateY(0px);} 50%{transform:translateY(-12px);} 100%{transform:translateY(0px);} }

  .rv { opacity:0; transform:translateY(28px); transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:translateY(0); }
  .card-3d { transform-style:preserve-3d; transition:transform 0.15s ease,box-shadow 0.2s ease; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  .why-card { animation:fadeUp 0.6s ease both; transform-style:preserve-3d; }
  .why-card:nth-child(1) { animation-delay:0.1s; }
  .why-card:nth-child(2) { animation-delay:0.22s; }
  .why-card:nth-child(3) { animation-delay:0.34s; }
  .why-card:hover { border-color:${gold} !important; box-shadow:0 20px 50px rgba(201,169,110,0.16) !important; }

  .benefit-row { display:flex; gap:14px; align-items:flex-start; padding:12px 16px; background:rgba(255,255,255,0.5); border:0.5px solid rgba(201,169,110,0.14); transition:background 0.2s,border-color 0.2s; cursor:default; }
  .benefit-row:hover { background:#fff; border-color:rgba(201,169,110,0.5); }

  .step-row { display:flex; gap:20px; align-items:flex-start; padding:26px 0; border-bottom:1px solid rgba(26,20,16,0.07); transition:padding-left 0.2s; cursor:default; }
  .step-row:hover { padding-left:10px; }
  .step-num { width:44px; height:44px; border:1px solid rgba(201,169,110,0.5); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Ibarra Real Nova',serif; font-size:13px; color:${gold}; background:rgba(201,169,110,0.06); flex-shrink:0; margin-top:3px; transition:background 0.3s,color 0.3s,box-shadow 0.3s; }
  .step-row:hover .step-num { background:${gold}; color:#fff; box-shadow:0 0 0 5px rgba(201,169,110,0.15); }

  .num-row { display:flex; gap:32px; align-items:flex-start; padding:32px 0; border-bottom:1px solid rgba(201,169,110,0.15); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1),background 0.2s; cursor:default; }
  .num-row:first-child { border-top:1px solid rgba(201,169,110,0.15); }
  .num-row:hover { padding-left:12px; }
  .num-glyph { width:64px; height:64px; border:1px solid rgba(201,169,110,0.35); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; background:rgba(201,169,110,0.05); flex-shrink:0; margin-top:4px; transition:background 0.3s,border-color 0.3s,box-shadow 0.3s; }
  .num-row:hover .num-glyph { background:rgba(201,169,110,0.12); border-color:${gold}; box-shadow:0 0 0 5px rgba(201,169,110,0.1); }

  .who-row { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid rgba(26,20,16,0.1); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1); cursor:default; }
  .who-row:hover { padding-left:10px; }

  .acc-item { border-bottom:1px solid rgba(26,20,16,0.1); }
  .acc-btn  { width:100%; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:12px; padding:15px 0; text-align:left; }
  .acc-arrow { font-size:20px; color:${gold}; transition:transform 0.3s; flex-shrink:0; line-height:1; }
  .acc-arrow.open { transform:rotate(90deg); }
  .acc-body { overflow:hidden; transition:max-height 0.35s cubic-bezier(.22,1,.36,1),opacity 0.35s; }

  .strip-row { display:flex; gap:48px; white-space:nowrap; align-items:center; padding:0 40px; will-change:transform; min-width:300vw; height:68px; }
  .strip-row span { font-family:'Ibarra Real Nova',serif; font-size:30px; }

  /* ── Tarot Fan Cards ── */
  .tarot-fan-wrap {
    position: relative;
    width: 100%;
    height: 600px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    perspective: 1400px;
  }

  .tarot-card-slot {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 205px;
    height: 390px;
    transform-origin: bottom center;
    cursor: pointer;
    transition: transform 0.5s cubic-bezier(.22,1,.36,1), z-index 0s;
  }

  .tarot-card-inner {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.65s cubic-bezier(.22,1,.36,1);
    position: relative;
  }

  .tarot-card-slot.hovered .tarot-card-inner {
    transform: rotateY(180deg);
  }

  .tarot-face {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
  }

  .tarot-back-face {
    transform: rotateY(180deg);
  }

  .tarot-card-slot.hovered {
    z-index: 30 !important;
  }
  .num-fan-desktop { display: block; }
  .num-grid-mobile  { display: none; }
  @media (max-width: 1024px) {
    .hero-section { background-position: top center !important; }
    .hero-inner { transform: translateY(-20px) !important; margin-bottom: -60px !important; }
    .num-fan-desktop { display: none !important; }
    .num-grid-mobile { display: grid !important; }
    .num-what-sec { padding: 80px 40px !important; }
    .num-flip-header { padding: 60px 40px 0 !important; }
  }
  @media (max-width: 768px) {
    .mobile-col-1 { grid-template-columns: 1fr !important; }
    section { padding-left: max(20px, 4vw) !important; padding-right: max(20px, 4vw) !important; }
    .num-fan-desktop { display: none !important; }
    .num-grid-mobile  { display: grid !important; }
    .hero-section { padding-top: 100px !important; background-position: top center !important; }
    .hero-inner { transform: translateY(-20px) !important; margin-bottom: -60px !important; }
    .cta-inner-pad { padding: 60px 20px 60px !important; }
  }
`;

/* ── Accordion ───────────────────────────────────────────────────────────────── */
function AccItem({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acc-item">
      <button className="acc-btn" onClick={() => setOpen(o => !o)}>
        <span className={`acc-arrow${open ? " open" : ""}`}>›</span>
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: dark, letterSpacing: 0.4 }}>{title}</span>
      </button>
      <div className="acc-body" style={{ maxHeight: open ? 140 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: "#7a6e68", lineHeight: 1.75, paddingBottom: 14, paddingLeft: 32 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── HERO ────────────────────────────────────────────────────────────────────── */
function Hero() {
  const crystalRef = useRef(null);
  const moonRef    = useRef(null);
  const { openBooking } = useBooking();
  useEffect(() => {
    return subscribeScroll((y) => {
      if (y > window.innerHeight * 1.5) return;
      if (crystalRef.current) crystalRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
      if (moonRef.current)    moonRef.current.style.transform    = `translate3d(0, ${y * 0.18}px, 0)`;
    });
  }, []);

  return (
    <section className="hero-section" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      textAlign: "center", background: "white",
      backgroundImage: 'url("/assets/vedicbg.svg")', backgroundSize: "cover",
      overflow: "visible", padding: "160px 40px 80px",
    }}>
      <div ref={crystalRef} className="hero-decor" style={{ position: "absolute", left: "-40px", bottom: "60px", width: 320, height: 420, transform: "translate3d(0,0,0)", willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: "none", zIndex: 40, opacity: 0.85 }}>
        <img src="/assets/beigecrystal.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div ref={moonRef} className="hero-decor" style={{ position: "absolute", right: "-20px", top: "90px", width: 200, height: 300, transform: "translate3d(0,0,0)", willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: "none", zIndex: 1, opacity: 0.80 }}>
        <img src="/assets/moon.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 700, marginBottom: -180, transform: "translateY(-80px)" }}>
        <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontWeight: 450, display: "inline-block", fontSize: "clamp(32px, 9vw, 70px)", color: "black", padding: "6px 20px", marginBottom: "clamp(40px, 10vw, 137px)", animation: "floatUp 0.8s ease forwards" }}>
          Numerology
        </div>

        <h1 style={{ marginTop: 80, fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, lineHeight: 1.15, color: "black", marginBottom: 40, animation: "floatUp 0.8s 0.2s ease both" }}>
          Discover the Hidden Power of Numbers —<br />
          <em style={{ color: gold, fontStyle: "italic" }}>Your Life's Blueprint Awaits</em>
        </h1>
        <p style={{ fontSize: 20, color: "#9b8fa0", lineHeight: 1.8, marginBottom: 10, fontFamily: "'Glacial Indifference', sans-serif", animation: "floatUp 0.8s 0.4s ease both" }}>
          At Vedic Saar, we believe your destiny isn't random. It's written in numbers.
        </p>
        <p style={{ fontSize: 20, color: gold, fontStyle: "italic", marginBottom: 44, fontFamily: "'Ibarra Real Nova', serif", animation: "floatUp 0.8s 0.5s ease both" }}>
          Every number carries a cosmic frequency that shapes your relationships, career, health, and wealth.
        </p>
                  <button
              onClick={() => openBooking("Numerology")}
              style={{ ...dashedBtn(dark), border: "1px dashed " + dark }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Numerology Consultation
            </button>
      </div>
    </section>
  );
}

/* ── CONSTELLATION OVERLAY ──────────────────────────────────────────────────── */
function ConstellationOverlay() {
  return (
    <div style={{ position: "relative", height: "0px", zIndex: 20 }}>
      <img src="/assets/costelation.png" alt="" loading="lazy" decoding="async" className="constellation-img" style={{ position: "absolute", top: "-120px", left: "70%", transform: "translateX(-50%)", width: "600px", opacity: 0.5, pointerEvents: "none" }} />
    </div>
  );
}

/* ── SLIDING STRIP ───────────────────────────────────────────────────────────── */
function SlidingStrip() {
  const topRowRef = useRef(null);
  const botRowRef = useRef(null);
  useEffect(() => {
    return subscribeScroll((y) => {
      if (topRowRef.current) topRowRef.current.style.transform = `translateX(-${y * 0.2}px)`;
      if (botRowRef.current) botRowRef.current.style.transform = `translateX(calc(-700px + ${y * 0.2}px))`;
    });
  }, []);

  const top = ["✦ Birth Number", "✦ Life Path Number", "✦ Name Number", "✦ Mobile Number", "✦ House Number", "✦ Expression Number", "✦ Soul Urge", "✦ Karmic Debt"];
  const bot = ["✶ Name Correction", "✶ Lucky Dates", "✶ Personal Year", "✶ Business Name", "✶ Compatibility", "✶ Favorable Timing", "✶ Master Numbers", "✶ Yearly Forecast"];
  const topRow = [...top,...top,...top,...top,...top];
  const botRow = [...bot,...bot,...bot,...bot,...bot];
  const fadeEdge = "linear-gradient(90deg, transparent 0%, black 7%, black 93%, transparent 100%)";

  return (
    <div style={{ overflow: "hidden", position: "relative" }}>
      <div style={{ position: "relative", background: "#f0e8dc", borderTop: "1px solid rgba(201,169,110,0.2)", borderBottom: "1px solid rgba(201,169,110,0.15)", WebkitMaskImage: fadeEdge, maskImage: fadeEdge }}>
        <div ref={topRowRef} className="strip-row" style={{ color: "#2a1f1a" }}>
          {topRow.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <div style={{ position: "relative", background: "#111111", borderBottom: "1px solid rgba(201,169,110,0.12)", WebkitMaskImage: fadeEdge, maskImage: fadeEdge }}>
        <div ref={botRowRef} className="strip-row" style={{ color: "rgba(255,255,255,0.80)" }}>
          {botRow.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function WhatIsSection() {
  const sectionRef = useRef(null);
  const bodyRef    = useRef(null);
  const { openBooking } = useBooking();
  useReveal(bodyRef);

  return (
    <section
      ref={sectionRef}
      className="num-what-sec"
      style={{
        padding: "140px 80px",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)",
      }}
    >
      <div
        ref={bodyRef}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* TOP LABEL */}
        <div className="rv" style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28
        }}>
          <span style={{ width: 28, height: 1, background: gold }} />
          <span style={{
            fontFamily: "'Glacial Indifference', sans-serif",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: gold
          }}>
            Ancient Vedic Science
          </span>
        </div>

        {/* HEADING */}
        <h2 className="rv" style={{
          fontFamily: "'Ibarra Real Nova', serif",
          fontSize: HEADING_SIZE,
          fontWeight: 400,
          color: dark,
          lineHeight: 1.1,
          marginBottom: 16
        }}>
          What is Numerology?
        </h2>

        {/* SUBTITLE */}
        <p className="rv" style={{
          fontFamily: "'Ibarra Real Nova', serif",
          fontSize: 37,
          color: gold,
          fontStyle: "italic",
          marginBottom: 36
        }}>
          The Language of Numbers
        </p>

        {/* CONTENT */}
        <p className="rv" style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: 22,
          color: "#6b5f5e",
          lineHeight: 1.95,
          marginBottom: 20
        }}>
          Rooted in thousands of years of Indian wisdom, numerology is the study of the mystical relationship between numbers and the events that govern your life. Every letter in your name and every digit in your birth date carries a vibrational signature.
        </p>

        <p className="rv" style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: 22,
          color: "#6b5f5e",
          lineHeight: 1.95,
          marginBottom: 40
        }}>
          When decoded together, these vibrations reveal your personality, strengths, hidden challenges, and soul's true purpose — with remarkable precision.
        </p>

        {/* QUOTE BOX */}
        <div className="rv" style={{
          borderLeft: `3px solid ${gold}`,
          padding: "20px 26px",
          background: `${gold}0a`,
          marginBottom: 44
        }}>
          <p style={{
            fontFamily: "'Ibarra Real Nova', serif",
            fontSize: 20,
            color: "#7a6460",
            lineHeight: 1.85,
            fontStyle: "italic"
          }}>
            Every number around you — your name, birth date, phone number, house number — carries a cosmic frequency that shapes your entire life.
          </p>
        </div>

        {/* ACCORDION */}
        <div className="rv">
          <AccItem
            title="Birth & Life Path Numbers"
            body="Derived from your date of birth, these reveal your natural personality, life's overarching purpose, and why certain phases feel effortless while others feel like a struggle."
          />
          <AccItem
            title="Name & Mobile Number Vibration"
            body="Every alphabet carries a numerical value. A name or mobile number misaligned with your core numbers creates invisible resistance — even when you're doing everything right."
          />
        </div>

        {/* CTA */}
        <div className="rv" style={{ marginTop: 44 }}>
          <button
            onClick={() => openBooking("Numerology")}
            style={{ ...dashedBtn(dark), border: "1px dashed " + dark }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark; e.currentTarget.style.boxShadow = "none"; }}
          >
            Book Your Numerology Consultation
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── NUMBERS FAN SECTION ─────────────────────────────────────────────────────── */
function NumberFlipSection() {
  const ref    = useRef(null);
  const fanRef = useRef(null);
  const [hov, setHov] = useState(null);
  useReveal(ref);

  const RADIUS = 480;
  const ANGLES = [-55, -40, -28, -14, 0, 14, 28, 40, 55];

  // True pivot = where all cards' transformOrigin lives (RADIUS-20 px below container bottom)
  const PIVOT_OFFSET = RADIUS - 20; // = 460px below container bottom

  function handleFanMove(e) {
    const rect = fanRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pivotX = rect.left + rect.width / 2;
    const pivotY = rect.bottom + PIVOT_OFFSET;   // actual CSS transformOrigin Y
    const dx = e.clientX - pivotX;
    const dy = pivotY - e.clientY;               // always positive (pivot is below viewport)
    const dist = Math.hypot(dx, dy);
    // Cards span RADIUS to RADIUS+cardHeight (480–830 px) from pivot
    if (dist < RADIUS - 100 || dist > RADIUS + 420) { setHov(null); return; }
    const mouseAngle = Math.atan2(dx, dy) * (180 / Math.PI);
    let best = -1, bestDiff = Infinity;
    ANGLES.forEach((a, i) => { const d = Math.abs(a - mouseAngle); if (d < bestDiff) { bestDiff = d; best = i; } });
    // Edge cards get a wider outer zone (no neighbour beyond them)
    const threshold = (best === 0 || best === ANGLES.length - 1) ? 22 : 16;
    setHov(bestDiff < threshold ? best : null);
  }

  const numbers = [
    { num: 1, name: "The Leader",       traits: "Independent, ambitious, and driven.",         desc: "Number 1 represents leadership, confidence, and new beginnings. People influenced by this number are natural pioneers who like to take initiative and create their own path." },
    { num: 2, name: "The Peacemaker",   traits: "Sensitive, intuitive, and cooperative.",       desc: "Number 2 is all about harmony, relationships, and emotional intelligence. It represents balance and the ability to connect deeply with others." },
    { num: 3, name: "The Creative",     traits: "Expressive, joyful, and imaginative.",         desc: "Number 3 is linked with creativity, communication, and self-expression. It brings charm, optimism, and a natural ability to inspire others." },
    { num: 4, name: "The Builder",      traits: "Practical, disciplined, and hardworking.",     desc: "Number 4 stands for stability, structure, and strong foundations. It represents people who are reliable and focused on long-term success." },
    { num: 5, name: "The Explorer",     traits: "Adventurous, dynamic, and freedom-loving.",    desc: "Number 5 symbolizes change, movement, and curiosity. It thrives on new experiences and dislikes routine or restrictions." },
    { num: 6, name: "The Nurturer",     traits: "Caring, responsible, and compassionate.",      desc: "Number 6 is deeply connected to love, family, and responsibility. It represents those who naturally take care of others and seek harmony in their surroundings." },
    { num: 7, name: "The Seeker",       traits: "Spiritual, analytical, and introspective.",    desc: "Number 7 is associated with wisdom, inner growth, and deep thinking. It represents a search for truth and a strong connection to spirituality." },
    { num: 8, name: "The Achiever",     traits: "Powerful, ambitious, and success-oriented.",   desc: "Number 8 is linked to wealth, authority, and material success. It represents strong leadership and the ability to turn goals into reality." },
    { num: 9, name: "The Humanitarian", traits: "Compassionate, wise, and selfless.",           desc: "Number 9 symbolizes completion, generosity, and service to others. It represents a higher purpose and a desire to make a positive impact." },
  ];

  return (
    <section ref={ref} style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #f5f0e8 0%, #fdf8f0 40%, #faf8f5 100%)",
      paddingBottom: 60,
    }}
      onMouseMove={handleFanMove}
      onMouseLeave={() => setHov(null)}
      onTouchMove={(e) => { e.preventDefault(); const t = e.touches[0]; if (t) handleFanMove({ clientX: t.clientX, clientY: t.clientY }); }}
      onTouchEnd={() => setHov(null)}
    >
      <div className="num-flip-header" style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 72px 0", position: "relative", zIndex: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Numerological Blueprint</span>
            <span style={{ width: 28, height: 1, background: gold }} />
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 14, transitionDelay: "0.08s" }}>
            Meaning of Numbers<br /><em style={{ color: gold, fontStyle: "italic" }}>in Numerology</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", maxWidth: 500, margin: "0 auto", lineHeight: 1.8, transitionDelay: "0.14s" }}>
            Hover each card to reveal the cosmic vibration it carries.
          </p>
        </div>
      </div>

      {/* ── TRUE ARC FAN (desktop) ── */}
      <div
        ref={fanRef}
        className="rv num-fan-desktop"
        style={{
          top: -90,
          position: "relative",
          width: "100%",
          height: 600,
          transitionDelay: "0.2s",
          overflow: "visible",
        }}
      >
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)", width: "55%", height: 1,
          background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)`,
          zIndex: 0,
        }} />

        {numbers.map((n, i) => {
          const isHov = hov === i;
          const angle = ANGLES[i];
          const baseZ = 9 - Math.abs(i - 4);
          const zi = isHov ? 30 : baseZ;

          const arcTransform = isHov
            ? `rotate(0deg) translateY(-${RADIUS + 50}px) scale(1.22)`
            : `rotate(${angle}deg) translateY(-${RADIUS}px)`;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: -RADIUS + 20,
                left: "50%",
                marginLeft: -102,
                width: 205,
                height: 390,
                transformOrigin: "center bottom",
                perspective: "1000px",
                transform: arcTransform,
                transition: "transform 0.55s cubic-bezier(.22,1,.36,1)",
                zIndex: zi,
                pointerEvents: "auto",
                cursor: "pointer",
              }}
              onClick={() => setHov(hov === i ? null : i)}
            >
              {/* Flip container — self-contained 3D context, isolated from arc transform */}
              <div style={{
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transform: isHov ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.65s cubic-bezier(.22,1,.36,1)",
                position: "relative",
              }}>

                {/* FRONT — card back design (ornate) */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden",
                  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  background: "#faf8f5",
                  border: "1px solid rgba(201,169,110,0.5)",
                  boxShadow: isHov
                    ? "0 24px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(201,169,110,0.3)"
                    : `0 ${6 + Math.abs(i - 4) * 2}px ${20 + Math.abs(i - 4) * 4}px rgba(0,0,0,${0.08 + Math.abs(i-4)*0.015})`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  {/* Ornate inner border */}
                  <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(201,169,110,0.25)", borderRadius: 6 }} />
                  <div style={{ position: "absolute", inset: 11, border: "0.5px solid rgba(201,169,110,0.12)", borderRadius: 4 }} />

                  {/* Corner ornaments */}
                  {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v, h], ci) => (
                    <span key={ci} style={{ position: "absolute", [v]: 14, [h]: 14, fontSize: 7, color: gold, opacity: 0.6, lineHeight: 1 }}>✦</span>
                  ))}

                  {/* Numerology wheel watermark */}
                  <img src="/assets/wheel.png" alt="" aria-hidden decoding="async" style={{
                    position: "absolute", width: "130%", height: "130%",
                    top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    objectFit: "contain", opacity: 0.08, pointerEvents: "none",
                    mixBlendMode: "multiply",
                  }} />

                  <span style={{ position: "relative", zIndex: 1, fontFamily: "'Glacial Indifference',sans-serif", fontSize: 7.5, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 18, opacity: 0.7 }}>Numerology</span>

                  {/* Large number */}
                  <span style={{
                    position: "relative", zIndex: 1,
                    fontFamily: "'Ibarra Real Nova',serif",
                    fontSize: 86,
                    color: gold,
                    lineHeight: 1,
                    opacity: 0.75,
                    textShadow: "0 2px 8px rgba(201,169,110,0.15)",
                  }}>{n.num}</span>

                  <div style={{ position: "relative", zIndex: 1, width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: "14px 0" }} />

                  <span style={{ position: "relative", zIndex: 1, fontFamily: "'Ibarra Real Nova',serif", fontSize: 12.5, color: dark, textAlign: "center", letterSpacing: "0.03em", padding: "0 16px", lineHeight: 1.4, opacity: 0.8 }}>{n.name}</span>

                  <span style={{ position: "absolute", bottom: 14, fontFamily: "'Glacial Indifference',sans-serif", fontSize: 6.5, color: gold, opacity: 0.45, letterSpacing: 1.5 }}>hover to flip</span>
                </div>

                {/* BACK — revealed cosmic info */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden",
                  backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: `linear-gradient(160deg, #1f1a14 0%, #2a2018 50%, #1a1410 100%)`,
                  border: "1px solid rgba(201,169,110,0.3)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,169,110,0.15)",
                  padding: "22px 18px",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ position: "absolute", inset: 8, border: "1px solid rgba(201,169,110,0.12)", borderRadius: 6 }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, position: "relative", zIndex: 1 }}>
                    <span style={{ fontFamily: "'Ibarra Real Nova',serif", fontSize: 38, color: gold, lineHeight: 1, opacity: 0.6 }}>{n.num}</span>
                    <span style={{ fontSize: 7, color: gold, opacity: 0.3, marginTop: 6 }}>✦</span>
                  </div>

                  <h3 style={{ position: "relative", zIndex: 1, fontFamily: "'Ibarra Real Nova',serif", fontSize: 16, fontWeight: 400, color: "#faf8f5", marginBottom: 8, lineHeight: 1.2 }}>{n.name}</h3>

                  <div style={{ position: "relative", zIndex: 1, height: 1, background: "rgba(201,169,110,0.2)", marginBottom: 10 }} />

                  <p style={{ position: "relative", zIndex: 1, fontFamily: "'Ibarra Real Nova',serif", fontSize: 13, color: gold, fontStyle: "italic", marginBottom: 10, lineHeight: 1.5 }}>{n.traits}</p>

                  <p style={{ position: "relative", zIndex: 1, fontFamily: "'Glacial Indifference',sans-serif", fontSize: 12, color: "rgba(250,248,245,0.75)", lineHeight: 1.7, flex: 1 }}>{n.desc}</p>

                  {/* Bottom accent */}
                  <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", marginTop: 12 }}>
                    <span style={{ fontSize: 7, color: gold, opacity: 0.3, letterSpacing: 4 }}>✦ ✦ ✦</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE GRID (hidden on desktop) ── */}
      <div className="num-grid-mobile" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 16px 48px", position: "relative", zIndex: 1 }}>
        {numbers.map((n, i) => {
          const isHov = hov === i;
          return (
            <div key={i} onClick={() => setHov(hov === i ? null : i)} style={{ height: 220, cursor: "pointer", perspective: "600px" }}>
              <div style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", transform: isHov ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.65s cubic-bezier(.22,1,.36,1)", position: "relative" }}>
                {/* Front */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: "#faf8f5", border: "1px solid rgba(201,169,110,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "absolute", inset: 6, border: "0.5px solid rgba(201,169,110,0.2)", borderRadius: 4 }} />
                  {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],ci) => (
                    <span key={ci} style={{ position: "absolute", [v]: 10, [h]: 10, fontSize: 6, color: gold, opacity: 0.5 }}>✦</span>
                  ))}
                  <span style={{ position: "relative", zIndex: 1, fontFamily: "'Ibarra Real Nova',serif", fontSize: 60, color: gold, lineHeight: 1, opacity: 0.75 }}>{n.num}</span>
                  <div style={{ width: 20, height: 1, background: `linear-gradient(90deg,transparent,${gold},transparent)`, margin: "8px 0" }} />
                  <span style={{ position: "relative", zIndex: 1, fontFamily: "'Ibarra Real Nova',serif", fontSize: 9, color: dark, textAlign: "center", padding: "0 8px", lineHeight: 1.4, opacity: 0.8 }}>{n.name}</span>
                  <span style={{ position: "absolute", bottom: 8, fontFamily: "'Glacial Indifference',sans-serif", fontSize: 6, color: gold, opacity: 0.45, letterSpacing: 1 }}>tap</span>
                </div>
                {/* Back */}
                <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(160deg,#1f1a14,#2a2018)", border: "1px solid rgba(201,169,110,0.3)", padding: "10px 10px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontFamily: "'Ibarra Real Nova',serif", fontSize: 26, color: gold, lineHeight: 1, opacity: 0.6, marginBottom: 4 }}>{n.num}</span>
                  <h3 style={{ fontFamily: "'Ibarra Real Nova',serif", fontSize: 11, fontWeight: 400, color: "#faf8f5", marginBottom: 5, lineHeight: 1.2 }}>{n.name}</h3>
                  <div style={{ height: 1, background: "rgba(201,169,110,0.2)", marginBottom: 6 }} />
                  <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 8, color: "rgba(250,248,245,0.75)", lineHeight: 1.6, flex: 1, overflow: "hidden" }}>{n.traits}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle hint text — desktop only */}
      <div className="num-fan-desktop" style={{ textAlign: "center", padding: "28px 0 80px", position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, color: "rgba(201,169,110,0.5)", textTransform: "uppercase" }}>
          ← hover any card →
        </span>
      </div>
    </section>
  );
}

const IMPACT_AREAS = [
  { symbol: "✦", label: "Your Birth Number",    subtitle: "Who You Are at the Core",        desc: "Derived from your date of birth, this number reveals your natural personality, talents, and the energy you carry through life. It influences how you think, the relationships you attract, and the career paths where you truly thrive.",   bg: "#fff" },
  { symbol: "☽", label: "Your Life Path Number", subtitle: "Your Cosmic Roadmap",            desc: "The most important number in Vedic numerology. Calculated from your full date of birth, it reveals your life's overarching purpose, the lessons your soul came to learn, and why certain phases feel effortless while others feel like a struggle.", bg: "#fff" },
  { symbol: "Ω", label: "Your Name Number",      subtitle: "The Vibration You Project",      desc: "Every alphabet carries a numerical value. Your name, when converted into numbers, reveals the energy you broadcast to the world. A name misaligned with your Birth or Life Path Number creates invisible resistance — even when you're doing everything right.", bg: "#fff" },
  { symbol: "◈", label: "Your Mobile Number",    subtitle: "Energy You Carry Every Day",     desc: "Your phone number is not just a contact detail. You interact with it dozens of times daily. When its vibration clashes with your personal numbers, it can subtly drain your energy, invite miscommunication, and block financial growth. The right mobile number supports success, clarity, and abundance.", bg: "#fff" },
  { symbol: "△", label: "Your House Number",     subtitle: "The Energy of Your Space",       desc: "Where you live carries a numerological vibration that affects your health, peace of mind, family relationships, and financial stability. Understanding your house number helps you choose the right home and create a space that truly supports your goals.", bg: "#fff" },
];

const SIGNS = [
  "You work hard but success always feels out of reach",
  "Your relationships repeat the same painful patterns",
  "You're planning a major decision — business, marriage, or relocation",
  "You want to rename yourself, your child, or your business",
  "You feel something in your life is persistently \"off\"",
];

function makeAreaCanvas(symbol, label, subtitle, desc, bg) {
  const W = 800, H = 620;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const cx = W / 2;
  const maxW = W - 140;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Top gold rule
  ctx.fillStyle = "rgba(201,169,110,0.4)";
  ctx.fillRect(cx - 28, 52, 56, 2);

  // Symbol
  ctx.textAlign = "center";
  ctx.font = "36px serif";
  ctx.fillStyle = "#c9a96e";
  ctx.globalAlpha = 0.75;
  ctx.fillText(symbol, cx, 112);
  ctx.globalAlpha = 1;

  // Label (title)
  ctx.font = "600 40px 'Ibarra Real Nova', serif";
  ctx.fillStyle = "#1a1410";
  const words = label.split(" ");
  let lines = [], cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  lines.push(cur);
  const labelY = 168;
  lines.forEach((l, li) => ctx.fillText(l, cx, labelY + li * 50));

  // Subtitle (italic gold)
  const afterLabel = labelY + lines.length * 50 + 10;
  ctx.font = "italic 22px 'Ibarra Real Nova', serif";
  ctx.fillStyle = "#c9a96e";
  ctx.fillText(subtitle, cx, afterLabel);

  // Divider
  const divY = afterLabel + 30;
  ctx.strokeStyle = "rgba(201,169,110,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, divY); ctx.lineTo(W - 90, divY);
  ctx.stroke();

  // Description
  ctx.font = "19px 'Glacial Indifference', sans-serif";
  ctx.fillStyle = "#7a6e68";
  const dwords = desc.split(" ");
  let dline = "", dy = divY + 42;
  for (const w of dwords) {
    const test = dline ? dline + " " + w : w;
    if (ctx.measureText(test).width > maxW && dline) { ctx.fillText(dline, cx, dy); dline = w; dy += 32; }
    else dline = test;
  }
  ctx.fillText(dline, cx, dy);

  // Bottom gold rule
  ctx.fillStyle = "rgba(201,169,110,0.4)";
  ctx.fillRect(cx - 28, H - 52, 56, 2);

  return canvas.toDataURL();
}

/* ── HOW IT IMPACTS LIFE ─────────────────────────────────────────────────────── */
function ImpactSection() {
  const [galleryItems, setGalleryItems] = useState([]);
  const bodyRef = useRef(null);
  useReveal(bodyRef);

  useEffect(() => {
    document.fonts.ready.then(() => {
      const items = IMPACT_AREAS.map((a) => ({
        image: makeAreaCanvas(a.symbol, a.label, a.subtitle, a.desc, a.bg),
        text: "",
      }));
      setGalleryItems(items);
    });
  }, []);

  return (
    <section style={{
      overflow: "hidden", position: "relative", marginTop: "00px", padding: "0 0 100px",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 60%, #faf8f5 100%)",
    }}>
      {/* ── HEADING ── */}
      <div ref={bodyRef} style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 72px 48px", textAlign: "center" }}>
        <div className="rv" style={{ marginBottom: 18 }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'Ibarra Real Nova', serif",
            fontSize: 28,
            color: gold,
            lineHeight: 1,
            transform: "scaleX(1.4)",
            letterSpacing: -2,
            opacity: 0.7,
          }}>∧</span>
        </div>
        <div className="rv" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16, transitionDelay: "0.04s" }}>
          <span style={{ width: 28, height: 1, background: gold }} />
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Vedic Numerology</span>
          <span style={{ width: 28, height: 1, background: gold }} />
        </div>
        <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 14, transitionDelay: "0.08s" }}>
          The Significance of<br /><em style={{ color: gold, fontStyle: "italic" }}>Your Key Numbers</em>
        </h2>
        <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", lineHeight: 1.85, maxWidth: 520, margin: "0 auto", transitionDelay: "0.14s" }}>
          Every number in your life carries a frequency. Together they form a complete blueprint of who you are.
        </p>
      </div>

      {/* ── CIRCULAR GALLERY ── */}
      {galleryItems.length > 0 && (
        <div style={{ height: 560, position: "relative", marginBottom: 80 }}>
          <CircularGallery
            items={galleryItems}
            bend={1}
            textColor="rgba(0,0,0,0)"
            borderRadius={0.06}
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </div>
      )}

      {/* ── SIGNS ── */}
      <div style={{ padding: "0 72px 0", maxWidth: 1160, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 1, background: gold }} />
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Do You Recognise This?</span>
        </div>
        <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1 }}>
            Signs You Need<br />a Consultation
          </h2>
          <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 19, color: gold, fontStyle: "italic", lineHeight: 1.7, paddingBottom: 6 }}>
            If even one of these resonates — your numbers have a message for you.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 72px 100px" }}>
        {SIGNS.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 32,
            padding: "28px 0",
            borderBottom: i < SIGNS.length - 1 ? "1px solid rgba(26,20,16,0.08)" : "none",
          }}>
            <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 13, color: gold, flexShrink: 0, marginTop: 7, letterSpacing: 2, lineHeight: 1 }}>0{i + 1}</span>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(20px,1.8vw,26px)", fontWeight: 400, color: dark, lineHeight: 1.6 }}>{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── WHAT YOU GET ────────────────────────────────────────────────────────────── */
function ApproachSection() {
  const ref = useRef(null);
  useReveal(ref);

  const steps = [
    { n: "01", title: "Complete Numerology Chart", desc: "Birth, Life Path, Expression & Soul Urge Numbers fully decoded — deep, honest interpretation of every vibration, not surface-level readings." },
    { n: "02", title: "Name & Mobile Number Analysis", desc: "Vibration analysis of your current name and mobile number — with precise corrections if they're creating friction or blocking your growth." },
    { n: "03", title: "Yearly Cycle Forecast", desc: "Know your best windows for action — the right timing for career moves, business launches, relationships, and major life decisions." },
    { n: "04", title: "Practical Remedies & Corrections", desc: "Simple, actionable steps you can apply immediately — number corrections, name adjustments, and personalized guidance for your life's flow." },
    { n: "05", title: "Personalised Q&A", desc: "Dedicated time on career, relationships, finances and health — your specific questions answered with clarity and precision." },
  ];

  return (
    <section style={{
      overflow: "visible", padding: "100px 72px", position: "relative",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 55%, #f7efe2 100%)",
    }}>
      <div ref={ref} className="mobile-col-1" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "start", position: "relative", zIndex: 1 }}>
        <div>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Your Session</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.12, marginBottom: 24, transitionDelay: "0.08s" }}>
            What You Get at<br /><em style={{ color: gold, fontStyle: "italic" }}>Vedic Saar</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", lineHeight: 1.9, marginBottom: 40, transitionDelay: "0.14s" }}>
            A complete, practical numerology session — not vague predictions but precise, actionable insight tailored entirely to you.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              "Ancient Wisdom. Modern Clarity. Timeless Results."
            </p>
          </div>
        </div>
        <div>
          {steps.map((s, i) => (
            <div key={i} className="rv step-row" style={{ transitionDelay: `${0.08 + i * 0.1}s` }}>
              <div className="step-num">{s.n}</div>
              <div>
                <h5 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 600, color: dark, marginBottom: 8 }}>{s.title}</h5>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 18, color: "#7a7068", lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHO + CTA ───────────────────────────────────────────────────────────────── */
function WhoAndCTASection() {
  const ref       = useRef(null);
  const mantraRef = useRef(null);
  const { openBooking } = useBooking();
  useReveal(ref);

  useEffect(() => {
    const el = mantraRef.current;
    if (!el) return;
    el.style.animationPlayState = "paused";
    const obs = new IntersectionObserver(
      ([entry]) => { el.style.animationPlayState = entry.isIntersecting ? "running" : "paused"; },
      { threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const who = [
    "Feeling stuck or out of alignment with your goals",
    "Planning a new business, brand name, or personal rebrand",
    "Seeking clarity on major decisions — career, finance, relationships",
    "Experiencing repeated patterns or unexplained obstacles",
    "Curious about your life's deeper purpose and direction",
    "Ready to stop reacting and start living with intention",
  ];

  return (
    <section style={{
      position: "relative", overflow: "visible",
      backgroundColor: "#f7efe2",
      backgroundImage: 'url("/assets/vediclast.svg")',
      backgroundSize: "cover", backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      padding: "120px 72px 140px",
    }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 180, background: "linear-gradient(180deg, #f7efe2 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />

      <div ref={mantraRef} style={{ position: "absolute", zIndex: 60, top: "-350px", left: "-250px", width: 980, opacity: 0.07, pointerEvents: "none", animation: "spinSlow 90s linear infinite", willChange: "transform" }}>
        <img src="/assets/mantra-wheel.png" alt="" loading="lazy" decoding="async" style={{ width: "200%", objectFit: "contain" }} />
      </div>

      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, marginBottom: 100, alignItems: "start" }}>
          <div>
            <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1, background: gold }} />
              <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Is This For You?</span>
            </div>
            <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.12, marginBottom: 16, transitionDelay: "0.08s" }}>
              Who Is This<br />Consultation For?
            </h2>
            <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: gold, fontStyle: "italic", transitionDelay: "0.14s" }}>
              This is ideal if you are:
            </p>
          </div>
          <div style={{ paddingTop: 6 }}>
            {who.map((item, i) => (
              <div key={i} className="rv who-row" style={{ transitionDelay: `${i * 0.07}s` }}>
                <span style={{ color: gold, fontSize: 16, flexShrink: 0, marginTop: 1 }}>›</span>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: dark, lineHeight: 1.8 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rv cta-inner-pad" style={{
          transitionDelay: "0.1s",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", minHeight: "70vh", padding: "240px 100px 160px",
        }}>
          <div style={{ maxWidth: "720px" }}>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: gold, marginTop: 40, marginBottom: 22 }}>
              Book Your Consultation Today
            </p>
            <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.2, marginBottom: 22, letterSpacing: "0.02em" }}>
              Your Numbers Are Ready<br />
              <em style={{ color: gold, fontStyle: "italic" }}>To Speak</em>
            </h2>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6460", lineHeight: 1.75, marginBottom: 14 }}>
              Stop leaving your life to chance when the universe has already written your blueprint.
            </p>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: gold, fontStyle: "italic", lineHeight: 1.7, marginBottom: 42 }}>
              Limited slots available — book early to secure your session.
            </p>
            <button
              onClick={() => openBooking("Numerology")}
              style={{ ...dashedBtn("#fff"), background: dark, border: "2px dashed rgba(201,169,110,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Numerology Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── KNOW YOUR NUMBER ────────────────────────────────────────────────────────── */
function reduceNum(n) {
  while (n > 9) n = String(n).split('').reduce((a, c) => a + Number(c), 0);
  return n;
}

const NUM_DATA = {
  1:  { birthTitle:'The Pioneer',       birthDesc:'Natural leader with an independent spirit. You carry an innate drive to initiate and innovate, rarely content to follow another\'s path.',         destinyTitle:'The Pioneer Path',         destinyDesc:'Your life purpose is to stand alone, lead boldly, and carve new trails. Independence and originality are your karmic assignments.' },
  2:  { birthTitle:'The Peacemaker',    birthDesc:'Sensitive, intuitive, and deeply cooperative. Your strength lies in diplomacy and your ability to sense what others feel before they speak.',       destinyTitle:'The Diplomat\'s Path',     destinyDesc:'You are here to foster peace, build partnerships, and master patience. Your soul lesson is trust and cooperation.' },
  3:  { birthTitle:'The Creator',       birthDesc:'Expressive, optimistic, and charming. Words and art flow through you naturally — your joy is contagious and your imagination boundless.',           destinyTitle:'The Creative Path',        destinyDesc:'Self-expression and joy are your dharma. Your karmic purpose is to uplift others through communication, art, and authentic voice.' },
  4:  { birthTitle:'The Builder',       birthDesc:'Disciplined, reliable, and methodical. You lay foundations others stand on, driven by a need to create lasting, tangible results.',                destinyTitle:'The Builder\'s Path',      destinyDesc:'You came to build systems, structures, and stability. Discipline and persistence are the karmic tools of your soul\'s journey.' },
  5:  { birthTitle:'The Explorer',      birthDesc:'Versatile, restless, and freedom-loving. Change doesn\'t unsettle you — it energises you; routine feels like a cage.',                           destinyTitle:'The Freedom Path',         destinyDesc:'Your soul chose a life of change, travel, and expansion. The lesson is to find freedom within, not just around you.' },
  6:  { birthTitle:'The Nurturer',      birthDesc:'Responsible, compassionate, and harmony-seeking. You are the one people lean on, carrying an instinctive need to care and protect.',              destinyTitle:'The Caregiver\'s Path',    destinyDesc:'Responsibility, love, and service define your karmic journey. You are here to nurture, heal, and create beautiful harmony.' },
  7:  { birthTitle:'The Seeker',        birthDesc:'Analytical, introspective, and spiritual. Beneath your quiet surface runs a deep river of questions about life, truth, and the unseen.',          destinyTitle:'The Spiritual Path',       destinyDesc:'Wisdom, solitude, and inner mastery are your destiny. Your soul came to understand the mysteries beneath the surface of life.' },
  8:  { birthTitle:'The Achiever',      birthDesc:'Ambitious, powerful, and results-driven. Material mastery comes naturally to you; you understand the language of effort and reward.',              destinyTitle:'The Executive\'s Path',    destinyDesc:'Power, abundance, and achievement are your karmic curriculum. You are here to master both the material and spiritual worlds.' },
  9:  { birthTitle:'The Humanitarian',  birthDesc:'Idealistic, empathetic, and wise. You carry a soul-level understanding that life is larger than any one person\'s story.',                        destinyTitle:'The Humanitarian Path',    destinyDesc:'Your destiny is to serve humanity and embody compassion. You are a soul completing a long and magnificent journey.' },
};

function KnowYourNumberSection() {
  const [dob, setDob]       = useState('');
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');
  const resultRef           = useRef(null);
  const ref                 = useRef(null);
  useReveal(ref);

  function getBirthNumber(dateStr) {
    const day = parseInt(dateStr.split('-')[2], 10);
    return reduceNum(day);
  }
  function getDestinyNumber(dateStr) {
    const sum = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + Number(c), 0);
    return reduceNum(sum);
  }

  function calculate() {
    if (!dob) { setError('Please enter your date of birth.'); return; }
    setError('');
    const birthNum   = getBirthNumber(dob);
    const destinyNum = getDestinyNumber(dob);
    const bd = NUM_DATA[birthNum]   || NUM_DATA[9];
    const dd = NUM_DATA[destinyNum] || NUM_DATA[9];
    setResult({ birthNum, destinyNum, birthTitle: bd.birthTitle, birthDesc: bd.birthDesc, destinyTitle: dd.destinyTitle, destinyDesc: dd.destinyDesc });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  }

  /* Card — cream front + dark back flip, same as NumberFlip cards */
  function NumCard({ label, num, title, desc, delay = 0 }) {
    const [flipped, setFlipped] = useState(false);
    return (
      <div
        style={{ width: 210, height: 420, flexShrink: 0, perspective: '1000px', cursor: 'pointer', animation: `numCardIn 0.55s cubic-bezier(.22,1,.36,1) both`, animationDelay: `${delay}s` }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped(f => !f)}
      >
        <div style={{
          width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.65s cubic-bezier(.22,1,.36,1)',
          position: 'relative',
        }}>

          {/* ── FRONT — cream card ── */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: '#faf8f5',
            border: '1px solid rgba(201,169,110,0.5)',
            boxShadow: flipped
              ? '0 24px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,169,110,0.3)'
              : '0 14px 50px rgba(0,0,0,0.11)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position:'absolute', inset:8,  border:'1px solid rgba(201,169,110,0.25)', borderRadius:6, pointerEvents:'none' }} />
            <div style={{ position:'absolute', inset:11, border:'0.5px solid rgba(201,169,110,0.12)', borderRadius:4, pointerEvents:'none' }} />
            {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],i) => (
              <span key={i} style={{ position:'absolute', [v]:14, [h]:14, fontSize:7, color:gold, opacity:0.6, lineHeight:1 }}>✦</span>
            ))}
            <img src="/assets/wheel.png" alt="" aria-hidden decoding="async" style={{
              position:'absolute', width:'130%', height:'130%',
              top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              objectFit:'contain', opacity:0.08, pointerEvents:'none', mixBlendMode:'multiply',
            }} />

            <span style={{ position:'relative', zIndex:1, fontFamily:"'Glacial Indifference',sans-serif", fontSize:7.5, letterSpacing:3, textTransform:'uppercase', color:gold, opacity:0.7, marginBottom:20 }}>{label}</span>

            <span style={{ position:'relative', zIndex:1, fontFamily:"'Ibarra Real Nova',serif", fontSize:96, color:gold, lineHeight:1, opacity:0.75, textShadow:'0 2px 8px rgba(201,169,110,0.18)' }}>{num}</span>

            <div style={{ position:'relative', zIndex:1, width:32, height:1, background:`linear-gradient(90deg,transparent,${gold},transparent)`, margin:'16px 0' }} />

            <span style={{ position:'relative', zIndex:1, fontFamily:"'Ibarra Real Nova',serif", fontSize:13, color:dark, textAlign:'center', letterSpacing:'0.03em', opacity:0.8, lineHeight:1.4 }}>{title}</span>

            <span style={{ position:'absolute', bottom:14, fontFamily:"'Glacial Indifference',sans-serif", fontSize:6.5, color:gold, opacity:0.45, letterSpacing:1.5 }}>hover to reveal</span>
          </div>

          {/* ── BACK — dark card with description ── */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(160deg, #1f1a14 0%, #2a2018 50%, #1a1410 100%)',
            border: '1px solid rgba(201,169,110,0.3)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,169,110,0.1)',
            padding: '22px 18px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ position:'absolute', inset:8, border:'1px solid rgba(201,169,110,0.12)', borderRadius:6 }} />
            {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],i) => (
              <span key={i} style={{ position:'absolute', [v]:14, [h]:14, fontSize:7, color:gold, opacity:0.3, lineHeight:1 }}>✦</span>
            ))}

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, position:'relative', zIndex:1 }}>
              <span style={{ fontFamily:"'Ibarra Real Nova',serif", fontSize:40, color:gold, lineHeight:1, opacity:0.6 }}>{num}</span>
              <span style={{ fontSize:7, color:gold, opacity:0.3, marginTop:6 }}>✦</span>
            </div>

            <span style={{ position:'relative', zIndex:1, fontFamily:"'Glacial Indifference',sans-serif", fontSize:7.5, letterSpacing:2.5, textTransform:'uppercase', color:'rgba(201,169,110,0.55)', marginBottom:8 }}>{label}</span>

            <h3 style={{ position:'relative', zIndex:1, fontFamily:"'Ibarra Real Nova',serif", fontSize:16, fontWeight:400, color:'#faf8f5', marginBottom:8, lineHeight:1.2, fontStyle:'italic' }}>{title}</h3>

            <div style={{ position:'relative', zIndex:1, height:1, background:'rgba(201,169,110,0.2)', marginBottom:12 }} />

            <p style={{ position:'relative', zIndex:1, fontFamily:"'Glacial Indifference',sans-serif", fontSize:12, color:'rgba(250,248,245,0.75)', lineHeight:1.75, flex:1 }}>{desc}</p>

            <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'center', marginTop:12 }}>
              <span style={{ fontSize:7, color:gold, opacity:0.3, letterSpacing:4 }}>✦ ✦ ✦</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <section ref={ref} style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 50%, #fdf8f0 100%)',
      padding: '100px 40px 110px',
    }}>
      <style>{`
        @keyframes numCardIn {
          from { opacity:0; transform:translateY(24px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .num-dob-input:focus { outline:none; border-color:rgba(201,169,110,0.7) !important; box-shadow:0 0 0 3px rgba(201,169,110,0.08) !important; }
        .num-calc-btn:hover:not(:disabled) { background:rgba(201,169,110,0.14) !important; }
        .num-calc-btn:disabled { opacity:0.4; cursor:not-allowed; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section heading — same pattern as NumberFlipSection */}
        <div className="rv" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginBottom:16 }}>
            <span style={{ width:28, height:1, background:gold }} />
            <span style={{ fontFamily:"'Glacial Indifference',sans-serif", fontSize:11, letterSpacing:3, textTransform:'uppercase', color:gold }}>Vedic Numerology</span>
            <span style={{ width:28, height:1, background:gold }} />
          </div>
          <h2 style={{ fontFamily:"'Ibarra Real Nova',serif", fontSize:HEADING_SIZE, fontWeight:400, color:dark, lineHeight:1.1, marginBottom:14 }}>
            Know Your <em style={{ color:gold, fontStyle:'italic' }}>Numbers</em>
          </h2>
          <p style={{ fontFamily:"'Glacial Indifference',sans-serif", fontSize:20, color:'#7a6e68', maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
            Enter your date of birth to reveal your Birth Number and Destiny Number.
          </p>
        </div>

        {/* Input box — dark panel, consistent with card aesthetic */}
        <div className="rv" style={{
          maxWidth: 540, margin: '0 auto 52px',
          background: 'linear-gradient(160deg, #1f1a14 0%, #2a2018 50%, #1a1410 100%)',
          border: '1px solid rgba(201,169,110,0.3)',
          borderRadius: 14,
          boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          padding: '36px 32px 32px',
          position: 'relative', overflow: 'hidden',
          transitionDelay: '0.08s',
        }}>
          <div style={{ position:'absolute', inset:8, border:'1px solid rgba(201,169,110,0.1)', borderRadius:8, pointerEvents:'none' }} />
          {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],i) => (
            <span key={i} style={{ position:'absolute', [v]:14, [h]:14, fontSize:7, color:gold, opacity:0.3 }}>✦</span>
          ))}

          <p style={{ position:'relative', zIndex:1, fontFamily:"'Glacial Indifference',sans-serif", fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'rgba(201,169,110,0.55)', textAlign:'center', marginBottom:22 }}>Date of Birth</p>

          <div style={{ position:'relative', zIndex:1, display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <input
              type="date"
              className="num-dob-input"
              value={dob}
              onChange={e => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              style={{
                flex:'1 1 180px', padding:'13px 18px',
                background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(201,169,110,0.22)',
                borderRadius:8, color:'#f5ede0',
                fontFamily:"'Glacial Indifference',sans-serif",
                fontSize:14, letterSpacing:0.5,
                colorScheme:'dark', transition:'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            <button
              className="num-calc-btn"
              onClick={calculate}
              disabled={!dob}
              style={{
                padding:'13px 32px',
                background:'rgba(201,169,110,0.08)',
                border:'1px dashed rgba(201,169,110,0.5)',
                borderRadius:8, color:gold,
                fontFamily:"'Glacial Indifference',sans-serif",
                fontSize:11, letterSpacing:2.5,
                textTransform:'uppercase', cursor:'pointer',
                transition:'background 0.2s', whiteSpace:'nowrap',
              }}
            >
              Reveal
            </button>
          </div>
          {error && <p style={{ position:'relative', zIndex:1, fontFamily:"'Glacial Indifference',sans-serif", fontSize:12, color:'rgba(240,120,100,0.85)', textAlign:'center', marginTop:12 }}>{error}</p>}
        </div>

        {/* Result cards — same style as NumberFlip card backs */}
        {result && (
          <div ref={resultRef} style={{ display:'flex', gap:24, flexWrap:'wrap', justifyContent:'center' }}>
            <NumCard label="Birth Number · Moolank"   num={result.birthNum}   title={result.birthTitle}   desc={result.birthDesc}   delay={0} />
            <NumCard label="Destiny Number · Life Path" num={result.destinyNum} title={result.destinyTitle} desc={result.destinyDesc} delay={0.12} />
          </div>
        )}


      </div>
    </section>
  );
}

/* ── ROOT ────────────────────────────────────────────────────────────────────── */
export default function NumerologyPage() {
  return (
    <>
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#faf8f5"
      />
      <style>{globalCss}</style>
      <div style={{ fontFamily: "'Glacial Indifference', sans-serif", background: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
        <Hero />
        <WhatIsSection />
        <SlidingStrip />
        <NumberFlipSection />
        <KnowYourNumberSection />
        <ApproachSection />
        <WhoAndCTASection />
      </div>
    </>
  );
}