import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBooking } from '../components/BookingContext';

gsap.registerPlugin(ScrollTrigger);

const rudrakshas = [
  {
    name: '1 Mukhi', sanskrit: 'Ek Mukhi', planet: 'Surya', color: '#c9835e',
    img: '/assets/rudraksha/1mukhi.png', thumb: '/assets/rudraksha/1mukhi.png',
    description: 'The 1 Mukhi Rudraksha is revered for its singular focus and divine grace. It brings clarity, courage, and success to seekers of spiritual awakening.',
    benefits: ['Enhances leadership energy', 'Increases self-confidence', 'Removes obstacles in life'],
    bestFor: 'Seekers of purpose, leaders, and spiritual aspirants', wearing: 'Wear as a pendant or bracelet close to the heart',
  },
  {
    name: '2 Mukhi', sanskrit: 'Dwimukhi', planet: 'Ardhanarishvara', color: '#8b5d38',
    img: '/assets/rudraksha/2mukhi.png', thumb: '/assets/rudraksha/2mukhi.png',
    description: 'The 2 Mukhi Rudraksha symbolizes balance and unity of masculine and feminine energies. It is used to harmonize relationships and open the heart center.',
    benefits: ['Builds emotional harmony', 'Supports partnerships', 'Strengthens intuition'],
    bestFor: 'Couples, healers, and those seeking inner balance', wearing: 'Wear on the left side or near the heart',
  },
  {
    name: '3 Mukhi', sanskrit: 'Trimukhi', planet: 'Agni', color: '#b04a28',
    img: '/assets/rudraksha/3mukhi.png', thumb: '/assets/rudraksha/3mukhi.png',
    description: 'The 3 Mukhi Rudraksha channels the power of fire and transformation. It boosts courage, personal power, and the ability to overcome fear.',
    benefits: ['Amplifies willpower', 'Removes anxiety', 'Ignites inner strength'],
    bestFor: 'Protectors, warriors, and those facing life changes', wearing: 'Wear on the right side or as a bracelet',
  },
  {
    name: '4 Mukhi', sanskrit: 'Chaturmukhi', planet: 'Brahma', color: '#5d6d42',
    img: '/assets/rudraksha/4mukhi.png', thumb: '/assets/rudraksha/4mukhi.png',
    description: 'The 4 Mukhi Rudraksha is associated with knowledge, creativity, and spiritual wisdom. It sharpens the mind and supports study and introspection.',
    benefits: ['Boosts concentration', 'Supports decision-making', 'Enhances learning ability'],
    bestFor: 'Students, scholars, and spiritual practitioners', wearing: 'Wear as a pendant during meditation',
  },
  {
    name: '5 Mukhi', sanskrit: 'Panchmukhi', planet: 'Kalagni', color: '#a8402e',
    img: '/assets/rudraksha/5mukhi.png', thumb: '/assets/rudraksha/5mukhi.png',
    description: 'The 5 Mukhi Rudraksha is one of the most common beads and represents purity, peace, and calm. It helps steady the mind and supports devotional practice.',
    benefits: ['Promotes inner peace', 'Balances emotions', 'Supports meditation'],
    bestFor: 'Everyone seeking calm, devotion, and grounding', wearing: 'Wear at all times for continuous protection',
  },
  {
    name: '6 Mukhi', sanskrit: 'Shanmukhi', planet: 'Kartikeya', color: '#7f5130',
    img: '/assets/rudraksha/6mukhi.png', thumb: '/assets/rudraksha/6mukhi.png',
    description: 'The 6 Mukhi Rudraksha embodies strength and courage. It clears fear, improves focus, and empowers the wearer to achieve goals.',
    benefits: ['Boosts confidence', 'Removes doubts', 'Supports disciplined action'],
    bestFor: 'Leaders, athletes, and active professionals', wearing: 'Best worn during important tasks and rituals',
  },
  {
    name: '7 Mukhi', sanskrit: 'Saptamukhi', planet: 'Indra', color: '#5d4d28',
    img: '/assets/rudraksha/7mukhi.png', thumb: '/assets/rudraksha/7mukhi.png',
    description: 'The 7 Mukhi Rudraksha represents wealth, authority, and spiritual abundance. It brings dignity and support during times of transition.',
    benefits: ['Encourages success', 'Attracts support', 'Balances leadership energy'],
    bestFor: 'Business owners, executives, and priests', wearing: 'Wear the bead as a pendant for steady influence',
  },
  {
    name: '8 Mukhi', sanskrit: 'Ashtamukhi', planet: 'Ganesha', color: '#ad7d4d',
    img: '/assets/rudraksha/8mukhi.png', thumb: '/assets/rudraksha/8mukhi.png',
    description: 'The 8 Mukhi Rudraksha is linked with Ganesha and removes obstacles from new beginnings. It creates momentum and opens the path forward.',
    benefits: ['Removes obstacles', 'Supports new ventures', 'Enhances problem-solving'],
    bestFor: 'Entrepreneurs, students, and those starting new projects', wearing: 'Wear during launches, travels, and important ceremonies',
  },
  {
    name: '9 Mukhi', sanskrit: 'Navamukhi', planet: 'Durga', color: '#a65945',
    img: '/assets/rudraksha/9mukhi.png', thumb: '/assets/rudraksha/9mukhi.png',
    description: 'The 9 Mukhi Rudraksha is associated with Durga and divine protection. It shields the wearer and increases spiritual endurance.',
    benefits: ['Enhances courage', 'Protects from negative energies', 'Strengthens resolve'],
    bestFor: 'Those seeking protection and spiritual resilience', wearing: 'Wear on the right side for protective energy',
  },
  {
    name: '10 Mukhi', sanskrit: 'Dashamukhi', planet: 'Vishnu', color: '#4f6970',
    img: '/assets/rudraksha/10mukhi.png', thumb: '/assets/rudraksha/10mukhi.png',
    description: 'The 10 Mukhi Rudraksha brings harmony, stability, and preservation energy. It supports family life, relationships, and inner calm.',
    benefits: ['Promotes harmony', 'Balances relationships', 'Supports steadiness'],
    bestFor: 'Families, rulers, and those needing balance', wearing: 'Wear daily to stabilize domestic and professional life',
  },
  {
    name: '11 Mukhi', sanskrit: 'Gyarah Mukhi', planet: 'Hanuman', color: '#8b2f00',
    img: '/assets/rudraksha/11mukhi.png', thumb: '/assets/rudraksha/11mukhi.png',
    description: 'The 11 Mukhi Rudraksha is linked to Hanuman and courage. It helps conquer fear, sharpen determination, and support disciplined effort.',
    benefits: ['Improves willpower', 'Increases resilience', 'Supports spiritual protection'],
    bestFor: 'Warriors, athletes, and devotees seeking bravery', wearing: 'Wear during physical or mental challenges',
  },
  {
    name: '12 Mukhi', sanskrit: 'Barah Mukhi', planet: 'Surya', color: '#bf7a47',
    img: '/assets/rudraksha/12mukhi.png', thumb: '/assets/rudraksha/12mukhi.png',
    description: 'The 12 Mukhi Rudraksha enhances leadership and fame. It brings recognition and helps the wearer express their purpose confidently.',
    benefits: ['Boosts reputation', 'Supports leadership', 'Clarifies goals'],
    bestFor: 'Public figures, speakers, and career-focused individuals', wearing: 'Wear during presentations, meetings, and ceremonies',
  },
  {
    name: '13 Mukhi', sanskrit: 'Terah Mukhi', planet: 'Krishna', color: '#5b6e5c',
    img: '/assets/rudraksha/13mukhi.png', thumb: '/assets/rudraksha/13mukhi.png',
    description: 'The 13 Mukhi Rudraksha carries devotional energy and deep spiritual awakening. It helps the mind settle and opens the heart to devotion.',
    benefits: ['Supports meditation', 'Encourages devotion', 'Calms the mind'],
    bestFor: 'Seekers of devotion and intense spiritual practice', wearing: 'Best worn during prayer and meditation',
  },
  {
    name: '14 Mukhi', sanskrit: 'Chaudah Mukhi', planet: 'Shiva', color: '#6c5b4b',
    img: '/assets/rudraksha/14mukhi.png', thumb: '/assets/rudraksha/14mukhi.png',
    description: 'The 14 Mukhi Rudraksha strengthens discipline, health, and spiritual stability. It brings steady progress on the inner path.',
    benefits: ['Enhances focus', 'Supports health', 'Stabilizes intention'],
    bestFor: 'Meditators, practitioners, and those seeking discipline', wearing: 'Wear during spiritual training and healing',
  },
  {
    name: '15 Mukhi', sanskrit: 'Pandra Mukhi', planet: 'Pashupatinath', color: '#9b6949',
    img: '/assets/rudraksha/15mukhi.png', thumb: '/assets/rudraksha/15mukhi.png',
    description: 'The 15 Mukhi Rudraksha is associated with prosperity, protection, and divine grace. It attracts blessings and increases abundance consciousness.',
    benefits: ['Attracts prosperity', 'Strengthens protection', 'Raises spiritual awareness'],
    bestFor: 'Those wishing for growth in life, wealth, and protection', wearing: 'Wear during sacred rituals and prosperity practices',
  },
  {
    name: '16 Mukhi', sanskrit: 'Solah Mukhi', planet: 'Indra', color: '#69523f',
    img: '/assets/rudraksha/16mukhi.png', thumb: '/assets/rudraksha/16mukhi.png',
    description: 'The 16 Mukhi Rudraksha supports authority, power, and social influence. It nurtures self-respect and the ability to lead with integrity.',
    benefits: ['Increases authority', 'Supports leadership', 'Strengthens confidence'],
    bestFor: 'Officials, managers, and spiritual leaders', wearing: 'Wear during important responsibilities and meetings',
  },
  {
    name: '17 Mukhi', sanskrit: 'Satra Mukhi', planet: 'Lakshmi', color: '#b77e4d',
    img: '/assets/rudraksha/17mukhi.png', thumb: '/assets/rudraksha/17mukhi.png',
    description: 'The 17 Mukhi Rudraksha brings abundance, grace, and emotional fulfillment. It helps align wealth with higher purpose and generosity.',
    benefits: ['Attracts abundance', 'Supports generosity', 'Calms the emotional body'],
    bestFor: 'Those seeking prosperity with a spiritual foundation', wearing: 'Wear when cultivating gratitude and abundance',
  },
  {
    name: '18 Mukhi', sanskrit: 'Athara Mukhi', planet: 'Vishnu', color: '#49696a',
    img: '/assets/rudraksha/18 mukhi.png', thumb: '/assets/rudraksha/18 mukhi.png',
    description: 'The 18 Mukhi Rudraksha carries preservation and grace. It stabilizes progress and protects the wearer through life transitions.',
    benefits: ['Supports stability', 'Protects through change', 'Promotes inner peace'],
    bestFor: 'Those undergoing transitions and growth', wearing: 'Wear daily for continuous support',
  },
  {
    name: '19 Mukhi', sanskrit: 'Unavimukhi', planet: 'Shiva', color: '#7f5a44',
    img: '/assets/rudraksha/19mukhi.png', thumb: '/assets/rudraksha/19mukhi.png',
    description: 'The 19 Mukhi Rudraksha symbolizes spiritual awakening and surrender. It invites transformation and removes deep-rooted blockages.',
    benefits: ['Aids spiritual growth', 'Clears karmic patterns', 'Deepens surrender'],
    bestFor: 'Advanced practitioners and seekers of liberation', wearing: 'Wear during retreats and intensive practice',
  },
  {
    name: '20 Mukhi', sanskrit: 'Vimshatmukhi', planet: 'Shakti', color: '#8f6347',
    img: '/assets/rudraksha/20mukhi.png', thumb: '/assets/rudraksha/20mukhi.png',
    description: 'The 20 Mukhi Rudraksha brings divine energy and radiant protection. It supports strength, courage, and higher guidance.',
    benefits: ['Empowers the spirit', 'Protects from negativity', 'Strengthens intuition'],
    bestFor: 'Those seeking radiant spiritual protection', wearing: 'Wear when calling higher support and protection',
  },
  {
    name: '21 Mukhi', sanskrit: 'Ekavimshatmukhi', planet: 'Maha Shiva', color: '#744c35',
    img: '/assets/rudraksha/21mukhi.png', thumb: '/assets/rudraksha/21mukhi.png',
    description: 'The 21 Mukhi Rudraksha is the highest bead and represents ultimate awakening. It is used for liberation, deep meditation, and transcendence.',
    benefits: ['Supports liberation', 'Deepens meditation', 'Brings spiritual completion'],
    bestFor: 'Advanced yogis and those on the path of moksha', wearing: 'Wear with reverence during deep practice',
  },
];

