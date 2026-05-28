import { useState, useEffect, useRef } from "react";
import SplashCursor from "../components/SplashCursor";
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

  .acc-item { border-bottom:1px solid rgba(26,20,16,0.1); }
  .acc-btn  { width:100%; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:12px; padding:15px 0; text-align:left; }
  .acc-arrow { font-size:20px; color:${gold}; transition:transform 0.3s; flex-shrink:0; line-height:1; }
  .acc-arrow.open { transform:rotate(90deg); }
  .acc-body { overflow:hidden; transition:max-height 0.35s cubic-bezier(.22,1,.36,1),opacity 0.35s; }

  .step-row { display:flex; gap:20px; align-items:flex-start; padding:26px 0; border-bottom:1px solid rgba(26,20,16,0.07); transition:padding-left 0.2s; cursor:default; }
  .step-row:hover { padding-left:10px; }
  .step-num { width:44px; height:44px; border:1px solid rgba(201,169,110,0.5); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Ibarra Real Nova',serif; font-size:13px; color:${gold}; background:rgba(201,169,110,0.06); flex-shrink:0; margin-top:3px; transition:background 0.3s,color 0.3s,box-shadow 0.3s; }
  .step-row:hover .step-num { background:${gold}; color:#fff; box-shadow:0 0 0 5px rgba(201,169,110,0.15); }

  .who-row { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid rgba(26,20,16,0.1); transition:padding-left 0.22s cubic-bezier(.22,1,.36,1); cursor:default; }
  .who-row:hover { padding-left:10px; }

  .impact-row { display:flex; gap:14px; align-items:flex-start; padding:14px 16px; border:0.5px solid rgba(201,169,110,0.14); background:rgba(255,255,255,0.5); transition:background 0.2s,border-color 0.2s; cursor:default; }
  .impact-row:hover { background:#fff; border-color:rgba(201,169,110,0.5); }

  .strip-row { display:flex; gap:48px; white-space:nowrap; align-items:center; padding:0 40px; will-change:transform; min-width:300vw; height:68px; }
  .strip-row span { font-family:'Ibarra Real Nova',serif; font-size:30px; }
  @media (max-width: 1024px) {
    .hero-section { background-position: top center !important; }
    .vaastu-gains-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .mobile-col-1 { grid-template-columns: 1fr !important; }
    section { padding-left: max(20px, 4vw) !important; padding-right: max(20px, 4vw) !important; }
    .hero-section { padding-top: 100px !important; background-position: top center !important; }
    .hero-inner { transform: translateY(-20px) !important; margin-bottom: -60px !important; }
    .vaastu-compass-col { display: none !important; }
    .vaastu-gains-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .cta-inner-pad { padding: 60px 20px 60px !important; }
    .vaastu-why-sep { display: none !important; }
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
      <div className="acc-body" style={{ maxHeight: open ? 160 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 14, color: "#7a6e68", lineHeight: 1.75, paddingBottom: 14, paddingLeft: 32 }}>{body}</p>
      </div>
    </div>
  );
}

/* ── HERO ────────────────────────────────────────────────────────────────────── */
function Hero() {
  const crystalRef = useRef(null);
  const moonRef    = useRef(null);
  const { openVaastuBooking } = useBooking();

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
          Vaastu Shastra
        </div>

        <h1 style={{ marginTop: 80, fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, lineHeight: 1.15, color: "black", marginBottom: 40, animation: "floatUp 0.8s 0.2s ease both" }}>
          Align Your Space.<br />
          <em style={{ color: gold, fontStyle: "italic" }}>Transform Your Life.</em>
        </h1>
        <p style={{ fontSize: 20, color: "#9b8fa0", lineHeight: 1.8, marginBottom: 10, fontFamily: "'Glacial Indifference', sans-serif", animation: "floatUp 0.8s 0.4s ease both" }}>
          Create a home or workspace that supports your growth, peace, and success.
        </p>
        <p style={{ fontSize: 20, color: gold, fontStyle: "italic", marginBottom: 44, fontFamily: "'Ibarra Real Nova', serif", animation: "floatUp 0.8s 0.5s ease both" }}>
          Your space is a living energy field — let us help you align it.
        </p>
        <button
          onClick={() => openVaastuBooking()}
          style={{ ...dashedBtn(dark), border: "1px dashed " + dark }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark; e.currentTarget.style.boxShadow = "none"; }}>
          Book Your Vaastu Consultation →
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

  const top = ["✦ North Direction", "✦ South Direction", "✦ East Direction", "✦ West Direction", "✦ Earth Element", "✦ Water Element", "✦ Fire Element", "✦ Air Element"];
  const bot = ["✶ Home Analysis", "✶ Office Layout", "✶ Energy Flow", "✶ Room Evaluation", "✶ Space Correction", "✶ Directional Balance", "✶ Space Element", "✶ Practical Remedies"];
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

function VaastuCompass() {
  useEffect(() => {
    const needle = document.getElementById("vaastu-needle");
    if (!needle) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const section = needle.closest("section");
        const scrolledPast = Math.max(0, window.scrollY - (section?.offsetTop ?? 0));
        needle.style.transform = `rotateZ(${scrolledPast / 2}deg)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ticks = Array.from({ length: 72 }).map((_, i) => {
    const rad = (i * 5 * Math.PI) / 180;
    const isMajor = i % 9 === 0, isMid = i % 3 === 0;
    const r1 = 232, r2 = isMajor ? 200 : isMid ? 212 : 222;
    return (
      <line key={i}
        x1={250 + r1 * Math.sin(rad)} y1={250 - r1 * Math.cos(rad)}
        x2={250 + r2 * Math.sin(rad)} y2={250 - r2 * Math.cos(rad)}
        stroke="#c8a97a" strokeWidth={isMajor ? 2.2 : isMid ? 1.4 : 0.7}
      />
    );
  });

  const cardinals = [
    ["N", 250, 58],
    ["S", 250, 448],
    ["E", 448, 256],
    ["W", 52,  256],
  ];

  const intercardinals = [
    ["NE", 368, 134],
    ["NW", 132, 134],
    ["SE", 368, 374],
    ["SW", 132, 374],
  ];

  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "120%",
        maxWidth: "700px",
        height: "auto",
        display: "block",
        position: "relative",
        zIndex: 1,
        opacity: 0.6,
        transform: "scale(1.6) translateX(-25%)",
        transformOrigin: "center",
        willChange: "auto",
      }}
    >
      {/* ── Outer rings (static) ── */}
      <circle cx="250" cy="250" r="245" fill="#f5eedf" stroke="#c8a97a" strokeWidth="5"/>
      <circle cx="250" cy="250" r="232" fill="none"    stroke="#c8a97a" strokeWidth="2"/>
      <circle cx="250" cy="250" r="220" fill="none"    stroke="#e8dcc0" strokeWidth="1"/>

      {/* ── Tick marks ── */}
      {ticks}

      {/* ── Inner rings ── */}
      <circle cx="250" cy="250" r="175" fill="none" stroke="#c8a97a" strokeWidth="1" strokeDasharray="4 5"/>
      <circle cx="250" cy="250" r="150" fill="none" stroke="#d9c99a" strokeWidth="0.8"/>

      {/* ── Rose lines (behind needle) ── */}
      {[
        [250,175,250,78],[250,325,250,422],
        [175,250,78,250],[325,250,422,250],
        [196,196,142,142],[304,196,358,142],
        [196,304,142,358],[304,304,358,358],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#a07840" strokeWidth="1" opacity="0.4"/>
      ))}

      {/* ── Cardinal labels with knockout circle behind ── */}
      {cardinals.map(([l, x, y]) => (
        <g key={l}>
          <circle cx={x} cy={y} r="20" fill="#f5eedf"/>
          <text
            x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Ibarra Real Nova', Georgia, serif"
            fontSize="24" fontWeight="bold" fill="#7a5c2e"
          >
            {l}
          </text>
        </g>
      ))}

      {/* ── Intercardinal labels with knockout circle behind ── */}
      {intercardinals.map(([l, x, y]) => (
        <g key={l}>
          <circle cx={x} cy={y} r="17" fill="#f5eedf"/>
          <text
            x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Glacial Indifference', sans-serif"
            fontSize="13" fill="#a07840" letterSpacing="1"
          >
            {l}
          </text>
        </g>
      ))}

      {/* ── NEEDLE — only this rotates on scroll ── */}
      <g
        id="vaastu-needle"
        style={{ transformOrigin: "250px 250px", willChange: "transform" }}
      >
        {/* North tip — dark walnut */}
        <polygon points="250,55  236,250 264,250" fill="#3d2b0e"/>
        {/* South tip — muted gold */}
        <polygon points="250,445 236,250 264,250" fill="#b09060"/>
        {/* Center pivot */}
        <circle cx="250" cy="250" r="14" fill="#2c1f0a"/>
        <circle cx="250" cy="250" r="8"  fill="#c8a97a"/>
        <circle cx="250" cy="250" r="3"  fill="#f5eedf"/>
      </g>

      {/* ── Decorative ring over needle center ── */}
      <circle cx="250" cy="250" r="36" fill="none" stroke="#c8a97a" strokeWidth="1.5"/>
    </svg>
  );
}
/* ── WHAT IS VAASTU ──────────────────────────────────────────────────────────── */
function WhatIsSection() {
  const sectionRef  = useRef(null);
  const compassRef  = useRef(null);   // ← replaces wheelRef
  const needleRef   = useRef(null);
  const bodyRef     = useRef(null);
  const { openVaastuBooking } = useBooking();
  useReveal(bodyRef);

  useEffect(() => {
    const s = sectionRef.current;
    const c = compassRef.current;
    if (!s || !c) return;

    let topOffset = s.getBoundingClientRect().top + window.scrollY;
    const onResize = () => { topOffset = s.getBoundingClientRect().top + window.scrollY; };
    window.addEventListener("resize", onResize, { passive: true });

    const needle = c.querySelector("#compass-needle");
    const sHeight = s.offsetHeight;

    const unsub = subscribeScroll((y) => {
      if (y > topOffset + sHeight || y + window.innerHeight < topOffset) return;

      const scrolledPast = Math.max(0, y - topOffset);

      // Whole compass drifts in (same as before)
      c.style.transform = `translate3d(-200px, 0, 0) rotateZ(${scrolledPast / 4}deg)`;

      // Needle rotates independently — faster, oscillating feel
      if (needle) {
        needle.style.transform = `rotateZ(${scrolledPast / 1.8}deg)`;
      }
    });

    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "130px 80px 140px", overflow: "hidden", position: "relative", contain: "paint",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)",
    }}>
      {/* grid wrapper — reduce gap */}
<div ref={bodyRef} className="mobile-col-1" style={{
  maxWidth: 1200,
  marginTop: -100,
  display: "grid",
  gridTemplateColumns: "1fr 1.25fr",
  gap: 80,                          // ✅ was 200
  alignItems: "center",
  position: "relative",
  zIndex: 50,
}}>

  {/* LEFT — compass */}
  <div className="vaastu-compass-col" style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    overflow: "visible",
  }}>
    <VaastuCompass />
  </div>

  {/* RIGHT — unchanged */}
 

        {/* RIGHT — unchanged … */}
    

        {/* RIGHT */}
        <div style={{ paddingTop: 8 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Ancient Indian Science of Architecture</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 16, transitionDelay: "0.08s" }}>
            What is Vaastu<br />Shastra?
          </h2>
          <p className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 37, color: gold, fontStyle: "italic", marginBottom: 36, transitionDelay: "0.12s" }}>
            The Science of Sacred Space
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 20, transitionDelay: "0.16s" }}>
            Vaastu Shastra is the ancient Indian science of architecture that focuses on balancing energies within a physical space. Rooted in the Vedas, it is based on the precise alignment of directions, elements, and energy flow within your environment.
          </p>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#6b5f5e", lineHeight: 1.95, marginBottom: 40, transitionDelay: "0.2s" }}>
            Your home or office is not just a structure — it is a living energy field that directly affects your health, relationships, finances, and peace of mind.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              Every space you inhabit carries a frequency — and that frequency is silently shaping your life, every single day.
            </p>
          </div>
          <div className="rv" style={{ transitionDelay: "0.28s" }}>
            <AccItem title="Directions & Five Elements" body="Vaastu aligns the five cosmic elements — Earth, Water, Fire, Air, and Space — with the eight directions to create a harmonious energy flow throughout your home or office." />
            <AccItem title="Energy Flow & Corrections" body="Imbalanced energy in your space can be corrected without demolition. Simple, practical adjustments to placement, colors, and materials can restore harmony and invite positive outcomes." />
          </div>
          <div className="rv" style={{ marginTop: 44, transitionDelay: "0.32s" }}>
            <button
              onClick={() => openVaastuBooking()}
              style={{ ...dashedBtn(dark), border: "1px dashed " + dark }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Vaastu Consultation →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── WHY IT MATTERS ──────────────────────────────────────────────────────────── */
const boxBg = "linear-gradient(180deg, #0d0b08 0%, #1a1410 60%, #1e1912 100%)";

function Item({ text, side }) {
  const isLeft = side === "left";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 16,
      padding: "18px 0",
      borderBottom: `1px solid rgba(201,169,110,${isLeft ? 0.06 : 0.1})`,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        border: isLeft ? "1px solid rgba(200,75,65,0.25)" : `1px solid rgba(201,169,110,0.35)`,
        background: isLeft ? "rgba(200,75,65,0.07)" : "rgba(201,169,110,0.07)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: isLeft ? "rgba(210,100,90,0.8)" : gold, fontSize: 12,
      }}>{isLeft ? "✗" : "✦"}</div>
      <span style={{
        fontFamily: "'Glacial Indifference', sans-serif", fontSize: 17,
        color: isLeft ? "rgba(245,235,220,0.5)" : "rgba(245,235,220,0.8)",
        lineHeight: 1.8, paddingTop: 6,
      }}>{text}</span>
    </div>
  );
}


function WhySection() {
  const ref = useRef(null);
  useReveal(ref);

  const imbalanced = [
    "Constant stress or mental discomfort",
    "Financial instability or slow growth",
    "Frequent conflicts in relationships",
    "Lack of motivation or clarity",
  ];
  const balanced = [
    "Sustained peace and emotional clarity",
    "Attract opportunities and financial growth",
    "Strengthen relationships and family bonds",
    "Enhance focus, productivity, and well-being",
  ];

  return (
    <section ref={ref} style={{
      background: "linear-gradient(180deg, #f5f0e8 0%, #fdf8f0 55%, #faf8f5 100%)",
      overflow: "hidden",
    }}>

      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "72px 48px 0" }}>
        <span style={{ width: 40, height: 1, background: gold, opacity: 0.7 }} />
        <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold }}>
          Your Environment Shapes Your Life
        </span>
        <span style={{ width: 40, height: 1, background: gold, opacity: 0.7 }} />
      </div>

      {/* Heading */}
      <div style={{ textAlign: "center", padding: "20px 48px 52px" }}>
        <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: "clamp(36px, 5.5vw, 54px)", fontWeight: 400, color: "#1c140d", lineHeight: 1.05, margin: "0 0 8px" }}>
          Why It Matters
        </h2>
        <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, color: gold, fontStyle: "italic", margin: "0 0 16px" }}>
          in Your Life
        </p>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 16, color: "#7a6e68", maxWidth: 500, margin: "0 auto", lineHeight: 1.9 }}>
          Your environment silently shapes your experiences. An imbalanced space can hold you back
          even when you are doing everything right.
        </p>
      </div>

      {/* Dark Brown Box */}
      <div className="why-dark-box" style={{
        margin: "0 40px 64px",
        background: "linear-gradient(180deg, #0d0b08 0%, #1a1410 60%, #1e1912 100%)",
        borderRadius: 3,
        padding: "56px 52px",
        border: "2px dashed rgba(201,169,110,0.65)",
      }}>

        {/* Diamond divider */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <span style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25))" }} />
          <span style={{ width: 6, height: 6, background: gold, transform: "rotate(45deg)", margin: "0 14px", flexShrink: 0 }} />
          <span style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,169,110,0.25))" }} />
        </div>

        {/* Grid */}
        <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>

          {/* Left — imbalanced */}
          <div style={{ paddingRight: 40 }}>
            <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 9, letterSpacing: 3.5, textTransform: "uppercase", color: "rgba(245,240,229,0.2)", marginBottom: 10 }}>
              Without Alignment
            </div>
            <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 400, lineHeight: 1.3, color: "rgba(245,240,229,0.45)", marginBottom: 28 }}>
              An Imbalanced Space<br />
              <em style={{ fontStyle: "italic", color: "rgba(200,75,65,0.6)" }}>Holds You Back</em>
            </div>
            {imbalanced.map((text, i) => (
              <Item key={i} text={text} side="left" />
            ))}
          </div>

          {/* Separator */}
          <div className="vaastu-why-sep" style={{ position: "relative", background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.3) 25%, rgba(201,169,110,0.3) 75%, transparent)" }}>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: 32, height: 32, background: boxBg,
              border: "1px solid rgba(201,169,110,0.4)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: gold,
            }}>→</div>
          </div>

          {/* Right — balanced */}
          <div style={{ paddingLeft: 40 }}>
            <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 9, letterSpacing: 3.5, textTransform: "uppercase", color: gold, marginBottom: 10 }}>
              With Vaastu Alignment
            </div>
            <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 400, lineHeight: 1.3, color: "#f0e8d5", marginBottom: 28 }}>
              A Balanced Space<br />
              <em style={{ fontStyle: "italic", color: gold }}>Transforms Your Life</em>
            </div>
            {balanced.map((text, i) => (
              <Item key={i} text={text} side="right" />
            ))}
          </div>

        </div>
      </div>

      {/* Tagline */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 0 56px" }}>
        <span style={{ width: 4, height: 4, background: gold, borderRadius: "50%", opacity: 0.6 }} />
        <span style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 15, fontStyle: "italic", color: "#9a8e85", letterSpacing: 0.3 }}>
          Space is not just architecture — it is the silent language of your life.
        </span>
        <span style={{ width: 4, height: 4, background: gold, borderRadius: "50%", opacity: 0.6 }} />
      </div>

    </section>
  );
}


const ELEM_IMAGES = {
  air: "assets/vaastu/wind.png",
  water: "assets/vaastu/jal.png",
  fire: "assets/vaastu/agni.png",
  earth: "assets/vaastu/prithvi.png",
  space: "assets/vaastu/akash.png",
};
/* ── FIVE ELEMENTS (PANCHABHUTA) ─────────────────────────────────────────────── */

function ElemSymbol({ type }) {
  const sv = { viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", height: "100%" } };
 
if (type === "earth") return (
  <svg {...sv}>
    {/* base square (stability) */}
    <rect x="12" y="12" width="76" height="76" stroke={gold} strokeWidth="1"/>

    {/* alchemical earth symbol */}
    <path d="M30 40 L50 70 L70 40 Z" stroke={gold} strokeWidth="0.8"/>
    <line x1="35" y1="50" x2="65" y2="50" stroke={gold} strokeWidth="0.6"/>

    {/* subtle grid */}
    <line x1="50" y1="12" x2="50" y2="88" stroke={gold} strokeWidth="0.4" opacity="0.3"/>
    <line x1="12" y1="50" x2="88" y2="50" stroke={gold} strokeWidth="0.4" opacity="0.3"/>

    {/* bindu */}
    <circle cx="50" cy="50" r="3" fill={gold}/>
  </svg>
);
 
if (type === "water") return (
  <svg {...sv}>
    {/* droplet */}
    <path d="M50 18 Q68 40 68 54 A18 18 0 0 1 32 54 Q32 40 50 18Z"
      stroke={gold} strokeWidth="1"/>

    {/* ripples */}
    <ellipse cx="50" cy="70" rx="22" ry="6" stroke={gold} strokeWidth="0.5" opacity="0.5"/>
    <ellipse cx="50" cy="78" rx="14" ry="4" stroke={gold} strokeWidth="0.4" opacity="0.3"/>

    {/* inner flow */}
    <path d="M50 30 Q60 45 50 55 Q40 45 50 30Z"
      stroke={gold} strokeWidth="0.4" opacity="0.4"/>
  </svg>
);
  if (type === "fire") return (
    <svg {...sv}>
      <path d="M50 10 L86 76 L14 76 Z" stroke={gold} strokeWidth="1" opacity="0.85"/>
      <path d="M50 26 L73 72 L27 72 Z" stroke={gold} strokeWidth="0.5" opacity="0.55"/>
      <path d="M50 44 L62 68 L38 68 Z" stroke={gold} strokeWidth="0.4" opacity="0.35"/>
      <line x1="14" y1="76" x2="86" y2="76" stroke={gold} strokeWidth="0.8" opacity="0.6"/>
      <circle cx="50" cy="60" r="3.5" fill={gold} opacity="0.55"/>
    </svg>
  );
  if (type === "air") return (
    <svg {...sv}>
      <circle cx="50" cy="50" r="37" stroke={gold} strokeWidth="1" opacity="0.85"/>
      <circle cx="50" cy="50" r="26" stroke={gold} strokeWidth="0.5" opacity="0.55"/>
      <circle cx="50" cy="50" r="10" stroke={gold} strokeWidth="0.4" opacity="0.35"/>
      {[0,60,120,180,240,300].map(a => {
        const r = a * Math.PI / 180;
        return <line key={a} x1={50 + 10*Math.cos(r)} y1={50 + 10*Math.sin(r)} x2={50 + 37*Math.cos(r)} y2={50 + 37*Math.sin(r)} stroke={gold} strokeWidth="0.5" opacity="0.4"/>;
      })}
      <circle cx="50" cy="50" r="2.5" fill={gold} opacity="0.75"/>
    </svg>
  );
  return (
    <svg {...sv}>
      <circle cx="50" cy="50" r="38" stroke={gold} strokeWidth="1" opacity="0.85"/>
      <circle cx="50" cy="50" r="28" stroke={gold} strokeWidth="0.5" opacity="0.6"/>
      <circle cx="50" cy="50" r="18" stroke={gold} strokeWidth="0.4" opacity="0.4"/>
      <circle cx="50" cy="50" r="8"  stroke={gold} strokeWidth="0.4" opacity="0.3"/>
      {[0,45,90,135,180,225,270,315].map(a => {
        const r = a * Math.PI / 180;
        return <line key={a} x1={50+8*Math.sin(r)} y1={50-8*Math.cos(r)} x2={50+38*Math.sin(r)} y2={50-38*Math.cos(r)} stroke={gold} strokeWidth="0.4" opacity="0.25"/>;
      })}
      <circle cx="50" cy="50" r="3" fill={gold} opacity="0.85"/>
    </svg>
  );
}

const ELEMS = [
  { type:"air",   name:"Vayu",    english:"Air",   dir:"Northwest", planet:"Moon",
    rules:"Movement, communication, and social connections.",
    tip:"Ensure good ventilation in the Northwest. Keep windows open — stagnant air here creates obstacles in relationships and communication." },
  { type:"water", name:"Jal",     english:"Water", dir:"Northeast", planet:"Jupiter",
    rules:"Mental clarity, abundance, and new opportunities.",
    tip:"Place a water feature, small fountain, or aquarium in the Northeast to activate prosperity and the steady inflow of new opportunities." },
  { type:"space", name:"Akasha",  english:"Space", dir:"Brahmasthan (Center)", planet:"—",
    rules:"Cosmic consciousness, expansion, and spiritual energy.",
    tip:"Keep the central zone of your home completely open and clutter-free. The Brahmasthan is the sacred heart — obstruct it and you obstruct life itself." },
  { type:"fire",  name:"Agni",    english:"Fire",  dir:"Southeast",  planet:"Venus",
    rules:"Vitality, metabolism, passion, and transformation.",
    tip:"The kitchen and electrical panels belong in the Southeast. Misplacing fire energy disturbs health, digestion, and the enthusiasm of all who live here." },
  { type:"earth", name:"Prithvi", english:"Earth", dir:"Southwest",  planet:"Mars",
    rules:"Stability, patience, and physical strength.",
    tip:"Place heavy furniture and the master bedroom in the Southwest. Avoid water features here — Earth energy must be dense and grounded to anchor the home." },
];

// Positions use pure top/left/bottom/right so JS parallax can freely set `transform`
const ELEM_POS = [
  { top:"20px",          left:"calc(50% - 85px)"  }, // air   — top
  { top:"calc(50% - 125px)", left:"20px"          }, // water — left
  { top:"calc(50% - 145px)", left:"calc(50% - 100px)" }, // space — center (200×290)
  { top:"calc(50% - 125px)", right:"20px"         }, // fire  — right
  { bottom:"20px",       left:"calc(50% - 85px)"  }, // earth — bottom
];
const ELEM_PAR = [-0.045, 0.038, 0, 0.045, -0.038];

function ElementsSection() {
  const sectionRef = useRef(null);
  const bgRef      = useRef(null);
  const [hov, setHov] = useState(null);
  const [pScale, setPScale] = useState(1);

  // pentagon geometry
  const R = 190, D = 144, CW = 800, CH = 560, CX = CW / 2, CY = CH / 2;
  // display order: Space(top), Water(NE), Fire(SE), Earth(SW), Air(NW)
  const DISP = [2, 1, 3, 4, 0];
  const elems = DISP.map(i => ELEMS[i]);
  const verts = elems.map((_, i) => {
    const a = -Math.PI / 2 + i * (2 * Math.PI / 5);
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
  });
  const hovEl = hov !== null ? elems[hov] : null;

  useEffect(() => {
    const s = sectionRef.current;
    if (!s) return;
    const updateScale = () => setPScale(Math.min(1, s.offsetWidth / (CW + 40)));
    updateScale();
    let sTop = s.getBoundingClientRect().top + window.scrollY;
    const onResize = () => {
      sTop = s.getBoundingClientRect().top + window.scrollY;
      updateScale();
    };
    window.addEventListener("resize", onResize, { passive: true });
    const unsub = subscribeScroll((y) => {
      if (y + window.innerHeight < sTop || y > sTop + s.offsetHeight) return;
      if (bgRef.current)
        bgRef.current.style.transform = `translate(-50%,-50%) rotate(${y * 0.005}deg)`;
    });
    return () => { unsub(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(180deg, #0d0b08 0%, #1a1410 60%, #1e1912 100%)",
      padding: "110px 72px 120px",
    }}>
      {/* Rotating yantra */}
      <div ref={bgRef} style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 1000, height: 1000, opacity: 0.05,
        pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <circle cx="50" cy="50" r="48" stroke={gold} strokeWidth="0.35"/>
          <circle cx="50" cy="50" r="38" stroke={gold} strokeWidth="0.25"/>
          <circle cx="50" cy="50" r="28" stroke={gold} strokeWidth="0.25"/>
          <rect x="9" y="9" width="82" height="82" stroke={gold} strokeWidth="0.25"/>
          <rect x="20" y="20" width="60" height="60" stroke={gold} strokeWidth="0.2"/>
          <path d="M50 2 L60 40 L98 40 L68 63 L78 98 L50 76 L22 98 L32 63 L2 40 L40 40 Z" stroke={gold} strokeWidth="0.25"/>
          {[0,45,90,135,180,225,270,315].map(a => {
            const r = a * Math.PI / 180;
            return <line key={a} x1={50} y1={50} x2={50+48*Math.sin(r)} y2={50-48*Math.cos(r)} stroke={gold} strokeWidth="0.18"/>;
          })}
        </svg>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 64, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
          <span style={{ width: 40, height: 1, background: gold, opacity: 0.6 }} />
          <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>The Cosmic Framework of Vaastu</span>
          <span style={{ width: 40, height: 1, background: gold, opacity: 0.6 }} />
        </div>
        <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: "#fff", lineHeight: 1.1, marginBottom: 8 }}>
          Panchabhuta
        </h2>
        <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, color: gold, fontStyle: "italic", marginBottom: 20 }}>
          The Five Sacred Elements
        </p>
        <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.38)", maxWidth: 520, margin: "0 auto", lineHeight: 1.95 }}>
          In Vaastu Shastra, every direction of your space is governed by one of five cosmic elements.
          Hover any element to reveal its Vaastu significance.
        </p>
      </div>

      {/* Pentagon of circles — JS-scaled to fit any viewport */}
      <div style={{
        width: "100%", display: "flex", justifyContent: "center",
        overflow: "hidden", position: "relative", zIndex: 2,
        height: CH * pScale,
      }}>
      <div className="vaastu-penta-vis" style={{
        position: "relative", height: CH, width: CW, flexShrink: 0,
        transform: pScale < 1 ? `scale(${pScale})` : undefined,
        transformOrigin: "top center",
      }}>

        {/* SVG: circumscribed circle + pentagon edges + spokes */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox={`0 0 ${CW} ${CH}`} xmlns="http://www.w3.org/2000/svg">
          <circle cx={CX} cy={CY} r={R} stroke={gold} strokeWidth="0.6" strokeDasharray="3 9" fill="none" opacity="0.14"/>
          {verts.map((v, i) => (
            <line key={`e${i}`} x1={v.x} y1={v.y} x2={verts[(i+1)%5].x} y2={verts[(i+1)%5].y}
              stroke={gold} strokeWidth="0.5" strokeDasharray="2 10" opacity="0.1"/>
          ))}
          {verts.map((v, i) => (
            <line key={`s${i}`} x1={CX} y1={CY} x2={v.x} y2={v.y}
              stroke={gold} strokeWidth="0.3" opacity="0.07"/>
          ))}
          <circle cx={CX} cy={CY} r="6" stroke={gold} strokeWidth="0.6" fill="none" opacity="0.2"/>
          <circle cx={CX} cy={CY} r="2" fill={gold} opacity="0.18"/>
        </svg>

        {/* 5 circular cards */}
        {elems.map((el, i) => {
          const { x, y } = verts[i];
          const isHov = hov === i;
          return (
            <div key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              onClick={() => setHov(hov === i ? null : i)}
              style={{
                position: "absolute",
                left: x - D / 2,
                top: y - D / 2,
                width: D, height: D,
                borderRadius: "50%",
                border: `1px solid rgba(201,169,110,${isHov ? 0.75 : 0.22})`,
                background: isHov
                  ? "linear-gradient(135deg, rgba(201,169,110,0.14) 0%, rgba(10,8,5,0.97) 100%)"
                  : "rgba(14,10,7,0.8)",
                boxShadow: isHov
                  ? `0 0 40px rgba(201,169,110,0.22), 0 0 80px rgba(201,169,110,0.08), inset 0 0 28px rgba(201,169,110,0.05)`
                  : "none",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.35s, background 0.35s, box-shadow 0.35s, transform 0.35s",
                transform: isHov ? "scale(1.12)" : "scale(1)",
                zIndex: isHov ? 10 : 1,
                padding: "0 12px",
              }}
            >
              <div style={{
  width: 42,
  height: 42,
  marginBottom: 9,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}}>
  <img
    src={ELEM_IMAGES[el.type]}
    alt={el.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      opacity: isHov ? 1 : 0.6,
      transition: "opacity 0.3s, transform 0.35s",
      transform: isHov ? "scale(1.1)" : "scale(1)"
    }}
  />
</div>
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 15, color: "#fff", letterSpacing: 0.4, textAlign: "center", lineHeight: 1.2, marginBottom: 4 }}>
                {el.name}
              </div>
              <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 8, letterSpacing: 2.5, textTransform: "uppercase", color: gold, opacity: isHov ? 1 : 0.65, transition: "opacity 0.3s" }}>
                {el.english}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Info panel — updates on hover */}
      <div style={{
        maxWidth: 660, margin: "0 auto",
        padding: "36px 48px",
        border: `1px solid rgba(201,169,110,${hovEl ? 0.26 : 0.07})`,
        background: hovEl ? "rgba(20,14,9,0.72)" : "transparent",
        textAlign: "center", minHeight: 160,
        transition: "border-color 0.4s, background 0.4s",
        position: "relative", zIndex: 2,
      }}>
        {hovEl ? (
          <div style={{ animation: "floatUp 0.28s ease forwards" }}>
            <div style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 14 }}>
              {hovEl.english}
              {" · "}{hovEl.dir === "Brahmasthan (Center)" ? "Brahmasthan" : hovEl.dir}
              {hovEl.planet !== "—" ? ` · ${hovEl.planet}` : ""}
            </div>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 17, color: "rgba(255,255,255,0.82)", lineHeight: 1.85, fontStyle: "italic", marginBottom: 16 }}>
              {hovEl.rules}
            </p>
            <div style={{ width: 24, height: 1, background: gold, opacity: 0.3, margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.9 }}>
              {hovEl.tip}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 16, color: "rgba(255,255,255,0.14)", fontStyle: "italic", paddingTop: 32 }}>
            Hover any element to reveal its Vaastu role and practical guidance
          </p>
        )}
      </div>

      <p style={{
        fontFamily: "'Ibarra Real Nova', serif", fontSize: 15,
        color: "rgba(255,255,255,0.13)", textAlign: "center",
        marginTop: 52, fontStyle: "italic", letterSpacing: 0.6,
        position: "relative", zIndex: 2,
      }}>
        "When all five elements are in harmony, your space becomes a temple of abundance."
      </p>
    </section>
  );
}

/* ── WHAT YOU GAIN ───────────────────────────────────────────────────────────── */
const GAINS = [
  { symbol: "◉", label: "Layout Analysis",         desc: "A detailed, room-by-room analysis of your home or office layout — identifying every area of energetic imbalance and its impact on your life." },
  { symbol: "⊕", label: "Energy Mapping",           desc: "Precise identification of energy imbalances in your space — understanding which directions and zones are working against your goals." },
  { symbol: "◈", label: "Practical Corrections",    desc: "Actionable, straightforward remedies for each identified issue — no demolition, no major reconstruction, just effective adjustments." },
  { symbol: "✦", label: "Flow Optimization",         desc: "Expert guidance on improving the flow of positive energy throughout your space to invite abundance, peace, and clarity." },
];

function GainSection() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section style={{
      padding: "120px 72px", overflow: "hidden", position: "relative",
      background: "linear-gradient(180deg, #faf8f5 0%, #f5f0e8 60%, #faf8f5 100%)",
    }}>
      <div ref={ref} style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="rv" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: gold }} />
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>From a Consultation</span>
            <span style={{ width: 28, height: 1, background: gold }} />
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.1, marginBottom: 14, transitionDelay: "0.08s" }}>
            What You Can Gain<br /><em style={{ color: gold, fontStyle: "italic" }}>From a Consultation</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 20, color: "#7a6e68", maxWidth: 520, margin: "0 auto", lineHeight: 1.8, transitionDelay: "0.14s" }}>
            A Vaastu consultation helps you transform your environment without drastic changes — practical, effective, and immediately applicable.
          </p>
        </div>

        <div className="mobile-col-1 vaastu-gains-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {GAINS.map((g, i) => (
            <div key={i} className="rv" style={{
              padding: "40px 28px 36px",
              border: "1px solid rgba(201,169,110,0.18)",
              background: "#fff",
              textAlign: "center",
              transitionDelay: `${0.06 + i * 0.09}s`,
              transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s cubic-bezier(.22,1,.36,1)",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(201,169,110,0.1)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.18)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 42, color: gold, opacity: 0.7, lineHeight: 1, marginBottom: 20 }}>{g.symbol}</div>
              <h4 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 500, color: dark, marginBottom: 14, lineHeight: 1.3 }}>{g.label}</h4>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 15, color: "#7a6e68", lineHeight: 1.85 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── HOW WE HELP ─────────────────────────────────────────────────────────────── */
function ApproachSection() {
  const ref = useRef(null);
  useReveal(ref);

  const steps = [
    { n: "01",  title: "Detailed Directional Analysis",  desc: "A thorough examination of your space against all eight directions — identifying which zones are aligned with your goals and which are creating resistance." },
    { n: "02",  title: "Room-by-Room Evaluation",         desc: "Every room serves a purpose. We assess each space individually — bedroom, kitchen, office, entrance — and evaluate its energetic impact on your life." },
    { n: "03",  title: "Simple Remedies, No Demolition",  desc: "Effective Vaastu corrections do not require breaking walls. We provide practical, non-invasive remedies you can apply immediately for real results." },
    { n: "04",  title: "Energy Enhancement Techniques",   desc: "Beyond corrections, we guide you on intentional enhancements — colors, placements, materials, and practices that amplify the positive energy in your space." },
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
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold }}>Our Approach</span>
          </div>
          <h2 className="rv" style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: HEADING_SIZE, fontWeight: 400, color: dark, lineHeight: 1.12, marginBottom: 24, transitionDelay: "0.08s" }}>
            How We Help You at<br /><em style={{ color: gold, fontStyle: "italic" }}>Vedic Saar</em>
          </h2>
          <p className="rv" style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6e68", lineHeight: 1.9, marginBottom: 40, transitionDelay: "0.14s" }}>
            We focus on realistic and practical Vaastu solutions — effective changes that restore harmony without disrupting your life.
          </p>
          <div className="rv" style={{ borderLeft: `3px solid ${gold}`, padding: "20px 26px", background: `${gold}0a`, marginBottom: 44, transitionDelay: "0.24s" }}>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: "#7a6460", lineHeight: 1.85, fontStyle: "italic" }}>
              "We ensure that every change is easy to implement, deeply effective, and completely non-disruptive."
            </p>
          </div>
          
        </div>
        <div>
          {steps.map((s, i) => (
            <div key={i} className="rv step-row" style={{ transitionDelay: `${0.08 + i * 0.1}s` }}>
              <div className="step-num">{s.n}</div>
              <div>
                <h5 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 22, fontWeight: 600, color: dark, marginBottom: 8 }}>
                  {s.title}
                </h5>
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
  const { openVaastuBooking } = useBooking();
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
    "Moving into a new home or office",
    "Feeling discomfort, stress, or negativity in your current space",
    "Facing persistent financial instability or slow growth",
    "Experiencing recurring conflicts or relationship tension at home",
    "Looking to improve focus, productivity, and well-being",
    "Ready for your space to fully support your goals and vision",
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
              Your Space Has the Power<br />
              <em style={{ color: gold, fontStyle: "italic" }}>to Uplift Your Life</em>
            </h2>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 22, color: "#7a6460", lineHeight: 1.75, marginBottom: 14 }}>
              Your environment is silently shaping your reality — let us align it in your favour.
            </p>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: gold, fontStyle: "italic", lineHeight: 1.7, marginBottom: 42 }}>
              Limited slots available — book early to secure your session.
            </p>
            <button
              onClick={() => openVaastuBooking()}
              style={{ ...dashedBtn("#fff"), background: dark, border: "2px dashed rgba(201,169,110,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = "#2e2620"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = dark; e.currentTarget.style.boxShadow = "none"; }}>
              Book Your Vaastu Consultation Now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── ROOT ────────────────────────────────────────────────────────────────────── */
export default function VaastuPage() {
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
        <ConstellationOverlay />
        <WhatIsSection />
        <SlidingStrip />
        <WhySection />
        <ElementsSection />
        <GainSection />
        <ApproachSection />
        <WhoAndCTASection />
      </div>
    </>
  );
}
