import { useEffect, useRef, useState } from "react";
import { useBooking } from "../components/BookingContext";


/* ── Palette (exact match to Career page) ── */
const GOLD   = "#c9a96e";
const GOLD2  = "#e8c98a";
const DARK   = "#0d0a06";
const DARK2  = "#140f08";
const CREAM  = "#f5f0e8";
const CREAM2 = "#fdf9f3";
const MUTED  = "#8a7e76";
const W      = "#ffffff";


const HEADING_FONT = "'Ibarra Real Nova', serif";
const BODY_FONT    = "'Glacial Indifference', sans-serif";
const HEADING_SIZE = "clamp(38px, 5.5vw, 64px)";
const BODY_SIZE    = "14px";

/* ── Scroll bus ── */
let _sY = 0, _sTick = false, _sInit = false;
const _sFns = new Set();
function subScroll(fn) {
  if (!_sInit && typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      _sY = window.scrollY;
      if (!_sTick) {
        requestAnimationFrame(() => { _sFns.forEach(f => f(_sY)); _sTick = false; });
        _sTick = true;
      }
    }, { passive: true });
    _sInit = true;
  }
  _sFns.add(fn);
  return () => _sFns.delete(fn);
}

/* ── Reveal hook ── */
function useReveal(ref) {
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("rv"); obs.unobserve(en.target); }
      }),
      { threshold: 0.04, rootMargin: "0px" }
    );
    c.querySelectorAll(".r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════════ CSS ══ */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --gold: #c9a96e;
    --gold2: #e8c98a;
    --dark: #0d0a06;
    --cream: #f5f0e8;
  }

  .r {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1);
  }
  .r.rv { opacity: 1; transform: none; }
  .r.d1 { transition-delay: 0.08s }
  .r.d2 { transition-delay: 0.18s }
  .r.d3 { transition-delay: 0.28s }
  .r.d4 { transition-delay: 0.40s }
  .r.d5 { transition-delay: 0.52s }
  .r.d6 { transition-delay: 0.64s }

  @keyframes hero-rise    { from { opacity:0; transform:translateY(60px) } to { opacity:1; transform:none } }
  @keyframes spin-slow    { to { transform: rotate(360deg) } }
  @keyframes spin-rev     { to { transform: rotate(-360deg) } }
  @keyframes gold-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes nebula-pulse {
    0%,100% { opacity: 0.042; transform: scale(1); }
    50%     { opacity: 0.085; transform: scale(1.12); }
  }
  @keyframes twinkle-glow {
    0%,100% { opacity: 0.07; transform: scale(0.72); }
    50%     { opacity: 0.62; transform: scale(1.12); }
  }
  @keyframes flame-flicker {
    0%,100% { transform: scaleX(1) scaleY(1) rotate(-0.5deg); opacity: 1; }
    25%     { transform: scaleX(0.92) scaleY(1.06) rotate(1.2deg); opacity: 0.95; }
    50%     { transform: scaleX(1.06) scaleY(0.97) rotate(-0.8deg); opacity: 1; }
    75%     { transform: scaleX(0.96) scaleY(1.04) rotate(0.9deg); opacity: 0.97; }
  }
  @keyframes ember-rise {
    0%   { opacity: 0; transform: translateY(0) translateX(0) scale(1); }
    10%  { opacity: 0.9; }
    80%  { opacity: 0.25; }
    100% { opacity: 0; transform: translateY(-240px) translateX(var(--drift, 0px)) scale(0.3); }
  }
  @keyframes shoot {
    0%   { opacity: 0; transform: rotate(var(--rot,28deg)) translate(var(--sx0,-150px), var(--sy0,-80px)); }
    8%   { opacity: 0.9; }
    70%  { opacity: 0.55; }
    100% { opacity: 0; transform: rotate(var(--rot,28deg)) translate(var(--sx1,500px), var(--sy1,280px)); }
  }
  @keyframes starsFloat {
    0%   { transform: translateY(0) scale(0.8); opacity: 0; }
    15%  { opacity: 0.12; }
    50%  { transform: translateY(-50vh) scale(1.1); opacity: 0.18; }
    100% { transform: translateY(-110vh) scale(1.4); opacity: 0; }
  }
  @keyframes glow-breathe {
    0%,100% { opacity: 0.35; transform: scale(0.88); }
    50%     { opacity: 0.65; transform: scale(1.1); }
  }
  @keyframes scroll-pulse {
    0%,100% { transform: scaleY(1); opacity: 0.5; }
    50%     { transform: scaleY(1.4); opacity: 1; }
  }
  @keyframes flame-birth {
    0%   { opacity:0; transform:scaleX(.04) scaleY(.02); filter:blur(6px); }
    25%  { opacity:.55; transform:scaleX(.5) scaleY(.3) rotate(-1.5deg); filter:blur(2px); }
    60%  { opacity:.85; transform:scaleX(.88) scaleY(.82) rotate(1deg); filter:blur(.5px); }
    100% { opacity:1; transform:scaleX(1) scaleY(1); filter:blur(0); }
  }
  @keyframes diya-body-in {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes glow-rise {
    from { opacity:0; transform:translateX(-50%) scale(0.4); }
    to   { opacity:1; transform:translateX(-50%) scale(1); }
  }

  .gold-shimmer {
    background: linear-gradient(90deg, #c9a96e 0%, #e8c98a 30%, #fff8e8 50%, #e8c98a 70%, #c9a96e 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gold-shimmer 6s linear infinite;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .eyebrow-line { width: 40px; height: 1px; background: rgba(201,169,110,0.45); }
  .eyebrow-line.light { background: rgba(245,240,232,0.25); }
  .eyebrow-text {
    font-family: 'Glacial Indifference', sans-serif;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    opacity: 0.8;
  }
  .eyebrow-text.light { color: rgba(245,240,232,0.5); opacity: 1; }

  .pcard {
    position: relative;
    background: linear-gradient(145deg, #ffffff, #f9f5ed);
    border: 1px solid rgba(201,169,110,0.2);
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s, border-color 0.4s;
    cursor: default;
  }
  .pcard::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .pcard:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 60px rgba(28,20,13,0.12), 0 0 0 1px rgba(201,169,110,0.35);
    border-color: rgba(201,169,110,0.35);
  }
  .pcard:hover::before { opacity: 1; }
  .pcard:hover .pcard-orb { opacity: 0.55 !important; transform: scale(1.15) !important; }

  .pcard-orb {
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,169,110,0.13) 0%, transparent 70%);
    opacity: 0.18;
    transition: opacity 0.4s, transform 0.6s;
    pointer-events: none;
  }

  .dark-pcard {
    position: relative;
    background: linear-gradient(145deg, #1c150e, #140e08);
    border: 1px solid rgba(201,169,110,0.22);
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s, border-color 0.4s;
    cursor: default;
  }
  .dark-pcard:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,169,110,0.38);
    border-color: rgba(201,169,110,0.42);
  }

  .step-row {
    display: flex;
    gap: 24px;
    padding: 20px 0;
    align-items: flex-start;
    border-bottom: 1px solid rgba(201,169,110,0.08);
    transition: padding-left 0.25s ease, border-color 0.25s;
    cursor: default;
  }
  .step-row:hover { padding-left: 10px; border-bottom-color: rgba(201,169,110,0.22); }
  .step-row:last-child { border-bottom: none; }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 18px 56px;
    background: #0d0a06;
    border: 2px dashed #ffffff;
    color: #ffffff;
    font-family: 'Glacial Indifference', sans-serif;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    transition: opacity 0.3s;
  }
  .cta-btn:hover { opacity: 0.8; }

  .grain::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.3;
    mix-blend-mode: overlay;
    z-index: 0;
  }

  .pillar-card {
    transition: transform 0.35s cubic-bezier(.16,1,.3,1), box-shadow 0.35s;
    cursor: default;
  }
  .pillar-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(28,20,13,0.09); }

  @media (max-width: 900px) {
    .poojas-grid { grid-template-columns: 1fr !important; }
    .pillars-grid { grid-template-columns: 1fr !important; }
    .process-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 580px) {
    .process-grid { grid-template-columns: 1fr !important; }
  }
