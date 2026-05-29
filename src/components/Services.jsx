import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    tag: "Astrology",
    title: "Vedic\nAstrology",
    body: "Discover the ancient science of Jyotish Shastra. Our detailed birth chart analysis reveals the cosmic influences shaping your personality, relationships, career, and spiritual journey.",
    img: "/assets/vedicastro.png",
    route: "/vedic-astrology",
  },
  {
    tag: "Numbers",
    title: "Numerology",
    body: "Numbers hold the key to understanding your life's purpose. Through Vedic numerology, uncover hidden patterns in your name and birth date that influence your destiny.",
    img: "/assets/nume.png",
    imgStyle: { transform: 'scale(1.3)', transformOrigin: 'center' },
    route: "/numerology",
  },
  {
    tag: "Architecture",
    title: "Vastu\nShastra",
    body: "Harmonize your living and working spaces with the ancient science of Vastu. Align your environment with cosmic energies to attract abundance, health, and happiness.",
    img: "/assets/vaastunew.png",
    route: "/vaastu",
  },
];

export default function MysticalServices() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Get index from data attribute for staggered delay
            const idx = Number(e.target.dataset.index);

            // Set will-change only during animation
            e.target.style.willChange = "transform, opacity";

            setTimeout(() => {
              e.target.classList.add("ms-card--show");

              // Remove will-change after animation completes
              setTimeout(() => {
                e.target.style.willChange = "auto";
              }, 750);
            }, idx * 120);

            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const els = cardRefs.current;
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/*
        All styles in one static block — not re-parsed on every render.
        In a real project, move this to a .css / .module.css file.
      */}
      <style>{`
        /* ── Card entrance ── */
        .ms-card {
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity  700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
          /* NO will-change here — applied only during animation via JS */
        }
        .ms-card--show {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Promote image to its own layer once, cheaply ── */
        .ms-card__img {
          transition: opacity 450ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);   /* one-time GPU layer — no will-change needed */
        }

        /* ── Overlays ── */
        .ms-card__gradient {
          background: linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.50));
          transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ms-card__default {
          transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ms-card__hover {
          background: rgba(245, 240, 235, 0.97);
          opacity: 0;
          transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Hover state — opacity-only repaints stay on the compositor ── */
        .ms-card:hover .ms-card__img      { opacity: 0.25; }
        .ms-card:hover .ms-card__gradient { opacity: 0; }
        .ms-card:hover .ms-card__default  { opacity: 0; }
        .ms-card:hover .ms-card__hover    { opacity: 1; }

        /* ── "Learn More" arrow ── */
        .ms-learn-after::after {
          content: '';
          display: block;
          height: 1px;
          width: 28px;
          background: #1a1a1a;
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ms-learn-after:hover::after { width: 44px; }
      `}</style>

<section className="relative px-10 -mt-[200px] pt-[240px] pb-32 overflow-visible mystical-section">

  {/* BACKGROUND LAYER */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: "url('/assets/Testimonialsbg.png')",
      backgroundSize: "cover",
      backgroundPosition: "bottom center",
    }}
  />

    <div className="relative z-[100]">
        <h2
          className="text-center font-normal text-[#1a1a1a] -mt-[150px] mb-14 tracking-tight pt-[100px]"
          style={{
            fontFamily: "'Ibarra Real Nova', serif",
            fontSize: "clamp(38px,6vw,60px)",
          }}
        >
          Our Mystical Services
        </h2>

        <div className="relative z-[9999] grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto -mt-10" style={{isolation: 'isolate'}}>
          {services.map((s, i) => (
            <Link to={s.route}
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              data-index={i}
              className="ms-card group relative border border-dashed border-[#ddd5c0] overflow-hidden rounded-sm aspect-[3/4] cursor-pointer"
            >
              {/* Image */}
              <img
                src={s.img}
                alt={s.tag}
                loading="lazy"
                decoding="async"
                className="ms-card__img absolute inset-0 w-full h-full object-cover"
                style={s.imgStyle || {}}
              />

              {/* Gradient overlay */}
              <div className="ms-card__gradient absolute inset-0 pointer-events-none" />

              {/* Default title */}
              <div className="ms-card__default absolute bottom-0 left-0 right-0 p-5 z-30">
                <p
                  className="text-[10px] tracking-[0.16em] uppercase text-white/75 mb-1.5
                    flex items-center gap-2
                    before:block before:w-4 before:h-px before:bg-white/60
                    after:block after:w-4 after:h-px after:bg-white/60"
                  style={{ fontFamily: "'Ibarra Real Nova', serif" }}
                >
                  {s.tag}
                </p>
                <h3
                  className="font-normal text-white leading-tight whitespace-pre-line"
                  style={{
                    fontFamily: "'Ibarra Real Nova', serif",
                    fontSize: "clamp(22px,2.5vw,30px)",
                  }}
                >
                  {s.title}
                </h3>
              </div>

              {/* Hover overlay */}
              <div className="ms-card__hover absolute inset-0 flex flex-col justify-center px-7 py-8 z-30">
                <p
                  className="text-[10px] tracking-[0.18em] uppercase text-[#9a7b6a] mb-3"
                  style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
                >
                  {s.tag}
                </p>
                <h3
                  className="font-normal text-[#1a1a1a] leading-tight whitespace-pre-line mb-4"
                  style={{
                    fontFamily: "'Ibarra Real Nova', serif",
                    fontSize: "clamp(24px,2.6vw,32px)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[13.5px] font-light leading-loose text-[#555] mb-6"
                  style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
                >
                  {s.body}
                </p>
                <span style={{ fontFamily: "'Glacial Indifference', sans-serif", color: '#1a1206', background: '#f5f0e8', border: '1px solid rgba(26,18,6,0.22)', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', cursor: 'pointer', padding: '13px 36px', display: 'inline-block', transition: 'border-color 0.2s' }}>
                  Learn More
                </span>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>
    </>
  );
}