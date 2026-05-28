import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function KnowYourAstrologer() {
  const sectionRef  = useRef(null);
  const sunburstRef = useRef(null);
  const chartBgRef  = useRef(null);
  const contentRef  = useRef(null);
  const photoRef    = useRef(null);
  const marqueeRef  = useRef(null);
  const blueOrbRef  = useRef(null);
  const brownOrbRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Sunburst rotates on scroll
      gsap.to(sunburstRef.current, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Zodiac wheel counter-rotates
      gsap.to(chartBgRef.current, {
        rotation: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.9,
        },
      });

      // Marquee scrolls left as page scrolls down
      gsap.to(marqueeRef.current, {
        x: '-40%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Blue orb top-right: rotates + slight parallax down
      gsap.to(blueOrbRef.current, {
        rotation: 360,
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom left',
          scrub: 2,
        },
      });

      // Brown orb bottom-left: moves right horizontally
      gsap.to(brownOrbRef.current, {
        x: 170,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0,
        },
      });

      // Content slides in from right
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
        }
      );

      // Photo pops in
      gsap.fromTo(photoRef.current,
        { opacity: 0, scale: 0.82 },
        {
          opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.3)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const rays = Array.from({ length: 48 }, (_, i) => ({
    angle: i * (360 / 48),
    isLong: i % 2 === 0,
  }));

  const marqueeWords = ['Destiny', '·', 'Future', '·', 'Wisdom', '·', 'Destiny', '·', 'Future', '·', 'Wisdom', '·', 'Cosmos', '·'];

  // Proper Unicode zodiac symbols (not emoji — plain text codepoints)
  const zodiacSymbols = [
    { sym: '♈', name: 'ARIES' },
    { sym: '♉', name: 'TAURUS' },
    { sym: '♊', name: 'GEMINI' },
    { sym: '♋', name: 'CANCER' },
    { sym: '♌', name: 'LEO' },
    { sym: '♍', name: 'VIRGO' },
    { sym: '♎', name: 'LIBRA' },
    { sym: '♏', name: 'SCORPIO' },
    { sym: '♐', name: 'SAGITTARIUS' },
    { sym: '♑', name: 'CAPRICORN' },
    { sym: '♒', name: 'AQUARIUS' },
    { sym: '♓', name: 'PISCES' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col z-40 overflow-visible astrologer-section"
      style={{ background: '#faf8f5', minHeight: '100vh'}}
    >
      {/* ── MARQUEE STRIP top ── */}
      <div
        className="relative w-full overflow-hidden py-3 z-40"
        style={{ borderBottom: '1px solid rgba(180,160,120,0.2)' }}
      >
        <div
          ref={marqueeRef}
          className="flex items-center gap-10 whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {marqueeWords.map((word, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Ibarra Real Nova', serif",
                fontSize: 'clamp(38px, 5vw, 78px)',
                fontWeight: 300,
                color: word === '·' ? '#b8860b' : 'rgba(26,18,6,0.15)',
                letterSpacing: word === '·' ? '0' : '-0.02em',
                lineHeight: 1,
                fontStyle:  'normal',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* ── BLUE ORB — top right, rotates + drifts down ── */}
<div
  ref={blueOrbRef}
  className="absolute pointer-events-none z-[9999] astrologer-orb"
  style={{ top: -190, right: -30, width: 190, height: 320 }}
>
        <img
          src="/assets/blue.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* ── BROWN ORB — bottom left, moves right ── */}
<div
  ref={brownOrbRef}
  className="absolute pointer-events-none z-[9999] astrologer-orb"
  style={{ bottom: -60, left: -80, width: 300, height: 300 }}
>
        <img
          src="/assets/beige.webp"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* ── MAIN ROW ── */}
      <div className="relative z-10 flex flex-1 items-center astrologer-row">

<div
  ref={chartBgRef}
  className="absolute pointer-events-none select-none astrologer-zodiac"
  style={{
    left: '-8%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 820,
    height: 980,
    opacity: 0.1,
  }}
>
  <img
    src="/assets/wheel.png"
    alt="zodiac wheel"
    className="w-full h-full object-contain"
    style={{
      transform: 'translateZ(0)', // GPU boost
    }}
  />
</div>

        {/* ── LEFT: sunburst + photo ── */}
        <div
          ref={photoRef}
          className="relative flex-shrink-0 flex items-center justify-center astrologer-left"
          style={{ width: '48%', minWidth: 0, height: '85vh' }}
        >
          {/* Sunburst — warm golden/beige rays */}
          <div
            ref={sunburstRef}
            className="absolute flex items-center justify-center pointer-events-none astrologer-sunburst"
            style={{ width: 680, height: 680 }}
          >
            <svg viewBox="0 0 580 580" xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}>
              {rays.map(({ angle, isLong }, i) => {
                const rad    = angle * Math.PI / 180;
                const innerR = 152;
                const outerR = isLong ? 278 : 248;
                const w      = isLong ? 5 : 3.5;
                const x1 = 290 + innerR * Math.cos(rad);
                const y1 = 290 + innerR * Math.sin(rad);
                const x2 = 290 + outerR * Math.cos(rad);
                const y2 = 290 + outerR * Math.sin(rad);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    // Long rays: rich gold; short rays: soft warm beige
                    stroke={isLong ? '#c9a96e' : '#e2d0a8'}
                    strokeWidth={w}
                    strokeLinecap="round"
                    opacity={isLong ? 0.9 : 0.65}
                  />
                );
              })}
              <circle cx="290" cy="290" r="152" fill="none" stroke="#c9a96e" strokeWidth="1.2" opacity="0.5"/>
            </svg>
          </div>

          {/* Circular photo */}
          <div
            className="relative rounded-full overflow-hidden z-10"
            style={{
              width: 'min(400px, 75vw)', height: 'min(400px, 75vw)',
              border: '3px solid rgba(180,190,200,0.35)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
              background: '#d8dce0',
            }}
          >
            <img
              src="/assets/astrologer.png"
              alt="Manish Malhotra"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* 20+ Years badge */}
          <div
            className="absolute z-20 flex flex-col items-center justify-center rounded-full"
            style={{
              width: 88, height: 88,
              bottom: '14%', right: '16%',
              background: '#1a1206',
              border: '2px solid rgba(201,169,110,0.5)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            <span style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 24, color: '#b8860b', lineHeight: 1 }}>20+</span>
            <span style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 9, color: '#c9a96e', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', marginTop: 3, lineHeight: 1.3 }}>Years Exp.</span>
          </div>
        </div>

        {/* ── RIGHT: content ── */}
        <div
          ref={contentRef}
          className="flex-1 py-16 pr-14 pl-4 max-w-2xl astrologer-right"
        >
          {/* Badge */}
          <span
            className="inline-block border border-[#c9a96e]/50 text-[#9a7b3a] px-4 py-1.5 mb-7"
            style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}
          >
            Know Your Astrologer
          </span>

          {/* Heading */}
          <h2
            className="text-[#1a1206] leading-[1.08] mb-5"
            style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 400 }}
          >
            Unlocking the Mysteries of Your Life Path to Fulfillment
          </h2>

          <div className="w-12 h-px mb-6" style={{ background: '#b8860b' }} />

          {/* Body */}
          <p
            className="text-[#6b5a40] leading-[1.85] mb-8"
            style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16 }}
          >
            Manish Malhotra is an experienced Vedic astrologer dedicated to helping
            individuals gain clarity and direction through the timeless wisdom of
            astrology. With years of study and practical consulting experience, he
            carefully analyzes birth charts, planetary alignments, and cosmic cycles
            to provide meaningful insights into life's most important areas — including
            career, relationships, health, and personal growth. His approach combines
            traditional astrological principles with thoughtful guidance, helping
            clients make confident and informed decisions about their future.
          </p>

          {/* Tags */}
          <div className="flex items-center gap-7 mb-8 flex-wrap">
            {[
              {
                icon: (
                  // Sun / Vedic Astrology
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <line x1="12" y1="2" x2="12" y2="5"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
                    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
                    <line x1="2" y1="12" x2="5" y2="12"/>
                    <line x1="19" y1="12" x2="22" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
                    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
                  </svg>
                ),
                label: 'Vedic Astrology'
              },
              {
                icon: (
                  // Hash / Numerology
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9"/>
                    <line x1="4" y1="15" x2="20" y2="15"/>
                    <line x1="10" y1="3" x2="8" y2="21"/>
                    <line x1="16" y1="3" x2="14" y2="21"/>
                  </svg>
                ),
                label: 'Numerology'
              },
              {
                icon: (
                  // House / Vastu
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                    <polyline points="9 21 9 12 15 12 15 21"/>
                  </svg>
                ),
                label: 'Vastu'
              },
              {
                icon: (
                  // Lotus / Spiritual Guidance
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V12"/>
                    <path d="M12 12C12 12 7 10 5 6c2 0 5 1 7 6z"/>
                    <path d="M12 12C12 12 17 10 19 6c-2 0-5 1-7 6z"/>
                    <path d="M12 12C12 12 9 7 12 3c3 4 0 9 0 9z"/>
                    <path d="M5 14c1.5 2 4 3.5 7 4"/>
                    <path d="M19 14c-1.5 2-4 3.5-7 4"/>
                  </svg>
                ),
                label: 'Spiritual Guidance'
              },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-[#6b5a40]"
                style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 15 }}>
                {icon} {label}
              </span>
            ))}
          </div>

          <div className="w-full h-px mb-7" style={{ background: 'rgba(201,169,110,0.2)' }} />

          {/* Author + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full overflow-hidden flex-shrink-0"
                style={{ width: 56, height: 56, border: '2px solid rgba(201,169,110,0.4)' }}>
                <img src="/assets/astrologer.png" alt="Manish Malhotra"
                  className="w-full h-full object-cover" />
              </div>
              <div>
                <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 18, color: '#1a1206' }}>
                  Manish Malhotra
                </p>
                <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, color: '#9a8060', letterSpacing: '0.05em' }}>
                  Vedic Astrologer · 20+ Years Experience
                </p>
              </div>
            </div>

            <button
              style={{
                background: 'black',
                color: 'white',
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                border: '2px dashed rgba(201,169,110,0.65)',
                borderRadius: 0,
                cursor: 'pointer',
              }}
            >
              Schedule a Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}