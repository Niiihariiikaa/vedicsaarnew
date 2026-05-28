import { useEffect, useRef, useState, useCallback, memo } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../components/BookingContext'

// ─── Constants outside component — never recreated ───────────────────────────
const SLIDES = [
 
  { src: '/assets/vedicastro.png',       alt: 'Vedic Astrology' },
  
  { src: '/assets/vaastunew.png',    alt: 'Vaastu Shastra' },
  { src: '/assets/nume.png',         alt: 'Numerology Reading', imgStyle: { transform: 'scale(1.3)', transformOrigin: 'center' } },
]

const SLIDER_CAPSULE_STYLE = {
  maxWidth: '460px',
  width: '100%',
  height: '580px',
  borderRadius: '230px 230px 0 0',
  border: '1px dashed rgba(184,135,11,0.45)',
  contain: 'paint',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
}

const SLIDE_INNER_STYLE = {
  borderRadius: '180px 180px 0 0',
  overflow: 'hidden',
  contain: 'paint',
  transform: 'translateZ(0)',
}

// Static style objects at module level — computed once, identity-stable forever
const HERO_GRID_STYLE   = { gridTemplateColumns: '1.5fr 460px 1.5fr' }
const HERO_BG_STYLE     = { fontFamily: "'Ibarra Real Nova', serif", backgroundImage: "url('/assets/bg.png')" }
const SECTION_BG_STYLE  = {
  backgroundImage: "url('/assets/secbg.png')",
  backgroundSize: '600px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  contentVisibility: 'auto',
  containIntrinsicSize: '0 700px',
}

// ─── Memoized Stat — never re-renders unless num/suffix/label change ──────────
const Stat = memo(({ num, suffix, label }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <div ref={ref}>
      <div
        className="text-4xl font-normal text-[#1a1206]"
        style={{ fontFamily: "'Ibarra Real Nova', serif" }}
      >
        {inView ? (
          <CountUp
            end={num}
            duration={2}
            suffix={` ${suffix}`}
            separator=","
            preserveValue
          />
        ) : (
          <span>0</span>
        )}
      </div>
      <div className="text-sm text-[#8a7a5a] mt-1 pt-2 border-t border-dashed border-[#c8bfaa]">
        {label}
      </div>
    </div>
  )
})
Stat.displayName = 'Stat'

