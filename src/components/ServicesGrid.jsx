import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    slug: "love-marriage",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <path d="M24 36 C24 36 10 27 10 18 C10 13.5 13.5 10 18 10 C20.5 10 22.8 11.2 24 13 C25.2 11.2 27.5 10 30 10 C34.5 10 38 13.5 38 18 C38 27 24 36 24 36Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        <path d="M18 20 C18 18 19.5 16.5 21.5 17" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.7"/>
        <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.5"/>
        <path d="M24 8 L24 6 M24 42 L24 40 M8 24 L6 24 M42 24 L40 24" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
        <path d="M14 14 L12.5 12.5 M34 34 L35.5 35.5 M34 14 L35.5 12.5 M14 34 L12.5 35.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    title: "Love & Marriage",
    body: "Find cosmic compatibility, auspicious timing for marriage, and remedies to strengthen bonds with your life partner.",
    img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&auto=format",
    route: "/life-solutions/love-marriage"
  },
  {
    slug: "business-career",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <rect x="10" y="20" width="28" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M18 20 L18 15 C18 13.3 19.3 12 21 12 L27 12 C28.7 12 30 13.3 30 15 L30 20" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <line x1="10" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2.5 2.5" opacity="0.5"/>
        <circle cx="24" cy="28" r="2.5" fill="none" stroke="currentColor" strokeWidth="1"/>
        <path d="M15 34 L15 36 M20 34 L20 36 M28 34 L28 36 M33 34 L33 36" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"/>
        <path d="M24 8 L24.8 10 L27 10 L25.3 11.3 L26 13.5 L24 12.2 L22 13.5 L22.7 11.3 L21 10 L23.2 10 Z" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.45"/>
      </svg>
    ),
    title: "Business & Career",
    body: "Identify favorable periods for career shifts, business ventures, and professional growth aligned with your planetary positions.",
    img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&auto=format",
    route: "/life-solutions/career"
  },
  {
    slug: "wealth-finance",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <path d="M24 9 L24 39" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M30 14 L20 14 C17.8 14 16 15.8 16 18 C16 20.2 17.8 22 20 22 L28 22 C30.2 22 32 23.8 32 26 C32 28.2 30.2 30 28 30 L16 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="37" cy="12" r="3.5" stroke="currentColor" strokeWidth="0.8" opacity="0.45"/>
        <circle cx="11" cy="36" r="3.5" stroke="currentColor" strokeWidth="0.8" opacity="0.45"/>
        <path d="M35 14 L39 10 M10 34 L12 38" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M7 18 L9 16 L11 18 L9 20 Z" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.35"/>
        <path d="M37 28 L39 26 L41 28 L39 30 Z" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.35"/>
      </svg>
    ),
    title: "Wealth & Finance",
    body: "Understand the cosmic patterns governing your financial destiny and discover pathways to prosperity and abundance.",
    img: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&auto=format",
    route: "/life-solutions/finance"
  },
  {
    slug: "children-progeny",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <circle cx="18" cy="16" r="5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M8 34 C8 29 12.5 25 18 25 C23.5 25 28 29 28 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="33" cy="19" r="3.5" stroke="currentColor" strokeWidth="1"/>
        <path d="M28 34 C28 30.5 30.5 28 33 28 C35.5 28 38 30.5 38 34" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M24 10 C24 10 26 8 28 8.5 C30 9 31 11 30 13" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5"/>
        <circle cx="24" cy="8" r="1" fill="currentColor" opacity="0.4"/>
        <path d="M40 11 L41.5 9.5 M40 27 L41.5 28.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    title: "Children & Progeny",
    body: "Gain insights into the timing and blessings related to children, their well-being, and your bond with them.",
    img: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&auto=format",
    route: "/life-solutions/child-progeny"
  },
  {
    slug: "education",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <path d="M12 10 L12 36 L30 36 C32.2 36 34 34.2 34 32 L34 14 C34 11.8 32.2 10 30 10 Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M34 18 L37 18 C38.1 18 39 18.9 39 20 L39 34 C39 35.1 38.1 36 37 36 L30 36" stroke="currentColor" strokeWidth="1" fill="none"/>
        <line x1="17" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        <line x1="17" y1="20" x2="29" y2="20" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        <line x1="17" y1="24" x2="25" y2="24" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.6"/>
        <path d="M8 12 L9.5 10 M8 30 L9.5 32" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.35"/>
        <circle cx="8.5" cy="21" r="1.2" stroke="currentColor" strokeWidth="0.7" opacity="0.35"/>
      </svg>
    ),
    title: "Education",
    body: "Discover ideal fields of study, favorable academic periods, and planetary support for intellectual growth.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&auto=format",
    route: "/life-solutions/education"
  },
  {
    slug: "house-property",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <path d="M8 22 L24 10 L40 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20 L12 37 L20 37 L20 28 L28 28 L28 37 L36 37 L36 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="20" y="28" width="8" height="9" stroke="currentColor" strokeWidth="0" fill="none"/>
        <circle cx="24" cy="10" r="2.5" stroke="currentColor" strokeWidth="0.8" opacity="0.45"/>
        <path d="M15 24 L18 24 L18 28 L15 28 Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5"/>
        <path d="M30 24 L33 24 L33 28 L30 28 Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5"/>
        <path d="M7 30 L5 28 M7 26 L5 24" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M41 30 L43 28 M41 26 L43 24" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    title: "House & Property",
    body: "Align property decisions with auspicious planetary transits for acquiring land, building homes, or real estate investments.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format",
    route: "/life-solutions/house-property"
  },
  {
    slug: "health",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <polyline points="7,24 13,24 16,14 20,34 24,20 28,28 31,22 35,24 41,24" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="24" cy="8" r="2" stroke="currentColor" strokeWidth="0.8" opacity="0.45"/>
        <circle cx="24" cy="40" r="2" stroke="currentColor" strokeWidth="0.8" opacity="0.45"/>
        <path d="M10 10 L12 8 M10 14 L8 12" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M38 10 L36 8 M38 14 L40 12" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M6 18 L8 18 M6 30 L8 30 M40 18 L42 18 M40 30 L42 30" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.25"/>
      </svg>
    ),
    title: "Health",
    body: "Identify health vulnerabilities through your birth chart and adopt preventive measures with Vedic remedies.",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format",
    route: "/life-solutions/health"
  },
  {
    slug: "foreign-travel",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        <line x1="9" y1="24" x2="39" y2="24" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/>
        <path d="M24 9 C20 13 18 18.5 18 24 C18 29.5 20 35 24 39" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>
        <path d="M24 9 C28 13 30 18.5 30 24 C30 29.5 28 35 24 39" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>
        <path d="M11 17 L37 17" stroke="currentColor" strokeWidth="0.7" opacity="0.35" strokeDasharray="1.5 2"/>
        <path d="M11 31 L37 31" stroke="currentColor" strokeWidth="0.7" opacity="0.35" strokeDasharray="1.5 2"/>
        <circle cx="24" cy="9" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="24" cy="39" r="1.5" fill="currentColor" opacity="0.5"/>
        <path d="M7 20 L5.5 22 L7 24 M41 20 L42.5 22 L41 24" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
      </svg>
    ),
    title: "Foreign Travel",
    body: "Know the planetary combinations that favor international opportunities, relocations, and successful overseas ventures.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format",
    route: "/life-solutions/foreign-travel"
  },
  {
    slug: "court-litigation",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.4"/>
        {/* scales of justice */}
        <line x1="24" y1="10" x2="24" y2="38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="12" y1="16" x2="36" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M12 16 L8 24 C8 27 10 29 12 29 C14 29 16 27 16 24 Z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round"/>
        <path d="M36 16 L32 24 C32 27 34 29 36 29 C38 29 40 27 40 24 Z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round"/>
        <line x1="18" y1="38" x2="30" y2="38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="24" cy="10" r="2" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
        <path d="M9 14 L10.5 12 M9 18 L7 17" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
        <path d="M39 14 L37.5 12 M39 18 L41 17" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    title: "Court & Litigation",
    body: "Navigate legal matters with astrological guidance on favorable timings and outcomes for court cases and disputes.",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format",
    route: "/life-solutions/court-litigation"
  }
];

