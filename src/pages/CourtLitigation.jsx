import { useEffect, useRef, useState } from "react";
import { useBooking } from "../components/BookingContext";


/* ── Palette ── */
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

/* ════════════════════════════════════════════════════════════════ */
/* CSS */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  :root { --gold: #c9a96e; --gold2: #e8c98a; --dark: #0d0a06; --cream: #f5f0e8; }

  .r { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
  .r.rv { opacity: 1; transform: none; }
  .r.d1 { transition-delay: 0.08s } .r.d2 { transition-delay: 0.18s }
  .r.d3 { transition-delay: 0.28s } .r.d4 { transition-delay: 0.40s }
  .r.d5 { transition-delay: 0.52s } .r.d6 { transition-delay: 0.64s }

  @keyframes hero-rise    { from { opacity:0; transform:translateY(60px) } to { opacity:1; transform:none } }
  @keyframes spin-slow    { to { transform: rotate(360deg) } }
  @keyframes spin-rev     { to { transform: rotate(-360deg) } }
  @keyframes gold-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes shoot {
    0%   { opacity:0; transform:rotate(var(--rot,28deg)) translate(var(--sx0,-150px),var(--sy0,-80px)); }
    8%   { opacity:0.9; } 70% { opacity:0.55; }
    100% { opacity:0; transform:rotate(var(--rot,28deg)) translate(var(--sx1,500px),var(--sy1,280px)); }
  }
  @keyframes nebula-pulse { 0%,100%{opacity:0.042;transform:scale(1)} 50%{opacity:0.085;transform:scale(1.12)} }
  @keyframes sun-pulse {
    0%,100%{box-shadow:0 0 40px 10px rgba(201,169,110,0.35),0 0 80px 20px rgba(201,169,110,0.15)}
    50%{box-shadow:0 0 60px 18px rgba(201,169,110,0.5),0 0 120px 40px rgba(201,169,110,0.22)}
  }
  @keyframes twinkle-glow { 0%,100%{opacity:0.07;transform:scale(0.72)} 50%{opacity:0.62;transform:scale(1.12)} }
  @keyframes starsFloat {
    0%{transform:translateY(0) scale(0.8);opacity:0} 15%{opacity:0.12}
    50%{transform:translateY(-50vh) scale(1.1);opacity:0.18} 100%{transform:translateY(-110vh) scale(1.4);opacity:0}
  }

  .gold-shimmer {
    background: linear-gradient(90deg,#c9a96e 0%,#e8c98a 30%,#fff8e8 50%,#e8c98a 70%,#c9a96e 100%);
    background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:gold-shimmer 6s linear infinite;
  }
  .eyebrow { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:20px; }
  .eyebrow-line { width:40px; height:1px; background:rgba(201,169,110,0.45); }
  .eyebrow-line.light { background:rgba(245,240,232,0.25); }
  .eyebrow-text { font-family:'Glacial Indifference',sans-serif; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:var(--gold); opacity:0.8; }
  .eyebrow-text.light { color:rgba(245,240,232,0.5); opacity:1; }

  .hcard { position:relative; background:linear-gradient(145deg,#ffffff,#f9f5ed); border:1px solid rgba(201,169,110,0.2); border-radius:0; overflow:hidden; transition:transform 0.4s cubic-bezier(.16,1,.3,1),box-shadow 0.4s,border-color 0.4s; cursor:default; }
  .hcard::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%,rgba(201,169,110,0.07) 0%,transparent 70%); opacity:0; transition:opacity 0.4s; }
  .hcard:hover { transform:translateY(-6px) scale(1.05); box-shadow:0 24px 60px rgba(28,20,13,0.12),0 0 0 1px rgba(201,169,110,0.35); border-color:rgba(201,169,110,0.35); }
  .hcard:hover::before { opacity:1; }
  .hcard:hover .hcard-num { color:var(--gold2) !important; }
  .hcard:hover .hcard-orb { opacity:0.6 !important; transform:scale(1.15) !important; }
  .hcard-orb { position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:radial-gradient(circle,rgba(201,169,110,0.13) 0%,transparent 70%); opacity:0.18; transition:opacity 0.4s,transform 0.6s; pointer-events:none; }

  .prob-row { display:flex; gap:16px; padding:14px 0; align-items:flex-start; border-bottom:1px solid rgba(201,169,110,0.07); transition:padding-left 0.25s ease,border-color 0.25s; cursor:default; }
  .prob-row:hover { padding-left:10px; border-bottom-color:rgba(201,169,110,0.2); }
  .prob-row:last-child { border-bottom:none; }

  .gitem { border:1px solid rgba(201,169,110,0.1); border-radius:0; transition:border-color 0.3s,box-shadow 0.3s,transform 0.3s,background 0.3s; cursor:default; }
  .gitem:hover { border-color:rgba(201,169,110,0.3); box-shadow:0 12px 40px rgba(0,0,0,0.35); transform:translateY(-4px); background:rgba(255,255,255,0.05) !important; }

  .cta-btn { display:inline-flex; align-items:center; gap:12px; padding:18px 56px; background:#0d0a06; border:2px dashed #ffffff; color:#ffffff; font-family:'Glacial Indifference',sans-serif; font-size:11px; letter-spacing:0.22em; text-transform:uppercase; cursor:pointer; position:relative; transition:opacity 0.3s; }
  .cta-btn:hover { opacity:0.8; }
  .cta-btn span { position:relative; z-index:1; }

  .planet-node { position:absolute; display:flex; flex-direction:column; align-items:center; cursor:default; }
  .planet-node:hover .planet-ball { transform:scale(1.12); box-shadow:0 0 30px rgba(201,169,110,0.45); }
  .planet-node:hover .planet-desc { max-height:80px; opacity:1; }
  .planet-ball { border-radius:50%; overflow:visible; transition:transform 0.4s,box-shadow 0.4s; box-shadow:0 0 20px rgba(201,169,110,0.2); background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.9),#e8dcc6); flex-shrink:0; position:relative; }
  .planet-glyph { font-size:11px; color:var(--gold); opacity:0.65; line-height:1; margin-bottom:2px; text-align:center; }
  .planet-name { font-family:'Ibarra Real Nova',serif; font-size:14px; font-weight:500; color:#1c140d; text-align:center; line-height:1.25; opacity:0.9; white-space:nowrap; }
  .planet-sub { font-family:'Glacial Indifference',sans-serif; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); opacity:0.7; text-align:center; margin-top:2px; white-space:nowrap; }
  .planet-desc { font-family:'Glacial Indifference',sans-serif; font-size:11px; color:#8a7e76; line-height:1.7; text-align:center; max-width:150px; max-height:0; overflow:hidden; opacity:0; transition:max-height 0.4s ease,opacity 0.4s ease; margin-top:4px; }

  .grain::after { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; opacity:0.3; mix-blend-mode:overlay; z-index:0; }

  @media (max-width:900px) { .planets-grid { grid-template-columns:repeat(2,1fr) !important; } }
  @media (max-width:580px) { .planets-grid { grid-template-columns:1fr !important; } }
  .ls-fan-desktop { display: block; }
  .ls-grid-mobile  { display: none; }

  @media (max-width: 768px) {
    .mobile-col-1 { grid-template-columns: 1fr !important; }
    section { padding-left: max(20px, 4vw) !important; padding-right: max(20px, 4vw) !important; }
    .ls-fan-desktop { display: none !important; }
    .ls-grid-mobile  { display: grid !important; }
  }
`;

/* ════════════════════════════════════════════════════════════════ */
/* HOUSE SVG ICONS — Legal / Court themed */
const houseIcons = [
  /* VI — Primary house of disputes: scales of justice */
  <svg key="vi" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="32" y1="10" x2="32" y2="60" stroke="black" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="18" y1="22" x2="46" y2="22" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="18" y1="22" x2="12" y2="38" stroke="black" strokeWidth="1.1" strokeLinecap="round"/>
    <line x1="46" y1="22" x2="52" y2="38" stroke="black" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M8 38 Q12 44 16 38" stroke="black" strokeWidth="1.1" fill="rgba(201,169,110,0.12)" strokeLinecap="round"/>
    <path d="M48 38 Q52 44 56 38" stroke="black" strokeWidth="1.1" fill="rgba(201,169,110,0.12)" strokeLinecap="round"/>
    <line x1="24" y1="60" x2="40" y2="60" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="32" cy="22" r="2.5" fill="rgba(201,169,110,0.4)" stroke="black" strokeWidth="0.8"/>
    <circle cx="32" cy="9"  r="2"   fill="rgba(201,169,110,0.6)" stroke="black" strokeWidth="0.7"/>
  </svg>,

  /* VII — The opponent: two figures facing each other */
  <svg key="vii" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="6" fill="rgba(201,169,110,0.1)" stroke="black" strokeWidth="1.2"/>
    <path d="M10 32 Q16 26 22 32 L22 50 L10 50 Z" stroke="black" strokeWidth="1.1" fill="rgba(201,169,110,0.07)" strokeLinejoin="round"/>
    <circle cx="48" cy="18" r="6" fill="rgba(201,169,110,0.1)" stroke="black" strokeWidth="1.2"/>
    <path d="M42 32 Q48 26 54 32 L54 50 L42 50 Z" stroke="black" strokeWidth="1.1" fill="rgba(201,169,110,0.05)" strokeLinejoin="round"/>
    <line x1="26" y1="39" x2="38" y2="39" stroke="black" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="28" y1="35" x2="28" y2="43" stroke="black" strokeWidth="0.9"/>
    <line x1="36" y1="35" x2="36" y2="43" stroke="black" strokeWidth="0.9"/>
    <line x1="22" y1="60" x2="42" y2="60" stroke="black" strokeWidth="0.8" strokeDasharray="2 2"/>
  </svg>,

  /* VIII — Sudden events / hidden truth: eye with lightning */
  <svg key="viii" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 38 Q20 22 32 22 Q44 22 58 38 Q44 54 32 54 Q20 54 6 38Z" stroke="black" strokeWidth="1.2" fill="rgba(201,169,110,0.06)"/>
    <circle cx="32" cy="38" r="8" stroke="black" strokeWidth="1.1" fill="rgba(201,169,110,0.12)"/>
    <circle cx="32" cy="38" r="3.5" fill="rgba(201,169,110,0.45)" stroke="black" strokeWidth="0.9"/>
    <line x1="38" y1="12" x2="32" y2="24" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="32" y1="24" x2="37" y2="24" stroke="black" strokeWidth="1.1" strokeLinecap="round"/>
    <line x1="37" y1="24" x2="31" y2="36" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="38" cy="10" r="2" fill="rgba(201,169,110,0.5)" stroke="black" strokeWidth="0.7"/>
  </svg>,

  /* IX — Justice / dharma: temple pillars with gavel */
  <svg key="ix" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="28" x2="54" y2="28" stroke="black" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="8"  y1="24" x2="56" y2="24" stroke="black" strokeWidth="0.9" strokeLinecap="round"/>
    <line x1="16" y1="28" x2="16" y2="58" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="32" y1="28" x2="32" y2="58" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="48" y1="28" x2="48" y2="58" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="10" y1="58" x2="54" y2="58" stroke="black" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="8"  y1="62" x2="56" y2="62" stroke="black" strokeWidth="0.9" strokeLinecap="round"/>
    <circle cx="32" cy="20" r="4" fill="rgba(201,169,110,0.2)" stroke="black" strokeWidth="1"/>
    <line x1="28" y1="20" x2="36" y2="20" stroke="black" strokeWidth="1.1" strokeLinecap="round"/>
    <line x1="32" y1="16" x2="32" y2="24" stroke="black" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>,

  /* XII — Imprisonment / loss: bars */
  <svg key="xii" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="16" width="44" height="44" rx="1" stroke="black" strokeWidth="1.2" fill="rgba(201,169,110,0.04)"/>
    <line x1="22" y1="16" x2="22" y2="60" stroke="black" strokeWidth="1.1"/>
    <line x1="32" y1="16" x2="32" y2="60" stroke="black" strokeWidth="1.1"/>
    <line x1="42" y1="16" x2="42" y2="60" stroke="black" strokeWidth="1.1"/>
    <line x1="10" y1="30" x2="54" y2="30" stroke="black" strokeWidth="0.8"/>
    <line x1="10" y1="44" x2="54" y2="44" stroke="black" strokeWidth="0.8"/>
    <circle cx="32" cy="8" r="4" fill="rgba(201,169,110,0.15)" stroke="black" strokeWidth="1"/>
    <line x1="32" y1="12" x2="32" y2="16" stroke="black" strokeWidth="1" strokeLinecap="round"/>
  </svg>,

  /* XI — Victory after litigation: trophy */
  <svg key="xi" viewBox="0 0 64 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 14 Q20 42 32 42 Q44 42 44 14 Z" stroke="black" strokeWidth="1.3" fill="rgba(201,169,110,0.08)"/>
    <line x1="12" y1="14" x2="20" y2="14" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="44" y1="14" x2="52" y2="14" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M12 14 Q10 22 16 28 Q18 30 20 30" stroke="black" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
    <path d="M52 14 Q54 22 48 28 Q46 30 44 30" stroke="black" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
    <line x1="32" y1="42" x2="32" y2="54" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="20" y1="54" x2="44" y2="54" stroke="black" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="18" y1="58" x2="46" y2="58" stroke="black" strokeWidth="0.9" strokeLinecap="round"/>
    <circle cx="32" cy="28" r="4" fill="rgba(201,169,110,0.25)" stroke="black" strokeWidth="0.9"/>
    <line x1="30" y1="28" x2="34" y2="28" stroke="black" strokeWidth="1" strokeLinecap="round"/>
    <line x1="32" y1="26" x2="32" y2="30" stroke="black" strokeWidth="1" strokeLinecap="round"/>
  </svg>,
];

/* ════════════════════════════════════════════════════════════════ */
/* DATA */
const houses = [
  { num: "VI",  title: "The Primary House of Legal Disputes",  sub: "The seat of enemies and litigation", desc: "The 6th house is the most important house for litigation. It governs disputes, enemies, debts, and legal battles. A strong 6th house and lord give you the power to prevail in lawsuits." },
  { num: "VII", title: "The Opponent & Legal Partnerships",    sub: "The house of the opposing party",    desc: "The 7th house represents the opposing party in any legal dispute. Analysing the relative strength of your 6th house vs your 7th house tells us who holds the upper hand in the case." },
  { num: "VIII", title: "Sudden Legal Events & Hidden Truth",  sub: "The vault of unexpected outcomes",   desc: "The 8th house governs sudden reversals in legal proceedings, secrets that come to light in court, and unexpected outcomes. It can create sudden victories or sudden defeats." },
  { num: "IX",  title: "Justice, Dharma & Legal Fortune",     sub: "The throne of higher courts",         desc: "The 9th house governs judges, lawyers, higher courts, and divine justice. A strong 9th house in a legal dispute is one of the most powerful indicators of eventual victory." },
  { num: "XII", title: "Imprisonment, Foreign Litigation & Loss", sub: "The house of legal confinement", desc: "The 12th house governs imprisonment, legal losses, cases fought in foreign jurisdictions, and settlements that involve significant financial outflow." },
  { num: "XI",  title: "Victory & Gains After Litigation",    sub: "The field of righteous reward",       desc: "The 11th house represents the gains that come after the legal battle is won — compensation, justice, and fulfilment of the righteous claim." },
];

const planets = [
  { glyph: "♂", name: "Mars",    sub: "Disputes, Aggression & Legal Battle",     desc: "Mars is the primary planet of conflict and legal battle. A strong Mars gives fighting spirit, the ability to take on enemies boldly, and the persistence to see a long case through. Afflicted Mars creates reckless defeats." },
  { glyph: "♄", name: "Saturn",  sub: "The Judge — Delays & Karmic Justice",     desc: "Saturn governs judges, courts, and the slow machinery of law. Saturn favours those who are disciplined, patient, and have righteous claims. Saturn Dasha cases drag but ultimately yield correct karmic justice." },
  { glyph: "♃", name: "Jupiter", sub: "Legal Wisdom & Righteous Victory",        desc: "Jupiter governs judges, advocates, and righteous outcomes. Jupiter's Dasha or strong transit often marks the period when truth prevails in a court case. A strong 9th house Jupiter is the most auspicious indicator." },
  { glyph: "☿", name: "Mercury", sub: "Documents, Contracts & Legal Strategy",   desc: "Mercury governs contracts, agreements, paperwork, and the communication strategy in legal cases. A strong Mercury helps you present your case with clarity and persuasive force." },
  { glyph: "☊", name: "Rahu",    sub: "Conspiracy, Hidden Enemies & Surprise",   desc: "Rahu in legal houses creates complex, murky cases involving deception, hidden opponents, and unexpected twists. Rahu Dasha cases often involve fraud, conspiracy, or unusual legal proceedings." },
];

const litigationNumbers = [
  { num: "9", title: "The Warrior Fighter",     ruler: "Mars",    color: "#f0d4c8", desc: "Mars energy — 9s are naturally the most effective litigants. They have the fire and courage to fight legal battles with full force. Best legal outcomes come in 9-energy years." },
  { num: "3", title: "Jupiter's Grace",         ruler: "Jupiter", color: "#f5e6c8", desc: "Jupiter energy — 3s often find legal resolution through wisdom, negotiation, and the intervention of a powerful third party such as a wise judge. Legal fortune favours them in 3-years." },
  { num: "8", title: "The Long Battle",         ruler: "Saturn",  color: "#c8c8d0", desc: "Saturn energy — 8s face long, draining legal battles. However, patience always pays off. Legal victory comes, but only after Saturn is fully satisfied through sustained persistence." },
  { num: "1", title: "Government Support",      ruler: "Sun",     color: "#f5f0c8", desc: "Sun energy — 1s often win legal battles involving government or authority. Cases involving documentation and official processes tend to go in their favour with clarity and speed." },
];

const problems = [
  "I have been fighting a legal case for years with no resolution — when will it end?",
  "Should I file a lawsuit or try to settle out of court?",
  "My opponent in the case is influential — can I still win?",
  "Property dispute with a family member — what does my chart predict?",
  "Criminal case filed against me — will I be acquitted?",
  "Business dispute going to court — who has the stronger chart for this period?",
  "Divorce proceedings and alimony — how will the judgment go?",
  "I am a victim of fraud — will justice be served?",
  "Labour or workplace dispute going to tribunal — what are my chances?",
  "When is the most auspicious time to file my legal case?",
];

const hiddenIssues = [
  "6th lord placed in the 6th, 8th, or 12th — indicating complex and prolonged legal entanglements",
  "Saturn afflicting the 6th house or its lord — justice is delayed, patience and Saturn worship are required",
  "Rahu placed in the 6th or 7th house — cases with hidden enemies, deception, and conspiracy elements",
  "Mars in the 12th house aspecting the 6th — legal battles that drain energy, finances, and lead to secret expenses",
  "Jupiter weakened or combust during the case period — loss of moral advantage and difficulty finding wise counsel",
  "7th lord stronger than 6th lord in the current Dasha — opponent currently holds the upper hand astrologically",
];

const guideItems = [
  { n: "01", text: "Detailed 6th house analysis — your litigation strength, enemy-defeating capacity, and lord's placement" },
  { n: "02", text: "Compare 6th vs 7th house strength — assess with precision who holds the upper hand in the case" },
  { n: "03", text: "9th house analysis — is divine justice and righteous victory indicated for you in this period?" },
  { n: "04", text: "Dasha-Antardasha timing — identify the windows most favourable for legal victory and the opponent's weak periods" },
  { n: "05", text: "Muhurta for filing cases — the most auspicious planetary moment to initiate your legal proceedings" },
  { n: "06", text: "Mars mantras, Saturn worship, Hanuman prayers, and numerological guidance for hearing and settlement dates" },
];

const planetImgs = [
  "/assets/lovelogos/planets/mars.png",
  "/assets/lovelogos/planets/saturn.png",
  "/assets/lovelogos/planets/jupiter.png",
  "/assets/lovelogos/planets/mercury.png",
  "/assets/lovelogos/planets/rahu.png",
  
];
const houseImages=[
 "/assets/courtlogos/74.png",
  "/assets/courtlogos/75.png",
  "/assets/courtlogos/76.png",
  "/assets/courtlogos/77.png",
  "/assets/courtlogos/78.png",
  "/assets/courtlogos/79.png",
];

/* ════════════════════════════════════════════════════════════════ */
/* PLANET ORBITAL CONFIG */
const INNER_R = 160, OUTER_R = 280, SYS_DIM = 700, SYS_CTR = SYS_DIM / 2;
const PLANET_CFG = [
  { orbitR: INNER_R, angleDeg: 270, ballSize: 55, duration: 62,  dir: "cw"  },
  { orbitR: INNER_R, angleDeg: 30,  ballSize: 55, duration: 70,  dir: "cw"  },
  { orbitR: INNER_R, angleDeg: 150, ballSize: 55, duration: 65,  dir: "cw"  },
  { orbitR: OUTER_R, angleDeg: 60,  ballSize: 65, duration: 105, dir: "ccw" },
  { orbitR: OUTER_R, angleDeg: 180, ballSize: 65, duration: 90,  dir: "ccw" },
  { orbitR: OUTER_R, angleDeg: 300, ballSize: 65, duration: 118, dir: "ccw" },
];

/* ════════════════════════════════════════════════════════════════ */
/* HELPERS */
function Eyebrow({ label, light }) {
  return (
    <div className="eyebrow">
      <div className={`eyebrow-line${light ? " light" : ""}`} />
      <span className={`eyebrow-text${light ? " light" : ""}`}>{label}</span>
      <div className={`eyebrow-line${light ? " light" : ""}`} />
    </div>
  );
}

function GlowyParticles({ count = 55 }) {
  const [pts] = useState(() => Array.from({ length: count }, () => ({
    top: `${(Math.random() * 92 + 2).toFixed(1)}%`, left: `${(Math.random() * 96 + 1).toFixed(1)}%`,
    sz: (Math.random() * 5 + 3).toFixed(1), delay: (Math.random() * 10).toFixed(2),
    dur: (Math.random() * 4 + 3).toFixed(2), star: Math.random() > 0.55,
  })));
  return (
    <>
      {pts.map((p, i) => (
        <span key={i} style={{
          position: "absolute", top: p.top, left: p.left, fontSize: `${p.sz}px`, lineHeight: 1,
          color: p.star ? "rgba(210,155,95,0.72)" : "rgba(242,218,162,0.78)",
          textShadow: p.star ? "0 0 7px rgba(201,169,110,0.9),0 0 18px rgba(201,169,110,0.45)" : "0 0 5px rgba(245,225,165,0.95),0 0 14px rgba(201,169,110,0.5)",
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

const SHOT_DATA = [
  { delay: 0,   dur: 7,   top: "9%",  left: "8%",  rot: 28, x0: "-160px", y0: "-90px",  x1: "520px", y1: "290px", len: 130 },
  { delay: 2.4, dur: 6,   top: "28%", left: "60%", rot: 31, x0: "-110px", y0: "-65px",  x1: "380px", y1: "220px", len: 100 },
  { delay: 4.9, dur: 8,   top: "62%", left: "4%",  rot: 24, x0: "-130px", y0: "-75px",  x1: "450px", y1: "240px", len: 155 },
  { delay: 1.3, dur: 6.5, top: "14%", left: "78%", rot: 34, x0: "-85px",  y0: "-50px",  x1: "310px", y1: "175px", len: 88  },
  { delay: 3.7, dur: 7.5, top: "77%", left: "38%", rot: 26, x0: "-120px", y0: "-70px",  x1: "430px", y1: "235px", len: 120 },
  { delay: 6.1, dur: 5.5, top: "45%", left: "22%", rot: 30, x0: "-95px",  y0: "-55px",  x1: "360px", y1: "200px", len: 105 },
];
function ShootingStars() {
  return (
    <>
      {SHOT_DATA.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, left: s.left, width: s.len, height: 1.5,
          background: "linear-gradient(90deg,rgba(255,248,215,0.92) 0%,rgba(201,169,110,0.55) 35%,transparent 100%)",
          transformOrigin: "left center",
          "--rot": `${s.rot}deg`, "--sx0": s.x0, "--sy0": s.y0, "--sx1": s.x1, "--sy1": s.y1,
          animation: `shoot ${s.dur}s ${s.delay}s linear infinite`, pointerEvents: "none", zIndex: 0,
        }} />
      ))}
    </>
  );
}

function NebulaBg() {
  return (
    <>
      <div style={{ position:"absolute",top:"12%",left:"3%",width:580,height:580,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,169,110,0.08) 0%,transparent 68%)",animation:"nebula-pulse 14s ease-in-out infinite",pointerEvents:"none",zIndex:0 }} />
      <div style={{ position:"absolute",bottom:"8%",right:"5%",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(180,130,80,0.065) 0%,transparent 68%)",animation:"nebula-pulse 18s 5s ease-in-out infinite",pointerEvents:"none",zIndex:0 }} />
      <div style={{ position:"absolute",top:"48%",left:"48%",transform:"translate(-50%,-50%)",width:700,height:320,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(201,169,110,0.04) 0%,transparent 68%)",animation:"nebula-pulse 22s 9s ease-in-out infinite",pointerEvents:"none",zIndex:0 }} />
    </>
  );
}

function StarsBg({ count = 56 }) {
  return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 8 + 6, left = Math.random() * 100;
        const duration = Math.random() * 25 + 20, delay = Math.random() * 20;
        return (
          <div key={i} style={{ position:"absolute",left:`${left}%`,bottom:"-20px",width:size,height:size,opacity:0.35,animation:`starsFloat ${duration}s linear infinite`,animationDelay:`${delay}s` }}>
            <svg viewBox="0 0 24 24" style={{ width:"100%",height:"100%",filter:"drop-shadow(0 0 5px rgba(255,255,255,0.5))" }}>
              <path d="M12 2 L13.5 9 L20 7 L15 12 L20 17 L13.5 15 L12 22 L10.5 15 L4 17 L9 12 L4 7 L10.5 9 Z" fill="rgba(255,255,255,0.85)" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* HERO */
function Hero() {
  const bgRef = useRef(null);
  const { openBooking } = useBooking();
  useEffect(() => {
    return subScroll(y => {
      const cap = window.innerHeight * 1.5;
      if (y > cap) return;
      if (bgRef.current) bgRef.current.style.transform = `translateY(${y * 0.15}px)`;
    });
  }, []);
  return (
    <section style={{ position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"white" }}>
      <div ref={bgRef} style={{ position:"absolute",inset:"-15%",backgroundImage:'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&auto=format")',backgroundSize:"cover",backgroundPosition:"center",opacity:0.18,willChange:"transform",pointerEvents:"none" }} />
      <div style={{ position:"relative",zIndex:2,textAlign:"center",padding:"120px 40px 140px",animation:"hero-rise 1s cubic-bezier(.22,1,.36,1) forwards" }}>
        <div style={{ fontFamily:BODY_FONT,fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"rgba(201,169,110,0.8)",marginBottom:28 }}>
          Vedic Saar · Sacred Services
        </div>
        <h1 style={{ fontFamily:HEADING_FONT,fontSize:"clamp(52px,9vw,100px)",fontWeight:400,color:DARK,margin:"0 0 22px",lineHeight:0.95,letterSpacing:-1 }}>
          Court &amp;<br />Litigation
        </h1>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:18,margin:"0 auto 32px",maxWidth:700 }}>
          <span style={{ flex:1,height:"0.5px",background:`linear-gradient(to right,transparent,${GOLD})` }} />
          <span style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:22,color:MUTED,whiteSpace:"nowrap" }}>
            ✦ &nbsp; Justice has a planetary timing. Let the stars guide you through the legal storm. &nbsp; ✦
          </span>
          <span style={{ flex:1,height:"0.5px",background:`linear-gradient(to left,transparent,${GOLD})` }} />
        </div>
        
        <button onClick={openBooking} className="cta-btn">
          <span>Book Consultation</span>
          <span style={{ fontSize:15,lineHeight:1 }}>→</span>
        </button>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* INTRO */
function IntroSection() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ background:CREAM2,position:"relative",overflow:"hidden" }}>
      <WaveTop fill={CREAM2} />
      <WaveBottom fill={DARK2} />
      <img src="/assets/wheel.png" alt="" style={{ position:"absolute",right:"-8%",top:"50%",transform:"translateY(-50%)",width:"clamp(480px,60vw,800px)",opacity:0.13,pointerEvents:"none",animation:"spin-slow 180s linear infinite",filter:"sepia(0.3) saturate(0.7)",userSelect:"none" }} />
      <div style={{ maxWidth:860,margin:"0 auto",padding:"100px 48px 80px",textAlign:"center",position:"relative",zIndex:1 }}>
        <Eyebrow label="Vedic Wisdom" />
        <h2 className="r" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontStyle:"italic",fontSize:HEADING_SIZE,color:DARK,lineHeight:1.1,margin:"0 0 48px",letterSpacing:"-0.01em" }}>
          Your Cosmic Legal<br /><span style={{ color:GOLD }}>Strategy</span>
        </h2>
        <div className="r d1" style={{ borderLeft:`2px solid ${GOLD}`,paddingLeft:28,marginBottom:40,textAlign:"left",maxWidth:680,margin:"0 auto 40px" }}>
          <p style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:22,color:DARK,lineHeight:1.7,margin:0,opacity:0.8 }}>
            "Legal battles are among the most draining, anxiety-inducing, and financially devastating experiences a person can face. Court cases, lawsuits, and disputes are governed by specific houses and planets — and their outcomes can be predicted with remarkable accuracy."
          </p>
        </div>
        <p className="r d2" style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:2.1,marginBottom:24 }}>
          Knowing when justice is on your side, when to push hard and when to settle, which planetary periods favour legal victory, and what remedies to perform — this knowledge is invaluable. At Vedic Saar, we provide exactly this guidance with precision and sensitivity.
        </p>
        <p className="r d3" style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:2.1,marginBottom:52 }}>
          We combine 6th house analysis, Mars and Saturn Dasha timing, Jupiter's transit over key houses, and Vedic numerology to arm you with a complete cosmic strategy for your legal battle.
        </p>
        <div className="r d4" style={{ display:"flex",gap:2,justifyContent:"center",flexWrap:"wrap" }}>
          {["6 Legal Houses Decoded","6 Planetary Justice Indicators","Muhurta for Filing Cases"].map((s, i) => (
            <div key={i} style={{ padding:"11px 22px",background:DARK,color:CREAM,fontFamily:BODY_FONT,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase" }}>{s}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* HOUSES */
function HousesSection() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ background:DARK2,position:"relative",overflow:"hidden" }} className="grain">
      <WaveTop fill={DARK2} />
      <WaveBottom fill={DARK2} />
      <GlowyParticles count={55} />
      <NebulaBg />
      <StarsBg count={100} />
      <img src="/assets/costelation.png" alt="" style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:1000,opacity:0.04,pointerEvents:"none",animation:"spin-slow 200s linear infinite" }} />
      <div style={{ maxWidth:1240,margin:"0 auto",padding:"100px 48px 90px",position:"relative",zIndex:1 }}>
        <Eyebrow label="Vedic Astrology" light />
        <h2 className="r" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:CREAM,textAlign:"center",margin:"0 0 8px",lineHeight:1.05 }}>
          Houses That Govern
        </h2>
        <p className="r d1" style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:26,color:GOLD,textAlign:"center",margin:"0 0 16px" }}>
          Court Cases &amp; Legal Matters
        </p>
        <p className="r d2" style={{ fontFamily:BODY_FONT,fontSize:10,color:"rgba(201,169,110,0.38)",textAlign:"center",letterSpacing:"0.22em",margin:"0 0 60px",textTransform:"uppercase" }}>
          Hover to awaken each house
        </p>
        <div className="mobile-col-1" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
          {houses.map((h, i) => (
            <div key={i} className={`r d${(i % 3) + 1} hcard`}>
              <div className="hcard-orb" />
              <div style={{ position:"absolute",top:0,right:10,fontFamily:HEADING_FONT,fontSize:86,fontWeight:600,color:DARK,opacity:0.06,lineHeight:1,pointerEvents:"none",userSelect:"none" }}>{h.num}</div>
              <div style={{ height:2,background:`linear-gradient(90deg,transparent,rgba(201,169,110,0.55),transparent)` }} />
              <div style={{ padding:"38px 30px 34px" }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"center",marginBottom:26,height:88 }}>
                  <div style={{ width:72,height:72 }}> <img
    src={houseImages[i]}
    alt={h.title}
    style={{
      width:"100%",
      height:"100%",
      objectFit:"contain",
      opacity:0.85,
      transition:"all 0.3s ease"
    }}
  /></div>
                </div>
                <div className="hcard-num" style={{ fontFamily:BODY_FONT,fontSize:10,letterSpacing:"0.22em",color:GOLD,marginBottom:10,textTransform:"uppercase",transition:"color 0.4s" }}>
                  {h.num} House
                </div>
                <h3 style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:22,color:DARK,margin:"0 0 6px",lineHeight:1.2 }}>{h.title}</h3>
                <div style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:14,color:"rgba(201,169,110,0.55)",marginBottom:16 }}>{h.sub}</div>
                <div style={{ width:30,height:1,background:`linear-gradient(90deg,rgba(201,169,110,0.5),transparent)`,marginBottom:16 }} />
                <p style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:1.9,margin:0 }}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PLANETS */
function PlanetsSection() {
  const ref    = useRef(null);
  const sysRef = useRef(null);
  const [scale, setScale] = useState(1);
  useReveal(ref);
  useEffect(() => {
    if (!sysRef.current) return;
    const parent = sysRef.current.parentElement;
    const update = () => setScale(Math.min(1, (parent?.offsetWidth ?? SYS_DIM) / SYS_DIM));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);
  return (
    <section ref={ref} style={{ background:CREAM2,position:"relative",overflow:"hidden" }}>
      <WaveTop fill={DARK2} />
      <WaveBottom fill={DARK2} />
      <div style={{ maxWidth:1300,margin:"0 auto",padding:"100px 48px 120px",position:"relative",zIndex:1 }}>
        <Eyebrow label="Planetary Influences" />
        <h2 className="r" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:DARK,textAlign:"center",margin:"0 0 8px" }}>
          Planets That Govern
        </h2>
        <p className="r d1" style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:26,color:GOLD,textAlign:"center",margin:"0 0 16px" }}>
          Legal Outcomes &amp; Justice
        </p>
        <p className="r d2" style={{ fontFamily:BODY_FONT,fontSize:10,color:MUTED,textAlign:"center",letterSpacing:"0.22em",textTransform:"uppercase",margin:"0 0 56px" }}>
          Hover each planet to reveal its role in legal matters
        </p>
        <div style={{ width:"100%",display:"flex",justifyContent:"center",overflow:"hidden" }}>
          <div ref={sysRef} className="r d3" style={{ position:"relative",width:SYS_DIM,height:SYS_DIM,flexShrink:0,transform:`scale(${scale})`,transformOrigin:"top center",marginBottom:`${-(SYS_DIM*(1-scale))}px` }}>
            {[INNER_R, OUTER_R].map((r, i) => (
              <div key={`ring-${i}`} style={{ position:"absolute",borderRadius:"50%",top:"50%",left:"50%",width:r*2,height:r*2,marginLeft:-r,marginTop:-r,border:`1px solid rgba(201,169,110,${i===0?0.45:0.35})`,boxShadow:"0 0 10px rgba(201,169,110,0.1)",pointerEvents:"none" }} />
            ))}
            {[INNER_R - 20, OUTER_R + 20].map((r, i) => (
              <div key={`deco-${i}`} style={{ position:"absolute",borderRadius:"50%",top:"50%",left:"50%",width:r*2,height:r*2,marginLeft:-r,marginTop:-r,border:"0.5px dashed rgba(201,169,110,0.07)",pointerEvents:"none" }} />
            ))}
            <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:88,height:88,borderRadius:"50%",background:"radial-gradient(circle at 38% 35%,#fffbe8,#f0c84a 48%,#c9902a)",animation:"sun-pulse 4s ease-in-out infinite",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ position:"absolute",inset:-9,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.35)" }} />
              <div style={{ position:"absolute",inset:-18,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.18)" }} />
              <span style={{ fontFamily:BODY_FONT,fontSize:8,letterSpacing:"0.22em",color:"#3a2a06",textTransform:"uppercase",fontWeight:600 }}>Justice</span>
            </div>
            {planets.map((p, i) => {
              const cfg = PLANET_CFG[i];
              const { ballSize, duration, dir } = cfg;
              const spinAnim    = dir === "cw" ? "spin-slow" : "spin-rev";
              const counterAnim = dir === "cw" ? "spin-rev"  : "spin-slow";
              const startDelay  = dir === "cw" ? -(cfg.angleDeg/360)*duration : -((360-cfg.angleDeg)/360)*duration;
              return (
                <div key={i} style={{ position:"absolute",top:SYS_CTR,left:SYS_CTR,width:0,height:0,animation:`${spinAnim} ${duration}s linear infinite ${startDelay}s`,willChange:"transform",zIndex:8 }}>
                  <div style={{ position:"absolute",left:cfg.orbitR,top:0 }}>
                    <div style={{ animation:`${counterAnim} ${duration}s linear infinite ${startDelay}s`,willChange:"transform" }}>
                      <div className="planet-node" style={{ position:"absolute",left:-80,top:-ballSize/2,width:160,animation:"none",display:"flex",flexDirection:"column",alignItems:"center" }}>
                        <div className="planet-ball" style={{ width:ballSize,height:ballSize }}>
                          {planetImgs[i]
                            ? <img src={planetImgs[i]} alt={p.name} style={{ width:"130%",height:"130%",objectFit:"contain",display:"block",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)" }} onError={e => { e.target.style.display="none"; }} />
                            : <span style={{ fontSize:Math.round(ballSize*0.38),color:GOLD,display:"flex",alignItems:"center",justifyContent:"center",height:"100%" }}>{p.glyph}</span>
                          }
                        </div>
                        <div style={{ textAlign:"center",marginTop:8 }}>
                          <div className="planet-glyph">{p.glyph}</div>
                          <div className="planet-name">{p.name}</div>
                          <div className="planet-sub">{p.sub}</div>
                          <div className="planet-desc">{p.desc}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="r d4 planets-grid mobile-col-1" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:48 }}>
          {planets.map((p, i) => (
            <div key={i} style={{ padding:"22px 20px",background:W,border:"1px solid rgba(201,169,110,0.16)",borderRadius:2,display:"flex",gap:14,alignItems:"flex-start",transition:"border-color 0.3s,transform 0.3s,box-shadow 0.3s",cursor:"default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(201,169,110,0.42)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(28,20,13,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(201,169,110,0.16)"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
            >
              <div style={{ width:42,height:42,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:"radial-gradient(circle at 30% 30%,#fffff0,#e8dcc6)",boxShadow:"0 0 10px rgba(201,169,110,0.16)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:GOLD }}>
                {planetImgs[i]
                  ? <img src={planetImgs[i]} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e => { e.target.style.display="none"; }} />
                  : p.glyph
                }
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:HEADING_FONT,fontSize:15,fontWeight:500,color:DARK,marginBottom:2 }}>{p.name}</div>
                <div style={{ fontFamily:BODY_FONT,fontSize:8,letterSpacing:"0.12em",textTransform:"uppercase",color:GOLD,opacity:0.72,marginBottom:6 }}>{p.sub}</div>
                <p style={{ fontFamily:BODY_FONT,fontSize:12,color:MUTED,lineHeight:1.75,margin:0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* NUMEROLOGY FAN */
function NumerologySection() {
  const ref    = useRef(null);
  const fanRef = useRef(null);
  const [hov, setHov] = useState(null);
  useReveal(ref);
  const RADIUS = 500, PIVOT_OFFSET = RADIUS - 20, ANGLES = [-21, -7, 7, 21];

  function handleFanMove(e) {
    const rect = fanRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pivotX = rect.left + rect.width / 2, pivotY = rect.bottom + PIVOT_OFFSET;
    const dx = e.clientX - pivotX, dy = pivotY - e.clientY;
    const dist = Math.hypot(dx, dy);
    if (dist < RADIUS - 100 || dist > RADIUS + 420) { setHov(null); return; }
    const mouseAngle = Math.atan2(dx, dy) * (180 / Math.PI);
    let best = -1, bestDiff = Infinity;
    ANGLES.forEach((a, i) => { const d = Math.abs(a - mouseAngle); if (d < bestDiff) { bestDiff = d; best = i; } });
    setHov(bestDiff < 20 ? best : null);
  }

  function handleFanTouch(e) {
    const touch = e.touches[0];
    if (touch) handleFanMove({ clientX: touch.clientX, clientY: touch.clientY });
  }

  return (
    <section ref={ref} style={{ position:"relative",overflow:"hidden",background:DARK,paddingBottom:0 }} onMouseMove={handleFanMove} onMouseLeave={() => setHov(null)} onTouchMove={(e) => { e.preventDefault(); handleFanTouch(e); }} onTouchEnd={() => setHov(null)} className="grain">
      <WaveTop fill={DARK2} />
      <WaveBottom fill={DARK2} />
      <GlowyParticles count={55} />
      <ShootingStars />
      <StarsBg count={20} />
      <NebulaBg />
      <div style={{ position:"absolute",top:"28%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.04,pointerEvents:"none" }}>
        <img src="/assets/wheel.png" alt="" style={{ width:680,animation:"spin-slow 130s linear infinite",filter:"sepia(1) hue-rotate(20deg) brightness(1.4)" }} />
      </div>
      <div style={{ maxWidth:1160,margin:"0 auto",padding:"100px 72px 0",position:"relative",zIndex:1 }}>
        <div style={{ textAlign:"center",marginBottom:64 }}>
          <Eyebrow label="Vedic Numerology" light />
          <h2 className="r" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:CREAM,lineHeight:1.05,marginBottom:14 }}>
            Numbers &amp; <em style={{ color:GOLD,fontStyle:"italic" }}>Legal Timing</em>
          </h2>
          <p className="r d1" style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:"rgba(245,240,232,0.42)",maxWidth:500,margin:"0 auto",lineHeight:1.9 }}>
            In Vedic numerology, specific years, months, and personal numbers favour legal action or settlement. Certain number combinations indicate high risk in litigation while others signal triumph.
          </p>
        </div>
      </div>
      <div ref={fanRef} className="r d2 ls-fan-desktop" style={{ position:"relative",top:-160,width:"100%",height:560,overflow:"visible" }}>
        <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"50%",height:1,background:`linear-gradient(90deg,transparent,rgba(201,169,110,0.15),transparent)`,zIndex:0 }} />
        {litigationNumbers.map((n, i) => {
          const isHov = hov === i, angle = ANGLES[i], baseZ = i <= 1 ? i + 1 : 4 - i;
          return (
            <div key={i} onClick={() => setHov(hov === i ? null : i)} style={{ position:"absolute",bottom:-RADIUS+20,left:"50%",marginLeft:-108,width:216,height:360,transformOrigin:"center bottom",transform:isHov?`rotate(0deg) translateY(-${RADIUS+80}px) scale(1.07)`:`rotate(${angle}deg) translateY(-${RADIUS}px)`,transition:"transform 0.55s cubic-bezier(.16,1,.3,1)",zIndex:isHov?30:baseZ,pointerEvents:"auto",cursor:"pointer" }}>
              <div style={{ width:"100%",height:"100%",transformStyle:"preserve-3d",transform:isHov?"rotateY(180deg)":"rotateY(0deg)",transition:"transform 0.65s cubic-bezier(.16,1,.3,1)",position:"relative" }}>
                <div style={{ position:"absolute",inset:0,borderRadius:0,overflow:"hidden",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",background:"linear-gradient(160deg,#ffffff,#faf6ef)",border:"1px solid rgba(201,169,110,0.32)",boxShadow:isHov?"0 20px 52px rgba(0,0,0,0.18),0 0 0 1px rgba(201,169,110,0.5)":`0 ${4+baseZ*2}px ${12+baseZ*4}px rgba(0,0,0,0.12)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ position:"absolute",inset:10,border:"1px solid rgba(201,169,110,0.25)" }} />
                  <div style={{ position:"absolute",inset:13,border:"0.5px solid rgba(201,169,110,0.12)" }} />
                  {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v, h], ci) => (
                    <span key={ci} style={{ position:"absolute",[v]:16,[h]:16,fontSize:8,color:GOLD,opacity:0.5,lineHeight:1 }}>✦</span>
                  ))}
                  <img src="/assets/wheel.png" alt="" aria-hidden decoding="async" style={{ position:"absolute",width:"140%",height:"140%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",objectFit:"contain",opacity:0.05,pointerEvents:"none" }} />
                  <span style={{ position:"relative",zIndex:1,fontFamily:BODY_FONT,fontSize:7,letterSpacing:"0.3em",textTransform:"uppercase",color:GOLD,marginBottom:20,opacity:0.75 }}>Numerology</span>
                  <span style={{ position:"relative",zIndex:1,fontFamily:HEADING_FONT,fontWeight:400,fontSize:94,color:GOLD,lineHeight:1,textShadow:"0 0 40px rgba(201,169,110,0.18)" }}>{n.num}</span>
                  <div style={{ position:"relative",zIndex:1,width:36,height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,margin:"16px 0" }} />
                  <span style={{ position:"relative",zIndex:1,fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:14,color:DARK,textAlign:"center",padding:"0 18px",lineHeight:1.4,opacity:0.85 }}>{n.title}</span>
                </div>
                <div style={{ position:"absolute",inset:0,borderRadius:0,overflow:"hidden",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",background:"linear-gradient(145deg,#ffffff,#faf6ef)",border:"1px solid rgba(201,169,110,0.55)",boxShadow:"0 20px 52px rgba(0,0,0,0.18),0 0 0 1px rgba(201,169,110,0.45)",padding:"24px 20px",display:"flex",flexDirection:"column" }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${n.color},transparent)`,opacity:0.85 }} />
                  <div style={{ position:"absolute",inset:10,border:"1px solid rgba(201,169,110,0.2)" }} />
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,position:"relative",zIndex:1 }}>
                    <span style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:42,color:GOLD,lineHeight:1,opacity:0.75 }}>{n.num}</span>
                    <span style={{ fontSize:8,color:GOLD,opacity:0.4,marginTop:8 }}>✦</span>
                  </div>
                  <h3 style={{ position:"relative",zIndex:1,fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:17,fontWeight:400,color:DARK,marginBottom:4,lineHeight:1.2 }}>{n.title}</h3>
                  <div style={{ position:"relative",zIndex:1,fontFamily:BODY_FONT,fontSize:8,color:GOLD,letterSpacing:"0.22em",textTransform:"uppercase",opacity:0.75,marginBottom:10 }}>Ruled by {n.ruler}</div>
                  <div style={{ position:"relative",zIndex:1,height:1,background:"rgba(201,169,110,0.25)",marginBottom:14 }} />
                  <p style={{ position:"relative",zIndex:1,fontFamily:BODY_FONT,fontSize:10,color:MUTED,lineHeight:1.9,flex:1 }}>{n.desc}</p>
                  <div style={{ position:"relative",zIndex:1,display:"flex",justifyContent:"center",marginTop:14 }}>
                    <span style={{ fontSize:7,color:GOLD,opacity:0.4,letterSpacing:"0.4em" }}>✦ ✦ ✦</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Mobile grid */}
      <div className="ls-grid-mobile" style={{ gridTemplateColumns:"repeat(3,1fr)", gap:12, padding:"16px 16px 48px", position:"relative", zIndex:1 }}>
        {litigationNumbers.map((n, i) => {
          const isHov = hov === i;
          return (
            <div key={i} onClick={() => setHov(hov === i ? null : i)} style={{ height:220, cursor:"pointer", perspective:"600px" }}>
              <div style={{ width:"100%", height:"100%", transformStyle:"preserve-3d", transform:isHov?"rotateY(180deg)":"rotateY(0deg)", transition:"transform 0.65s cubic-bezier(.22,1,.36,1)", position:"relative" }}>
                {/* Front */}
                <div style={{ position:"absolute", inset:0, borderRadius:8, overflow:"hidden", backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", background:"linear-gradient(160deg,#ffffff,#faf6ef)", border:"1px solid rgba(201,169,110,0.32)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Ibarra Real Nova',serif", fontSize:60, color:GOLD, lineHeight:1, opacity:0.8 }}>{n.num}</span>
                  <div style={{ width:20, height:1, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, margin:"8px 0" }} />
                  <span style={{ fontFamily:"'Ibarra Real Nova',serif", fontStyle:"italic", fontSize:9, color:DARK, textAlign:"center", padding:"0 8px", lineHeight:1.4, opacity:0.8 }}>{n.title}</span>
                  <span style={{ position:"absolute", bottom:8, fontFamily:"'Glacial Indifference',sans-serif", fontSize:6, color:GOLD, opacity:0.45, letterSpacing:1 }}>tap</span>
                </div>
                {/* Back */}
                <div style={{ position:"absolute", inset:0, borderRadius:8, overflow:"hidden", backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", transform:"rotateY(180deg)", background:"linear-gradient(145deg,#ffffff,#faf6ef)", border:"1px solid rgba(201,169,110,0.55)", padding:"12px 10px", display:"flex", flexDirection:"column" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"'Ibarra Real Nova',serif", fontSize:28, color:GOLD, lineHeight:1, opacity:0.5 }}>{n.num}</span>
                  </div>
                  <h3 style={{ fontFamily:"'Ibarra Real Nova',serif", fontStyle:"italic", fontSize:11, fontWeight:400, color:DARK, marginBottom:4, lineHeight:1.2 }}>{n.title}</h3>
                  <div style={{ fontFamily:"'Glacial Indifference',sans-serif", fontSize:7, color:GOLD, letterSpacing:"0.2em", textTransform:"uppercase", opacity:0.5, marginBottom:6 }}>Ruled by {n.ruler}</div>
                  <div style={{ height:1, background:"rgba(201,169,110,0.13)", marginBottom:8 }} />
                  <p style={{ fontFamily:"'Glacial Indifference',sans-serif", fontSize:8, color:MUTED, lineHeight:1.7, flex:1, overflow:"hidden" }}>{n.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ls-fan-desktop" style={{ textAlign:"center",padding:"28px 0 80px",position:"relative",zIndex:1,marginTop:-100 }}>
        <span style={{ fontFamily:BODY_FONT,fontSize:9,letterSpacing:"0.3em",color:"rgba(201,169,110,0.28)",textTransform:"uppercase" }}>← hover any card →</span>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PROBLEMS */
function ProblemsSection() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ background:CREAM2,position:"relative",overflow:"hidden" }}>
      <WaveTop fill={DARK2} />
      <div style={{ position:"absolute",left:"-50px",top:"50%",transform:"translateY(-50%)",fontFamily:HEADING_FONT,fontSize:"clamp(260px,33vw,460px)",fontWeight:300,color:DARK,opacity:0.02,lineHeight:1,pointerEvents:"none",userSelect:"none" }}>⚖</div>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"100px 48px 90px",position:"relative",zIndex:1 }}>
        <Eyebrow label="Common Concerns" />
        <h2 className="r" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:DARK,textAlign:"center",margin:"0 0 64px",lineHeight:1.1 }}>
          Questions We Help<br /><em style={{ color:GOLD }}>You Answer</em>
        </h2>
        <div className="mobile-col-1" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72 }}>
          <div className="r d1">
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:28 }}>
              <div style={{ width:3,height:28,background:GOLD,borderRadius:2 }} />
              <h3 style={{ fontFamily:HEADING_FONT,fontSize:26,fontWeight:500,color:DARK,margin:0,lineHeight:1.2 }}>Legal Questions We Help Navigate</h3>
            </div>
            {problems.map((p, i) => (
              <div key={i} className="prob-row">
                <span style={{ fontFamily:BODY_FONT,fontSize:9,color:GOLD,marginTop:3,flexShrink:0,opacity:0.65 }}>{String(i+1).padStart(2,"0")}</span>
                <span style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:1.75 }}>{p}</span>
              </div>
            ))}
          </div>
          <div className="r d2">
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
              <div style={{ width:3,height:28,background:GOLD,borderRadius:2 }} />
              <h3 style={{ fontFamily:HEADING_FONT,fontSize:26,fontWeight:500,color:DARK,margin:0,lineHeight:1.2 }}>Hidden Issues in Your Chart</h3>
            </div>
            <p style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,marginBottom:28,lineHeight:1.9 }}>
              Certain planetary combinations indicate legal vulnerability or hidden disadvantage. Our reading specifically checks for:
            </p>
            {hiddenIssues.map((h, i) => (
              <div key={i} className="prob-row" style={{ borderBottomColor:i<hiddenIssues.length-1?"rgba(28,20,13,0.07)":"transparent" }}>
                <span style={{ color:GOLD,fontSize:8,marginTop:5,flexShrink:0 }}>◆</span>
                <span style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:DARK,lineHeight:1.75 }}>{h}</span>
              </div>
            ))}
            <div style={{ marginTop:36,padding:"24px 28px",background:DARK,borderLeft:`3px solid ${GOLD}` }}>
              <div style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:16,color:CREAM,lineHeight:1.75,opacity:0.82 }}>
                "Truth has a planetary champion. In your moment of legal crisis, let the stars be your strategy."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* GUIDE */
