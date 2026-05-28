import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from './BookingContext'

const dropdowns = {
  Predictions:      ['Vedic Astrology', 'K P Astrology', 'Numerology', 'Prashna', 'Yearly Prediction'],
  'Life Solutions': ['Love & Marriage', 'Career', 'Finance', 'Health', 'Foreign Travel','Child & Progeny', 'Education', 'House & Property', 'Court & Litigation'],
  Remedies:         ['Pooja', 'Lal Kitab'],
}

const navRoutes = {
  'Home':           '/',
  'Predictions':    '/predictions',
  'Life Solutions': '/life-solutions',
  'Vaastu':         '/vaastu',
  'Rudraksha':      '/rudraksha',
  'Remedies':       '/remedies',
  'Gemstones':      '/gemstones',
  'Mantra':         '/mantra',
  'Vedic Astrology':'/vedic-astrology',
  'Numerology':     '/numerology',
  'About':          '/about',
}

const subRoutes = {
  'Vedic Astrology':    '/vedic-astrology',
  'K P Astrology':      '/predictions/kp-astrology',
  'Numerology':         '/numerology',
  'Prashna':            '/predictions/prashna',
  'Yearly Prediction':  '/predictions/yearly-prediction',
  'Love & Marriage':    '/life-solutions/love-marriage',
  'Career':             '/life-solutions/career',
  'Finance':            '/life-solutions/finance',
  'Health':             '/life-solutions/health',
  'Foreign Travel':     '/life-solutions/foreign-travel',
  'Child & Progeny':    '/life-solutions/child-progeny',
  'Education':          '/life-solutions/education',
  'House & Property':   '/life-solutions/house-property',
  'Court & Litigation': '/life-solutions/court-litigation',
  'Pooja':              '/remedies/pooja',
  'Lal Kitab':          '/remedies/lal-kitab',
}

const navItems = [
  'Home', 'Life Solutions', 'Vaastu', 'Numerology', 'Vedic Astrology', 'Rudraksha', 'About', 'Gemstones',
  'Mantra', 'Remedies'
]

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const { openBooking } = useBooking()

  return (
    <div style={{ fontFamily: "'Glacial Indifference', serif" }}>

      {/* ── TOP BAR WITH VIDEO ── */}
      <div className="relative h-[18px] overflow-hidden flex items-center justify-between px-6 bg-[#0e0e0e]">
        <video
          autoPlay muted loop playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
          style={{ objectPosition: '50% 20%' }}
        >
          <source src="/assets/navvid.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── MAIN NAV ── */}
      <nav className="bg-white border-b border-[#b8870b72] border-dashed px-6 py-3 flex items-center justify-between" style={{ minHeight: '120px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
          <span className="text-4xl font-semibold tracking-wide">
            <span style={{ color: 'black', fontFamily: 'Lathusca' }}>VEDIC</span><span style={{ color: '#c9a96e', fontFamily: 'Lathusca' }}>SAAR</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-4">
          <ul className="flex flex-wrap items-center list-none m-0 p-0">
            {navItems.map((item) => (
              <li
                key={item}
                className="relative"
                onMouseEnter={() => dropdowns[item] && setOpenMenu(item)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  to={navRoutes[item] || '/'}
                  className="block px-2 py-2 text-[15px] text-[#3a2e1e] tracking-wide whitespace-nowrap hover:text-[#b8860b] transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  {item}
                  {dropdowns[item] && (
                    <span className="inline-block text-[14px] opacity-100 ml-1">▾</span>
                  )}
                </Link>

                {dropdowns[item] && openMenu === item && (
                  <ul className="absolute top-full left-0 bg-white border border-[#ddd5c0] border-t-2 border-t-[#b8860b] min-w-[160px] z-50 py-1.5 shadow-lg list-none p-0 m-0">
                    {dropdowns[item].map((sub) => (
                      <li key={sub}>
                        <Link
                          to={subRoutes[sub] || '/'}
                          className="block px-4 py-2 text-xs text-[#3a2e1e] hover:bg-[#fdf6e8] transition-colors"
                          style={{ textDecoration: 'none' }}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => openBooking()}
            className="ml-2 border border-dashed bg-transparent border-[black] text-black px-4 py-2 text-s tracking-widest whitespace-nowrap hover:bg-[#b8860b] hover:text-white transition-all duration-200"
          >
            Book Reading
          </button>
        </div>

        {/* Hamburger (mobile/tablet) */}
        <button
          className="lg:hidden flex flex-col justify-center gap-[5px] p-2 z-50"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] bg-[#1a1206] transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#1a1206] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#1a1206] transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`lg:hidden bg-white border-b border-[#b8870b72] border-dashed shadow-md overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[90vh] overflow-y-auto' : 'max-h-0'}`}>
        <ul className="flex flex-col list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item} className="border-b border-[#f0ebe0]">
              {dropdowns[item] ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-6 py-4 text-[15px] text-[#3a2e1e] tracking-wide bg-transparent border-none cursor-pointer"
                    onClick={() => setMobileExpanded(mobileExpanded === item ? null : item)}
                  >
                    <span>{item}</span>
                    <span className={`transition-transform duration-300 text-[#b8860b] ${mobileExpanded === item ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === item ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="bg-[#fdf9f3] list-none p-0 m-0">
                      {dropdowns[item].map((sub) => (
                        <li key={sub}>
                          <Link
                            to={subRoutes[sub] || '/'}
                            className="block px-10 py-3 text-sm text-[#3a2e1e] hover:text-[#b8860b] transition-colors"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  to={navRoutes[item] || '/'}
                  className="block px-6 py-4 text-[15px] text-[#3a2e1e] tracking-wide hover:text-[#b8860b] transition-colors"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              )}
            </li>
          ))}
          <li className="p-4">
            <button
              onClick={() => { openBooking(); setMobileOpen(false); }}
              className="w-full border border-dashed bg-transparent border-[black] text-black px-4 py-3 tracking-widest hover:bg-[#b8860b] hover:text-white transition-all duration-200 text-sm"
            >
              Book Reading
            </button>
          </li>
        </ul>
      </div>

    </div>
  )
}
