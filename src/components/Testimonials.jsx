import React from 'react'
import Stack from './Stack'
import  { memo } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
const testimonials = [
  {
    name: "Ashish Gupta",
    rating: 5,
    text: "In my opinion he is one of the best astrologer and Vastu consultant. His knowledge and understanding of this subject is absolutely great. He knows how to apply and solve issues with this ancient knowledge in modern lifestyle and predict practically.",
    initial: "A",
  },
  {
    name: "Shubham (Lakhpat Rai Sons)",
    rating: 5,
    text: "Only person I trust in terms of astrology. I've been following him for 6 years. He has always guided me at every step of life with extremely accurate predictions and always helped me find a way out of problems.",
    initial: "S",
  },
  {
    name: "Kavita Jain",
    rating: 5,
    text: "Manish ji explained everything patiently and made the session feel personal, not mechanical. He didn’t push unnecessary remedies. Feels like someone you can truly trust rather than a commercial service.",
    initial: "K",
  },
  {
    name: "Sukesh Kumar",
    rating: 5,
    text: "My life was very disturbed with financial issues and stress when I met him. He came like a blessing and helped me through a very tough phase with guidance and clarity.",
    initial: "S",
  },
  {
    name: "Ana Jain",
    rating: 5,
    text: "Their predictions are always accurate and guidance is thoughtful and practical. They take time to understand concerns and provide clarity that genuinely helps.",
    initial: "A",
  },
  {
    name: "Fariha Asif",
    rating: 5,
    text: "The reading felt deeply insightful. The explanation really resonated. The way he combines astrology and numbers is amazing. Highly recommend!",
    initial: "F",
  },
  {
    name: "Vanisha Bajaj",
    rating: 5,
    text: "He always predicted accurately. Whatever he told me actually happened in my life.",
    initial: "V",
  },
  {
    name: "Shrishti Aggarwal",
    rating: 5,
    text: "I’ve been in touch with him for 7–8 years. His predictions have always been on point. To me he’s like an elder brother guiding me.",
    initial: "S",
  },
  {
    name: "Mukul Sharma",
    rating: 5,
    text: "He listened very patiently and even without exact birth time, calculated correctly and guided us well. Very satisfying experience.",
    initial: "M",
  },
  {
    name: "Gulrukh Alamgir",
    rating: 5,
    text: "He has vast knowledge of astrology and vastu. Very soft spoken and kind. Highly recommend.",
    initial: "G",
  },
  {
    name: "Anil Pathak",
    rating: 5,
    text: "Since 2020 my entire family has been following his guidance. His predictions are highly accurate and he is an excellent vastu consultant.",
    initial: "A",
  },
  {
    name: "Sumit W",
    rating: 5,
    text: "Consulting him for over 3 years. Not just an astrologer but also a great counselor. Solutions bring both results and internal peace.",
    initial: "S",
  },
  {
    name: "Payal Jain",
    rating: 5,
    text: "Very patient and soft spoken. Gives proper time and listens carefully. Always feel satisfied after consultation.",
    initial: "P",
  },
  {
    name: "Jatin Mahajan",
    rating: 5,
    text: "Always had a great session. He listens properly and answers everything clearly. Highly recommend.",
    initial: "J",
  },
  {
    name: "Simran Sachdeva",
    rating: 5,
    text: "Extremely accurate and insightful. The guidance has helped me navigate important life decisions.",
    initial: "S",
  },
  {
    name: "Gaurav (G C)",
    rating: 5,
    text: "His approach is very scientific and logical. Analysis and forecasting are always spot on. Truly honest guidance.",
    initial: "G",
  },
]

const StarRating = ({ count }) => (
  <div className="flex gap-0.5 mb-3">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-[#b8860b]" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969
          0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755
          1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1
          1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
          00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

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

const TestimonialCard = ({ name, location, rating, text, service, initial }) => (
  <div
    className="w-full h-full flex flex-col justify-between p-8 rounded-2xl"
    style={{
      background: 'linear-gradient(145deg, #fdf8f0 0%, #f5ede0 100%)',
      border: '1px solid rgba(184,134,11,0.25)',
      fontFamily: "'Glacial Indifference', serif",
      boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
    }}
  >
    <div>
      <div className="text-[#b8860b] text-6xl leading-none mb-2" style={{ fontFamily: "'Glacial Indifference', serif" }}>"</div>
      <StarRating count={rating} />
      <p className="text-[#3a2e1e] text-[17px] leading-relaxed ">{text}</p>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-[#f5ede0]"
          style={{ background: '#b8860b' }}
        >
          {initial}
        </div>
        <div>
          <p className="text-[#1a1206] text-[14px] font-semibold tracking-wide leading-tight">{name}</p>
          <p className="text-[#9a7b6a] text-[12px] tracking-wide">{location}</p>
        </div>
      </div>
      <span
        className="text-[10px] tracking-widest uppercase text-[#b8860b] border border-[#b8860b]/40 px-2.5 py-1 rounded-sm"
        style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
      >
        {service}
      </span>
    </div>
  </div>
);

const Testimonials = () => {
  return (
<section
  className="relative w-full overflow-hidden -mt-8 py-24 md:px-16 z-10 testimonials-section"
  style={{
    backgroundImage: "url('/assets/Testimonialsbg.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center', 
    marginTop: -38, // 👈 KEY LINE
  }}
>
      {/* dark overlay so text stays readable */}
      <div className="absolute inset-0" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24 testimonials-inner">

        {/* ── LEFT: text content ── */}
        <div className="flex-1 text-center md:text-left">

          {/* eyebrow */}
          <p
            className="text-[#b8860b] text-[11px] tracking-[0.25em] uppercase mb-4 flex items-center gap-3 justify-center md:justify-start"
            style={{ fontFamily: "'Glacial Indifference', sans-serif" }}
          >
            <span className="block w-8 h-px bg-[#b8860b]" />
            What They Say
            <span className="block w-8 h-px bg-[#b8860b]" />
          </p>

          {/* heading */}
          <h2
            className="text-[clamp(34px,5vw,58px)] font-light leading-[1.1] text-black mb-6"
            style={{ fontFamily: "'Ibarra Real Nova', serif" }}
          >
            Voices of the<br />
            <em className=" text-[#b8860b]">Cosmos</em>
          </h2>

          {/* body */}
          <p
            className="text-[#c9b99a] text-[15px] leading-relaxed max-w-sm mb-8"
            style={{ fontFamily: "'Glacial Indifference', serif" }}
          >
            Thousands have walked the path of self-discovery with us.
            Each reading, each consultation — a step closer to your
            true cosmic purpose.
          </p>

          {/* stat row */}
              <div className="mt-10 grid grid-cols-2 gap-6">
                <Stat num={10000} suffix="+" label="Readings" />
                <Stat num={20}    suffix="+" label="Years of Experience" />
              </div>

          {/* CTA */}
          <button
            style={{ fontFamily: "'Glacial Indifference', sans-serif", background: 'transparent', color: 'black', border: '1px dashed black', borderRadius: 0, padding: '12px 32px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 24, cursor: 'pointer' }}
          >
            Read All Reviews
          </button>
        </div>

        {/* ── RIGHT: stacked cards ── */}
        <div className="flex-1 flex items-center justify-center">
          <div className="testimonials-stack-wrap" style={{ width: 'min(620px, 92vw)', height: 380 }}>
            <Stack
              randomRotation={true}
              sensitivity={200}
              sendToBackOnClick={true}
              cards={testimonials.map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}
              autoplay={true}
              autoplayDelay={3500}
              pauseOnHover={true}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;