function FloatingParticles({ color }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const particles = el.querySelectorAll('.fp');
    particles.forEach((p, i) => {
      gsap.set(p, { x: Math.random() * 400, y: Math.random() * 300, opacity: 0 });
      gsap.to(p, {
        y: `-=${40 + Math.random() * 60}`,
        x: `+=${(Math.random() - 0.5) * 30}`,
        opacity: [0, 0.7, 0],
        duration: 3 + Math.random() * 3,
        delay: i * 0.3,
        repeat: -1,
        ease: 'none',
      });
    });
    return () => gsap.killTweensOf(particles);
  }, [color]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="fp absolute rounded-full"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            background: color,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

function BookConsultationFixed() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [concern, setConcern] = useState('');
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(btnRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, delay: 1.2, ease: 'back.out(1.5)' }
    );
    gsap.to(btnRef.current, {
      boxShadow: '0 0 0 8px rgba(184,134,11,0.0)',
      repeat: -1, duration: 1.8, ease: 'power2.inOut', yoyo: true,
    });
  }, []);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 24, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.3)' }
      );
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className="fixed z-[9998] flex items-center gap-2.5 overflow-hidden"
        style={{
          bottom: 28, right: 24,
          background: 'linear-gradient(135deg, #1a1206, #2a1e0a)',
          border: '1px solid #b8860b60',
          color: '#f5ede0',
          borderRadius: 50,
          padding: '12px 22px 12px 16px',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px #b8860b15',
          fontFamily: "'Glacial Indifference',sans-serif",
          fontSize: 10,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ fontSize: 18 }}>🔮</span>
        <span>Book Consultation</span>
        <span style={{ color: '#b8860b', marginLeft: 2, transition: 'transform 0.3s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9997] w-80"
          style={{
            bottom: 82, right: 24,
            background: 'linear-gradient(160deg, #1c1508 0%, #0f0d07 100%)',
            border: '1px solid #b8860b35',
            borderRadius: 8,
            boxShadow: '0 24px 72px rgba(0,0,0,0.7), 0 0 0 1px #b8860b10',
            overflow: 'hidden',
          }}
        >
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #b8860b80, transparent)' }} />

          <div className="px-6 pt-5 pb-2" style={{ borderBottom: '1px solid rgba(184,134,11,0.12)' }}>
            <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 4 }}>
              Rudraksha Remedies
            </p>
            <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 20, color: '#f5ede0', fontWeight: 400, lineHeight: 1.1 }}>
              Book a Personal<br />Rudraksha Reading
            </h3>
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 13, color: '#9a8060', marginTop: 5, lineHeight: 1.6 }}>
              Find the perfect Mukhi bead for your chart.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-3">
              {[
                { label: 'Full Name', val: name, set: setName, ph: 'Your name', type: 'text' },
                { label: 'Phone / WhatsApp', val: phone, set: setPhone, ph: '+91 98765 43210', type: 'tel' },
                { label: 'Date of Birth', val: dob, set: setDob, ph: '', type: 'date' },
              ].map(({ label, val, set, ph, type }) => (
                <div key={label}>
                  <label style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input
                    required type={type} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,134,11,0.25)',
                      borderRadius: 3, padding: '8px 12px', color: '#f5ede0',
                      fontFamily: "'Ibarra', serif", fontSize: 14,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', display: 'block', marginBottom: 4 }}>Your Concern</label>
                <textarea
                  rows={2} placeholder="e.g. career, marriage, health…" value={concern} onChange={e => setConcern(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(184,134,11,0.25)',
                    borderRadius: 3, padding: '8px 12px', color: '#f5ede0', resize: 'none',
                    fontFamily: "'Ibarra', serif", fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: '#b8860b', color: '#0f0d07', fontFamily: "'Glacial Indifference',sans-serif",
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '11px', border: 'none', borderRadius: 3, cursor: 'pointer', fontWeight: 700, marginTop: 2,
                }}
              >
                ✦ Request Consultation
              </button>
            </form>
          ) : (
            <div className="px-6 py-8 text-center">
              <div className="text-4xl mb-3">🌟</div>
              <p style={{ fontFamily: "'Ibarra', serif", fontSize: 18, color: '#f5ede0', marginBottom: 6 }}>Request Received!</p>
              <p style={{ fontFamily: "'Ibarra', serif", fontSize: 13, color: '#9a8060', lineHeight: 1.7 }}>
                Our astrologer will reach out within 24 hours on WhatsApp.
              </p>
              <button
                onClick={() => { setSubmitted(false); setOpen(false); }}
                style={{ color: '#b8860b', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Close ✕
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function RudraHero({ bead, onConsult }) {
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const radialRef = useRef(null);
  const textRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
    .fromTo(imgRef.current,
      { scale: 0.88, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.3)' }, '-=0.3'
    )
    .fromTo(radialRef.current,
      { scale: 0.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5'
    )
    .fromTo(textRef.current?.children ? Array.from(textRef.current.children) : [],
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }, '-=0.5'
    );

    gsap.to(imgRef.current, {
      y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    if (benefitsRef.current) {
      gsap.fromTo(
        benefitsRef.current.children,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.35, delay: 0.6, ease: 'power2.out' }
      );
    }
  }, [bead.name]);

  return (
    <div ref={heroRef} className="relative w-full" style={{ background: 'transparent' }}>
      <div
        ref={radialRef}
        className="absolute pointer-events-none"
        style={{
          top: '50%', left: '22%', transform: 'translate(-50%, -50%)',
          width: 800, height: 1100,
          background: `radial-gradient(circle, ${bead.color}25 50%, ${bead.color}10 25%, transparent 28%)`,
          zIndex: 0, filter: 'blur(28px)',
          transition: 'background 0.7s ease',
        }}
      />

      <FloatingParticles color={bead.color} />

      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 py-16 flex flex-col md:flex-row items-center gap-14">
        <div ref={imgRef} className="flex-shrink-0 relative flex items-center justify-center">
          <img
            src={bead.img}
            alt={bead.name}
            style={{
              width: 'min(430px, 85vw)', height: 200,
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: `0 12px 48px ${bead.color}28`,
              position: 'relative', overflow: 'visible', zIndex: 1,
            }}
          />
        </div>

        <div ref={textRef} className="flex-1">
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: bead.color, marginBottom: 6 }}>
            {bead.sanskrit}
          </p>
          <h1 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 400, color: '#1a1206', lineHeight: 1, marginBottom: 10 }}>
            {bead.name}
          </h1>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 16, color: '#6b5a40', lineHeight: 1.85, marginBottom: 18, maxWidth: 460 }}>
            {bead.description}
          </p>

          <div ref={benefitsRef} className="flex flex-wrap gap-x-6 gap-y-1 mb-5">
            {bead.benefits.map(b => (
              <span key={b} className="flex items-center gap-1.5"
                style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 14, color: '#4a3820' }}>
                <span style={{ color: bead.color }}>✦</span> {b}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-8 mb-6 pb-6" style={{ borderBottom: `1px solid ${bead.color}25` }}>
            <div>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 3 }}>Best For</p>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 14, color: '#4a3820' }}>{bead.bestFor}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9a8060', marginBottom: 3 }}>How to Wear</p>
              <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 14, color: '#4a3820' }}>{bead.wearing}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={onConsult}
              style={{
                background: 'black', color: 'white', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', padding: '13px 28px',
                border: '2px dashed rgba(201,169,110,0.65)', borderRadius: 0, cursor: 'pointer',
              }}
            >
              ✦ Consult Astrologer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RudraShopCard({ bead, isActive, onClick }) {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (!isActive) {
      gsap.to(cardRef.current, { y: -4, duration: 0.25, ease: 'power2.out' });
    }
  };
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.25, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer flex flex-col overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(8px)',
        border: isActive ? `2px solid ${bead.color}60` : '2px dashed rgba(200,185,160,0.3)',
        borderRadius: 4,
        transition: 'border 0.25s ease, box-shadow 0.25s ease',
        boxShadow: isActive ? `0 4px 24px ${bead.color}22` : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: 150, background: 'transparent' }}>
        <div
          className="absolute"
          style={{ width: 120, height: 120, border: `2px dashed ${bead.color}60`, borderRadius: '50%', background: `radial-gradient(circle, ${bead.color}40 0%, transparent 70%)`, filter: 'blur(14px)', opacity: isActive ? 1 : 0.5, transition: 'opacity 0.3s' }}
        />
        <img
          src={bead.thumb}
          alt={bead.name}
          className="relative z-10 transition-transform duration-400 group-hover:scale-105"
          style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover' }}
        />
        {isActive && (
          <div className="absolute top-2 right-2 rounded-full flex items-center justify-center" style={{ width: 22, height: 22, background: bead.color }}>
            <span style={{ color: '#fff', fontSize: 11 }}>✓</span>
          </div>
        )}
      </div>

      <div className="p-4" style={{ background: 'rgba(253,248,240,0.7)' }}>
        <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: bead.color, marginBottom: 3 }}>{bead.planet}</p>
        <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 17, fontWeight: 400, color: '#1a1206', marginBottom: 2, lineHeight: 1.2 }}>{bead.name}</h3>
        <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.1em', color: '#9a8060', textTransform: 'uppercase', marginBottom: 10 }}>{bead.sanskrit}</p>
        <button
          style={{
            background: isActive ? bead.color : '#1a1206', color: isActive ? '#0f0d07' : '#f5ede0',
            fontFamily: "'Glacial Indifference',sans-serif", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '6px 14px', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.2s',
          }}
        >
          {isActive ? 'Selected' : 'View'}
        </button>
      </div>
    </div>
  );
}