`;

/* ── Planet SVG Icons (stroke-only, black/gold) ── */
const PlanetIcons = {
  Sun: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
      <circle cx="24" cy="24" r="9" />
      <line x1="24" y1="4" x2="24" y2="10" />
      <line x1="24" y1="38" x2="24" y2="44" />
      <line x1="4" y1="24" x2="10" y2="24" />
      <line x1="38" y1="24" x2="44" y2="24" />
      <line x1="9.5" y1="9.5" x2="13.7" y2="13.7" />
      <line x1="34.3" y1="34.3" x2="38.5" y2="38.5" />
      <line x1="38.5" y1="9.5" x2="34.3" y2="13.7" />
      <line x1="13.7" y1="34.3" x2="9.5" y2="38.5" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <path d="M30 8 C18 10 12 20 14 30 C16 40 26 46 36 42 C22 42 14 32 18 20 C20 13 25 9 30 8Z" />
    </svg>
  ),
  Mars: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <circle cx="20" cy="28" r="12" />
      <line x1="29" y1="19" x2="40" y2="8" />
      <polyline points="32,8 40,8 40,16" />
    </svg>
  ),
  Mercury: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <circle cx="24" cy="22" r="9" />
      <line x1="24" y1="31" x2="24" y2="40" />
      <line x1="18" y1="37" x2="30" y2="37" />
      <path d="M15 14 C15 9 33 9 33 14" />
    </svg>
  ),
  Jupiter: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <path d="M28 8 C18 8 13 14 13 20 C13 28 22 30 28 30" />
      <line x1="28" y1="8" x2="28" y2="40" />
      <line x1="12" y1="26" x2="38" y2="26" />
      <line x1="34" y1="36" x2="42" y2="44" />
    </svg>
  ),
  Venus: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <circle cx="24" cy="18" r="11" />
      <line x1="24" y1="29" x2="24" y2="40" />
      <line x1="17" y1="36" x2="31" y2="36" />
    </svg>
  ),
  Saturn: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <path d="M22 8 C12 8 16 28 22 38" />
      <line x1="22" y1="8" x2="22" y2="38" />
      <line x1="12" y1="20" x2="32" y2="20" />
      <path d="M8 36 C14 28 30 28 40 36" strokeDasharray="3 2" />
    </svg>
  ),
  Rahu: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <path d="M10 24 C10 14 38 14 38 24" />
      <circle cx="10" cy="24" r="3" />
      <circle cx="38" cy="24" r="3" />
      <line x1="24" y1="24" x2="24" y2="38" />
      <line x1="18" y1="32" x2="30" y2="38" />
      <line x1="30" y1="32" x2="18" y2="38" />
    </svg>
  ),
  Shiva: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <path d="M24 6 C16 10 12 18 14 26 C16 34 22 40 24 42 C26 40 32 34 34 26 C36 18 32 10 24 6Z" />
      <path d="M18 18 C20 22 28 22 30 18" />
      <line x1="24" y1="6" x2="24" y2="4" />
      <path d="M20 8 C16 4 10 6 8 10" />
      <path d="M28 8 C32 4 38 6 40 10" />
    </svg>
  ),
  Navagraha: () => (
    <svg viewBox="0 0 48 48" fill="none" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" style={{ width: 48, height: 48 }}>
      <circle cx="24" cy="24" r="5" />
      {[0,1,2,3,4,5,6,7,8].map(i => {
        const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
        const x = 24 + 14 * Math.cos(a);
        const y = 24 + 14 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="3" />;
      })}
      <circle cx="24" cy="24" r="19" strokeDasharray="4 3" opacity="0.5" />
    </svg>
  ),
};

/* ── Process step SVGs ── */
const ProcessIcons = {
  Share: () => (
    <svg viewBox="0 0 40 40" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" style={{ width: 40, height: 40 }}>
      <rect x="6" y="12" width="28" height="20" rx="1" />
      <path d="M6 18 L20 26 L34 18" />
      <line x1="20" y1="6" x2="20" y2="12" />
      <polyline points="16,9 20,5 24,9" />
    </svg>
  ),
  Prescribe: () => (
    <svg viewBox="0 0 40 40" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" style={{ width: 40, height: 40 }}>
      <circle cx="20" cy="16" r="8" />
      <path d="M14 28 C10 32 10 36 20 36 C30 36 30 32 26 28" />
      <line x1="17" y1="16" x2="23" y2="16" />
      <line x1="20" y1="13" x2="20" y2="19" />
    </svg>
  ),
  Ritual: () => (
    <svg viewBox="0 0 40 40" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" style={{ width: 40, height: 40 }}>
      <path d="M20 6 C20 6 14 14 14 20 C14 26 17 30 20 30 C23 30 26 26 26 20 C26 14 20 6 20 6Z" />
      <line x1="20" y1="30" x2="20" y2="36" />
      <line x1="10" y1="36" x2="30" y2="36" />
      <line x1="8" y1="32" x2="32" y2="32" />
    </svg>
  ),
  Report: () => (
    <svg viewBox="0 0 40 40" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round" style={{ width: 40, height: 40 }}>
      <rect x="8" y="6" width="24" height="30" rx="1" />
      <line x1="13" y1="14" x2="27" y2="14" />
      <line x1="13" y1="19" x2="27" y2="19" />
      <line x1="13" y1="24" x2="22" y2="24" />
      <circle cx="28" cy="30" r="5" fill="none" />
      <polyline points="26,30 28,32 32,28" strokeWidth="1" />
    </svg>
  ),
};

/* ── Pillar SVGs ── */
const PillarIcons = {
  Fire: () => (
    <svg viewBox="0 0 64 72" fill="none" style={{ width: 64, height: 72 }}>
      {/* outer flame */}
      <path d="M32 6 C32 6 14 22 14 38 C14 52 22 62 32 64 C42 62 50 52 50 38 C50 22 32 6 32 6Z" fill="url(#pi-f1)" opacity=".88"/>
      {/* mid flame */}
      <path d="M32 20 C32 20 22 32 22 42 C22 52 27 58 32 60 C37 58 42 52 42 42 C42 32 32 20 32 20Z" fill="url(#pi-f2)" opacity=".9"/>
      {/* core */}
      <path d="M32 38 C32 38 28 43 28 47 C28 51 30 54 32 55 C34 54 36 51 36 47 C36 43 32 38 32 38Z" fill="rgba(255,255,220,.9)"/>
      {/* wick */}
      <line x1="32" y1="64" x2="32" y2="70" stroke="#5a3a10" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="pi-f1" x1="32" y1="6" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff3a0"/>
          <stop offset="38%" stopColor="#ffc044"/>
          <stop offset="72%" stopColor="#e8732a"/>
          <stop offset="100%" stopColor="#b83808"/>
        </linearGradient>
        <linearGradient id="pi-f2" x1="32" y1="20" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff8c0"/>
          <stop offset="55%" stopColor="#ffb300"/>
          <stop offset="100%" stopColor="rgba(255,130,30,.7)"/>
        </linearGradient>
      </defs>
    </svg>
  ),

Mantra: () => (
  <div
    style={{
      width: 64,
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Ibarra Real Nova', serif",
      fontSize: 42,
      color: GOLD,
      
      borderRadius: "50%",
      
    }}
  >
    ॐ
  </div>
),

  Offering: () => (
    <svg viewBox="0 0 64 64" fill="none" style={{ width: 64, height: 64 }}>
      {/* 5 lotus petals */}
      <path d="M32 52 C32 52 25 40 25 30 C25 20 32 14 32 14 C32 14 39 20 39 30 C39 40 32 52 32 52Z" fill={GOLD} opacity=".88"/>
      <path d="M32 50 C32 50 19 44 15 34 C11 24 17 15 17 15 C17 15 24 22 28 32 C30 39 32 50 32 50Z" fill={GOLD} opacity=".65"/>
      <path d="M32 50 C32 50 45 44 49 34 C53 24 47 15 47 15 C47 15 40 22 36 32 C34 39 32 50 32 50Z" fill={GOLD} opacity=".65"/>
      <path d="M30 50 C30 50 15 46 10 36 C5 26 11 17 11 17 C11 17 19 23 23 33 C26 40 30 50 30 50Z" fill={GOLD} opacity=".36"/>
      <path d="M34 50 C34 50 49 46 54 36 C59 26 53 17 53 17 C53 17 45 23 41 33 C38 40 34 50 34 50Z" fill={GOLD} opacity=".36"/>
      {/* centre */}
      <circle cx="32" cy="30" r="5.5" fill="rgba(255,250,210,.95)" stroke={GOLD} strokeWidth=".8"/>
      <circle cx="32" cy="30" r="2.5" fill={GOLD} opacity=".7"/>
      {/* water line */}
      <path d="M8 54 Q20 50 32 54 Q44 58 56 54" stroke={GOLD} strokeWidth="1" fill="none" strokeLinecap="round" opacity=".45"/>
    </svg>
  ),
};

/* ── DATA ── */
const poojas = [
  {
    icon: "Sun",
    name: "Surya Pooja",
    san: "सूर्य पूजा",
    planet: "Sun",
    tag: "Authority",
    dur: "1.5 hrs",
    purpose: "For career growth, authority, and clarity of purpose. Recommended for those with a weak or afflicted Sun.",
    remedy: "Strengthens leadership, paternal relationships, and governmental favour.",
  },
  {
    icon: "Moon",
    name: "Chandra Pooja",
    san: "चंद्र पूजा",
    planet: "Moon",
    tag: "Emotional Peace",
    dur: "1.5 hrs",
    purpose: "For emotional peace, mental stability, and harmony in family life. Ideal for Moon-related anxieties and maternal relationship issues.",
    remedy: "Calms the mind, stabilises moods, and mends family bonds.",
  },
  {
    icon: "Mars",
    name: "Mangal Pooja",
    san: "मंगल पूजा",
    planet: "Mars",
    tag: "Courage",
    dur: "2 hrs",
    purpose: "To overcome aggression, resolve Manglik dosha, and attract courage and drive.",
    remedy: "Neutralises Manglik dosha and amplifies competitive strength.",
  },
  {
    icon: "Mercury",
    name: "Budh Pooja",
    san: "बुध पूजा",
    planet: "Mercury",
    tag: "Intellect",
    dur: "1.5 hrs",
    purpose: "For sharp intellect, business success, communication skills, and academic excellence.",
    remedy: "Sharpens analytical thinking and unlocks financial intelligence.",
  },
  {
    icon: "Jupiter",
    name: "Guru Pooja",
    san: "गुरु पूजा",
    planet: "Jupiter",
    tag: "Wisdom",
    dur: "2 hrs",
    purpose: "For wisdom, prosperity, spiritual growth, and blessings in marriage and children.",
    remedy: "Invites divine grace, expands opportunities, and blesses progeny.",
  },
  {
    icon: "Venus",
    name: "Shukra Pooja",
    san: "शुक्र पूजा",
    planet: "Venus",
    tag: "Abundance",
    dur: "2 hrs",
    purpose: "For love, luxury, creative expression, and marital bliss.",
    remedy: "Attracts beauty, artistic success, and harmonious partnerships.",
  },
  {
    icon: "Saturn",
    name: "Shani Pooja",
    san: "शनि पूजा",
    planet: "Saturn",
    tag: "Karmic Relief",
    dur: "2.5 hrs",
    purpose: "For karmic relief, especially during Sade Sati, Dhaiya, or Saturn Mahadasha. Reduces suffering and transforms discipline into reward.",
    remedy: "Converts Shani's burdens into hard-won, lasting rewards.",
  },
  {
    icon: "Rahu",
    name: "Rahu & Ketu Pooja",
    san: "राहु-केतु पूजा",
    planet: "Rahu & Ketu",
    tag: "Liberation",
    dur: "3 hrs",
    purpose: "For relief from confusion, obsession, ancestral karma, and sudden upheavals.",
    remedy: "Dissolves shadow-planet afflictions and breaks karmic loops.",
  },
  {
    icon: "Shiva",
    name: "Maha Mrityunjaya Havan",
    san: "महामृत्युंजय हवन",
    planet: "Shiva",
    tag: "Protection",
    dur: "4 hrs",
    purpose: "A powerful fire ritual invoking Lord Shiva for health, longevity, and protection from life-threatening situations.",
    remedy: "The supreme protective ritual — conquering fear and illness.",
  },
  {
    icon: "Navagraha",
    name: "Navgraha Shanti Pooja",
    san: "नवग्रह शांति पूजा",
    planet: "All 9",
    tag: "Complete Balance",
    dur: "5 hrs",
    purpose: "A comprehensive ritual balancing all nine planetary energies simultaneously, prescribed for those facing multiple life challenges at once.",
    remedy: "Total planetary realignment — the most complete offering available.",
  },
];

const pillars = [
  {
    icon: "Fire",
    title: "Agni — The Sacred Fire",
    body: "The havan flame carries your intentions beyond the visible world. Offerings placed into fire are transmuted into direct cosmic signals, bypassing the ordinary channels of cause and effect.",
  },
  {
    icon: "Mantra",
    title: "Mantra — The Precise Word",
    body: "Vedic syllables resonate at specific frequencies that interact directly with planetary energies in your chart. Pronunciation, count, and timing are exact — there is no approximation in sacred sound.",
  },
  {
    icon: "Offering",
    title: "Naivedya — Sacred Offering",
    body: "Each planet receives specific flowers, grains, herbs, and substances aligned to its elemental and rashi nature. Incorrect offerings produce no effect; precision is everything.",
  },
];

const processSteps = [
  {
    n: "01",
    icon: "Share",
    title: "Share Your Details",
    body: "Provide your birth date, time, and place alongside your current life challenges. Our astrologer studies the full chart before recommending any ritual.",
  },
  {
    n: "02",
    icon: "Prescribe",
    title: "Prescription",
    body: "Our astrologer identifies the afflicted planet(s) and prescribes the appropriate Pooja — along with the most auspicious muhurta (timing) for maximum efficacy.",
  },
  {
    n: "03",
    icon: "Ritual",
    title: "The Ritual",
    body: "Experienced Vedic pandits perform the complete ritual with full protocols — mantra recitation, havan fire offerings, and final aarti. No shortcuts, no half-measures.",
  },
  {
    n: "04",
    icon: "Report",
    title: "Report & Prasad",
    body: "You receive a detailed post-ritual report, sacred prasad where applicable, and personalised follow-up guidance for sustaining the shift.",
  },
];

const problems = [
  "My career has stagnated despite consistent effort — which planet is responsible?",
  "My relationships dissolve repeatedly and I cannot understand why.",
  "I suffer from persistent health issues that medicine has not fully resolved.",
  "I have financial troubles despite earning well — wealth never stays.",
  "I am plagued by anxiety, depression, or emotional instability.",
  "My marriage is under severe strain and I fear separation.",
  "I face legal troubles and conflicts I cannot resolve.",
  "My children are facing difficulties I feel helpless to address.",
  "I experience repeated failures precisely when success seems within reach.",
  "I am in Sade Sati or a difficult Mahadasha — what can I do?",
];

/* ── EMBERS (deterministic) ── */
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  left: 40 + (i % 10) * 3,
  delay: (i * 0.43) % 5.2,
  duration: 3.4 + (i % 7) * 0.5,
  size: 2 + (i % 3),
  drift: ((i % 9) - 4) * 18,
}));

const SHOT_DATA = [
  { delay: 0,   dur: 7,   top: "9%",  left: "8%",  rot: 28, x0: "-160px", y0: "-90px",  x1: "520px", y1: "290px", len: 130 },
  { delay: 2.4, dur: 6,   top: "28%", left: "60%", rot: 31, x0: "-110px", y0: "-65px",  x1: "380px", y1: "220px", len: 100 },
  { delay: 4.9, dur: 8,   top: "62%", left: "4%",  rot: 24, x0: "-130px", y0: "-75px",  x1: "450px", y1: "240px", len: 155 },
  { delay: 1.3, dur: 6.5, top: "14%", left: "78%", rot: 34, x0: "-85px",  y0: "-50px",  x1: "310px", y1: "175px", len: 88  },
  { delay: 3.7, dur: 7.5, top: "77%", left: "38%", rot: 26, x0: "-120px", y0: "-70px",  x1: "430px", y1: "235px", len: 120 },
];

/* ══════════════════════════════════════════ HELPERS ══ */
function Eyebrow({ label, light }) {
  return (
    <div className="eyebrow">
      <div className={`eyebrow-line${light ? " light" : ""}`} />
      <span className={`eyebrow-text${light ? " light" : ""}`}>{label}</span>
      <div className={`eyebrow-line${light ? " light" : ""}`} />
    </div>
  );
}

function GlowyParticles({ count = 50 }) {
  const [pts] = useState(() => Array.from({ length: count }, (_, i) => ({
    top:   `${(((i * 73 + 17) % 92) + 2).toFixed(1)}%`,
    left:  `${(((i * 53 + 11) % 96) + 1).toFixed(1)}%`,
    sz:    (3 + (i % 5)).toFixed(1),
    delay: ((i * 0.37) % 10).toFixed(2),
    dur:   (3 + (i % 5) * 0.8).toFixed(2),
    star:  i % 2 === 0,
  })));
  return (
    <>
      {pts.map((p, i) => (
        <span key={i} style={{
          position: "absolute", top: p.top, left: p.left,
          fontSize: `${p.sz}px`, lineHeight: 1,
          color: p.star ? "rgba(210,155,95,0.72)" : "rgba(242,218,162,0.78)",
          textShadow: p.star
            ? "0 0 7px rgba(201,169,110,0.9), 0 0 18px rgba(201,169,110,0.45)"
            : "0 0 5px rgba(245,225,165,0.95), 0 0 14px rgba(201,169,110,0.5)",
          animation: `twinkle-glow ${p.dur}s ${p.delay}s ease-in-out infinite`,
          pointerEvents: "none", zIndex: 0, userSelect: "none",
        }}>{p.star ? "★" : "✦"}</span>
      ))}
    </>
  );
}

function WaveTop({ fill, h = 88 }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, lineHeight: 0, zIndex: 1, pointerEvents: "none" }}>
      <svg viewBox={`0 0 1440 ${h}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: h }}>
        <path d={`M0,0 C480,${h} 960,${h} 1440,0 L1440,0 L0,0 Z`} fill={fill} />
      </svg>
    </div>
  );
}
function WaveBottom({ fill, h = 88 }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0, zIndex: 1, pointerEvents: "none" }}>
      <svg viewBox={`0 0 1440 ${h}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: h }}>
        <path d={`M0,${h} C480,0 960,0 1440,${h} L1440,${h} L0,${h} Z`} fill={fill} />
      </svg>
    </div>
  );
}

function NebulaBg() {
  return (
    <>
      <div style={{ position: "absolute", top: "12%", left: "3%", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 68%)", animation: "nebula-pulse 14s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "8%", right: "5%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,130,80,0.065) 0%, transparent 68%)", animation: "nebula-pulse 18s 5s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
    </>
  );
}

function ShootingStars() {
  return (
    <>
      {SHOT_DATA.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, left: s.left,
          width: s.len, height: 1.5,
          background: "linear-gradient(90deg, rgba(255,248,215,0.92) 0%, rgba(201,169,110,0.55) 35%, transparent 100%)",
          transformOrigin: "left center",
          "--rot": `${s.rot}deg`, "--sx0": s.x0, "--sy0": s.y0, "--sx1": s.x1, "--sy1": s.y1,
          animation: `shoot ${s.dur}s ${s.delay}s linear infinite`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}
    </>
  );
}

function StarsBg({ count = 50 }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    size: 6 + (i % 5) * 1.6,
    left: (i * 37 + 11) % 100,
    dur:  20 + (i % 8) * 3,
    del:  (i * 0.7) % 20,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: `${s.left}%`, bottom: "-20px", width: s.size, height: s.size, opacity: 0.35, animation: `starsFloat ${s.dur}s linear infinite`, animationDelay: `${s.del}s` }}>
          <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.5))" }}>
            <path d="M12 2 L13.5 9 L20 7 L15 12 L20 17 L13.5 15 L12 22 L10.5 15 L4 17 L9 12 L4 7 L10.5 9 Z" fill="rgba(255,255,255,0.85)" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════ HERO ══ */
function Hero() {
  const bgRef = useRef(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => setPhase(2), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    return subScroll(y => {
      const cap = window.innerHeight * 1.5;
      if (y > cap) return;
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.15}px)`;
    });
  }, []);

  /* Phase 0: diya centered in viewport (top:120px anchor + translateY lifts it to 50vh center).
     Phase 1+: diya settles at top:120px, transform collapses to just translateX(-50%). */
  const diyaTransform = phase === 0
    ? "translateX(-50%) translateY(calc(50vh - 207px))"
    : "translateX(-50%) translateY(0px)";

  const flameAnim = phase >= 1
    ? "flame-birth 1.8s forwards, flame-flicker 1.1s 1.8s infinite alternate"
    : "flame-birth 1.8s forwards";

  return (
    <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#0d0a06" }}>

      {/* Background parallax — fades in at phase 1 */}
      <div ref={bgRef} style={{
        position: "absolute", inset: "-15%",
        backgroundImage: 'url("/assets/solutionsbg.svg")',
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: phase >= 1 ? 0.15 : 0,
        transition: "opacity 1.4s ease",
        willChange: "transform", pointerEvents: "none",
      }} />

      {/* Mandala — fades in at phase 1 */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 600, height: 600, pointerEvents: "none", zIndex: 0,
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 1.6s ease 0.3s",
      }}>
        <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%", opacity: 0.055, animation: "spin-slow 90s linear infinite", transform: "translate(-50%, -50%)" }}>
          {[1,2,3,4,5,6].map(r => (
            <circle key={r} cx="300" cy="300" r={30 + r * 44} fill="none" stroke={GOLD} strokeWidth="0.8" strokeDasharray="5 10" />
          ))}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={i} x1="300" y1="300" x2={300 + 270 * Math.cos(a)} y2={300 + 270 * Math.sin(a)} stroke={GOLD} strokeWidth="0.4" />;
          })}
        </svg>
      </div>

      {/* Particles & shooting stars — fades in at phase 1 */}
      <div style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity 1.2s ease 0.5s", position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <GlowyParticles count={60} />
        <ShootingStars />
      </div>

      {/* Ambient glow — follows diya position */}
      <div style={{
        position: "absolute",
        width: 420, height: 280,
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(230,115,42,0.38), rgba(201,169,110,0.18) 45%, transparent 72%)",
        top: "120px", left: "50%",
        transform: diyaTransform,
        transition: "transform 1.4s cubic-bezier(.22,1,.36,1)",
        animation: "glow-breathe 2.8s ease-in-out infinite",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── Diya: flame + wick + bowl + base ── */}
      <div style={{
        position: "absolute", top: "120px", left: "50%",
        transform: diyaTransform,
        transition: "transform 1.4s cubic-bezier(.22,1,.36,1)",
        zIndex: 2, pointerEvents: "none",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Flame */}
        <svg viewBox="0 0 80 120" style={{ width: 80, height: 120, animation: flameAnim, transformOrigin: "center bottom" }}>
          <path d="M40 10 C40 10 18 32 18 58 C18 80 28 98 40 104 C52 98 62 80 62 58 C62 32 40 10 40 10Z" fill="url(#flameOuter)" opacity="0.9" />
          <path d="M40 30 C40 30 28 46 28 60 C28 74 33 84 40 88 C47 84 52 74 52 60 C52 46 40 30 40 30Z" fill="url(#flameInner)" />
          <path d="M40 50 C40 50 34 58 34 64 C34 70 37 74 40 76 C43 74 46 70 46 64 C46 58 40 50 40 50Z" fill="rgba(255,255,230,0.95)" />
          <defs>
            <linearGradient id="flameOuter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#b83808" />
              <stop offset="35%"  stopColor="#e8732a" />
              <stop offset="70%"  stopColor="#ffc044" />
              <stop offset="100%" stopColor="#fff3a0" />
            </linearGradient>
            <linearGradient id="flameInner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#ffb300" />
              <stop offset="60%"  stopColor="#fff8c0" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Wick */}
        <div style={{ width: 2, height: 14, background: "#3a2000", marginTop: -10, zIndex: 3, animation: "diya-body-in 0.6s ease 0.5s both" }} />
        {/* Bowl */}
        <svg viewBox="0 0 130 42" width="130" height="42" style={{ marginTop: -2, overflow: "visible", animation: "diya-body-in 0.6s ease 0.65s both" }}>
          <path d="M15 12 C15 32 115 32 115 12 L108 22 C108 34 22 34 22 22 Z" fill="url(#bowlGrad)"/>
          <ellipse cx="65" cy="12" rx="50" ry="8" fill="url(#oilSheen)" opacity=".5"/>
          <path d="M10 16 C10 36 120 36 120 16" stroke="rgba(201,169,110,.45)" strokeWidth="1" fill="none"/>
          <defs>
            <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7a5810"/>
              <stop offset="28%"  stopColor="#c9a96e"/>
              <stop offset="55%"  stopColor="#8b6014"/>
              <stop offset="100%" stopColor="#c9a96e"/>
            </linearGradient>
            <radialGradient id="oilSheen" cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor="rgba(255,210,80,.4)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
        </svg>
        {/* Base plate */}
        <div style={{ width: 154, height: 7, background: "linear-gradient(90deg,#6a4a10,#c9a96e 32%,#8a6012 65%,#c9a96e)", borderRadius: "50%", marginTop: 4, boxShadow: "0 4px 16px rgba(0,0,0,.65)", animation: "diya-body-in 0.6s ease 0.8s both" }} />
      </div>

      {/* Embers — appear with phase 1 */}
      {phase >= 1 && EMBERS.map((em, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "48%", left: `${em.left}%`,
          width: em.size, height: em.size,
          borderRadius: "50%",
          background: `rgba(255,${158 + (i % 6) * 8},${30 + (i % 5) * 12},.9)`,
          animation: `ember-rise ${em.duration}s ${em.delay}s ease-out infinite`,
          "--drift": `${em.drift}px`,
          pointerEvents: "none", zIndex: 2,
        }} />
      ))}

      {/* ── Text content — appears at phase 2 ── */}
      <div style={{
        position: "relative", zIndex: 3, textAlign: "center",
        paddingTop: "330px", paddingBottom: "100px",
        paddingLeft: "40px", paddingRight: "40px",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "none" : "translateY(24px)",
        transition: "opacity 1.1s cubic-bezier(.22,1,.36,1), transform 1.1s cubic-bezier(.22,1,.36,1)",
        pointerEvents: phase >= 2 ? "auto" : "none",
      }}>
        <div style={{ fontFamily: BODY_FONT, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "rgba(201,169,110,0.8)", marginBottom: 28, transitionDelay: "0s" }}>
          Vedic Saar · Sacred Rituals
        </div>
        <h1 style={{ fontFamily: HEADING_FONT, fontSize: "clamp(52px,9vw,100px)", fontWeight: 400, color: CREAM, margin: "0 0 22px", lineHeight: 0.95, letterSpacing: -1 }}>
          Pooja
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "0 auto 32px", maxWidth: 680 }}>
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right, transparent, ${GOLD})` }} />
          <span style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 16, color: "rgba(201,169,110,0.7)", whiteSpace: "nowrap" }}>
            पूजा — Sacred Rituals for Planetary Harmony
          </span>
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left, transparent, ${GOLD})` }} />
        </div>
        <p style={{ fontFamily: BODY_FONT, fontSize: BODY_SIZE, color: "rgba(245,240,232,0.5)", maxWidth: 400, margin: "0 auto 48px", lineHeight: 2, letterSpacing: 0.5 }}>
          When the planets are troubled, the sacred fire speaks for you.
        </p>
        <button className="cta-btn">
          <span>Book a Pooja</span>
          <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
        </button>
        <div style={{ marginTop: 64, textAlign: "center" }}>
          <p style={{ fontFamily: BODY_FONT, fontSize: 8, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,169,110,0.4)", margin: "0 0 8px" }}>Scroll</p>
          <div style={{ width: 1, height: 30, background: `linear-gradient(to bottom,${GOLD},transparent)`, margin: "0 auto", animation: "scroll-pulse 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ INTRO ══ */
function IntroSection() {
  const ref    = useRef(null);
  const bgRef  = useRef(null);
  useReveal(ref);

  useEffect(() => {
    return subScroll(y => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.06}px)`;
    });
  }, []);

  return (
    <section ref={ref} style={{ background: CREAM2, position: "relative", overflow: "hidden" }}>
      <WaveTop fill={CREAM2} />
      <WaveBottom fill={DARK2} />
      {/* Large OM — centred watermark */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
        <span ref={bgRef} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(280px,44vw,520px)", fontWeight: 400, color: DARK, opacity: 0.045, lineHeight: 1, userSelect: "none", display: "block" }}>ॐ</span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "100px 48px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Vedic Wisdom" />
        <h2 className="r" style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontStyle: "italic", fontSize: HEADING_SIZE, color: DARK, lineHeight: 1.1, margin: "0 0 48px", letterSpacing: "-0.01em" }}>
          A Direct Conversation<br />
          <span style={{ color: GOLD }}>with the Divine</span>
        </h2>

        <div className="r d1" style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 28, marginBottom: 40, textAlign: "left", maxWidth: 680, margin: "0 auto 40px" }}>
          <p style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 22, color: DARK, lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
            "A Pooja is more than a ritual — it is a direct conversation with the cosmic forces that govern your life. Performed by learned Vedic pandits using precise mantras, offerings, and sacred fire."
          </p>
        </div>

        <p className="r d2" style={{ fontFamily: BODY_FONT, fontSize: BODY_SIZE, color: MUTED, lineHeight: 2.1, marginBottom: 24 }}>
          Every planet governs a domain of your life — Saturn rules karma and discipline, Venus rules love and abundance, Rahu and Ketu govern karmic debts and liberation. When these planets are debilitated, combust, or afflicted in your chart, the imbalance manifests as persistent challenges: failed relationships, blocked careers, health troubles, or spiritual unrest.
        </p>
        <p className="r d3" style={{ fontFamily: BODY_FONT, fontSize: BODY_SIZE, color: MUTED, lineHeight: 2.1, marginBottom: 52 }}>
          A targeted Pooja energetically appeases the planet, clears the karmic blockage, and creates a vibrational shift in your life's trajectory. Each Pooja is prescribed based on the specific planetary imbalances identified in your birth chart.
        </p>

        <div className="r d4" style={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          {["10 Sacred Poojas", "Precise Muhurta Timing", "Vedic Pandits Only"].map((s, i) => (
            <div key={i} style={{ padding: "11px 22px", background: DARK, color: CREAM, fontFamily: BODY_FONT, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ PILLARS ══ */
function PillarsSection() {
  const ref   = useRef(null);
  const wRef  = useRef(null);
  useReveal(ref);

  useEffect(() => {
    return subScroll(y => {
      if (wRef.current) {
        const rect = wRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        wRef.current.style.transform = `translateY(${(p - 0.5) * -40}px)`;
      }
    });
  }, []);

  return (
    <section ref={ref} style={{ background: DARK2, position: "relative", overflow: "hidden" }} className="grain">
      <WaveTop fill={DARK2} />
      <WaveBottom fill={DARK2} />
      <GlowyParticles count={50} />
      <NebulaBg />
      <StarsBg count={80} />
      <img ref={wRef} src="/assets/costelation.png" alt="" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 900, opacity: 0.04, pointerEvents: "none", animation: "spin-slow 200s linear infinite" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 90px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="The Foundation" light />
        <h2 className="r" style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: HEADING_SIZE, color: CREAM, textAlign: "center", margin: "0 0 8px", lineHeight: 1.05 }}>
          Why Pooja
        </h2>
        <p className="r d1" style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 26, color: GOLD, textAlign: "center", margin: "0 0 60px" }}>
          Works
        </p>

        <div className="pillars-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {pillars.map((p, i) => {
            const Icon = PillarIcons[p.icon];
            return (
              <div key={i} className={`r d${i + 1} dark-pcard`} style={{ padding: "44px 32px 40px" }}>
                <div style={{ height: 2, background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.55), transparent)`, position: "absolute", top: 0, left: 0, right: 0 }} />
                <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
                  <Icon />
                </div>
                <h3 style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: 20, color: CREAM, margin: "0 0 10px", lineHeight: 1.25, textAlign: "center" }}>{p.title}</h3>
                <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.5), transparent)`, margin: "0 auto 16px" }} />
                <p style={{ fontFamily: BODY_FONT, fontSize: BODY_SIZE, color: MUTED, lineHeight: 1.9, margin: 0, textAlign: "center" }}>{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PoojasSection() {
  const ref  = useRef(null);
  const wRef = useRef(null);
  useReveal(ref);

  useEffect(() => {
    return subScroll(y => {
      if (wRef.current) {
        const rect = wRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        wRef.current.style.transform =
          `translateY(${(p - 0.5) * -30}px) rotate(${(p - 0.5) * 20}deg)`;
      }
    });
  }, []);

  return (
    <section ref={ref} style={{ background: CREAM2, position: "relative", overflow: "hidden" }}>
      <WaveTop fill={DARK2} />
      <WaveBottom fill={DARK2} />

      <div style={{
        position: "absolute",
        left: "-80px",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "Georgia,'Times New Roman',serif",
        fontSize: 480,
        color: DARK,
        opacity: 0.03,
        pointerEvents: "none"
      }}>
        ॐ
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 48px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="Sacred Services" />

        <h2 style={{
          fontFamily: HEADING_FONT,
          fontSize: HEADING_SIZE,
          textAlign: "center",
          marginBottom: 8
        }}>
          Our Pooja
        </h2>

        <p style={{
          fontFamily: HEADING_FONT,
          fontStyle: "italic",
          fontSize: 26,
          color: GOLD,
          textAlign: "center",
          marginBottom: 60
        }}>
          Offerings
        </p>

        <div className="poojas-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
          {poojas.map((p, i) => {
            return (
              <div key={i} className={`r d${(i % 3) + 1} pcard`}>

                {/* Tag */}
                <div style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  fontSize: 9,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: GOLD,
                  background: "rgba(201,169,110,0.08)",
                  padding: "4px 10px"
                }}>
                  {p.tag}
                </div>

                <div style={{ padding: "36px 32px" }}>

                  {/* Title */}
                  <div style={{
                    fontFamily: HEADING_FONT,
                    fontWeight: 600,
                    fontSize: 22,
                    marginBottom: 4,
                    lineHeight: 1.2
                  }}>
                    {p.name}
                  </div>

                  {/* Sanskrit */}
                  <div style={{
                    fontFamily: HEADING_FONT,
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "#8b6030",
                    marginBottom: 16
                  }}>
                    {p.san}
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1,
                    background: "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)",
                    marginBottom: 16
                  }} />

                  {/* Purpose */}
                  <p style={{
                    fontSize: 13,
                    lineHeight: 1.9,
                    marginBottom: 14,
                    color: "#5a4a30"
                  }}>
                    {p.purpose}
                  </p>

                  {/* Remedy */}
                  <p style={{
                    fontStyle: "italic",
                    fontSize: 13,
                    color: GOLD,
                    marginBottom: 18,
                    lineHeight: 1.6
                  }}>
                    {p.remedy}
                  </p>

                  {/* Meta */}
                  <div style={{
                    display: "flex",
                    gap: 24,
                    fontSize: 11,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#9a8060"
                  }}>
                    <span>
                      Planet: <strong style={{ color: GOLD }}>{p.planet}</strong>
                    </span>
                    <span>
                      Duration: <strong style={{ color: GOLD }}>{p.dur}</strong>
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean premium hover */}
      <style jsx>{`
        .pcard {
          position: relative;
          border-radius: 18px;
          background: #fffaf3;
          border: 1px solid rgba(201,169,110,0.18);
          transition: all 0.35s ease;
        }

        .pcard:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.08);
        }
      `}</style>
    </section>
  );
}
/* ══════════════════════════════════════════ PROCESS ══ */
function ProcessSection() {
  const ref   = useRef(null);
  const wRef  = useRef(null);
  useReveal(ref);

  useEffect(() => {
    return subScroll(y => {
      if (wRef.current) {
        const rect = wRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        wRef.current.style.transform = `translate(-50%,-50%) rotate(${p * 60}deg)`;
      }
    });
  }, []);

  return (
    <section ref={ref} style={{ background: DARK, position: "relative", overflow: "hidden" }} className="grain">
      <WaveTop fill={DARK2} />
      <WaveBottom fill={DARK2} />
      <GlowyParticles count={45} />
      <ShootingStars />
      <div ref={wRef} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "Georgia,'Times New Roman',serif", fontSize: 600, fontWeight: 400, color: CREAM, opacity: 0.028, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>ॐ</div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 90px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="How It Works" light />
        <h2 className="r" style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: HEADING_SIZE, color: CREAM, textAlign: "center", margin: "0 0 8px", lineHeight: 1.05 }}>
          The Ritual
        </h2>
        <p className="r d1" style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 26, color: GOLD, textAlign: "center", margin: "0 0 64px" }}>
          Process
        </p>

        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, position: "relative" }}>
          {/* Connecting line */}
          <div style={{ position: "absolute", top: 21, left: "12.5%", right: "12.5%", height: 1, background: `linear-gradient(90deg,transparent,${GOLD},${GOLD},transparent)`, opacity: 0.22 }} />

          {processSteps.map((s, i) => {
            const Icon = ProcessIcons[s.icon];
            return (
              <div key={i} className={`r d${i + 1}`} style={{ textAlign: "center", padding: "0 16px" }}>
                {/* Step circle */}
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  border: `1px solid rgba(201,169,110,0.38)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 28px", position: "relative", zIndex: 2,
                  background: DARK,
                }}>
                  <span style={{ fontFamily: BODY_FONT, fontSize: 9, letterSpacing: ".1em", color: GOLD }}>{s.n}</span>
                </div>
                {/* Icon */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                  <Icon />
                </div>
                <div style={{ fontFamily: HEADING_FONT, fontWeight: 600, fontSize: 17, color: CREAM, marginBottom: 10 }}>{s.title}</div>
                <div style={{ width: 24, height: 1, background: `rgba(201,169,110,0.35)`, margin: "0 auto 12px" }} />
                <p style={{ fontFamily: BODY_FONT, fontSize: 12, lineHeight: 1.88, color: "rgba(253,249,243,.5)", margin: 0 }}>{s.body}</p>
              </div>
            );
          })}
        </div>

        {/* Guarantee block */}
        <div className="r d5" style={{ marginTop: 64, padding: "28px 36px", border: `1px solid rgba(201,169,110,0.22)`, borderLeft: `3px solid ${GOLD}`, background: "rgba(201,169,110,0.04)", textAlign: "center" }}>
          <p style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 18, color: CREAM, margin: 0, lineHeight: 1.7, opacity: 0.85 }}>
            All Poojas are performed with full Vedic protocols — no shortcuts, no half measures.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ PROBLEMS ══ */
