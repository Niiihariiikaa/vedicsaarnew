import { useState, useEffect, useRef } from "react";
import SplashCursor from "../components/SplashCursor";
import { Lightbulb, Sparkles, HeartHandshake, Orbit, Moon } from "lucide-react";
import { useBooking } from "../components/BookingContext";

/* ── Scroll Manager (singleton — one RAF loop, zero re-renders) ────────────── */
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
  onMouseEnter(e) {
    const el = e.currentTarget;
    el.style.willChange = "transform";
    el._tiltRect = el.getBoundingClientRect();
  },
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
    el.style.willChange = "auto";
    el._tiltRect = null;
  },
};

function useReveal(ref) {
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("vis"); obs.unobserve(en.target); }
      }),
      { threshold: 0.08, rootMargin: "-10px" }
    );
    c.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── GLOBAL CSS ───────────────────────────────────────────────────────────────── */
const globalCss = `
  * { margin:0; padding:0; box-sizing:border-box; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
  body { background:#fff; color:#1a1410; }
  html { scroll-behavior:smooth; }

  @keyframes twinkle  { from { opacity:0.05; } to { opacity:0.6; } }
  @keyframes floatUp  { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spinSlow { to { transform:rotate(360deg); } }

  .rv { opacity:0; transform:translateY(28px); transition:opacity 0.65s cubic-bezier(.22,1,.36,1),transform 0.65s cubic-bezier(.22,1,.36,1); }
  .rv.vis { opacity:1; transform:translateY(0); }
  .card-3d { transform-style:preserve-3d; transition:transform 0.15s ease,box-shadow 0.2s ease; }

  .arch {
    width:110px; height:142px;
    border:1.5px solid rgba(26,20,16,0.25);
    border-radius:55px 55px 0 0;
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 28px; font-size:58px; color:#1a1410;
    transition:background 0.35s,border-color 0.35s,color 0.35s,box-shadow 0.35s;
  }
  .icon-card:hover .arch { background:rgba(201,169,110,0.08); border-color:${gold}; color:${gold}; box-shadow:0 0 0 4px rgba(201,169,110,0.1); }
  .icon-card { transition:transform 0.28s cubic-bezier(.22,1,.36,1); cursor:default; }
  .icon-card:hover { transform:translateY(-8px); }

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

  .who-row { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid rgba(26,20,16,0.1); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1); cursor:default; }
  .who-row:hover { padding-left:10px; }

  .acc-item { border-bottom:1px solid rgba(26,20,16,0.1); }
  .acc-btn  { width:100%; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:12px; padding:15px 0; text-align:left; }
  .acc-arrow { font-size:20px; color:${gold}; transition:transform 0.3s; flex-shrink:0; line-height:1; }
  .acc-arrow.open { transform:rotate(90deg); }
  .acc-body { overflow:hidden; transition:max-height 0.35s cubic-bezier(.22,1,.36,1),opacity 0.35s; }

  .strip-row { display:flex; gap:48px; white-space:nowrap; align-items:center; padding:0 40px; will-change:transform; min-width:300vw; height:68px; }
  .strip-row span { font-family:'Ibarra Real Nova',serif; font-size:30px; }
  @media (max-width: 1024px) {
    .hero-section { background-position: top center !important; }
    .v-gains-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .mobile-col-1 { grid-template-columns: 1fr !important; }
    section { padding-left: max(20px, 4vw) !important; padding-right: max(20px, 4vw) !important; }
    .hero-section { padding-top: 100px !important; background-position: top center !important; }
    .hero-inner { transform: translateY(-20px) !important; margin-bottom: -60px !important; }
    .vedic-wheel-col { display: none !important; }
    .v-gains-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .cta-inner-pad { padding: 60px 20px 60px !important; }
  }
`;

