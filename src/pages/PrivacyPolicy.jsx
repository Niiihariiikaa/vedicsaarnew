import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const minimalCss = `
html { scroll-behavior: smooth; }
body { font-family: 'Jost', sans-serif; }
.font-ibarra { font-family: 'Ibarra Real Nova', serif; }
.pp-section h2 { font-family: 'Ibarra Real Nova', serif; font-size: 26px; font-weight: 400; color: #2a2017; margin-bottom: 14px; margin-top: 0; }
.pp-section h3 { font-family: 'Glacial Indifference', sans-serif; font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: #a8865c; margin-bottom: 10px; margin-top: 32px; }
.pp-section p, .pp-section li { font-family: 'Glacial Indifference', sans-serif; font-size: 15.5px; line-height: 1.95; color: #555; }
.pp-section ul { padding-left: 20px; margin: 10px 0; }
.pp-section li { margin-bottom: 6px; }
.pp-divider { width: 40px; height: 1px; background: rgba(168,134,92,0.45); margin: 0 0 28px; }
`

function FU({ children, delay = 0 }) {
  const r = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!r.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.08 })
    io.observe(r.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={r}
      className={`transition-[opacity,transform] duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const SECTIONS = [
  {
    title: 'Information We Collect',
    items: [
      {
        heading: 'Personal & Birth Data',
        body: 'To generate your Janma Kundli (birth chart) and deliver personalised Vedic readings, we collect your name, date of birth, time of birth, and place of birth. This data is used solely for astrological calculation and interpretation.',
      },
      {
        heading: 'Booking Information',
        body: 'When you book a consultation, we collect your name, email address, phone number, and the service you selected. This information is used to schedule and confirm your appointment and to send you relevant communication.',
      },
      {
        heading: 'Usage & Technical Data',
        body: 'We may collect standard technical data such as your browser type, device, IP address, and pages visited. This helps us improve site performance and detect errors. We do not sell or share this data with advertisers.',
      },
    ],
  },
  {
    title: 'How We Use Your Information',
    items: [
      {
        heading: 'To Provide Our Services',
        body: 'Your birth data is passed to third-party astrological computation APIs (FreeAstroAPI) to generate your sidereal birth chart, and to Google Gemini AI to produce AI-assisted interpretations. By using our AI chat feature you acknowledge this data transfer.',
      },
      {
        heading: 'For Booking & Communication',
        body: 'Booking details are stored securely via Supabase and used to send confirmation and follow-up emails through our email service. We do not send marketing emails without your explicit consent.',
      },
      {
        heading: 'To Improve Our Platform',
        body: 'Aggregate, anonymised usage data may be used to understand which features are most helpful, to identify and fix technical issues, and to develop new services.',
      },
    ],
  },
  {
    title: 'Third-Party Services',
    items: [
      {
        heading: 'AI & Computation Partners',
        body: 'Our AI chatbot sends your birth data to Google Gemini (a Google Cloud service) for interpretation. Your data is governed by Google\'s privacy terms for API usage. We send only the birth data required for the reading — no personally identifying contact details are shared with AI services.',
      },
      {
        heading: 'Supabase (Database & Functions)',
        body: 'Booking records are stored on Supabase, a GDPR-compliant data platform. Data is encrypted at rest and in transit. Supabase does not use your data for its own purposes.',
      },
      {
        heading: 'Google Maps',
        body: 'Our footer embeds a Google Maps iframe to show our office location. Google may set cookies in relation to this embed. Please refer to Google\'s Privacy Policy for details.',
      },
    ],
  },
  {
    title: 'Data Retention & Security',
    items: [
      {
        heading: 'How Long We Keep Your Data',
        body: 'Booking records are retained for up to 24 months to facilitate follow-up consultations and for accounting purposes. AI chat sessions are not stored on our servers — birth data entered in the chatbot exists only in your browser session and is cleared when you close the chat.',
      },
      {
        heading: 'Security Measures',
        body: 'We use industry-standard encryption (HTTPS/TLS) for all data in transit. Our database provider applies encryption at rest. Access to user data is restricted to authorised personnel only.',
      },
    ],
  },
  {
    title: 'Your Rights',
    items: [
      {
        heading: 'Access, Correction & Deletion',
        body: 'You may request a copy of any personal data we hold about you, ask us to correct inaccuracies, or request deletion of your data at any time. To exercise these rights, email us at info@vedicsaar.com with the subject line "Data Request".',
      },
      {
        heading: 'Cookies',
        body: 'We use minimal, functional cookies (e.g., to track your free daily reading count via localStorage). We do not use tracking or advertising cookies. You may clear your browser storage at any time to reset this data.',
      },
      {
        heading: 'Children\'s Privacy',
        body: 'Our services are intended for adults aged 18 and above. We do not knowingly collect personal data from children. If you believe a child has submitted data to us, please contact us immediately.',
      },
    ],
  },
  {
    title: 'Changes to This Policy',
    items: [
      {
        heading: 'Updates',
        body: 'We may update this Privacy Policy from time to time. Material changes will be communicated via a notice on our website. The date of the last revision appears at the bottom of this page. Continued use of our services after any changes constitutes your acceptance of the updated policy.',
      },
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <style>{minimalCss}</style>

      {/* Hero */}
      <section className="relative min-h-[320px] bg-[#f7f2ea] flex items-end justify-center overflow-hidden">
        <img src="/assets/costelation.png" alt="" aria-hidden="true"
          className="absolute top-0 left-0 w-[280px] pointer-events-none select-none"
          style={{ opacity: 0.4, zIndex: 1 }} />
        <img src="/assets/crescentmoon.png" alt="" aria-hidden="true"
          className="absolute top-0 right-0 w-[220px] pointer-events-none select-none"
          style={{ opacity: 0.4, zIndex: 1 }} />
        <div className="relative z-[3] text-center pb-10 w-full">
          <p className="text-[10px] tracking-[3px] uppercase text-[#a8865c] mb-4 font-normal"
            style={{ fontFamily: "'Glacial Indifference', sans-serif" }}>
            Vedic Saar · Legal
          </p>
          <h1 className="font-ibarra text-[64px] max-[960px]:text-[40px] font-normal text-black tracking-[2px] leading-none">
            Privacy <em>Policy</em>
          </h1>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 13, color: '#9a8060', marginTop: 14, letterSpacing: '0.04em' }}>
            Last updated: May 2025
          </p>
        </div>
        <div className="absolute bottom-[-1px] left-0 w-full z-[1] overflow-visible">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 60" preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '60px' }}>
            <path fill="white" d="M0,60 L0,40 Q500,-14 1000,40 L1000,60 Z" />
          </svg>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white pt-16 pb-10">
        <div className="max-w-[820px] mx-auto px-8 md:px-12">
          <FU>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 16.5, lineHeight: 2, color: '#666' }}>
              At Vedic Saar, your trust is sacred to us — as sacred as the knowledge we share. This Privacy Policy explains
              what personal information we collect when you use our website, AI chat, and booking services, how we use it,
              and the choices you have. We keep this simple and transparent.
            </p>
          </FU>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white pb-24">
        <div className="max-w-[820px] mx-auto px-8 md:px-12">
          {SECTIONS.map((sec, si) => (
            <FU key={sec.title} delay={si * 60}>
              <div className="pp-section mb-14">
                <div className="pp-divider" />
                <h2>{sec.title}</h2>
                {sec.items.map((item) => (
                  <div key={item.heading}>
                    <h3>{item.heading}</h3>
                    <p>{item.body}</p>
                  </div>
                ))}
              </div>
            </FU>
          ))}

          {/* Contact */}
          <FU delay={360}>
            <div style={{ background: '#f7f2ea', border: '1px solid rgba(168,134,92,0.25)', borderRadius: 10, padding: '36px 40px', marginTop: 8 }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#a8865c', marginBottom: 10 }}>
                Questions?
              </p>
              <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 24, fontWeight: 400, color: '#2a2017', marginBottom: 12 }}>
                Contact Our Privacy Team
              </h2>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 15.5, lineHeight: 1.9, color: '#666', marginBottom: 20 }}>
                For any privacy-related questions, data requests, or concerns, please reach out to us directly.
              </p>
              <a
                href="mailto:info@vedicsaar.com"
                style={{
                  display: 'inline-block',
                  fontFamily: "'Glacial Indifference', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '12px 28px',
                  background: '#0d0a06',
                  color: '#fff',
                  border: '2px dashed rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                  borderRadius: 0,
                }}
              >
                info@vedicsaar.com
              </a>
            </div>
          </FU>

          {/* Back links */}
          <FU delay={400}>
            <div style={{ marginTop: 40, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Disclaimer', to: '/disclaimer' },
                { label: 'Terms of Service', to: '/terms-of-service' },
              ].map(({ label, to }) => (
                <Link key={to} to={to}
                  style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 13, color: '#a8865c', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {label}
                </Link>
              ))}
            </div>
          </FU>
        </div>
      </section>
    </>
  )
}