const tags = ["Vastu", "Numerology", "Vedic Astrology", "Spiritual Guidance"];

export default function ServicesGrid() {
  const cardRefs = useRef([]);

  useEffect(() => {
    // Prefetch images as soon as intersection fires – avoids jank on hover
    const prefetchImage = (src) => {
      const img = new Image();
      img.fetchPriority = "low";
      img.src = src;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = Number(e.target.dataset.index);
          const svc = services[idx];

          // Pre-warm the image so hover shows instantly
          prefetchImage(svc.img);

          // Staggered entrance – only opacity+transform (compositor only)
          setTimeout(() => {
            e.target.classList.add("sg-card--show");
          }, idx * 65);

          observer.unobserve(e.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    const els = cardRefs.current;
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Section ── */
        .sg-section {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding-bottom: 100px;
          z-index: 20;
          margin-top: -500px;
          content-visibility: auto;
          contain-intrinsic-size: 0 1200px;
        }
        .sg-bg {
          position: absolute;
          inset: 0;
          background-image: url('/assets/cardbg.png');
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          z-index: 0;
          pointer-events: none;
          /* Promote to own layer once, don't keep will-change */
          transform: translateZ(0);
        }

        /* ── Tag pills ── */
        .sg-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border: 1px dashed rgba(184,134,11,0.35);
          background: rgba(255,255,255,0.55);
          font-family: 'Glacial Indifference', serif;
          font-size: 13px;
          letter-spacing: 0.05em;
          color: #6b5d45;
          border-radius: 100px;
          white-space: nowrap;
        }
        .sg-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b8860b;
          flex-shrink: 0;
        }

        /* ── Decorative rule ── */
        .sg-rule {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: 'Glacial Indifference', serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b8a882;
        }
        .sg-rule::before,
        .sg-rule::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #c8bfaa 40%, #c8bfaa 60%, transparent);
        }

        /* ── Card entrance animation ── */
        .sg-card {
          opacity: 0;
          transform: translateY(24px);
          /* contain prevents layout recalcs spilling to parent */
          contain: layout style;
          transition:
            opacity  550ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sg-card--show {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Card shell ── */
        .sg-card-link {
          display: block;
          text-decoration: none;
          /* own compositor layer for the whole card */
          transform: translateZ(0);
          border-radius: 14px;
        }
        .sg-card-inner {
          position: relative;
          height: 210px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(184,134,11,0.18);
          background: rgba(255,255,255,0.93);
          cursor: pointer;
          /* Only shadow changes on hover — no layout props */
          box-shadow: 0 2px 12px rgba(26,18,6,0.06);
          transition: box-shadow 320ms cubic-bezier(0.4,0,0.2,1);
          /* contain layers inside the card */
          contain: paint;
        }
        .sg-card-inner:hover {
          box-shadow: 0 20px 48px rgba(26,18,6,0.18), 0 4px 16px rgba(184,134,11,0.12);
        }

        /* ── Background image: pre-loaded, GPU composited ── */
        .sg-card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* Start invisible but promote to layer immediately via translateZ */
          opacity: 0;
          transform: translateZ(0) scale(1.04);
          /* Only opacity & transform — pure compositor ── */
          transition:
            opacity 380ms cubic-bezier(0.4,0,0.2,1),
            transform 420ms cubic-bezier(0.4,0,0.2,1);
        }
        .sg-card-inner:hover .sg-card-img {
          opacity: 1;
          transform: translateZ(0) scale(1);
        }

        /* ── Scrim ── */
        .sg-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            160deg,
            rgba(10,6,1,0.72) 0%,
            rgba(20,12,2,0.82) 100%
          );
          transform: translateZ(0);
          transition: opacity 360ms cubic-bezier(0.4,0,0.2,1);
        }
        .sg-card-inner:hover .sg-scrim { opacity: 1; }

        /* ── Golden border glow on hover ── */
        .sg-card-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1px solid rgba(201,169,110,0);
          z-index: 10;
          pointer-events: none;
          transition: border-color 360ms ease;
        }
        .sg-card-inner:hover::after {
          border-color: rgba(201,169,110,0.5);
        }

        /* ── Default state ── */
        .sg-default {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 2;
          padding: 22px 24px;
          /* only opacity on hover-out — no position change */
          transition: opacity 300ms cubic-bezier(0.4,0,0.2,1);
        }
        .sg-card-inner:hover .sg-default { opacity: 0; pointer-events: none; }

        .sg-icon-wrap {
          display: block;
          margin-bottom: 12px;
          line-height: 1;
          color: #b8860b;
        }
        /* Subtle idle pulse on icon */
        .sg-icon-wrap svg {
          transition: transform 320ms cubic-bezier(0.4,0,0.2,1);
          transform: translateZ(0);
        }
        .sg-card-inner:hover .sg-icon-wrap svg {
          transform: translateZ(0) scale(1.08);
        }

        .sg-title-default {
          display: block;
          font-family: 'Ibarra Real Nova', serif;
          font-size: clamp(18px, 1.6vw, 22px);
          font-weight: 400;
          color: #1a1206;
          line-height: 1.2;
        }
        .sg-divider {
          width: 30px;
          height: 1px;
          background: linear-gradient(to right, rgba(184,134,11,0.7), transparent);
          margin-top: 10px;
          transition: width 320ms ease;
        }
        .sg-card-inner:hover .sg-divider { width: 50px; }

        /* ── Hover overlay ── */
        .sg-hover {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px 26px;
          opacity: 0;
          transform: translateZ(0) translateY(6px);
          transition:
            opacity 340ms cubic-bezier(0.4,0,0.2,1),
            transform 360ms cubic-bezier(0.22,1,0.36,1);
        }
        .sg-card-inner:hover .sg-hover {
          opacity: 1;
          transform: translateZ(0) translateY(0);
        }

        .sg-tag {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.8);
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sg-tag::before {
          content: '';
          display: block;
          width: 14px;
          height: 1px;
          background: rgba(201,169,110,0.55);
        }
        .sg-title-hover {
          font-family: 'Ibarra Real Nova', serif;
          font-size: clamp(20px, 1.8vw, 25px);
          font-weight: 400;
          color: #f5ede0;
          line-height: 1.2;
          margin-bottom: 9px;
        }
        .sg-body {
          font-family: 'Glacial Indifference', sans-serif;
          font-size: clamp(12px, 1vw, 13px);
          line-height: 1.75;
          color: #ddd0b8;
          font-weight: 300;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Learn More CTA ── */
        .sg-learn {
          display: inline-flex;
          align-items: center;
          font-family: 'Glacial Indifference', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #1a1206;
          background: #f5f0e8;
          border: 1px solid rgba(26,18,6,0.22);
          padding: 13px 32px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .sg-learn:hover {
          background: #ede7db;
          border-color: rgba(26,18,6,0.4);
        }
        .sg-learn-line { display: none; }

        /* ── Decorative corner ornament ── */
        .sg-corner {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 4;
          opacity: 0;
          transform: translateZ(0) rotate(-15deg) scale(0.8);
          transition:
            opacity 380ms cubic-bezier(0.22,1,0.36,1) 40ms,
            transform 380ms cubic-bezier(0.22,1,0.36,1) 40ms;
          color: rgba(201,169,110,0.6);
        }
        .sg-card-inner:hover .sg-corner {
          opacity: 1;
          transform: translateZ(0) rotate(0deg) scale(1);
        }

        /* ── Number badge ── */
        .sg-num {
          position: absolute;
          top: 16px;
          left: 18px;
          z-index: 2;
          font-family: 'Ibarra Real Nova', serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(184,134,11,0.55);
          transition: opacity 300ms ease;
        }
        .sg-card-inner:hover .sg-num { opacity: 0; }

      `}</style>

      <section className="sg-section">
        <div className="sg-bg" aria-hidden="true" />

        <div
          className="absolute pointer-events-none z-[5]"
          style={{ top: "500px", right: "-100px", width: "580px", opacity: 0.4 }}
        >
          <img src="/assets/crescentmoon.png" alt="crescent moon" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        <div
          className="absolute pointer-events-none z-[5]"
          style={{ bottom: "-10px", left: "-80px", width: "420px", opacity: 0.4 }}
        >
          <img src="/assets/costelation.png" alt="constellation" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>

        {/* ── HEADING ── */}
        <div className="relative z-10 text-center mt-[340px] pt-20 px-6 sg-heading-wrap">
          <p
            className="flex items-center justify-center gap-3 mb-4"
            style={{
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#b8860b",
            }}
          >
            <span style={{ display: "block", width: "32px", height: "1px", background: "#b8860b" }} />
            Explore the Stars
            <span style={{ display: "block", width: "32px", height: "1px", background: "#b8860b" }} />
          </p>

          <h2
            style={{
              fontFamily: "'Ibarra Real Nova', serif",
              fontSize: "clamp(32px, 4.5vw, 58px)",
              fontWeight: 400,
              color: "#1a1206",
              lineHeight: 1.1,
            }}
          >
            Our <em style={{ color: "#b8860b" }}>Cosmic</em> Services
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            {tags.map((t) => (
              <span key={t} className="sg-pill">
                <span className="sg-pill-dot" />
                {t}
              </span>
            ))}
          </div>

          <div className="sg-rule mt-7 mb-2 max-w-xl mx-auto">
            guided by the stars · rooted in tradition
          </div>
        </div>

        {/* ── CARDS GRID ── */}
        <div
          className="relative z-10 px-6 md:px-16 mt-10"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "16px",
            maxWidth: "1200px",
            margin: "40px auto 0",
          }}
        >
          {services.map((s, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              data-index={i}
              className="sg-card"
            >
              <Link
                to={s.route}
                key={i}
                className="sg-card-link"
                aria-label={`Learn more about ${s.title}`}
              >
                <div className="sg-card-inner">
                  {/* Pre-loaded background image */}
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="sg-card-img"
                  />
                  <div className="sg-scrim" />

                  {/* Number badge */}
                  <span className="sg-num">0{i + 1}</span>

                  {/* Decorative corner star */}
                  <span className="sg-corner" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1L10.5 6.5H16L11.5 9.8L13 15L9 11.8L5 15L6.5 9.8L2 6.5H7.5Z"
                        stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinejoin="round"/>
                    </svg>
                  </span>

                  {/* Default resting state */}
                  <div className="sg-default">
                    <span className="sg-icon-wrap">{s.icon}</span>
                    <span className="sg-title-default">{s.title}</span>
                    <div className="sg-divider" />
                  </div>

                  {/* Hover overlay */}
                  <div className="sg-hover">
                    <p className="sg-tag">{s.title.split(" ")[0]}</p>
                    <h3 className="sg-title-hover">{s.title}</h3>
                    <p className="sg-body">{s.body}</p>
                    <span className="sg-learn">
                      Explore
                      <span className="sg-learn-line" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}