/* ── ACCORDION ────────────────────────────────────────────────────────────────── */
function AccItem({ title, body }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acc-item">
      <button className="acc-btn" onClick={() => setOpen(o => !o)}>
        <span className={`acc-arrow${open ? " open" : ""}`}>›</span>
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: dark, letterSpacing: 0.4 }}>{title}</span>
      </button>
      <div className="acc-body" style={{ maxHeight: open ? 120 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: "#7a6e68", lineHeight: 1.75, paddingBottom: 14, paddingLeft: 32 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── HERO ─────────────────────────────────────────────────────────────────────── */
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
        <img src="/assets/beigecrystal.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", overflow: "visible" }} />
      </div>
      <div ref={moonRef} className="hero-decor" style={{ position: "absolute", right: "-20px", top: "90px", width: 200, height: 300, transform: "translate3d(0,0,0)", willChange: "transform", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: "none", zIndex: 1, opacity: 0.80 }}>
        <img src="/assets/moon.png" alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div className="hero-inner" style={{ position: "relative", zIndex: 2, maxWidth: 680, marginBottom: -180, transform: "translateY(-80px)" }}>
        <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontWeight: 450, display: "inline-block", fontSize: "clamp(32px, 9vw, 70px)", color: "black", padding: "6px 20px", marginBottom: "clamp(40px, 10vw, 137px)", animation: "floatUp 0.8s ease forwards" }}>
          Vedic Astrology
        </div>
        <h1 style={{ marginTop: 80, fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, lineHeight: 1.15, color: "black", marginBottom: 40, animation: "floatUp 0.8s 0.2s ease both" }}>
          Decode Your Destiny Through<br />
          <em style={{ color: gold, fontStyle: "italic" }}> Vedic Astrology</em>
        </h1>
        <p style={{ fontSize: 20, color: "#9b8fa0", lineHeight: 1.8, marginBottom: 10, fontFamily: "'Glacial Indifference', sans-serif", animation: "floatUp 0.8s 0.4s ease both" }}>
          Ancient wisdom. Modern clarity. Personalized guidance for your life's biggest decisions.
        </p>
        <p style={{ fontSize: 20, color: gold, fontStyle: "italic", marginBottom: 44, fontFamily: "'Ibarra Real Nova', serif", animation: "floatUp 0.8s 0.5s ease both" }}>
          Your journey is not random — it is written in the stars. Let us help you understand it.
        </p>
                   <button
                   onClick={() => openBooking("Vedic Astrology")}
              style={{ ...dashedBtn(dark), border: "1px dashed " + dark }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Vedic Astrology Consultation
            </button>
      </div>
    </section>
  );
}

/* ── OVERLAYS ─────────────────────────────────────────────────────────────────── */
function ConstellationOverlay() {
  return (
    <div style={{ position: "relative", height: "0px", zIndex: 20 }}>
      <img src="/assets/costelation.png" alt="" loading="lazy" decoding="async" className="constellation-img" style={{ position: "absolute", top: "-120px", left: "70%", transform: "translateX(-50%)", width: "600px", opacity: 0.5, pointerEvents: "none" }} />
    </div>
  );
}