function ProblemsSection() {
  const ref  = useRef(null);
  const wRef = useRef(null);
  useReveal(ref);

  useEffect(() => {
    return subScroll(y => {
      if (wRef.current) {
        const rect = wRef.current.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        wRef.current.style.transform = `translateX(-50%) translateY(${(p - 0.5) * -40}px)`;
      }
    });
  }, []);

  return (
    <section ref={ref} style={{ background: CREAM2, position: "relative", overflow: "hidden" }}>
      <WaveTop fill={DARK2} />
      
      <div ref={wRef} style={{ position: "absolute", left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%)", fontFamily: HEADING_FONT, fontSize: "clamp(200px,30vw,420px)", fontWeight: 300, color: DARK, opacity: 0.02, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>?</div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 48px 90px", position: "relative", zIndex: 1 }}>
        <Eyebrow label="When Pooja is Needed" />
        <h2 className="r" style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: HEADING_SIZE, color: DARK, textAlign: "center", margin: "0 0 64px", lineHeight: 1.1 }}>
          Challenges We Help<br /><em style={{ color: GOLD }}>You Resolve</em>
        </h2>

        <div className="mobile-col-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72 }}>
          <div className="r d1">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ width: 3, height: 28, background: GOLD, borderRadius: 2 }} />
              <h3 style={{ fontFamily: HEADING_FONT, fontSize: 26, fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.2 }}>
                Life Problems Pooja Addresses
              </h3>
            </div>
            {problems.map((p, i) => (
              <div key={i} className="step-row">
                <span style={{ fontFamily: BODY_FONT, fontSize: 9, color: GOLD, marginTop: 3, flexShrink: 0, opacity: 0.65 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: BODY_FONT, fontSize: BODY_SIZE, color: MUTED, lineHeight: 1.75 }}>{p}</span>
              </div>
            ))}
          </div>

          <div className="r d2">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 3, height: 28, background: GOLD, borderRadius: 2 }} />
              <h3 style={{ fontFamily: HEADING_FONT, fontSize: 26, fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.2 }}>
                What Makes It Work
              </h3>
            </div>

            {[
              { title: "Planetary Precision", body: "Each Pooja targets a specific planet's energy signature. A Shani Pooja will not resolve a Venus affliction. Prescription requires chart analysis first." },
              { title: "Muhurta — Sacred Timing", body: "The ritual must be performed at an auspicious moment. An incorrectly timed Pooja reduces efficacy significantly. Our astrologers compute the optimal muhurta for your chart." },
              { title: "Mantra Recitation Count", body: "Each mantra has a prescribed count — 11,000, 21,000, or 108,000 repetitions depending on the severity of affliction. We do not cut corners." },
              { title: "Pandit Qualification", body: "Only Vedic pandits trained in the specific Pooja tradition perform the ritual. Each pandit is tested for pronunciation accuracy and ritual knowledge." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 20, padding: "20px 24px", background: W, border: `1px solid rgba(201,169,110,0.16)`, borderLeft: `2px solid ${GOLD}`, transition: "border-color 0.3s", cursor: "default" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.38)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(201,169,110,0.16)"}
              >
                <div style={{ fontFamily: HEADING_FONT, fontSize: 16, fontWeight: 500, color: DARK, marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontFamily: BODY_FONT, fontSize: 13, color: MUTED, lineHeight: 1.8, margin: 0 }}>{item.body}</p>
              </div>
            ))}

            <div style={{ marginTop: 8, padding: "24px 28px", background: DARK, borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 16, color: CREAM, lineHeight: 1.75, opacity: 0.82 }}>
                "Every planetary affliction has a Vedic remedy. Every remedy, applied precisely, creates a cosmic shift."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ CTA ══ */
