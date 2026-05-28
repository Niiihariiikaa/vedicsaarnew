import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from './BookingContext';

const Galaxy = lazy(() => import('./Galaxy'));

const footerLinks = {
  Services: [
    { label: 'Vedic Astrology', to: '/vedic-astrology' },
    { label: 'Numerology', to: '/numerology' },
    { label: 'Vastu Shastra', to: '/vaastu' },
  ],
  Explore: [
    { label: 'About VedicSaar', to: '/about' },
    { label: 'Testimonials', to: '/' },
  ],
  Connect: [
    { label: 'Book a Session', action: 'booking' },
    { label: 'manishmalhotra30@gmail.com', href: 'mailto:manishmalhotra30@gmail.com' },
    { label: '+91 98919 35353', href: 'tel:+919891935353' },
    { label: '+91 98186 75353', href: 'tel:+919818675353' },
    { label: 'Connect on WhatsApp', href: 'https://wa.me/919891935353', whatsapp: true },
    { label: 'Instagram', href: 'https://instagram.com/vedicsaar' },
  ],
};

const linkStyle = {
  fontFamily: "'Glacial Indifference', serif",
  fontSize: 15,
  color: 'rgba(245,237,224,0.6)',
  textDecoration: 'none',
};

export default function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer className="relative w-full overflow-hidden" style={{ minHeight: 560 }}>

      {/* Galaxy background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div style={{ background: '#0d0a06', width: '100%', height: '100%' }} />}>
          <Galaxy
            mouseRepulsion
            mouseInteraction
            density={1.2}
            glowIntensity={0.35}
            saturation={0.1}
            hueShift={140}
            twinkleIntensity={0.4}
            rotationSpeed={0.08}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.4}
            speed={0.8}
            transparent={false}
          />
        </Suspense>
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16 pt-20 pb-10">

        {/* Top row: brand + links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <p
                className="mb-1"
                style={{
                  fontFamily: "'Lathusca', sans-serif",
                  fontSize: 34,
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: '#f5ede0' }}>VEDIC</span><span style={{ color: '#c9a96e' }}>SAAR</span>
              </p>
            </Link>
            <p
              className="mb-6"
              style={{
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9a8060',
              }}
            >
              Ancient Wisdom · Modern Clarity
            </p>
            <p
              style={{
                fontFamily: "'Glacial Indifference', serif",
                fontSize: 15,
                color: '#9a8060',
                lineHeight: 1.8,
              }}
            >
              Guiding souls through the timeless science of Vedic astrology, numerology, and Vastu.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p
                className="mb-5"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#b8860b',
                }}
              >
                {title}
              </p>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.action === 'booking' ? (
                      <button
                        onClick={() => openBooking()}
                        className="transition-colors duration-200 hover:text-[#b8860b] bg-transparent border-none p-0 cursor-pointer text-left"
                        style={linkStyle}
                      >
                        {link.label}
                      </button>
                    ) : link.whatsapp ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 hover:text-[#25d366]"
                        style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, color: '#25d366' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#25d366" style={{ flexShrink: 0 }}>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                        {link.label}
                      </a>
                    ) : link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto') || link.href.startsWith('tel') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 hover:text-[#b8860b]"
                        style={linkStyle}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="transition-colors duration-200 hover:text-[#b8860b]"
                        style={linkStyle}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Prediction email strip */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 mb-0"
          style={{ borderTop: '1px solid rgba(201,169,110,0.15)', borderBottom: '1px solid rgba(201,169,110,0.15)' }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Ibarra Real Nova', serif",
                fontSize: 20,
                color: '#f5ede0',
                fontWeight: 400,
              }}
            >
              Receive your <em style={{ color: '#b8860b' }}>cosmic prediction</em> through email
            </p>
            <p
              style={{
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: 11,
                color: '#9a8060',
                letterSpacing: '0.04em',
                marginTop: 4,
              }}
            >
              Enter your email and get a personalised Vedic prediction delivered to you.
            </p>
          </div>
          <div className="flex items-stretch gap-0 flex-shrink-0">
            <button
              style={{
                background: 'black',
                color: 'white',
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 24px',
                border: '2px dashed rgba(201,169,110,0.65)',
                borderRadius: 0,
                cursor: 'pointer',
              }}
            >
              Get Prediction
            </button>
          </div>
        </div>

        {/* ── Full-width address band ── */}
        <div
          style={{
            borderBottom: '1px solid rgba(201,169,110,0.15)',
            padding: '36px 0',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'stretch',
            gap: 48,
            flexWrap: 'wrap',
          }}
        >
          {/* Left — label + address text */}
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#b8860b',
              marginBottom: 16,
            }}>
              Visit Us
            </p>

            <a
              href="https://maps.google.com/?q=A1%2F293+Paschim+Vihar+Top+Floor+New+Delhi+Delhi+110063"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                textDecoration: 'none',
                color: '#f5ede0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
              onMouseLeave={e => e.currentTarget.style.color = '#f5ede0'}
            >
              <svg width="22" height="28" viewBox="0 0 13 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
                <path d="M6.5 0C3.467 0 1 2.467 1 5.5c0 4.125 5.5 10.5 5.5 10.5S12 9.625 12 5.5C12 2.467 9.533 0 6.5 0Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="#c9a96e"/>
              </svg>
              <span style={{
                fontFamily: "'Glacial Indifference', sans-serif",
                fontSize: 15,
                lineHeight: 1.8,
                fontWeight: 400,
              }}>
                A1/293, Paschim Vihar,<br />
                <span style={{ fontSize: 15, color: 'rgba(245,237,224,0.6)' }}>Top Floor, New Delhi, Delhi 110063</span>
              </span>
            </a>
          </div>

          {/* Right — map */}
          <a
            href="https://maps.google.com/?q=A1%2F293+Paschim+Vihar+Top+Floor+New+Delhi+Delhi+110063"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: '1 1 340px',
              display: 'block',
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid rgba(201,169,110,0.3)',
              minHeight: 180,
            }}
          >
            <iframe
              title="VedicSaar Location"
              src="https://maps.google.com/maps?q=A1%2F293%2C+Paschim+Vihar%2C+New+Delhi%2C+Delhi+110063&output=embed&z=15"
              width="100%"
              height="180"
              style={{ display: 'block', border: 'none', filter: 'grayscale(0.25) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            style={{
              fontFamily: "'Glacial Indifference', sans-serif",
              fontSize: 11,
              color: 'rgba(154,128,96,0.7)',
              letterSpacing: '0.04em',
            }}
          >
            © {new Date().getFullYear()} VedicSaar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Disclaimer', to: '/disclaimer' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                style={{
                  fontFamily: "'Glacial Indifference', sans-serif",
                  fontSize: 11,
                  color: 'rgba(154,128,96,0.7)',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