export default function Rudraksha() {
  const [active, setActive] = useState(rudrakshas[0]);
  const topRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const { openBooking } = useBooking();

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.55, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      }
    );
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.rudra-card-wrapper');
    gsap.fromTo(cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      }
    );
  }, []);

  const handleSelect = (bead) => {
    setActive(bead);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      ref={topRef}
      style={{
        backgroundImage: "url('/assets/Gems-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div>
        <div ref={headingRef} className="text-center pt-16 pb-6">
          <p className="flex items-center justify-center gap-3 mb-3"
            style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#b8860b' }}>
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
            Rudraksha Beads
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
          </p>
          <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#1a1206', lineHeight: 1.1, marginBottom: 10 }}>
            Sacred <em style={{ color: '#b8860b' }}>Mukhi</em> Rudraksha
          </h2>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 15, color: '#9a7b6a', maxWidth: 420, margin: '0 auto' }}>
            Explore the 1–21 Mukhi Rudraksha beads with their spiritual powers and how to wear them.
          </p>
        </div>

        <RudraHero bead={active} onConsult={() => openBooking('Rudraksha Consultation')} />

        <div className="max-w-5xl mx-auto px-8 md:px-16 pt-8">
          <div className="flex items-center gap-4 mb-2">
            <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', whiteSpace: 'nowrap' }}>
              Rudraksha Mukhi Selection
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(184,134,11,0.2)' }} />
          </div>
          <p style={{ fontFamily: "'Glacial Indifference',sans-serif", fontSize: 15, color: '#9a7b6a', marginBottom: 20, maxWidth: 520 }}>
            Click any bead below to learn its meaning, benefits, and recommended usage.
          </p>
        </div>

        <div ref={gridRef} className="max-w-5xl mx-auto px-8 md:px-16 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {rudrakshas.map((bead) => (
              <div key={bead.name} className="rudra-card-wrapper">
                <RudraShopCard
                  bead={bead}
                  isActive={active.name === bead.name}
                  onClick={() => handleSelect(bead)}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <p style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 15, color: '#9a7b6a', marginBottom: 16 }}>
              Want a custom Mukhi recommendation? Our astrologer can help you choose the right bead for your chart.
            </p>
            <button
              onClick={() => openBooking('Rudraksha Consultation')}
              className="hover:bg-[#b8860b] transition-all duration-300"
              style={{ background: '#1a1206', color: '#f5ede0', fontFamily: "'Glacial Indifference',sans-serif", fontSize: 11, border: '2px dashed rgba(201,169,110,0.65)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', cursor: 'pointer' }}
            >
              Book Rudraksha Guidance
            </button>
          </div>
        </div>
      </div>

      <BookConsultationFixed />
    </div>
  );
}
