import { useEffect, useRef, useState } from "react";
import KnowYourAstrologer from "../components/Astrologer";

const minimalCss = `
html { scroll-behavior: smooth; }
body { font-family: 'Jost', sans-serif; color: #3a3028; }
.font-ibarra { font-family: 'Ibarra Real Nova', serif; }
@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  white-space: nowrap;
  animation: marqueeScroll 32s linear infinite;
}
`;

function FU({ children, delay = 0, style = {} }) {
  const r = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!r.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(r.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={r}
      className={`transition-[opacity,transform] duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

const WHY_BULLETS = [
  "It uses the sidereal zodiac — aligned with actual star positions, making it astronomically precise.",
  "It accounts for your Ascendant, Moon sign, and planetary periods (Dashas) for a complete life reading.",
  "It integrates spiritual and karmic insights beyond surface-level sun sign predictions.",
  "It offers practical remedies — mantras, gemstones, and rituals — to align you with cosmic energies.",
  "With over 5,000 years of tradition, it has been tested, refined, and trusted across generations.",
];


export default function AboutVedicSaar() {

  return (
    <>
      <style>{minimalCss}</style>

      {/* ── HERO ── */}
      <section className="relative min-h-[360px] bg-[#f7f2ea] flex items-end justify-center overflow-hidden">
        <img src="/assets/costelation.png" alt="" aria-hidden="true"
          className="absolute top-0 left-0 w-[320px] pointer-events-none select-none about-hero-img"
          style={{ opacity: 0.5, zIndex: 1 }} />
        <img src="/assets/crescentmoon.png" alt="" aria-hidden="true"
          className="absolute top-0 right-0 w-[260px] pointer-events-none select-none about-hero-img"
          style={{ opacity: 0.5, zIndex: 1 }} />
        <div className="relative z-[3] text-center pb-10 w-full">
          <p className="text-[10px] tracking-[3px] uppercase text-[#a8865c] mb-4 font-normal">
            Vedic Saar
          </p>
          <h1 className="font-ibarra text-[72px] max-[960px]:text-[48px] font-normal text-black tracking-[4px] leading-none">
            About <em>Us</em>
          </h1>
        </div>
        <div className="absolute bottom-[-1px] left-0 w-full z-[1] overflow-visible">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 60" preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "60px" }}>
            <path fill="white" d="M0,60 L0,40 Q500,-14 1000,40 L1000,60 Z"/>
          </svg>
        </div>
      </section>

     

      {/* ── WHO WE ARE ── */}
      <section
        className="bg-white pt-[90px] pb-20 z-2 about-who-section"
        style={{ position: "relative", overflow: "visible" }}
      >
        <img
          src="/assets/wheel.png"
          alt=""
          aria-hidden="true"
          className="about-wheel-decor"
          style={{
            position: "absolute",
            top: "55%", left: "20%",
            transform: "translate(-50%, -50%)",
            width: "720px", height: "680px",
            objectFit: "contain",
            opacity: 0.2,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        />
        <div
          className="max-w-[860px] mx-auto px-10"
          style={{ position: "relative", zIndex: 1 }}
        >
          <FU>
            <span className="block text-[10px] tracking-[3px] uppercase text-[#a8865c] mb-[14px] font-normal text-center">
              Ancient Wisdom. Modern Clarity.
            </span>
            <h2 className="font-ibarra text-[42px] font-normal leading-[1.2] text-[#2a2017] mb-8 text-center">
              Who We Are
            </h2>
            <div style={{ width: 48, height: 1, background: "rgba(168,134,92,0.5)", margin: "0 auto 36px" }} />
            <p className="text-[22px] leading-[1.9] text-[#666] mb-5" style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16 }}>
              Welcome to Vedic Saar — a sacred space where ancient Vedic wisdom meets the
              questions of your modern life. We are not just astrologers. We are guides who have
              spent years studying the cosmic language of the planets, the nuances of your birth
              chart, and the timeless principles of Jyotish — the 'Eye of the Vedas.'
            </p>
            <p className="text-[18px] leading-[1.9] text-[#666]" style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16 }}>
              At Vedic Saar, every consultation is treated as a deeply personal conversation
              between the cosmos and you. We believe that the moment you were born, the universe
              encoded a unique blueprint of your life into the sky above. Our mission is to decode
              that blueprint — with precision, compassion, and clarity.
            </p>
          </FU>
        </div>
      </section>

      {/* ── OUR PHILOSOPHY ── */}
      <section className="bg-[#f7f2ea] pb-20 mt-5">
        {/* top wave — white → beige */}
        

        <div className="max-w-[1140px] mx-auto px-10 py-10 ">
          <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-[70px] items-start">
            <FU>
              <span className="block text-[10px] tracking-[3px] uppercase text-[#a8865c] mb-[14px] font-normal">
                The Foundation of Our Practice
              </span>
              <h2 className="font-ibarra text-[42px] font-normal leading-[1.2] text-[#2a2017] mb-5">
                Our Philosophy
              </h2>
              <p className=" leading-[1.9] text-[#666] " style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16} }>
                Vedic astrology, or Jyotish, is more than a predictive science. It is a spiritual
                mirror that reflects your soul's journey — your strengths, your challenges, your
                karma, and your dharma. At Vedic Saar, we approach each chart not as a fixed
                destiny, but as a living map of possibilities — one that empowers you to make
                informed, aligned choices in life.
              </p>
            </FU>

            <FU delay={120}>
              <span className="block text-[10px] tracking-[3px] uppercase text-[#a8865c] mb-[14px] font-normal">
                Why Vedic Astrology?
              </span>
              <ul className="space-y-4" style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16 }}>
                {WHY_BULLETS.map((b, i) => (
                  <li key={i} className="flex gap-3 items-start" style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16 }}>
                    <span className="text-[#a8865c] shrink-0 text-[14px] mt-[2px]">✦</span>
                    <span className=" leading-[1.85] text-[#666] font-light"style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </FU>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES VEDIC SAAR DIFFERENT ── */}
      <section className="bg-white relative overflow-hidden">

        {/* top wave — beige (Our Philosophy) → white */}
        <div className="block w-full leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 60" preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "60px" }}>
            <path fill="#f7f2ea" d="M0,60 Q500,0 1000,60 L1000,0 L0,0 Z"/>
          </svg>
        </div>

        <FU>
          <div className="text-center pt-10 pb-12">
            <span className="block text-[11px] tracking-[2px] uppercase text-[#a8865c] mb-3">Our Difference</span>
            <h2 className="font-ibarra text-[42px] font-normal text-[#2a2017] leading-[1.25]">
              What Makes Vedic Saar Different
            </h2>
          </div>
        </FU>

        {/* 3×2 checkerboard: img|card|img / card|img|card */}
        <div className="grid grid-cols-3 max-[768px]:grid-cols-1 auto-rows-[460px]">

          {/* ── ROW 1 ── */}

          {/* img */}
          <div className="overflow-hidden h-full">
            <img src="/assets/numerology.webp" alt="Numerology" className="w-full h-full object-cover object-top block"/>
          </div>

          {/* card — Precision */}
          <div className="border border-[#e8e2d8] bg-[#faf7f2] flex flex-col items-center justify-center px-10 py-14 text-center">
            <div className="mb-7">
              <svg viewBox="0 0 200 250" width="160" height="200" fill="none" stroke="#3a2c1a" strokeWidth="0.9">
                {/* 12 spokes */}
                <line x1="100" y1="92"  x2="100" y2="122" strokeWidth="0.7" opacity="0.6"/>
                <line x1="130" y1="97"  x2="115" y2="123" strokeWidth="0.7" opacity="0.6"/>
                <line x1="151" y1="122" x2="128" y2="137" strokeWidth="0.7" opacity="0.6"/>
                <line x1="160" y1="152" x2="130" y2="152" strokeWidth="0.7" opacity="0.6"/>
                <line x1="151" y1="182" x2="128" y2="167" strokeWidth="0.7" opacity="0.6"/>
                <line x1="130" y1="207" x2="115" y2="181" strokeWidth="0.7" opacity="0.6"/>
                <line x1="100" y1="212" x2="100" y2="182" strokeWidth="0.7" opacity="0.6"/>
                <line x1="70"  y1="207" x2="85"  y2="181" strokeWidth="0.7" opacity="0.6"/>
                <line x1="49"  y1="182" x2="72"  y2="167" strokeWidth="0.7" opacity="0.6"/>
                <line x1="40"  y1="152" x2="70"  y2="152" strokeWidth="0.7" opacity="0.6"/>
                <line x1="49"  y1="122" x2="72"  y2="137" strokeWidth="0.7" opacity="0.6"/>
                <line x1="70"  y1="97"  x2="85"  y2="123" strokeWidth="0.7" opacity="0.6"/>
                {/* Inner 6-point star */}
                <polygon points="100,120 117,148 100,152 83,148" strokeWidth="0.9" opacity="0.6"/>
                <polygon points="100,184 117,156 100,152 83,156" strokeWidth="0.9" opacity="0.6"/>
                <circle cx="100" cy="152" r="7" fill="#3a2c1a" fillOpacity="0.15" strokeWidth="0.8"/>
                {/* Tiny rim dots */}
                <circle cx="100" cy="90"  r="2.5" fill="#3a2c1a" opacity="0.4"/>
                <circle cx="130" cy="95"  r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="153" cy="120" r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="162" cy="152" r="2.5" fill="#3a2c1a" opacity="0.4"/>
                <circle cx="153" cy="184" r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="130" cy="209" r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="100" cy="214" r="2.5" fill="#3a2c1a" opacity="0.4"/>
                <circle cx="70"  cy="209" r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="47"  cy="184" r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="38"  cy="152" r="2.5" fill="#3a2c1a" opacity="0.4"/>
                <circle cx="47"  cy="120" r="2"   fill="#3a2c1a" opacity="0.35"/>
                <circle cx="70"  cy="95"  r="2"   fill="#3a2c1a" opacity="0.35"/>
              </svg>
            </div>
            <span className="text-[11px] tracking-[2px] uppercase text-[#a8865c] mb-3 block font-normal">Readings</span>
            <h3 className="font-ibarra text-[28px] font-normal text-[#2a2017] mb-4 leading-[1.3]">Precision</h3>
            <p className="text-[18px] leading-[1.85] text-[#777] font-normal max-w-[270px] mx-auto">
              We study your full birth chart — exact planetary positions, nakshatras, and divisional charts — not just your sun sign.
            </p>
          </div>

          {/* img */}
          <div className="overflow-hidden h-full">
            <img src="/assets/vastu.webp" alt="Vaastu Shastra" className="w-full h-full object-cover object-top block"/>
          </div>

          {/* ── ROW 2 ── */}

          {/* card — Compassionate Space */}
          <div className="border border-[#e8e2d8] bg-[#faf7f2] flex flex-col items-center justify-center px-10 py-14 text-center">
            <div className="mb-7">
              <svg viewBox="0 0 200 250" width="160" height="200" fill="none" stroke="#3a2c1a" strokeWidth="0.9">
                {/* Crescent moon body */}
                <path d="M80,105 A52,52 0 1 1 80,198 A36,36 0 1 0 80,105 Z" strokeWidth="1"/>
                {/* Stars — 4-point cross style */}
                <line x1="138" y1="108" x2="138" y2="116" strokeWidth="0.9"/>
                <line x1="134" y1="112" x2="142" y2="112" strokeWidth="0.9"/>
                <line x1="148" y1="135" x2="148" y2="141" strokeWidth="0.8"/>
                <line x1="145" y1="138" x2="151" y2="138" strokeWidth="0.8"/>
                <line x1="143" y1="162" x2="143" y2="168" strokeWidth="0.8"/>
                <line x1="140" y1="165" x2="146" y2="165" strokeWidth="0.8"/>
                <circle cx="54"  cy="118" r="2.5" fill="#3a2c1a" opacity="0.3"/>
                <circle cx="50"  cy="152" r="2"   fill="#3a2c1a" opacity="0.25"/>
                <circle cx="56"  cy="180" r="2"   fill="#3a2c1a" opacity="0.25"/>
                {/* Lotus petals at base */}
                <path d="M100,206 Q92,192 100,182 Q108,192 100,206Z"    strokeWidth="0.9"/>
                <path d="M84,203  Q77,188  87,184 Q90,196  84,203Z"     strokeWidth="0.9"/>
                <path d="M116,203 Q123,188 113,184 Q110,196 116,203Z"   strokeWidth="0.9"/>
                <path d="M68,197  Q64,182  74,180 Q75,192  68,197Z"     strokeWidth="0.8"/>
                <path d="M132,197 Q136,182 126,180 Q125,192 132,197Z"   strokeWidth="0.8"/>
              </svg>
            </div>
            <span className="text-[11px] tracking-[2px] uppercase text-[#a8865c] mb-3 block font-normal">Guidance</span>
            <h3 className="font-ibarra text-[28px] font-normal text-[#2a2017] mb-4 leading-[1.3]">Compassionate Space</h3>
            <p className="text-[18px] leading-[1.85] text-[#777] font-normal max-w-[270px] mx-auto">
              Every consultation is held without judgment. We listen, we guide, and we honour your journey exactly as it is.
            </p>
          </div>

          {/* img */}
          <div className="overflow-hidden h-full">
            <img src="/assets/vedic.webp" alt="Vedic Astrology" className="w-full h-full object-cover object-top block"/>
          </div>

          {/* card — Actionable Guidance */}
          <div className="border border-[#e8e2d8] bg-[#faf7f2] flex flex-col items-center justify-center px-10 py-14 text-center">
            <div className="mb-7">
              <svg viewBox="0 0 200 250" width="160" height="200" fill="none" stroke="#3a2c1a" strokeWidth="0.9">
                {/* Compass — N/S/E/W diamond points */}
                <polygon points="100,94  108,144 100,152 92,144"  strokeWidth="0.9" fill="#3a2c1a" fillOpacity="0.12"/>
                <polygon points="100,210 108,160 100,152 92,160"  strokeWidth="0.9"/>
                <polygon points="42,152  92,144  100,152 92,160"  strokeWidth="0.9"/>
                <polygon points="158,152 108,144 100,152 108,160" strokeWidth="0.9" fill="#3a2c1a" fillOpacity="0.08"/>
                {/* NE/NW/SE/SW hairlines */}
                <line x1="100" y1="94"  x2="141" y2="111" strokeWidth="0.55" opacity="0.4"/>
                <line x1="100" y1="94"  x2="59"  y2="111" strokeWidth="0.55" opacity="0.4"/>
                <line x1="100" y1="210" x2="141" y2="193" strokeWidth="0.55" opacity="0.4"/>
                <line x1="100" y1="210" x2="59"  y2="193" strokeWidth="0.55" opacity="0.4"/>
                {/* 8 dots on outer rim */}
                <circle cx="100" cy="94"  r="3.5" fill="#3a2c1a" opacity="0.5"/>
                <circle cx="141" cy="111" r="2.5" fill="#3a2c1a" opacity="0.38"/>
                <circle cx="158" cy="152" r="3.5" fill="#3a2c1a" opacity="0.5"/>
                <circle cx="141" cy="193" r="2.5" fill="#3a2c1a" opacity="0.38"/>
                <circle cx="100" cy="210" r="3.5" fill="#3a2c1a" opacity="0.5"/>
                <circle cx="59"  cy="193" r="2.5" fill="#3a2c1a" opacity="0.38"/>
                <circle cx="42"  cy="152" r="3.5" fill="#3a2c1a" opacity="0.5"/>
                <circle cx="59"  cy="111" r="2.5" fill="#3a2c1a" opacity="0.38"/>
                {/* Center jewel */}
                <circle cx="100" cy="152" r="6" fill="#3a2c1a" fillOpacity="0.2" strokeWidth="0.8"/>
              </svg>
            </div>
            <span className="text-[11px] tracking-[2px] uppercase text-[#a8865c] mb-3 block font-normal">Clarity</span>
            <h3 className="font-ibarra text-[28px] font-normal text-[#2a2017] mb-4 leading-[1.3]">Actionable Guidance</h3>
            <p className="text-[18px] leading-[1.85] text-[#777] font-normal max-w-[270px] mx-auto">
              We don't just describe your chart — we help you navigate it. You leave every session with clarity, not confusion.
            </p>
          </div>

        </div>

        {/* bottom wave — white → Astrologer warm cream (#faf8f5) */}
        <div className="block w-full leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 60" preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "60px" }}>
            <path fill="#faf8f5" d="M0,60 L0,20 Q500,80 1000,20 L1000,60 Z"/>
          </svg>
        </div>
      </section>

      {/* ── OUR ASTROLOGER ── */}
      <KnowYourAstrologer />

      {/* ── CLOSING QUOTE ── */}
      <section className="relative overflow-hidden py-40 min-h-[260px] flex items-center" style={{ backgroundImage: "url('/assets/Testimonialsbg.png')", backgroundSize: "cover", backgroundPosition: "50% 20%", backgroundRepeat: "no-repeat", backgroundColor: "#f7f2ea" }}>
        <div className="max-w-[720px] mx-auto px-10 text-center w-full">
          <FU>
            <div className="mb-8">
             
            </div>
            <p className="font-ibarra text-[40px] mt-[140px] max-[960px]:text-[20px] font-normal text-black leading-[1.6] not-italic">
              ✦ Your stars are not your prison — they are your map. Let us help you read it. ✦
            </p>
            <div className="mt-10">
              <a
                href="/contact"
                className="inline-block text-white px-[34px] py-[13px] text-[10px] tracking-[2px] uppercase font-normal cursor-pointer bg-black transition-colors duration-200 no-underline hover:bg-transparent hover:text-black"
                style={{ border: "2px dashed rgba(201,169,110,0.65)", borderRadius: "0px" }}
              >
                Book a Reading
              </a>
            </div>
          </FU>
        </div>
      </section>
    </>
  );
}
