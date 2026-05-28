import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
const AstroChat        = lazy(() => import('./components/AstroChat'))
const NumerologyWidget = lazy(() => import('./components/NumerologyWidget'))
import './index.css'

// ── Eagerly loaded — visible on first paint ──────────────────────────────────
import Homepage from './pages/Home'
import MysticalServices from './components/Services'

// ── Lazy-loaded home sections — below the fold ───────────────────────────────
const ServicesGrid      = lazy(() => import('./components/ServicesGrid'))
const KnowYourAstrologer = lazy(() => import('./components/Astrologer'))
const Testimonials      = lazy(() => import('./components/Testimonials'))

// ── All other pages loaded only when their route is visited ─────────────────
const GemstonesPage      = lazy(() => import('./pages/Gemstones'))
const RudrakshaPage      = lazy(() => import('./pages/Rudraksha'))
const MantrasPage        = lazy(() => import('./pages/Mantras'))
const VedicAstrologyPage = lazy(() => import('./pages/Vedic'))
const NumerologyPage     = lazy(() => import('./pages/Numerology'))
const AboutPage          = lazy(() => import('./pages/About'))
const VaastuPage         = lazy(() => import('./pages/Vaastu'))
const LoveMarriagePage   = lazy(() => import('./pages/LoveMarriage'))
const HealthPage         = lazy(() => import('./pages/Health'))
const CareerPage         = lazy(() => import('./pages/Career'))
const FinancePage        = lazy(() => import('./pages/Finance'))
const ForeignTravelPage  = lazy(() => import('./pages/ForeignTravel'))
const ChildProgenyPage   = lazy(() => import('./pages/ChildProgeny'))
const EducationPage      = lazy(() => import('./pages/Education'))
const HousePropertyPage  = lazy(() => import('./pages/HouseProperty'))
const CourtLitigationPage = lazy(() => import('./pages/CourtLitigation'))
const Pooja              = lazy(() => import('./pages/Pooja'))
const LalKitab           = lazy(() => import('./pages/LalKitab'))
const PrivacyPolicyPage  = lazy(() => import('./pages/PrivacyPolicy'))
const DisclaimerPage     = lazy(() => import('./pages/Disclaimer'))

function MainLayout() {
  return (
    <>
      <Homepage />
      <MysticalServices />
      <Suspense fallback={null}>
        <ServicesGrid />
        <KnowYourAstrologer />
        <Testimonials />
      </Suspense>
    </>
  )
}

// Minimal fallback — matches the dark background so there's no flash
function PageFallback() {
  return <div style={{ minHeight: '100vh', background: '#0d0a06' }} />
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/gemstones" element={<GemstonesPage />} />
          <Route path="/rudraksha" element={<RudrakshaPage />} />
          <Route path="/mantra" element={<MantrasPage />} />
          <Route path="/vedic-astrology" element={<VedicAstrologyPage />} />
          <Route path="/numerology" element={<NumerologyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/vaastu" element={<VaastuPage />} />
          <Route path="/life-solutions/love-marriage" element={<LoveMarriagePage />} />
          <Route path="/life-solutions/health" element={<HealthPage />} />
          <Route path="/life-solutions/career" element={<CareerPage />} />
          <Route path="/life-solutions/finance" element={<FinancePage />} />
          <Route path="/life-solutions/foreign-travel" element={<ForeignTravelPage />} />
          <Route path="/life-solutions/child-progeny" element={<ChildProgenyPage />} />
          <Route path="/life-solutions/education" element={<EducationPage />} />
          <Route path="/life-solutions/house-property" element={<HousePropertyPage />} />
          <Route path="/life-solutions/court-litigation" element={<CourtLitigationPage />} />
          <Route path="/remedies/pooja" element={<Pooja />} />
          <Route path="/remedies/lal-kitab" element={<LalKitab />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <AstroChat />
      <NumerologyWidget />
    </BrowserRouter>
  )
}