function GuideSection() {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{ background:"#faf8f5",position:"relative",overflow:"hidden" }} className="grain">
      <WaveTop fill={CREAM2} />
      <img src="/assets/wheel.png" alt="" style={{ position:"absolute",left:"-100px",bottom:"35px",width:650,opacity:0.2,pointerEvents:"none",animation:"spin-slow 160s linear infinite" }} />
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"100px 48px 100px",position:"relative",zIndex:1 }}>
        <Eyebrow label="Our Approach" />
        <h2 className="r" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:"black",textAlign:"center",margin:"0 0 8px",lineHeight:1.05 }}>
          How We Guide You
        </h2>
        <p className="r d1" style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:26,color:GOLD,textAlign:"center",margin:"0 0 64px" }}>
          Through Your Legal Challenges
        </p>
        <div className="mobile-col-1" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
          {guideItems.map((g, i) => (
            <div key={i} className={`r d${(i%3)+1} gitem`} style={{ padding:"32px 28px",background:"white",display:"flex",gap:20,alignItems:"flex-start" }}>
              <span style={{ fontFamily:HEADING_FONT,fontSize:26,color:GOLD,lineHeight:1,flexShrink:0,paddingTop:2,fontWeight:400 }}>{g.n}</span>
              <span style={{ fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:"black",lineHeight:1.9 }}>{g.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* CTA */
function CTASection() {
  const ref = useRef(null), moonRef = useRef(null);
  const { openBooking } = useBooking();
  useReveal(ref);
  useEffect(() => {
    return subScroll(() => {
      if (!moonRef.current) return;
      const rect = moonRef.current.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      moonRef.current.style.transform = `translate(-50%,-50%) translateY(${(p-0.5)*-60}px)`;
    });
  }, []);
  return (
    <section ref={ref} style={{ backgroundImage:'url("/assets/Testimonialsbg.png")',marginTop:-120,backgroundSize:"cover",backgroundPosition:"top center",padding:"130px 48px 150px",textAlign:"center",position:"relative",overflow:"hidden" }}>
      <div ref={moonRef} style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none" }} />
      <div style={{ position:"relative",zIndex:2,marginTop:500 }}>
        <div className="r" style={{ fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:16,color:CREAM,marginBottom:52,letterSpacing:"0.03em" }}>
          ✦ &nbsp; Fight smarter with cosmic strategy — truth always has a planetary champion. &nbsp; ✦
        </div>
        <h2 className="r d1" style={{ fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:"black",margin:0,lineHeight:0.92,letterSpacing:"-0.02em" }}>
          Book Your<br />
          <span className="gold-shimmer">Court &amp; Litigation</span><br />
          Consultation
        </h2>
        <div className="r d2" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:20,margin:"52px auto",maxWidth:380 }}>
          <span style={{ flex:1,height:"0.5px",background:`linear-gradient(to right,transparent,rgba(201,169,110,0.35))` }} />
          <span style={{ width:6,height:6,background:GOLD,transform:"rotate(45deg)",flexShrink:0 }} />
          <span style={{ flex:1,height:"0.5px",background:`linear-gradient(to left,transparent,rgba(201,169,110,0.35))` }} />
        </div>
        <p className="r d3" style={{ fontFamily:BODY_FONT,fontSize:10,color:"black",maxWidth:360,margin:"0 auto 60px",lineHeight:2,letterSpacing:"0.18em",textTransform:"uppercase" }}>
          Navigate Your Legal Battle With Cosmic Clarity
        </p>
        <div className="r d4">
          <button onClick={openBooking} className="cta-btn">
            <span>Book Consultation</span>
            <span style={{ fontFamily:BODY_FONT,fontSize:15,lineHeight:1 }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function CourtLitigationPage() {
  return (
    <>
      <style>{CSS}</style>
      <Hero />
      <IntroSection />
      <HousesSection />
      <PlanetsSection />
      <NumerologySection />
      <ProblemsSection />
      <GuideSection />
      <CTASection />
    </>
  );
}