function CTASection() {
  const ref     = useRef(null);
  const moonRef = useRef(null);
  useReveal(ref);

  useEffect(() => {
    return subScroll(() => {
      if (!moonRef.current) return;
      const rect = moonRef.current.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      moonRef.current.style.transform = `translate(-50%,-50%) translateY(${(p - 0.5) * -60}px)`;
    });
  }, []);

  return (
    <section ref={ref} style={{ backgroundImage: 'url("/assets/Testimonialsbg.png")', marginTop: -120, backgroundSize: "cover", backgroundPosition: "top center", padding: "130px 48px 150px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div ref={moonRef} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, marginTop: 500 }}>
        <div className="r" style={{ fontFamily: HEADING_FONT, fontStyle: "italic", fontSize: 16, color: CREAM, marginBottom: 52, letterSpacing: "0.03em" }}>
          ✦ &nbsp; The sacred fire carries your intentions beyond the veil. &nbsp; ✦
        </div>

        <h2 className="r d1" style={{ fontFamily: HEADING_FONT, fontWeight: 400, fontSize: HEADING_SIZE, color: "black", margin: 0, lineHeight: 0.92, letterSpacing: "-0.02em" }}>
          Ready to Speak<br />
          <span className="gold-shimmer">with the Divine?</span>
        </h2>

        <div className="r d2" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "52px auto", maxWidth: 380 }}>
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to right, transparent, rgba(201,169,110,0.35))` }} />
          <span style={{ width: 6, height: 6, background: GOLD, transform: "rotate(45deg)", flexShrink: 0 }} />
          <span style={{ flex: 1, height: "0.5px", background: `linear-gradient(to left, transparent, rgba(201,169,110,0.35))` }} />
        </div>

        <p className="r d3" style={{ fontFamily: BODY_FONT, fontSize: 10, color: "black", maxWidth: 360, margin: "0 auto 60px", lineHeight: 2, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Share Your Birth Details — We Prescribe the Right Pooja
        </p>

        <div className="r d4">
          <button className="cta-btn" onClick={() => openBooking()}>
             
            <span>Book a Pooja</span>
            <span style={{ fontFamily: BODY_FONT, fontSize: 15, lineHeight: 1 }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ EXPORT ══ */
export default function Pooja() {
    const { openBooking } = useBooking(); 
  return (
    <>
      <style>{CSS}</style>
      <Hero />
      <IntroSection />
      <PillarsSection />
      <PoojasSection />
      <ProcessSection />
      <ProblemsSection />
      <CTASection />
    </>
  );
}