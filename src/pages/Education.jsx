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

  .r { opacity:0; transform:translateY(36px); transition:opacity 0.9s cubic-bezier(.16,1,.3,1),transform 0.9s cubic-bezier(.16,1,.3,1); }
  .r.rv { opacity:1; transform:none; }
  .r.d1{transition-delay:0.08s} .r.d2{transition-delay:0.18s} .r.d3{transition-delay:0.28s}
  .r.d4{transition-delay:0.40s} .r.d5{transition-delay:0.52s} .r.d6{transition-delay:0.64s}

  @keyframes hero-rise    { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:none} }
  @keyframes spin-slow    { to{transform:rotate(360deg)} }
  @keyframes spin-rev     { to{transform:rotate(-360deg)} }
  @keyframes gold-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes shoot {
    0%{opacity:0;transform:rotate(var(--rot,28deg)) translate(var(--sx0,-150px),var(--sy0,-80px))}
    8%{opacity:0.9} 70%{opacity:0.55}
    100%{opacity:0;transform:rotate(var(--rot,28deg)) translate(var(--sx1,500px),var(--sy1,280px))}
  }
  @keyframes nebula-pulse { 0%,100%{opacity:0.042;transform:scale(1)} 50%{opacity:0.085;transform:scale(1.12)} }
  @keyframes sun-pulse {
    0%,100%{box-shadow:0 0 40px 10px rgba(201,169,110,0.35),0 0 80px 20px rgba(201,169,110,0.15)}
    50%{box-shadow:0 0 60px 18px rgba(201,169,110,0.5),0 0 120px 40px rgba(201,169,110,0.22)}
  }
  @keyframes planet-hover { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes twinkle-glow { 0%,100%{opacity:0.07;transform:scale(0.72)} 50%{opacity:0.62;transform:scale(1.12)} }
  @keyframes starsFloat {
    0%{transform:translateY(0) scale(0.8);opacity:0} 15%{opacity:0.12}
    50%{transform:translateY(-50vh) scale(1.1);opacity:0.18} 100%{transform:translateY(-110vh) scale(1.4);opacity:0}
  }

  .gold-shimmer {
    background:linear-gradient(90deg,#c9a96e 0%,#e8c98a 30%,#fff8e8 50%,#e8c98a 70%,#c9a96e 100%);
    background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:gold-shimmer 6s linear infinite;
  }
  .eyebrow{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:20px}
  .eyebrow-line{width:40px;height:1px;background:rgba(201,169,110,0.45)}
  .eyebrow-line.light{background:rgba(245,240,232,0.25)}
  .eyebrow-text{font-family:'Glacial Indifference',sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);opacity:0.8}
  .eyebrow-text.light{color:rgba(245,240,232,0.5);opacity:1}

  .hcard{position:relative;background:linear-gradient(145deg,#ffffff,#f9f5ed);border:1px solid rgba(201,169,110,0.2);border-radius:0;overflow:hidden;transition:transform 0.4s cubic-bezier(.16,1,.3,1),box-shadow 0.4s,border-color 0.4s;cursor:default}
  .hcard::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(201,169,110,0.07) 0%,transparent 70%);opacity:0;transition:opacity 0.4s}
  .hcard:hover{transform:translateY(-8px);box-shadow:0 24px 60px rgba(28,20,13,0.12),0 0 0 1px rgba(201,169,110,0.35);border-color:rgba(201,169,110,0.35)}
  .hcard:hover::before{opacity:1}
  .hcard:hover .hcard-num{color:var(--gold2) !important}
  .hcard:hover .hcard-orb{opacity:0.6 !important;transform:scale(1.15) !important}
  .hcard-orb{position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(201,169,110,0.13) 0%,transparent 70%);opacity:0.18;transition:opacity 0.4s,transform 0.6s;pointer-events:none}

  .prob-row{display:flex;gap:16px;padding:14px 0;align-items:flex-start;border-bottom:1px solid rgba(201,169,110,0.07);transition:padding-left 0.25s ease,border-color 0.25s;cursor:default}
  .prob-row:hover{padding-left:10px;border-bottom-color:rgba(201,169,110,0.2)}
  .prob-row:last-child{border-bottom:none}

  .gitem{border:1px solid rgba(201,169,110,0.1);border-radius:0;transition:border-color 0.3s,box-shadow 0.3s,transform 0.3s,background 0.3s;cursor:default}
  .gitem:hover{border-color:rgba(201,169,110,0.3);box-shadow:0 12px 40px rgba(0,0,0,0.35);transform:translateY(-4px);background:rgba(255,255,255,0.05) !important}

  .cta-btn{display:inline-flex;align-items:center;gap:12px;padding:18px 56px;background:#0d0a06;border:2px dashed #ffffff;color:#ffffff;font-family:'Glacial Indifference',sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;cursor:pointer;position:relative;transition:opacity 0.3s}
  .cta-btn:hover{opacity:0.8}
  .cta-btn span{position:relative;z-index:1}

  .planet-node{position:absolute;display:flex;flex-direction:column;align-items:center;cursor:default}
  .planet-node:hover .planet-ball{transform:scale(1.12);box-shadow:0 0 30px rgba(201,169,110,0.45)}
  .planet-node:hover .planet-desc{max-height:80px;opacity:1}
  .planet-ball{border-radius:50%;overflow:visible;transition:transform 0.4s,box-shadow 0.4s;box-shadow:0 0 20px rgba(201,169,110,0.2);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.9),#e8dcc6);flex-shrink:0;position:relative}
  .planet-glyph{font-size:11px;color:var(--gold);opacity:0.65;line-height:1;margin-bottom:2px;text-align:center}
  .planet-name{font-family:'Ibarra Real Nova',serif;font-size:14px;font-weight:500;color:#1c140d;text-align:center;line-height:1.25;opacity:0.9;white-space:nowrap}
  .planet-sub{font-family:'Glacial Indifference',sans-serif;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);opacity:0.7;text-align:center;margin-top:2px;white-space:nowrap}
  .planet-desc{font-family:'Glacial Indifference',sans-serif;font-size:11px;color:#8a7e76;line-height:1.7;text-align:center;max-width:150px;max-height:0;overflow:hidden;opacity:0;transition:max-height 0.4s ease,opacity 0.4s ease;margin-top:4px}

  .grain::after{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;opacity:0.3;mix-blend-mode:overlay;z-index:0}

  @media(max-width:900px){.planets-grid{grid-template-columns:repeat(2,1fr) !important}}
  @media(max-width:580px){.planets-grid{grid-template-columns:1fr !important}}
  @media (max-width: 768px) {
    .mobile-col-1 { grid-template-columns: 1fr !important; }
    section { padding-left: max(20px, 4vw) !important; padding-right: max(20px, 4vw) !important; }
  }
`;

/* ════════════════════════════════════════════════════════════════ */
/* HOUSE SVG ICONS — thin black stroke, premium line-art style    */

const S = "#0d0a06";  /* stroke colour */
const SW = "1.5";     /* default stroke-width */

const houseIcons = [

  /* IV — Open Book (foundation / primary education) */
  <svg key="iv" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Left page */}
    <path d="M36 16 C28 17 17 19 7 17 L7 58 C17 56 28 58 36 60" stroke={S} strokeWidth={SW}/>
    {/* Right page */}
    <path d="M36 16 C44 17 55 19 65 17 L65 58 C55 56 44 58 36 60" stroke={S} strokeWidth={SW}/>
    {/* Spine */}
    <line x1="36" y1="16" x2="36" y2="60" stroke={S} strokeWidth={SW}/>
    {/* Left page lines */}
    <line x1="13" y1="27" x2="30" y2="26" stroke={S} strokeWidth="1" opacity="0.5"/>
    <line x1="12" y1="34" x2="30" y2="33" stroke={S} strokeWidth="1" opacity="0.5"/>
    <line x1="12" y1="41" x2="30" y2="40" stroke={S} strokeWidth="1" opacity="0.5"/>
    <line x1="12" y1="48" x2="27" y2="47" stroke={S} strokeWidth="1" opacity="0.5"/>
    {/* Right page lines */}
    <line x1="42" y1="26" x2="59" y2="27" stroke={S} strokeWidth="1" opacity="0.5"/>
    <line x1="42" y1="33" x2="60" y2="34" stroke={S} strokeWidth="1" opacity="0.5"/>
    <line x1="42" y1="40" x2="60" y2="41" stroke={S} strokeWidth="1" opacity="0.5"/>
    <line x1="44" y1="47" x2="58" y2="48" stroke={S} strokeWidth="1" opacity="0.5"/>
  </svg>,

  /* V — Lightbulb with star inside (intelligence / creativity) */
  <svg key="v" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Bulb body */}
    <path d="M36 9 C21 9 13 19 13 29 C13 40 19 46 26 51 L46 51 C53 46 59 40 59 29 C59 19 51 9 36 9Z" stroke={S} strokeWidth={SW}/>
    {/* Socket bands */}
    <line x1="27" y1="55" x2="45" y2="55" stroke={S} strokeWidth={SW}/>
    <line x1="29" y1="59" x2="43" y2="59" stroke={S} strokeWidth={SW}/>
    <line x1="32" y1="63" x2="40" y2="63" stroke={S} strokeWidth={SW}/>
    {/* Inner star */}
    <path d="M36 21 L38.1 27.4 L44.9 27.4 L39.4 31.4 L41.5 37.8 L36 33.8 L30.5 37.8 L32.6 31.4 L27.1 27.4 L33.9 27.4Z" stroke={S} strokeWidth="1.2" fill="none"/>
    {/* Radiant rays */}
    <line x1="36" y1="3" x2="36" y2="7" stroke={S} strokeWidth="1.3"/>
    <line x1="58" y1="9" x2="55" y2="12" stroke={S} strokeWidth="1.3"/>
    <line x1="14" y1="9" x2="17" y2="12" stroke={S} strokeWidth="1.3"/>
    <line x1="64" y1="29" x2="60" y2="29" stroke={S} strokeWidth="1.3"/>
    <line x1="8"  y1="29" x2="12" y2="29" stroke={S} strokeWidth="1.3"/>
  </svg>,

  /* IX — Graduation mortarboard (higher education / foreign study) */
  <svg key="ix" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Diamond board */}
    <path d="M36 9 L63 23 L36 37 L9 23Z" stroke={S} strokeWidth={SW} fill="none"/>
    {/* Cap crown hanging below centre */}
    <path d="M21 27 L21 43 C21 51 28 57 36 57 C44 57 51 51 51 43 L51 27" stroke={S} strokeWidth={SW} fill="none"/>
    {/* Tassel cord from right corner */}
    <line x1="63" y1="23" x2="63" y2="38" stroke={S} strokeWidth="1.4"/>
    {/* Tassel bundle */}
    <path d="M59 37 Q63 42 67 37" stroke={S} strokeWidth="1.3" fill="none"/>
    <line x1="60" y1="40" x2="59" y2="50" stroke={S} strokeWidth="1.2"/>
    <line x1="63" y1="41" x2="63" y2="52" stroke={S} strokeWidth="1.2"/>
    <line x1="66" y1="40" x2="67" y2="50" stroke={S} strokeWidth="1.2"/>
  </svg>,

  /* III — Gear + Pencil (skills / vocational / technical learning) */
  <svg key="iii" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Gear outer ring */}
    <circle cx="30" cy="42" r="16" stroke={S} strokeWidth={SW}/>
    {/* Gear inner hole */}
    <circle cx="30" cy="42" r="6"  stroke={S} strokeWidth="1.3"/>
    {/* Gear teeth — 8 nubs as short thick strokes */}
    <line x1="30" y1="22" x2="30" y2="26" stroke={S} strokeWidth="4.5"/>
    <line x1="30" y1="58" x2="30" y2="62" stroke={S} strokeWidth="4.5"/>
    <line x1="10" y1="42" x2="14" y2="42" stroke={S} strokeWidth="4.5"/>
    <line x1="46" y1="42" x2="50" y2="42" stroke={S} strokeWidth="4.5"/>
    <line x1="16.8" y1="28.8" x2="19.6" y2="31.6" stroke={S} strokeWidth="4.5"/>
    <line x1="40.4" y1="52.4" x2="43.2" y2="55.2" stroke={S} strokeWidth="4.5"/>
    <line x1="16.8" y1="55.2" x2="19.6" y2="52.4" stroke={S} strokeWidth="4.5"/>
    <line x1="40.4" y1="31.6" x2="43.2" y2="28.8" stroke={S} strokeWidth="4.5"/>
    {/* Pencil body */}
    <path d="M48 8 L60 20 L55 25 L43 13Z" stroke={S} strokeWidth="1.4" fill="none"/>
    {/* Pencil tip */}
    <path d="M43 13 L39 30 L55 25Z" stroke={S} strokeWidth="1.4" fill="none"/>
    {/* Pencil point */}
    <line x1="39" y1="30" x2="37" y2="35" stroke={S} strokeWidth="1.2"/>
  </svg>,

  /* XI — Laurel wreath + star (academic success / achievement) */
  <svg key="xi" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Left branch stem */}
    <path d="M36 16 C32 20 24 23 17 29 C13 33 11 39 13 45 C15 49 19 53 24 55" stroke={S} strokeWidth={SW} fill="none"/>
    {/* Left leaves */}
    <path d="M24 22 C19 20 15 23 15 27 C19 27 24 24 24 22Z" stroke={S} strokeWidth="1.2" fill="none"/>
    <path d="M17 31 C13 29 10 32 11 36 C15 35 18 33 17 31Z" stroke={S} strokeWidth="1.2" fill="none"/>
    <path d="M13 41 C9 41 8 45 10 48 C13 47 15 44 13 41Z" stroke={S} strokeWidth="1.2" fill="none"/>
    <path d="M17 51 C14 53 14 57 17 59 C19 56 19 53 17 51Z" stroke={S} strokeWidth="1.2" fill="none"/>
    {/* Right branch stem */}
    <path d="M36 16 C40 20 48 23 55 29 C59 33 61 39 59 45 C57 49 53 53 48 55" stroke={S} strokeWidth={SW} fill="none"/>
    {/* Right leaves */}
    <path d="M48 22 C53 20 57 23 57 27 C53 27 48 24 48 22Z" stroke={S} strokeWidth="1.2" fill="none"/>
    <path d="M55 31 C59 29 62 32 61 36 C57 35 54 33 55 31Z" stroke={S} strokeWidth="1.2" fill="none"/>
    <path d="M59 41 C63 41 64 45 62 48 C59 47 57 44 59 41Z" stroke={S} strokeWidth="1.2" fill="none"/>
    <path d="M55 51 C58 53 58 57 55 59 C53 56 53 53 55 51Z" stroke={S} strokeWidth="1.2" fill="none"/>
    {/* Ribbon at bottom connecting both branches */}
    <path d="M24 59 Q36 66 48 59" stroke={S} strokeWidth="1.4" fill="none"/>
    {/* Central star at crown */}
    <path d="M36 4 L37.6 9.6 L43.6 9.6 L38.8 13.2 L40.4 18.8 L36 15.2 L31.6 18.8 L33.2 13.2 L28.4 9.6 L34.4 9.6Z" stroke={S} strokeWidth="1.2" fill="none"/>
  </svg>,

  /* II — Scroll + Quill (speech / memory / knowledge retention) */
  <svg key="ii" viewBox="0 0 72 72" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Scroll body */}
    <rect x="12" y="20" width="44" height="38" rx="3" stroke={S} strokeWidth={SW}/>
    {/* Top roll */}
    <path d="M12 26 C12 16 22 16 22 26" stroke={S} strokeWidth={SW} fill="none"/>
    <path d="M56 26 C56 16 46 16 46 26" stroke={S} strokeWidth={SW} fill="none"/>
    {/* Bottom roll */}
    <path d="M12 52 C12 62 22 62 22 52" stroke={S} strokeWidth={SW} fill="none"/>
    <path d="M56 52 C56 62 46 62 46 52" stroke={S} strokeWidth={SW} fill="none"/>
    {/* Text lines on scroll */}
    <line x1="20" y1="32" x2="48" y2="32" stroke={S} strokeWidth="1" opacity="0.55"/>
    <line x1="20" y1="38" x2="48" y2="38" stroke={S} strokeWidth="1" opacity="0.55"/>
    <line x1="20" y1="44" x2="48" y2="44" stroke={S} strokeWidth="1" opacity="0.55"/>
    <line x1="20" y1="50" x2="40" y2="50" stroke={S} strokeWidth="1" opacity="0.55"/>
    {/* Quill feather */}
    <path d="M46 10 C56 2 66 7 64 17 C62 27 50 28 46 40 C44 35 42 30 46 10Z" stroke={S} strokeWidth="1.3" fill="none"/>
    {/* Quill centre shaft */}
    <line x1="46" y1="10" x2="46" y2="40" stroke={S} strokeWidth="1" opacity="0.6"/>
    {/* Quill nib */}
    <path d="M44 37 L40 54 L52 44" stroke={S} strokeWidth="1.3" fill="none"/>
  </svg>,
];

/* ════════════════════════════════════════════════════════════════ */
/* DATA */

const houses = [
  { num: "IV",  title: "Primary Education & Learning Environment",  sub: "The foundation of all learning",      desc: "Rules school education, early learning, and the home environment's role in shaping your academic foundation. The 4th house also governs the quality of teachers in your formative years and your early relationship with knowledge itself." },
  { num: "V",   title: "Intelligence, Creativity & Academic Brilliance", sub: "The throne of the intellect",   desc: "The primary house of intellect, memory, and scholarly ability. Planets here — especially Jupiter, Mercury, or the Sun — create outstanding academic potential. The 5th house reveals the type of mind you were born with." },
  { num: "IX",  title: "Higher Education, Philosophy & Foreign Study", sub: "The road of higher wisdom",       desc: "Governs university education, doctoral study, philosophy, religious learning, and going abroad for education. A strong 9th house is essential for advanced degrees, research, and international academic pursuits." },
  { num: "III", title: "Skills, Vocational Training & Technical Learning", sub: "The forge of practical mastery", desc: "Rules hands-on skills, vocational training, technical learning, and the courage to pursue unconventional educational paths. A strong 3rd house gives the ability to master practical arts and applied sciences." },
  { num: "XI",  title: "Academic Success & Educational Gains",        sub: "Where effort becomes achievement",  desc: "The fulfilment house — where the fruits of education become real-world achievements, recognition, and financial gain. A strong 11th house ensures that your educational investments produce lasting, tangible results." },
  { num: "II",  title: "Speech, Memory & Knowledge Retention",        sub: "The storehouse of learning",       desc: "The 2nd house governs speech, the faculty of recitation, and the ability to retain and articulate learned knowledge. A strong 2nd house gives excellent verbal memory, the ability to learn languages, and the power to teach clearly." },
];

const planets = [
  { glyph: "☿", name: "Mercury", sub: "Intellect, Memory & Logic",           desc: "Primary karaka for all forms of study. Strong Mercury gives photographic memory, sharp analytical ability, quick learning, and linguistic mastery. Rules commerce, science, IT, writing, and all communication-based education." },
  { glyph: "♃", name: "Jupiter", sub: "Wisdom, Higher Learning & Philosophy", desc: "Governs philosophical depth, higher education, law, teaching, and spiritual wisdom. Strong Jupiter individuals are lifelong learners who eventually become teachers, guides, or professors themselves." },
  { glyph: "☽", name: "Moon",    sub: "Memory, Emotional Learning & Intuition", desc: "Governs memory retention, emotional intelligence, and intuitive understanding. Children with a strong Moon are fast learners who retain information deeply through emotional association and vivid imagination." },
  { glyph: "♄", name: "Saturn",  sub: "Discipline, Endurance & Deep Mastery",  desc: "Saturn's students are slow but unstoppable. They may not be the fastest learners, but they master whatever they commit to with sheer persistence and discipline — often surpassing faster learners in depth and expertise." },
  { glyph: "☋", name: "Ketu",    sub: "Technical Mastery & Laser Focus",       desc: "Ketu is surprisingly powerful for education in highly specialised technical fields — mathematics, astrology, engineering, and spiritual sciences. Ketu students go where others find too complex or too esoteric." },
];

const eduNumbers = [
  { num: "1", title: "Born Leader in Education",  ruler: "Sun",     color: "#f5e6c8", desc: "Ruled by Sun. Naturally drawn to leadership positions in academia. Excels in roles of authority, independent research, and pioneering new fields. Often the student who becomes a founder or head of their discipline." },
  { num: "3", title: "The Scholar",               ruler: "Jupiter", color: "#f0e4c0", desc: "Ruled by Jupiter. The most academically oriented of all numbers. Number 3s are natural teachers, professors, lawyers, and philosophical thinkers — often lifelong students who never stop learning and never stop teaching." },
  { num: "4", title: "The Technical Expert",       ruler: "Rahu",    color: "#c8d4f0", desc: "Ruled by Rahu. Thrives in engineering, IT, architecture, and systematic technical fields. Excels through methodical, step-by-step study — the number most suited to mastering complex systems and emerging technologies." },
  { num: "5", title: "The Quick Learner",          ruler: "Mercury", color: "#d4f0d4", desc: "Ruled by Mercury. Absorbs information at extraordinary speed. Excels in communication, commerce, languages, media, and multi-disciplinary studies. Number 5s are at their best when their education moves as fast as their mind." },
  { num: "7", title: "The Deep Researcher",        ruler: "Ketu",    color: "#dcd4f0", desc: "Ruled by Ketu. Drawn to subjects others find too complex or too esoteric. Excels in deep research, philosophy, astrology, mathematics, and spiritual sciences — the number of the academic who changes their field forever." },
];

const problems = [
  "Which field of study is most aligned with my natural talents and planetary strengths?",
  "My child is an average student but clearly talented — why the gap between potential and performance?",
  "I keep failing competitive exams (JEE, UPSC, NEET, CAT) — is this a Dasha blockage?",
  "Should I study science, commerce, or arts — what does my chart indicate?",
  "Is studying abroad written in my chart? If yes, when is the right time?",
  "Memory and concentration problems are making studying extremely difficult",
  "I want to pursue a PhD or advanced degree — is the timing right for me?",
  "I dropped out of education years ago and want to return — is it too late?",
  "My child does not want to study — how to understand their planetary mindset?",
  "I am choosing between two educational paths or institutions and cannot decide",
];

const hiddenIssues = [
  "Mercury debilitated, combust, or heavily afflicted — core intellectual challenges affecting memory, concentration, and learning speed",
  "Jupiter placed in the 6th, 8th, or 12th — hidden barriers to higher education despite sincere effort and genuine academic desire",
  "Rahu aspecting or occupying the 4th or 5th house — mental restlessness and difficulty with conventional academic environments",
  "Saturn's direct influence on Mercury or the 5th house — slow learning pace that frustrates, but builds profound, enduring mastery when given time",
  "5th lord in an enemy sign or debilitated — academic potential clearly present but specific planetary combinations blocking its full expression",
  "Ketu in the 4th house — deep disconnection from conventional learning environments; requires alternative or specialized educational approaches",
];

const guideItems = [
  { n: "01", text: "Full 4th, 5th, and 9th house analysis — the complete educational triangle of foundation, intellect, and higher learning" },
  { n: "02", text: "Mercury and Jupiter assessment — your two core intellectual planets, their current strength, Dasha timing, and transit positions" },
  { n: "03", text: "Identify your natural learning style — analytical, visual, creative, experiential, or deeply philosophical" },
  { n: "04", text: "Map the Dasha and transit windows most favourable for study, competitive exams, and pursuing advanced degrees" },
  { n: "05", text: "Detect Dasha periods creating academic blockages — and provide Vedic remedies, mantras, and gemstones to counter them" },
  { n: "06", text: "Saraswati mantras, Mercury-strengthening rituals, and auspicious dates for exams, admissions, and new course beginnings" },
];

const planetImgs = [
  "/assets/lovelogos/planets/mercury.png",                                          /* Mercury — glyph ☿ */
  "/assets/lovelogos/planets/jupiter.png",
  "/assets/lovelogos/planets/moon.png",
                                         /* Sun — glyph ☉ */
  "/assets/lovelogos/planets/saturn.png",
  "/assets/lovelogos/planets/Ketu.png",                                          /* Ketu — glyph ☋ */
];


const houseImages = [
  "/assets/educationlogos/62.png",
  "/assets/educationlogos/63.png",
  "/assets/educationlogos/64.png",
  "/assets/educationlogos/65.png",
  "/assets/educationlogos/66.png",
  "/assets/educationlogos/67.png",
];
/* ════════════════════════════════════════════════════════════════ */
/* ORBITAL CONFIG — 3 inner + 3 outer */
const INNER_R = 160;
const OUTER_R = 280;
const SYS_DIM = 700;
const SYS_CTR = SYS_DIM / 2;

const PLANET_CFG = [
  { orbitR: INNER_R, angleDeg: 270, ballSize: 55, duration: 60,  dir: "cw"  }, // Mercury
  { orbitR: INNER_R, angleDeg: 30,  ballSize: 55, duration: 68,  dir: "cw"  }, // Jupiter
  { orbitR: INNER_R, angleDeg: 150, ballSize: 55, duration: 72,  dir: "cw"  }, // Moon
  { orbitR: OUTER_R, angleDeg: 45,  ballSize: 65, duration: 88,  dir: "ccw" }, // Sun
  { orbitR: OUTER_R, angleDeg: 165, ballSize: 65, duration: 105, dir: "ccw" }, // Saturn
  { orbitR: OUTER_R, angleDeg: 285, ballSize: 65, duration: 118, dir: "ccw" }, // Ketu
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
    top:`${(Math.random()*92+2).toFixed(1)}%`, left:`${(Math.random()*96+1).toFixed(1)}%`,
    sz:(Math.random()*5+3).toFixed(1), delay:(Math.random()*10).toFixed(2),
    dur:(Math.random()*4+3).toFixed(2), star:Math.random()>0.55,
  })));
  return (
    <>
      {pts.map((p,i)=>(
        <span key={i} style={{ position:"absolute",top:p.top,left:p.left,fontSize:`${p.sz}px`,lineHeight:1,
          color:p.star?"rgba(210,155,95,0.72)":"rgba(242,218,162,0.78)",
          textShadow:p.star?"0 0 7px rgba(201,169,110,0.9),0 0 18px rgba(201,169,110,0.45)":"0 0 5px rgba(245,225,165,0.95),0 0 14px rgba(201,169,110,0.5)",
          animation:`twinkle-glow ${p.dur}s ${p.delay}s ease-in-out infinite`,
          pointerEvents:"none",zIndex:0,userSelect:"none" }}>{p.star?"★":"✦"}</span>
      ))}
    </>
  );
}

function WaveTop({ fill, h=88 }) {
  return (
    <div style={{position:"absolute",top:0,left:0,right:0,lineHeight:0,zIndex:1,pointerEvents:"none"}}>
      <svg viewBox={`0 0 1440 ${h}`} preserveAspectRatio="none" style={{display:"block",width:"100%",height:h}}>
        <path d={`M0,0 C480,${h} 960,${h} 1440,0 L1440,0 L0,0 Z`} fill={fill}/>
      </svg>
    </div>
  );
}
function WaveBottom({ fill, h=88 }) {
  return (
    <div style={{position:"absolute",bottom:0,left:0,right:0,lineHeight:0,zIndex:1,pointerEvents:"none"}}>
      <svg viewBox={`0 0 1440 ${h}`} preserveAspectRatio="none" style={{display:"block",width:"100%",height:h}}>
        <path d={`M0,${h} C480,0 960,0 1440,${h} L1440,${h} L0,${h} Z`} fill={fill}/>
      </svg>
    </div>
  );
}

const SHOT_DATA = [
  {delay:0,dur:7,top:"9%",left:"8%",rot:28,x0:"-160px",y0:"-90px",x1:"520px",y1:"290px",len:130},
  {delay:2.4,dur:6,top:"28%",left:"60%",rot:31,x0:"-110px",y0:"-65px",x1:"380px",y1:"220px",len:100},
  {delay:4.9,dur:8,top:"62%",left:"4%",rot:24,x0:"-130px",y0:"-75px",x1:"450px",y1:"240px",len:155},
  {delay:1.3,dur:6.5,top:"14%",left:"78%",rot:34,x0:"-85px",y0:"-50px",x1:"310px",y1:"175px",len:88},
  {delay:3.7,dur:7.5,top:"77%",left:"38%",rot:26,x0:"-120px",y0:"-70px",x1:"430px",y1:"235px",len:120},
  {delay:6.1,dur:5.5,top:"45%",left:"22%",rot:30,x0:"-95px",y0:"-55px",x1:"360px",y1:"200px",len:105},
];
function ShootingStars() {
  return (
    <>{SHOT_DATA.map((s,i)=>(
      <div key={i} style={{position:"absolute",top:s.top,left:s.left,width:s.len,height:1.5,
        background:"linear-gradient(90deg,rgba(255,248,215,0.92) 0%,rgba(201,169,110,0.55) 35%,transparent 100%)",
        transformOrigin:"left center","--rot":`${s.rot}deg`,"--sx0":s.x0,"--sy0":s.y0,"--sx1":s.x1,"--sy1":s.y1,
        animation:`shoot ${s.dur}s ${s.delay}s linear infinite`,pointerEvents:"none",zIndex:0}}/>
    ))}</>
  );
}

function NebulaBg() {
  return (
    <>
      <div style={{position:"absolute",top:"12%",left:"3%",width:580,height:580,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,169,110,0.08) 0%,transparent 68%)",animation:"nebula-pulse 14s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"absolute",bottom:"8%",right:"5%",width:460,height:460,borderRadius:"50%",background:"radial-gradient(circle,rgba(180,130,80,0.065) 0%,transparent 68%)",animation:"nebula-pulse 18s 5s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"absolute",top:"48%",left:"48%",transform:"translate(-50%,-50%)",width:700,height:320,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(201,169,110,0.04) 0%,transparent 68%)",animation:"nebula-pulse 22s 9s ease-in-out infinite",pointerEvents:"none",zIndex:0}}/>
    </>
  );
}

function StarsBg({ count=56 }) {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {Array.from({length:count}).map((_,i)=>{
        const size=Math.random()*8+6,left=Math.random()*100;
        const duration=Math.random()*25+20,delay=Math.random()*20;
        return (
          <div key={i} style={{position:"absolute",left:`${left}%`,bottom:"-20px",width:size,height:size,opacity:0.35,animation:`starsFloat ${duration}s linear infinite`,animationDelay:`${delay}s`}}>
            <svg viewBox="0 0 24 24" style={{width:"100%",height:"100%",filter:"drop-shadow(0 0 5px rgba(255,255,255,0.5))"}}>
              <path d="M12 2 L13.5 9 L20 7 L15 12 L20 17 L13.5 15 L12 22 L10.5 15 L4 17 L9 12 L4 7 L10.5 9 Z" fill="rgba(255,255,255,0.85)"/>
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
    <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"white"}}>
      <div ref={bgRef} style={{position:"absolute",inset:"-15%",backgroundImage:'url("https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1400&auto=format")',backgroundSize:"cover",backgroundPosition:"center",opacity:0.18,willChange:"transform",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"120px 40px 140px",animation:"hero-rise 1s cubic-bezier(.22,1,.36,1) forwards"}}>
        <div style={{fontFamily:BODY_FONT,fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"rgba(201,169,110,0.8)",marginBottom:28}}>Vedic Saar · Sacred Services</div>
        <h1 style={{fontFamily:HEADING_FONT,fontSize:"clamp(52px,9vw,100px)",fontWeight:400,color:DARK,margin:"0 0 22px",lineHeight:0.95,letterSpacing:-1}}>
          Education &amp;<br />Learning
        </h1>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,margin:"0 auto 32px",maxWidth:700}}>
          <span style={{flex:1,height:"0.5px",background:`linear-gradient(to right,transparent,${GOLD})`}}/>
          <span style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:22,color:MUTED,whiteSpace:"nowrap"}}>
            ✦ &nbsp; Your intelligence has a cosmic source. Your chart reveals where it shines brightest. &nbsp; ✦
          </span>
          <span style={{flex:1,height:"0.5px",background:`linear-gradient(to left,transparent,${GOLD})`}}/>
        </div>
        <p style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,maxWidth:380,margin:"0 auto 48px",lineHeight:2,letterSpacing:0.5}}>Astrology &amp; Numerology Consultation</p>
        <button onClick={openBooking} className="cta-btn">
          <span>Book Consultation</span>
          <span style={{fontSize:15,lineHeight:1}}>→</span>
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
    <section ref={ref} style={{background:CREAM2,position:"relative",overflow:"hidden"}}>
      <WaveTop fill={CREAM2}/>
      <WaveBottom fill={DARK2}/>
      <img src="/assets/wheel.png" alt="" style={{position:"absolute",right:"-8%",top:"50%",transform:"translateY(-50%)",width:"clamp(480px,60vw,800px)",opacity:0.13,pointerEvents:"none",animation:"spin-slow 180s linear infinite",filter:"sepia(0.3) saturate(0.7)",userSelect:"none"}}/>
      <div style={{maxWidth:860,margin:"0 auto",padding:"100px 48px 80px",textAlign:"center",position:"relative",zIndex:1}}>
        <Eyebrow label="Vedic Wisdom"/>
        <h2 className="r" style={{fontFamily:HEADING_FONT,fontWeight:400,fontStyle:"italic",fontSize:HEADING_SIZE,color:DARK,lineHeight:1.1,margin:"0 0 48px",letterSpacing:"-0.01em"}}>
          Your Cosmic Learning<br/><span style={{color:GOLD}}>Blueprint</span>
        </h2>
        <div className="r d1" style={{borderLeft:`2px solid ${GOLD}`,paddingLeft:28,marginBottom:40,textAlign:"left",maxWidth:680,margin:"0 auto 40px"}}>
          <p style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:22,color:DARK,lineHeight:1.7,margin:0,opacity:0.8}}>
            "Education is not just about what you study — it is about discovering how your unique mind works. Your birth chart reveals your natural intellectual gifts, the learning style you are built for, and the precise time windows when studying yields the greatest results."
          </p>
        </div>
        <p className="r d2" style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:2.1,marginBottom:24}}>
          From a child struggling in school to an adult making a career-changing educational decision — the birth chart offers guidance that no standardised test or career counsellor can replicate. Your chart shows not just what to study, but when your mind is cosmically aligned to absorb, retain, and excel.
        </p>
        <p className="r d3" style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:2.1,marginBottom:52}}>
          At Vedic Saar, we decode the 4th, 5th, and 9th house triangle, assess Mercury and Jupiter's strength and timing, and combine this with your numerological learning profile to give you complete educational guidance.
        </p>
        <div className="r d4" style={{display:"flex",gap:2,justifyContent:"center",flexWrap:"wrap"}}>
          {["6 Education Houses Decoded","6 Planetary Learning Influences","Dasha Academic Timing"].map((s,i)=>(
            <div key={i} style={{padding:"11px 22px",background:DARK,color:CREAM,fontFamily:BODY_FONT,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase"}}>{s}</div>
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
    <section ref={ref} style={{background:DARK2,position:"relative",overflow:"hidden"}} className="grain">
      <WaveTop fill={DARK2}/>
      <WaveBottom fill={DARK2}/>
      <GlowyParticles count={55}/>
      <NebulaBg/>
      <StarsBg count={100}/>
      <img src="/assets/costelation.png" alt="" style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:1000,opacity:0.04,pointerEvents:"none",animation:"spin-slow 200s linear infinite"}}/>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"100px 48px 90px",position:"relative",zIndex:1}}>
        <Eyebrow label="Vedic Astrology" light/>
        <h2 className="r" style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:CREAM,textAlign:"center",margin:"0 0 8px",lineHeight:1.05}}>Houses That Govern</h2>
        <p className="r d1" style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:26,color:GOLD,textAlign:"center",margin:"0 0 16px"}}>Education &amp; Learning</p>
        <p className="r d2" style={{fontFamily:BODY_FONT,fontSize:10,color:"rgba(201,169,110,0.38)",textAlign:"center",letterSpacing:"0.22em",margin:"0 0 60px",textTransform:"uppercase"}}>Hover to awaken each house</p>
        <div className="mobile-col-1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {houses.map((h,i)=>(
            <div key={i} className={`r d${(i%3)+1} hcard`}>
              <div className="hcard-orb"/>
              <div style={{position:"absolute",top:0,right:10,fontFamily:HEADING_FONT,fontSize:86,fontWeight:600,color:DARK,opacity:0.06,lineHeight:1,pointerEvents:"none",userSelect:"none"}}>{h.num}</div>
              <div style={{height:2,background:`linear-gradient(90deg,transparent,rgba(201,169,110,0.55),transparent)`}}/>
              <div style={{padding:"38px 30px 34px"}}>
                {/* SVG icon centred in the card */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:26,height:88}}>
                            <div style={{width:72,height:72,opacity:0.82,transition:"opacity 0.3s"}}>
                                <img
              src={houseImages[i]}
              alt={h.title}
              style={{
                width:"100%",
                height:"100%",
                objectFit:"contain",
                opacity:0.85
              }}
  />
                  </div>
                </div>
                <div className="hcard-num" style={{fontFamily:BODY_FONT,fontSize:10,letterSpacing:"0.22em",color:GOLD,marginBottom:10,textTransform:"uppercase",transition:"color 0.4s"}}>{h.num} House</div>
                <h3 style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:22,color:DARK,margin:"0 0 6px",lineHeight:1.2}}>{h.title}</h3>
                <div style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:14,color:"rgba(201,169,110,0.55)",marginBottom:16}}>{h.sub}</div>
                <div style={{width:30,height:1,background:`linear-gradient(90deg,rgba(201,169,110,0.5),transparent)`,marginBottom:16}}/>
                <p style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:1.9,margin:0}}>{h.desc}</p>
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
  const ref=useRef(null), sysRef=useRef(null);
  const [scale,setScale]=useState(1);
  useReveal(ref);
  useEffect(()=>{
    if(!sysRef.current)return;
    const parent=sysRef.current.parentElement;
    const update=()=>setScale(Math.min(1,(parent?.offsetWidth??SYS_DIM)/SYS_DIM));
    update();
    const ro=new ResizeObserver(update); ro.observe(parent);
    return()=>ro.disconnect();
  },[]);
  return (
    <section ref={ref} style={{background:CREAM2,position:"relative",overflow:"hidden"}}>
      <WaveTop fill={DARK2}/>
      <WaveBottom fill={DARK2}/>
      <div style={{maxWidth:1300,margin:"0 auto",padding:"100px 48px 120px",position:"relative",zIndex:1}}>
        <Eyebrow label="Planetary Influences"/>
        <h2 className="r" style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:DARK,textAlign:"center",margin:"0 0 8px"}}>Planets That Shape</h2>
        <p className="r d1" style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:26,color:GOLD,textAlign:"center",margin:"0 0 16px"}}>Your Learning</p>
        <p className="r d2" style={{fontFamily:BODY_FONT,fontSize:10,color:MUTED,textAlign:"center",letterSpacing:"0.22em",textTransform:"uppercase",margin:"0 0 56px"}}>Hover each planet to reveal its educational domain</p>
        <div style={{width:"100%",display:"flex",justifyContent:"center",overflow:"hidden"}}>
          <div ref={sysRef} className="r d3" style={{position:"relative",width:SYS_DIM,height:SYS_DIM,flexShrink:0,transform:`scale(${scale})`,transformOrigin:"top center",marginBottom:`${-(SYS_DIM*(1-scale))}px`}}>
            {[INNER_R,OUTER_R].map((r,i)=>(
              <div key={`ring-${i}`} style={{position:"absolute",borderRadius:"50%",top:"50%",left:"50%",width:r*2,height:r*2,marginLeft:-r,marginTop:-r,border:`1px solid rgba(201,169,110,${i===0?0.45:0.35})`,boxShadow:"0 0 10px rgba(201,169,110,0.1)",pointerEvents:"none"}}/>
            ))}
            {[INNER_R-20,OUTER_R+20].map((r,i)=>(
              <div key={`deco-${i}`} style={{position:"absolute",borderRadius:"50%",top:"50%",left:"50%",width:r*2,height:r*2,marginLeft:-r,marginTop:-r,border:"0.5px dashed rgba(201,169,110,0.07)",pointerEvents:"none"}}/>
            ))}
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:88,height:88,borderRadius:"50%",background:"radial-gradient(circle at 38% 35%,#fffbe8,#f0c84a 48%,#c9902a)",animation:"sun-pulse 4s ease-in-out infinite",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"absolute",inset:-9,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.35)"}}/>
              <div style={{position:"absolute",inset:-18,borderRadius:"50%",border:"1px solid rgba(201,169,110,0.18)"}}/>
              <span style={{fontFamily:BODY_FONT,fontSize:8,letterSpacing:"0.22em",color:"#3a2a06",textTransform:"uppercase",fontWeight:600}}>Learning</span>
            </div>
            {planets.map((p,i)=>{
              const cfg=PLANET_CFG[i];
              const {ballSize,duration,dir}=cfg;
              const spinAnim=dir==="cw"?"spin-slow":"spin-rev";
              const counterAnim=dir==="cw"?"spin-rev":"spin-slow";
              const startDelay=dir==="cw"?-(cfg.angleDeg/360)*duration:-((360-cfg.angleDeg)/360)*duration;
              return (
                <div key={i} style={{position:"absolute",top:SYS_CTR,left:SYS_CTR,width:0,height:0,animation:`${spinAnim} ${duration}s linear infinite ${startDelay}s`,willChange:"transform",zIndex:8}}>
                  <div style={{position:"absolute",left:cfg.orbitR,top:0}}>
                    <div style={{animation:`${counterAnim} ${duration}s linear infinite ${startDelay}s`,willChange:"transform"}}>
                      <div className="planet-node" style={{position:"absolute",left:-80,top:-ballSize/2,width:160,animation:"none",display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <div className="planet-ball" style={{width:ballSize,height:ballSize}}>
                          {planetImgs[i]
                            ?<img src={planetImgs[i]} alt={p.name} style={{width:"130%",height:"130%",objectFit:"contain",display:"block",position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}} onError={e=>{e.target.style.display="none"}}/>
                            :<span style={{fontSize:Math.round(ballSize*0.38),color:GOLD,display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>{p.glyph}</span>
                          }
                        </div>
                        <div style={{textAlign:"center",marginTop:8}}>
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
        <div className="r d4 planets-grid mobile-col-1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginTop:48}}>
          {planets.map((p,i)=>(
            <div key={i} style={{padding:"22px 20px",background:W,border:"1px solid rgba(201,169,110,0.16)",borderRadius:2,display:"flex",gap:14,alignItems:"flex-start",transition:"border-color 0.3s,transform 0.3s,box-shadow 0.3s",cursor:"default"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(201,169,110,0.42)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(28,20,13,0.08)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,169,110,0.16)";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}
            >
              <div style={{width:42,height:42,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:"radial-gradient(circle at 30% 30%,#fffff0,#e8dcc6)",boxShadow:"0 0 10px rgba(201,169,110,0.16)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:GOLD}}>
                {planetImgs[i]
                  ?<img src={planetImgs[i]} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none"}}/>
                  :p.glyph
                }
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:HEADING_FONT,fontSize:15,fontWeight:500,color:DARK,marginBottom:2}}>{p.name}</div>
                <div style={{fontFamily:BODY_FONT,fontSize:8,letterSpacing:"0.12em",textTransform:"uppercase",color:GOLD,opacity:0.72,marginBottom:6}}>{p.sub}</div>
                <p style={{fontFamily:BODY_FONT,fontSize:12,color:MUTED,lineHeight:1.75,margin:0}}>{p.desc}</p>
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
  const ref=useRef(null), fanRef=useRef(null);
  const [hov,setHov]=useState(null);
  useReveal(ref);
  const RADIUS=500, PIVOT_OFFSET=RADIUS-20, ANGLES=[-28,-14,0,14,28];

  function handleFanMove(e) {
    const rect=fanRef.current?.getBoundingClientRect(); if(!rect)return;
    const pivotX=rect.left+rect.width/2, pivotY=rect.bottom+PIVOT_OFFSET;
    const dx=e.clientX-pivotX, dy=pivotY-e.clientY;
    const dist=Math.hypot(dx,dy);
    if(dist<RADIUS-100||dist>RADIUS+420){setHov(null);return;}
    const mouseAngle=Math.atan2(dx,dy)*(180/Math.PI);
    let best=-1, bestDiff=Infinity;
    ANGLES.forEach((a,i)=>{const d=Math.abs(a-mouseAngle);if(d<bestDiff){bestDiff=d;best=i;}});
    setHov(bestDiff<20?best:null);
  }

  return (
    <section ref={ref} style={{position:"relative",overflow:"hidden",background:DARK,paddingBottom:0}} onMouseMove={handleFanMove} onMouseLeave={()=>setHov(null)} className="grain">
      <WaveTop fill={DARK2}/><WaveBottom fill={DARK2}/>
      <GlowyParticles count={55}/><ShootingStars/><StarsBg count={20}/><NebulaBg/>
      <div style={{position:"absolute",top:"28%",left:"50%",transform:"translate(-50%,-50%)",opacity:0.04,pointerEvents:"none"}}>
        <img src="/assets/wheel.png" alt="" style={{width:680,animation:"spin-slow 130s linear infinite",filter:"sepia(1) hue-rotate(20deg) brightness(1.4)"}}/>
      </div>
      <div style={{maxWidth:1160,margin:"0 auto",padding:"100px 72px 0",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:64}}>
          <Eyebrow label="Vedic Numerology" light/>
          <h2 className="r" style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:CREAM,lineHeight:1.05,marginBottom:14}}>
            Numbers &amp; <em style={{color:GOLD,fontStyle:"italic"}}>Education</em>
          </h2>
          <p className="r d1" style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:"rgba(245,240,232,0.42)",maxWidth:500,margin:"0 auto",lineHeight:1.9}}>
            Your Birth Number and Name Number reveal your ideal learning style and the educational fields where you are naturally destined to excel.
          </p>
        </div>
      </div>
      <div ref={fanRef} className="r d2" style={{position:"relative",top:-160,width:"100%",height:560,overflow:"visible"}}>
        <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"50%",height:1,background:`linear-gradient(90deg,transparent,rgba(201,169,110,0.15),transparent)`,zIndex:0}}/>
        {eduNumbers.map((n,i)=>{
          const isHov=hov===i, angle=ANGLES[i], baseZ=i<=2?i+1:5-i;
          return (
            <div key={i} style={{position:"absolute",bottom:-RADIUS+20,left:"50%",marginLeft:-108,width:216,height:360,transformOrigin:"center bottom",transform:isHov?`rotate(0deg) translateY(-${RADIUS+80}px) scale(1.07)`:`rotate(${angle}deg) translateY(-${RADIUS}px)`,transition:"transform 0.55s cubic-bezier(.16,1,.3,1)",zIndex:isHov?30:baseZ,pointerEvents:"none"}}>
              <div style={{width:"100%",height:"100%",transformStyle:"preserve-3d",transform:isHov?"rotateY(180deg)":"rotateY(0deg)",transition:"transform 0.65s cubic-bezier(.16,1,.3,1)",position:"relative"}}>
                {/* FRONT */}
                <div style={{position:"absolute",inset:0,borderRadius:0,overflow:"hidden",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",background:"linear-gradient(160deg,#ffffff,#faf6ef)",border:"1px solid rgba(201,169,110,0.32)",boxShadow:isHov?"0 20px 52px rgba(0,0,0,0.18),0 0 0 1px rgba(201,169,110,0.5)":`0 ${4+baseZ*2}px ${12+baseZ*4}px rgba(0,0,0,0.12)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{position:"absolute",inset:10,border:"1px solid rgba(201,169,110,0.15)"}}/>
                  <div style={{position:"absolute",inset:13,border:"0.5px solid rgba(201,169,110,0.07)"}}/>
                  {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],ci)=>(
                    <span key={ci} style={{position:"absolute",[v]:16,[h]:16,fontSize:8,color:GOLD,opacity:0.5,lineHeight:1}}>✦</span>
                  ))}
                  <img src="/assets/wheel.png" alt="" aria-hidden decoding="async" style={{position:"absolute",width:"140%",height:"140%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",objectFit:"contain",opacity:0.065,pointerEvents:"none"}}/>
                  <span style={{position:"relative",zIndex:1,fontFamily:BODY_FONT,fontSize:7,letterSpacing:"0.3em",textTransform:"uppercase",color:GOLD,marginBottom:20,opacity:0.55}}>Numerology</span>
                  <span style={{position:"relative",zIndex:1,fontFamily:HEADING_FONT,fontWeight:400,fontSize:94,color:GOLD,lineHeight:1,textShadow:"0 0 40px rgba(201,169,110,0.22)"}}>{n.num}</span>
                  <div style={{position:"relative",zIndex:1,width:36,height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,margin:"16px 0"}}/>
                  <span style={{position:"relative",zIndex:1,fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:14,color:DARK,textAlign:"center",padding:"0 18px",lineHeight:1.4,opacity:0.78}}>{n.title}</span>
                </div>
                {/* BACK */}
                <div style={{position:"absolute",inset:0,borderRadius:0,overflow:"hidden",backfaceVisibility:"hidden",WebkitBackfaceVisibility:"hidden",transform:"rotateY(180deg)",background:"linear-gradient(145deg,#ffffff,#faf6ef)",border:"1px solid rgba(201,169,110,0.55)",boxShadow:"0 20px 52px rgba(0,0,0,0.18),0 0 0 1px rgba(201,169,110,0.45)",padding:"24px 20px",display:"flex",flexDirection:"column"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${n.color},transparent)`,opacity:0.85}}/>
                  <div style={{position:"absolute",inset:10,border:"1px solid rgba(201,169,110,0.2)"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,position:"relative",zIndex:1}}>
                    <span style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:42,color:GOLD,lineHeight:1,opacity:0.52}}>{n.num}</span>
                    <span style={{fontSize:8,color:GOLD,opacity:0.22,marginTop:8}}>✦</span>
                  </div>
                  <h3 style={{position:"relative",zIndex:1,fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:17,fontWeight:400,color:DARK,marginBottom:4,lineHeight:1.2}}>{n.title}</h3>
                  <div style={{position:"relative",zIndex:1,fontFamily:BODY_FONT,fontSize:8,color:GOLD,letterSpacing:"0.22em",textTransform:"uppercase",opacity:0.52,marginBottom:10}}>Ruled by {n.ruler}</div>
                  <div style={{position:"relative",zIndex:1,height:1,background:"rgba(201,169,110,0.13)",marginBottom:14}}/>
                  <p style={{position:"relative",zIndex:1,fontFamily:BODY_FONT,fontSize:10,color:MUTED,lineHeight:1.9,flex:1}}>{n.desc}</p>
                  <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"center",marginTop:14}}>
                    <span style={{fontSize:7,color:GOLD,opacity:0.22,letterSpacing:"0.4em"}}>✦ ✦ ✦</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{textAlign:"center",padding:"28px 0 80px",position:"relative",zIndex:1,marginTop:-100}}>
        <span style={{fontFamily:BODY_FONT,fontSize:9,letterSpacing:"0.3em",color:"rgba(201,169,110,0.28)",textTransform:"uppercase"}}>← hover any card →</span>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/* PROBLEMS */
function ProblemsSection() {
  const ref=useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{background:CREAM2,position:"relative",overflow:"hidden"}}>
      <WaveTop fill={DARK2}/>
      <div style={{position:"absolute",left:"-50px",top:"50%",transform:"translateY(-50%)",fontFamily:HEADING_FONT,fontSize:"clamp(260px,33vw,460px)",fontWeight:300,color:DARK,opacity:0.02,lineHeight:1,pointerEvents:"none",userSelect:"none"}}>?</div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"100px 48px 90px",position:"relative",zIndex:1}}>
        <Eyebrow label="Common Concerns"/>
        <h2 className="r" style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:DARK,textAlign:"center",margin:"0 0 64px",lineHeight:1.1}}>
          Questions We Help<br/><em style={{color:GOLD}}>You Answer</em>
        </h2>
        <div className="mobile-col-1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72}}>
          <div className="r d1">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
              <div style={{width:3,height:28,background:GOLD,borderRadius:2}}/>
              <h3 style={{fontFamily:HEADING_FONT,fontSize:26,fontWeight:500,color:DARK,margin:0,lineHeight:1.2}}>Education Questions We Help With</h3>
            </div>
            {problems.map((p,i)=>(
              <div key={i} className="prob-row">
                <span style={{fontFamily:BODY_FONT,fontSize:9,color:GOLD,marginTop:3,flexShrink:0,opacity:0.65}}>{String(i+1).padStart(2,"0")}</span>
                <span style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,lineHeight:1.75}}>{p}</span>
              </div>
            ))}
          </div>
          <div className="r d2">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
              <div style={{width:3,height:28,background:GOLD,borderRadius:2}}/>
              <h3 style={{fontFamily:HEADING_FONT,fontSize:26,fontWeight:500,color:DARK,margin:0,lineHeight:1.2}}>Hidden Issues in Your Chart</h3>
            </div>
            <p style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:MUTED,marginBottom:28,lineHeight:1.9}}>
              Certain planetary combinations create invisible barriers to academic achievement. Our reading specifically checks for:
            </p>
            {hiddenIssues.map((h,i)=>(
              <div key={i} className="prob-row" style={{borderBottomColor:i<hiddenIssues.length-1?"rgba(28,20,13,0.07)":"transparent"}}>
                <span style={{color:GOLD,fontSize:8,marginTop:5,flexShrink:0}}>◆</span>
                <span style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:DARK,lineHeight:1.75}}>{h}</span>
              </div>
            ))}
            <div style={{marginTop:36,padding:"24px 28px",background:DARK,borderLeft:`3px solid ${GOLD}`}}>
              <div style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:16,color:CREAM,lineHeight:1.75,opacity:0.82}}>
                "The right education at the right time unlocks a lifetime of growth. Your chart shows both."
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
  const ref=useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} style={{background:"#faf8f5",position:"relative",overflow:"hidden"}} className="grain">
      <WaveTop fill={CREAM2}/>
      <img src="/assets/wheel.png" alt="" style={{position:"absolute",left:"-100px",bottom:"35px",width:650,opacity:0.2,pointerEvents:"none",animation:"spin-slow 160s linear infinite"}}/>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"100px 48px 100px",position:"relative",zIndex:1}}>
        <Eyebrow label="Our Approach"/>
        <h2 className="r" style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:"black",textAlign:"center",margin:"0 0 8px",lineHeight:1.05}}>How We Guide You</h2>
        <p className="r d1" style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:26,color:GOLD,textAlign:"center",margin:"0 0 64px"}}>Towards Your Intellectual Destiny</p>
        <div className="mobile-col-1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {guideItems.map((g,i)=>(
            <div key={i} className={`r d${(i%3)+1} gitem`} style={{padding:"32px 28px",background:"white",display:"flex",gap:20,alignItems:"flex-start"}}>
              <span style={{fontFamily:HEADING_FONT,fontSize:26,color:GOLD,lineHeight:1,flexShrink:0,paddingTop:2,fontWeight:400}}>{g.n}</span>
              <span style={{fontFamily:BODY_FONT,fontSize:BODY_SIZE,color:"black",lineHeight:1.9}}>{g.text}</span>
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
  const ref=useRef(null), moonRef=useRef(null);
  const {openBooking}=useBooking();
  useReveal(ref);
  useEffect(()=>{
    return subScroll(()=>{
      if(!moonRef.current)return;
      const rect=moonRef.current.parentElement.getBoundingClientRect();
      if(rect.bottom<0||rect.top>window.innerHeight)return;
      const p=(window.innerHeight-rect.top)/(window.innerHeight+rect.height);
      moonRef.current.style.transform=`translate(-50%,-50%) translateY(${(p-0.5)*-60}px)`;
    });
  },[]);
  return (
    <section ref={ref} style={{backgroundImage:'url("/assets/Testimonialsbg.png")',marginTop:-120,backgroundSize:"cover",backgroundPosition:"top center",padding:"130px 48px 150px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div ref={moonRef} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2,marginTop:500}}>
        <div className="r" style={{fontFamily:HEADING_FONT,fontStyle:"italic",fontSize:16,color:CREAM,marginBottom:52,letterSpacing:"0.03em"}}>
          ✦ &nbsp; The right education at the right time unlocks a lifetime of growth. Your chart shows both. &nbsp; ✦
        </div>
        <h2 className="r d1" style={{fontFamily:HEADING_FONT,fontWeight:400,fontSize:HEADING_SIZE,color:"black",margin:0,lineHeight:0.92,letterSpacing:"-0.02em"}}>
          Book Your<br/><span className="gold-shimmer">Education</span><br/>Consultation
        </h2>
        <div className="r d2" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,margin:"52px auto",maxWidth:380}}>
          <span style={{flex:1,height:"0.5px",background:`linear-gradient(to right,transparent,rgba(201,169,110,0.35))`}}/>
          <span style={{width:6,height:6,background:GOLD,transform:"rotate(45deg)",flexShrink:0}}/>
          <span style={{flex:1,height:"0.5px",background:`linear-gradient(to left,transparent,rgba(201,169,110,0.35))`}}/>
        </div>
        <p className="r d3" style={{fontFamily:BODY_FONT,fontSize:10,color:"black",maxWidth:360,margin:"0 auto 60px",lineHeight:2,letterSpacing:"0.18em",textTransform:"uppercase"}}>
          Discover Your Intellectual Destiny
        </p>
        <div className="r d4">
          <button onClick={openBooking} className="cta-btn">
            <span>Book Consultation</span>
            <span style={{fontFamily:BODY_FONT,fontSize:15,lineHeight:1}}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function EducationPage() {
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