/* ── SLIDING STRIP ────────────────────────────────────────────────────────────── */
function SlidingStrip() {
  const topRowRef = useRef(null);
  const botRowRef = useRef(null);
  useEffect(() => {
    return subscribeScroll((y) => {
      if (topRowRef.current) topRowRef.current.style.transform = `translateX(-${y * 0.2}px)`;
      if (botRowRef.current) botRowRef.current.style.transform = `translateX(calc(-700px + ${y * 0.2}px))`;
    });
  }, []);

  const top = ["☾ Kundli Analysis","✶ Birth Chart","☯ Ascendant Reading","✧ Planetary Dashas","☾ Navamsa Chart","✶ Lagna Chart","☯ Sade Sati","✧ Yogas & Doshas"];
  const bot = ["✶ Career & Finance","✶ Compatibility","✶ Muhurat Timing","✶ Retrograde Insights","✶ Nakshatra Analysis","✶ Life Path","✶ Karma & Dharma","✶ Vedic Remedies"];
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

/* ── WHAT IS VEDIC ────────────────────────────────────────────────────────────── */
function WhatIsSection() {
  const sectionRef = useRef(null);
  const wheelRef   = useRef(null);
  const bodyRef    = useRef(null);
  const { openBooking } = useBooking();
  useReveal(bodyRef);

  useEffect(() => {
    const s = sectionRef.current;
    const w = wheelRef.current;
    if (!s || !w) return;
    let topOffset = s.getBoundingClientRect().top + window.scrollY;
    const onResize = () => { topOffset = s.getBoundingClientRect().top + window.scrollY; };
    window.addEventListener("resize", onResize, { passive: true });
    const sHeight = s.offsetHeight;
    const unsub = subscribeScroll((y) => {
      if (y > topOffset + sHeight || y + window.innerHeight < topOffset) return;
      const scrolledPast = y - topOffset;
      w.style.transform = `translate3d(-360px, 0, 0) rotateZ(${Math.max(0, scrolledPast) / 4}deg)`;
    });
    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "130px 80px 140px",
      overflow: "hidden",
      position: "relative",
      contain: "paint",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)",
    }}>
      <div ref={bodyRef} className="mobile-col-1" style={{
        maxWidth: 1200, marginTop: -100,
        display: "grid", gridTemplateColumns: "1fr 1.25fr",
        gap: 80, alignItems: "center", position: "relative", zIndex: 50,
      }}>
        <div className="vedic-wheel-col" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <img
            ref={wheelRef}
            src="/assets/wheel.png"
            alt="Vedic Astrology Wheel"
            style={{ width: "250%", maxWidth: "none", height: "auto", display: "block", transformOrigin: "center", willChange: "transform", transform: "translate3d(-360px, 0, 0)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "relative", zIndex: 1 }}
          />
        </div>
        <div style={{ paddingTop: 8 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>5000 Years of Sacred Science</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 16, transitionDelay: "0.08s" }}>
            What is Vedic<br />Astrology?
          </h2>
          <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 37, color: gold, fontStyle: "italic", marginBottom: 36, transitionDelay: "0.12s" }}>
            Jyotish Shastra
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 20, transitionDelay: "0.16s" }}>
            Vedic Astrology, or Jyotish Shastra, is a 5,000-year-old sacred science rooted in the Vedas. It studies the precise positions of planets at the time of your birth to create your unique birth chart (Kundli) — a cosmic blueprint of your life.
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 40, transitionDelay: "0.2s" }}>
            This chart is not just about predictions. It is a map of your personality, karmic patterns, strengths, challenges, and life purpose.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              Unlike generic horoscopes, Vedic Astrology is deeply personalized and incredibly precise when interpreted correctly.
            </p>
          </div>
          <div className="rv" style={{ transitionDelay: "0.28s" }}>
            <AccItem title="Birth Chart & Kundli Analysis" body="A comprehensive reading of your natal chart revealing personality, karma, life path, and the planetary periods that shape every phase of your journey." />
            <AccItem title="Personalized Consultation Sessions" body="One-on-one guidance tailored to your specific questions — career, relationships, spiritual growth, and major life decisions." />
          </div>
          <div className="rv" style={{ marginTop: 44, transitionDelay: "0.32s" }}>
             <button
              onClick={() => openBooking("Vedic Astrology")}
              style={{ ...dashedBtn(dark), border: "1px dashed " + dark }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Vedic Astrology Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── WHAT YOU CAN GAIN ────────────────────────────────────────────────────────── */
function GainSection() {
  const ref = useRef(null);
  useReveal(ref);

  const gains = [
    { icon: Lightbulb, label: "Insights",      desc: "Deep insights into who you truly are at a soul level — your strengths, karmic patterns, and life purpose." },
    { icon: Sparkles,  label: "Clarity",       desc: "Clarity on career choices, financial timing, and major life decisions with precise planetary guidance." },
    { icon: HeartHandshake, label: "Understanding", desc: "Understanding of compatibility, karmic bonds, and how to nurture your most important relationships." },
    { icon: Orbit,     label: "Awareness",     desc: "Awareness of upcoming planetary shifts — so you prepare instead of react and align with favorable energies." },
    { icon: Moon,      label: "Reassurance",   desc: "Instead of feeling lost, you begin to feel guided and in control — with the confidence to move forward." },
  ];

  return (
    <section style={{
      padding: "100px 72px",
      position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #f5f0e8 0%, #fdf8f0 55%, #faf8f5 100%)",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>From a Consultation</span>
            <span style={{ width: 28, height: 1, background: gold }} />
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, transitionDelay: "0.08s" }}>
            What You Can Gain
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", marginTop: 14, maxWidth: 520, margin: "14px auto 0", lineHeight: 1.8, transitionDelay: "0.14s" }}>
            A Vedic Astrology consultation is not just about knowing the future — it's about empowerment.
          </p>
        </div>
        <div className="mobile-col-1 v-gains-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 28 }}>
          {gains.map((g, i) => (
            <div key={i} className="rv icon-card" style={{ textAlign: "center", transitionDelay: `${0.06 + i * 0.09}s`, padding: "0 8px" }}>
              <div className="arch"><g.icon size={40} strokeWidth={1.5} /></div>
              <h4 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 30, fontWeight: 500, color: dark, marginBottom: 10, lineHeight: 1.3 }}>{g.label}</h4>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 16, color: "#7a6e68", lineHeight: 1.85 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHY IT MATTERS ───────────────────────────────────────────────────────────── */
function WhySection() {
  const ref = useRef(null);
  useReveal(ref);

  const questions = [
    { q: "Am I choosing the right career path?",   sub: "Finding direction in work & purpose" },
    { q: "Why are my relationships not working?",  sub: "Understanding karmic connections" },
    { q: "When will things finally get better?",   sub: "Timing cycles & planetary shifts" },
  ];
  const benefits = [
    "Understand why things are happening in your life",
    "Make confident decisions with better timing (muhurat)",
    "Prepare for upcoming challenges instead of reacting to them",
    "Recognize opportunities you might otherwise miss",
    "Align your actions with favorable planetary energies",
    "Instead of feeling lost, begin to feel guided and in control",
  ];

  return (
    <section style={{
      padding: "100px 72px", overflow: "hidden", position: "relative",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 55%, #faf8f5 100%)",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="rv" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Why It Matters</span>
          </div>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 12 }}>
            Clarity Where There<br />Is Confusion
          </h2>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", lineHeight: 1.85, maxWidth: 540 }}>
            At some point, everyone faces uncertainty. Vedic Astrology brings light to life's hardest questions.
          </p>
        </div>

        <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, margin: "52px 0" }}>
          {questions.map((item, i) => (
            <div key={i} className="why-card card-3d" {...tilt} style={{
              background: "rgba(250,248,245,0.95)",
              border: `1px solid rgba(201,169,110,0.3)`,
              padding: "40px 32px 32px", cursor: "default", minHeight: 230,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 52, color: gold, lineHeight: 0.75, marginBottom: 22, opacity: 0.55 }}>"</div>
              <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 400, color: dark, lineHeight: 1.65, flexGrow: 1, marginBottom: 24 }}>{item.q}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: gold, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Glacial Indifference', sans-serif", borderTop: `1px solid rgba(201,169,110,0.2)`, paddingTop: 16 }}>
                <span>✦</span>{item.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="rv" style={{ transitionDelay: "0.1s" }}>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, color: "#9a8a80", marginBottom: 24, letterSpacing: 3, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 20, height: 1, background: "#9a8a80" }} />
            Vedic Astrology helps you
          </p>
          <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {benefits.map((b, i) => (
              <div key={i} className="rv benefit-row" style={{ transitionDelay: `${0.14 + i * 0.06}s` }}>
                <span style={{ width: 6, height: 6, background: gold, borderRadius: "50%", flexShrink: 0, marginTop: 7 }} />
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 18, color: "#6a5e58", lineHeight: 1.7 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HOW WE HELP ──────────────────────────────────────────────────────────────── */
function ApproachSection() {
  const ref = useRef(null);
  useReveal(ref);

  const steps = [
    { n: "01", title: "Detailed Birth Chart Analysis",  desc: "No surface-level readings — every house, planet, dasha, and transit examined thoroughly to give you precise, honest insights." },
    { n: "02", title: "Real-Life Guidance",              desc: "Practical advice you can actually apply to your current situation — not vague generalities but actionable clarity." },
    { n: "03", title: "Effective Vedic Remedies",        desc: "Personalized mantras, gemstone guidance, rituals, and simple lifestyle shifts aligned to your unique birth chart." },
    { n: "04", title: "Personalized Attention",          desc: "Every consultation is uniquely tailored to you and your life journey. We don't just tell you what's happening — we help you understand what to do about it." },
  ];

  return (
    <section style={{
      overflow: "visible",
      padding: "100px 72px", position: "relative",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 55%, #f7efe2 100%)",
    }}>
      <div ref={ref} className="mobile-col-1" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "start", position: "relative", zIndex: 1 }}>
        <div>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Our Approach</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.12, marginBottom: 24, transitionDelay: "0.08s" }}>
            How We Help You at<br /><em style={{ color: gold, fontStyle: "italic" }}>Vedic Saar</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", lineHeight: 1.9, marginBottom: 40, transitionDelay: "0.14s" }}>
            At Vedic Saar, we believe astrology should be practical, honest, and actionable — not vague or fear-based.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              "The answers you are searching for already exist — let us uncover them together."
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

/* ── WHO + CTA ────────────────────────────────────────────────────────────────── */
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
    "Feeling stuck or confused about your life direction",
    "Facing repeated obstacles or unexplained delays",
    "Seeking clarity in relationships or marriage decisions",
    "Planning major life decisions — career, business, relocation",
    "Looking for deeper self-understanding and spiritual growth",
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
        <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, marginBottom: 100, alignItems: "start", position: "relative" }}>
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
              Illuminate Your Path
            </p>
            <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.2, marginBottom: 22, letterSpacing: "0.02em" }}>
              Book Your Vedic <br />
              Astrology <br />
              Consultation
            </h2>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6460", lineHeight: 1.75, marginBottom: 42 }}>
              The answers you are searching for already exist — <br />
              let us uncover them together.
            </p>
            <button
              onClick={() => openBooking("Vedic Astrology")}
              style={{ ...dashedBtn("#fff"), background: dark, border: "2px dashed rgba(201,169,110,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Vedic Astrology Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── ROOT ─────────────────────────────────────────────────────────────────────── */
export default function VedicAstrologyPage() {
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
      <div style={{ fontFamily: "'Glacial Indifference', sans-serif", background: "#fff", minHeight: "100vh" }}>
        <Hero />
        <ConstellationOverlay />
        <WhatIsSection />
        <SlidingStrip />
        <GainSection />
        <WhySection />
        <ApproachSection />
        <WhoAndCTASection />
      </div>
    </>
  );
}