// ─── Isolated Slider — its setInterval never causes Homepage re-renders ───────
const HeroSlider = memo(({ saturnRef, crystalRef }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(s => (s + 1) % SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="relative flex justify-center items-end overflow-visible z-[1] hero-slider-wrap"
      style={{ height: '600px' }}
    >
      {/* Slider capsule */}
      <div className="relative overflow-hidden bg-[#c8bfaa] hero-capsule" style={SLIDER_CAPSULE_STYLE}>
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`slide-img ${i === currentSlide ? 'active' : ''}`}
            style={SLIDE_INNER_STYLE}
          >
            <img
              src={s.src}
              alt={s.alt}
              className="w-full h-full object-cover"
              style={s.imgStyle}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          </div>
        ))}
      </div>

      {/* Saturn planet */}
      <div
        ref={saturnRef}
        className="absolute pointer-events-none z-10 home-hero-decor home-hero-planet"
        style={{ width: '140px', height: '170px', top: '20px', right: '-30px' }}
      >
        <img
          src="/assets/planet.webp"
          alt="planet"
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Crystal stone */}
      <div
        ref={crystalRef}
        className="absolute pointer-events-none z-10 home-hero-decor home-hero-crystal"
        style={{ width: '170px', height: '150px', bottom: '0', left: '-80px' }}
      >
        <img
          src="/assets/stone.webp"
          alt="stone"
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
              i === currentSlide ? 'bg-[#1a1206]' : 'bg-[#c8bfaa]'
            }`}
          />
        ))}
      </div>
    </div>
  )
})
HeroSlider.displayName = 'HeroSlider'

// ─── Main component ───────────────────────────────────────────────────────────
export default function Homepage() {
  const saturnRef   = useRef(null)
  const crystalRef  = useRef(null)
  const crystal2Ref = useRef(null)
  const moonRef     = useRef(null)
  const heroRef     = useRef(null)

  const { openBooking } = useBooking()
  const navigate = useNavigate()

  const rafParallax   = useRef(null)
  const latestY       = useRef(0)
  const prevY         = useRef(0)
  const isVisible     = useRef(false) // gate: only run parallax when hero/about is on screen

  // ── Parallax — gated + translate3d for GPU compositing ──────────────────────
  useEffect(() => {
    const els = [saturnRef.current, crystalRef.current, crystal2Ref.current, moonRef.current]

    // Visibility gate: IntersectionObserver on the parallax zone
    const visObs = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting },
      { threshold: 0 }
    )
    if (heroRef.current) visObs.observe(heroRef.current)

    let ticking = false

    const update = () => {
      const y = latestY.current

      // Skip frame if movement < 2px — avoids unnecessary GPU work
      if (Math.abs(y - prevY.current) < 2) {
        ticking = false
        return
      }
      prevY.current = y

      // translate3d forces GPU layer — no layout recalc, no repaint cascade
      if (saturnRef.current)
        saturnRef.current.style.transform = `translate3d(0, 0, 0) rotate(${y * 0.15}deg)`
      if (crystalRef.current)
        crystalRef.current.style.transform = `translate3d(${y * 0.2}px, 0, 0) rotate(${-y * 0.1}deg)`
      if (crystal2Ref.current)
        crystal2Ref.current.style.transform = `translate3d(0, ${y * 0.15}px, 0)`
      if (moonRef.current)
        moonRef.current.style.transform = `translate3d(0, ${y * 0.15}px, 0)`

      ticking = false
    }

    const onScroll = () => {
      // Hard gate — don't even queue a frame if nothing is visible
      if (!isVisible.current) return
      // Quantize to 4px buckets — 75% fewer DOM writes, visually identical
      latestY.current = Math.round(window.scrollY / 4) * 4
      if (!ticking) {
        rafParallax.current = requestAnimationFrame(update)
        ticking = true
      }
    }

    // willChange + initial GPU layer promotion on mount
    els.forEach(el => {
      if (el) {
        el.style.willChange = 'transform'
        el.style.transform = 'translateZ(0)'
      }
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafParallax.current) cancelAnimationFrame(rafParallax.current)
      els.forEach(el => { if (el) el.style.willChange = 'auto' })
      visObs.disconnect()
    }
  }, [])

  const handleBooking = useCallback(() => openBooking(), [openBooking])

  return (
    <>
      <div className="relative z-20 bg-cover bg-center bg-no-repeat" style={HERO_BG_STYLE}>

        {/* ══════════════════════ HERO ══════════════════════ */}
        {/* heroRef wraps both hero + about so visibility gate covers full parallax zone */}
        <div ref={heroRef}>
          <section
            className="relative min-h-[600px] overflow-visible items-center grid bg-transparent home-hero"
            style={HERO_GRID_STYLE}
          >
            {/* Zodiac watermark */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url('/assets/zodiac-ring.svg')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: 0.07,
              }}
            />

            {/* ── LEFT ── */}
            <div className="relative z-10 ml-5 home-hero-left" style={{ marginRight: '-170px' }}>
              <span className="block text-base text-[#8a7a5a] mb-3 tracking-wide">
                Vedic Astrology &amp; Cosmic Guidance
              </span>
              <h1
                className="overflow-visible font-normal text-[#1a1206] leading-[1.1]"
                style={{
                  fontFamily: "'Ibarra Real Nova', serif",
                  fontSize: 'clamp(60px, 7vw, 96px)',
                  marginLeft: '100px',
                  transform: 'translateX(-80px)',
                }}
              >
                The Secrets of<br />
                <em>
                  the{' '}
                  <span className="flip-wrap">
                    <span className="flip-word">
                      <span>Cosmos</span>
                      <span>Horoscope</span>
                    </span>
                  </span>
                </em>
              </h1>
              <p
                className="ml-6 text-sm text-[#6b5d45] leading-[1.7] my-5 max-w-[340px]"
                style={{ fontFamily: "'Glacial Indifference', serif" }}
              >
                Step into the mystical world of astrology and uncover the secrets the cosmos holds.
                Let our experienced astrologer guide you through the stars, revealing insights tailored just for you.
              </p>
              <button
                onClick={handleBooking}
                style={{ fontFamily: "'Glacial Indifference', serif", background: 'black', color: 'white', border: '2px dashed rgba(201,169,110,0.65)', borderRadius: 0, padding: '10px 24px', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginLeft: 24 }}
              >
                Request a Consultation
              </button>
            </div>

            {/* ── CENTER (isolated slider component) ── */}
            <HeroSlider saturnRef={saturnRef} crystalRef={crystalRef} />

            {/* ── RIGHT ── */}
            <div
              className="relative z-10 overflow-visible home-hero-right"
              style={{ marginLeft: '-100px', padding: '60px', marginTop: '100px' }}
            >
              <div
                className="font-normal text-[#1a1206] leading-[1.1] opacity-90"
                style={{
                  fontFamily: "'Ibarra Real Nova', serif",
                  fontSize: 'clamp(48px, 5.5vw, 90px)',
                  marginLeft: '-10px',
                }}
              >
                <div>Discover Your</div>
                <div>Destiny</div>
                <div>
                  <em>
                    <span className="flip-wrap-big">
                      <span className="flip-big">
                        <span>with Stars</span>
                        <span>with Numbers</span>
                      </span>
                    </span>
                  </em>
                </div>
              </div>
              <div className="mt-6">
                <div
                  className="mt-1 text-[#1a1206] flex items-center gap-2"
                  style={{ fontFamily: "'Glacial Indifference', serif", fontSize: '28px' }}
                >
                  Unveil Your Future{' '}
                  <span className="flip-wrap-sm">
                    <span className="flip-sm">
                      <span>with Numbers</span>
                      <span>with Stars</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════ SECTION 2 — ABOUT ══════════════════════ */}
          <section
            className="py-20 grid grid-cols-1 md:grid-cols-3 gap-10 items-center relative home-about-grid"
            style={SECTION_BG_STYLE}
          >
            {/* Left image */}
            <div className="relative home-about-col-left">
              <div
                className="overflow-hidden bg-[#c8bfaa] home-about-img-left"
                style={{ width: 'min(500px, 100%)', height: 'min(480px, 65vw)', borderRadius: '0px 300px 300px 0px' }}
              >
                <img
                  src="/assets/section1.webp"
                  alt="Tarot reading"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {/* Beige crystal float */}
              <div
                ref={crystal2Ref}
                className="absolute pointer-events-none z-10 home-float-decor"
                style={{
                  left: '-40px',
                  top: '-150px',
                  width: '250px',
                  height: '250px',
                  backgroundImage: "url('/assets/beige.webp')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            </div>

            {/* Centre text */}
            <div className="px-4">
              <p
                className="text-[#b8860b] text-[11px] tracking-[0.25em] uppercase mb-4 flex items-center gap-3 justify-center text-center"
                style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
              >
                <span className="block w-8 h-px bg-[#b8860b]" />
                WHO WE ARE
                <span className="block w-8 h-px bg-[#b8860b]" />
              </p>
              <h2
                className="font-normal text-center text-[#1a1206] leading-[1.2] mb-5"
                style={{
                  fontFamily: "'Ibarra Real Nova', serif",
                  fontSize: 'clamp(36px, 4vw, 54px)',
                }}
              >
                About <em className="font-normal">Vedic Saar</em>
              </h2>
              <p
                className="text-base text-[#6b5d45] leading-[1.8] text-center"
                style={{ fontFamily: "'Glacial Indifference', serif" }}
              >
                Vedic Saar is dedicated to guiding individuals through the profound sciences of Vedic Astrology,
                Numerology, Vaastu, and Spiritual Remedies. Rooted in ancient traditions and supported by deep
                study and experience, our consultations help individuals gain clarity in life's most important decisions.
                From career and relationships to finances and spiritual growth, Vedic Saar provides insight, guidance,
                and practical remedies to restore harmony and balance in life.
              </p>
              <button
                onClick={() => navigate('/about')}
                className="mt-6 border border-dashed border-[#1a1206] bg-transparent text-[#1a1206] px-6 py-2.5 text-sm tracking-widest hover:bg-[#1a1206] hover:text-[#f5f0e8] transition-all duration-300 block mx-auto"
                style={{ fontFamily: "'Glacial Indifference', serif" }}
              >
                Discover More
              </button>

              <div className="mt-10 grid grid-cols-2 gap-6">
                <Stat num={10000} suffix="+" label="Readings" />
                <Stat num={20}    suffix="+" label="Years of Experience" />
              </div>
            </div>

            {/* Right image */}
            <div className="relative flex justify-end home-about-right-wrap">
              <div
                className="overflow-hidden bg-[#c8bfaa] home-about-img-right"
                style={{ width: 'min(580px, 100%)', height: 'min(700px, 80vw)', borderRadius: '300px 0px 0px 0px' }}
              >
                <img
                  src="/assets/section2.webp"
                  alt="Crystal ball"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {/* Moon float */}
              <div
                ref={moonRef}
                className="absolute pointer-events-none z-10 home-float-decor"
                style={{
                  top: '-90px',
                  right: '10px',
                  width: '120px',
                  height: '120px',
                  backgroundImage: "url('/assets/moon.webp')",
                  backgroundSize: 'cover',
                }}
              />
            </div>

            
          </section>
        </div>

      </div>
    </>
  )
}