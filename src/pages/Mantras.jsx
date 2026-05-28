import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function audioSrc(path) {
  const parts = path.split('/');
  const filename = parts.pop();
  return [...parts, encodeURIComponent(filename)].join('/');
}

const mantras = [
  { id: 'gayatri', name: 'Gayatri Mantra', deity: 'Surya · Sun', planet: 'Sun', color: '#c8860a', accent: '#f5c842', image: '/assets/mantras/mantra-img/Om.png', beejMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', transliteration: 'Om Bhur Bhuvah Svah | Tat Savitur Varenyam | Bhargo Devasya Dheemahi | Dhiyo Yo Nah Prachodayat', meaning: 'We meditate on the divine light of the Sun, who illuminates all realms. May that sacred effulgence awaken and guide our intellect.', benefits: ['Clarity of mind', 'Solar energy', 'Wisdom & intellect', 'Spiritual awakening'], chantCount: '108×', bestTime: 'Sunrise & Sunset', audio: '/assets/mantras/Gayatri-Mantra.mp3' },
  { id: 'chandra', name: 'Chandra Mantra', deity: 'Chandra · Moon', planet: 'Moon', color: '#4a6080', accent: '#a0c8e8', image: '/assets/mantras/mantra-img/Chandra.png', sanskrit: 'ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः', transliteration: 'Om Shraam Shreem Shraum Sah Chandramase Namah', meaning: 'Salutations to Chandra, the luminous Moon. May the divine Moon bless me with peace, emotional harmony, and the nectar of divine grace.', benefits: ['Emotional balance', 'Mental peace', 'Chandra dosha relief', 'Intuition & creativity'], chantCount: '108×', bestTime: 'Monday evening, Purnima', audio: '/assets/mantras/Chandra-Mantra.mp3' },
  { id: 'mangal', name: 'Mangal Mantra', deity: 'Mangal · Mars', planet: 'Mars', color: '#9b2c1a', accent: '#f07050', image: '/assets/mantras/mantra-img/Mangal.png', beejMantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', sanskrit: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः।', transliteration: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', meaning: 'Salutations to Mangal, the fiery Mars. O red planet, lord of courage and valor, remove all obstacles and bless me with strength and vitality.', benefits: ['Courage & vitality', 'Mangal dosha relief', 'Victory over enemies', 'Strength & stamina'], chantCount: '108×', bestTime: 'Tuesday sunrise', audio: '/assets/mantras/Om Kram Kreem Kroum Sah Bhaumaya Namah 108 Times Fast _ Mangal Beej Mantra.mp3' },
  { id: 'budha', name: 'Budha Mantra', deity: 'Budha · Mercury', planet: 'Mercury', color: '#2d7a57', accent: '#4ec890', image: '/assets/mantras/mantra-img/Budhha.png', beejMantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', sanskrit: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', transliteration: 'Om Braam Breem Braum Sah Budhaya Namah', meaning: 'Salutations to Mercury, the planet of intellect, communication, and commerce. May you bless me with clarity of thought and the power of eloquent expression.', benefits: ['Sharp intellect', 'Communication skills', 'Business success', 'Mercury dosha relief'], chantCount: '108×', bestTime: 'Wednesday morning', audio: '/assets/mantras/Om Bram Breem Broum Sah Budhaya Namah 108 Times Fast _ Budh Beej Mantra.mp3' },
  { id: 'brihaspati', name: 'Brihaspati Mantra', deity: 'Brihaspati · Jupiter', planet: 'Jupiter', color: '#7a5a18', accent: '#e8b84a', image: '/assets/mantras/mantra-img/Brahspati.png', beejMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरुवे नमः', sanskrit: 'ॐ ग्रां ग्रीं ग्रौं सः गुरुवे नमः', transliteration: 'Om Graam Greem Graum Sah Gurave Namah', meaning: 'Salutations to Brihaspati, the divine Guru. O Jupiter, lord of wisdom and dharma, bless me with knowledge, prosperity, and spiritual growth.', benefits: ['Wisdom & knowledge', 'Guru dosha relief', 'Prosperity & luck', 'Spiritual growth'], chantCount: '108× or 19,000×', bestTime: 'Thursday morning', audio: '/assets/mantras/Brihaspati.mp3' },
  { id: 'shukra', name: 'Shukra Mantra', deity: 'Shukra · Venus', planet: 'Venus', color: '#7a4f8a', accent: '#c890e8', image: '/assets/mantras/mantra-img/shukr.png', beejMantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', sanskrit: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः।', transliteration: 'Om Draam Dreem Draum Sah Shukraya Namah', meaning: 'Salutations to Shukra, the radiant Venus. O planet of beauty and love, bless me with artistic expression, romantic harmony, and material comforts.', benefits: ['Love & relationships', 'Artistic talents', 'Beauty & luxury', 'Shukra dosha relief'], chantCount: '108×', bestTime: 'Friday morning', audio: '/assets/mantras/Shukra-Mantra.mp3' },
  { id: 'shani', name: 'Shani Mantra', deity: 'Shani Dev · Saturn', planet: 'Saturn', color: '#3a3060', accent: '#7870d0', image: '/assets/mantras/mantra-img/Shani.png', beejMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', sanskrit: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', transliteration: 'Om Praam Preem Praum Sah Shanaishcharaya Namah', meaning: 'Salutations to Shani, the slow-moving one. O Saturn, lord of karma and discipline, please remove all obstacles from my path.', benefits: ['Saturn sade sati relief', 'Karma purification', 'Discipline & focus', 'Removes delays'], chantCount: '108× or 23,000×', bestTime: 'Saturday dusk', audio: '/assets/mantras/om pram preem proum sah shanaischaraya namah 10 Times Fast _ Shani Beej Mantra.mp3' },
  { id: 'rahu', name: 'Rahu Mantra', deity: 'Rahu · North Node', planet: 'Rahu', color: '#4a3010', accent: '#c89050', image: '/assets/mantras/mantra-img/Rahu.png', beejMantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', sanskrit: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', transliteration: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', meaning: 'Salutations to Rahu, the ascending lunar node. O shadow planet of illusion and transformation, grant me clarity, wisdom and liberation from confusion.', benefits: ['Rahu dosha relief', 'Removes confusion', 'Worldly success', 'Hidden knowledge'], chantCount: '108×', bestTime: 'Saturday night', audio: '/assets/mantras/Om Ram Rahave Namah 108 Times in 5 Minutes _ Rahu Mantra Fast.mp3' },
  { id: 'ketu', name: 'Ketu Mantra', deity: 'Ketu · South Node', planet: 'Ketu', color: '#2e4a30', accent: '#70b878', image: '/assets/mantras/mantra-img/Ketu.png', beejMantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', sanskrit: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', transliteration: 'Om Sraam Sreem Sraum Sah Ketave Namah', meaning: 'Salutations to Ketu, the descending lunar node. O shadow planet of moksha and liberation, guide me toward spiritual awakening and freedom from ancestral karma.', benefits: ['Ketu dosha relief', 'Spiritual liberation', 'Ancestral karma', 'Psychic intuition'], chantCount: '108×', bestTime: 'Saturday night', audio: '/assets/mantras/Om Kem Ketave Namah 108 Times in 5 Minutes _ Ketu Mantra _ Fast.mp3' },
  { id: 'mahamrityunjaya', name: 'Mahamrityunjaya', deity: 'Shiva · Healer', planet: 'Mars & Moon', color: '#598BAF', accent: '#598BAF', image: '/assets/mantras/mantra-img/Shiva.png', beejMantra: 'ॐ ह्रौं जूं सः ॐ भूर्भुवः स्वः', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्', transliteration: 'Om Tryambakam Yajamahe | Sugandhim Pushtivardhanam | Urvarukamiva Bandhanan | Mrityor Mukshiya Maamritat', meaning: 'We worship the three-eyed Lord Shiva, the fragrant, the nourisher of all. Like a cucumber freed from its vine, liberate us from the bondage of death.', benefits: ['Protection & healing', 'Removes fear of death', 'Mangal dosha relief', 'Victory over illness'], chantCount: '108×', bestTime: 'Monday dawn, Pradosha', audio: '/assets/mantras/mahamriyunjaya.mp3' },
  { id: 'hanuman-chalisa', name: 'Hanuman Chalisa', deity: 'Hanuman · Protector', planet: 'Saturn', color: '#b05a10', accent: '#f07830', image: '/assets/mantras/mantra-img/Hanuman.png', beejMantra: 'ॐ ऐं भ्रीं हनुमते रामदूताय नमः', sanskrit: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥', transliteration: 'Shri Guru Charan Saroj Raj | Nij Manu Mukuru Sudhari | Barnau Raghubar Bimal Jasu | Jo Dayaku Phal Chari', meaning: 'Cleansing the mirror of my mind with the dust of the lotus feet of the Guru, I describe the pure glory of Raghuvara, which bestows the four fruits of life.', benefits: ['Saturn dosha relief', 'Courage & strength', 'Protection from evil', 'Removes obstacles'], chantCount: '7× or 40 days', bestTime: 'Tuesday & Saturday', audio: '/assets/mantras/HanumanChalisa.mp3' },
  { id: 'lakshmi', name: 'Lakshmi Mantra', deity: 'Lakshmi · Venus', planet: 'Venus', color: '#8a3a6a', accent: '#e890c8', image: '/assets/mantras/mantra-img/Lakshmi.png', beejMantra: 'ॐ श्रीं ह्रीं महालक्ष्म्यै नमः', sanskrit: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः', transliteration: 'Om Shreem Hreem Shreem | Kamale Kamalalaye Praseed Praseed | Om Shreem Hreem Shreem | Mahalakshmyai Namah', meaning: 'O Lotus-dwelling Goddess Lakshmi, I invoke your grace. Grant me prosperity, abundance, and the divine blessings of Venus.', benefits: ['Wealth & prosperity', 'Venus energy boost', 'Love & harmony', 'Luxury & beauty'], chantCount: '108×', bestTime: 'Friday evening', audio: '/assets/mantras/Maha Laxmi Mantra _ Om Shreem Mahalakshmiyei Namaha _ 108 Times _ Fast.mp3' },
];

// ─── HANUMAN CHALISA LYRICS (Spotify-style) ──────────────────────────────
const hanumanLyrics = [
  "श्री गुरु चरण सरोज रज, निज मनु मुकुरु सुधारि।",
  "वरनऊँ रघुवर विमल जसु, जो दायकु फल चारि॥",
  "बुद्धिहीन तनु जानिके, सुमिरो पवन कुमार।",
  "बल बुद्धि विद्या देहु मोहिं, हरहु कलेश विकार॥",
  "जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर॥",
  "राम दूत अतुलित बल धामा। अंजनिपुत्र पवन सुत नामा॥",
  "महावीर बिक्रम बजरंगी। कुमति निवार सुमिति के संगी॥",
  "कंचन वरन विराज सुवेसा। कानन कुंडल कुंचित केसा॥",
  "हाथ बज्र औ ध्वजा विराजै। काँधे मूँज जनेऊ साजै॥",
  "शंकर सुवन केसरीनंदन। तेज प्रताप महा जग बंदन॥",
  "विद्यावान गुनी अति चातुर। राम काज करिबे को आतुर॥",
  "प्रभु चरित्र सुनिबे को रसिया। राम लखन सीता मन बसिया॥",
  "सूक्ष्म रूप धरि सियहि दिखावा। बिकट रूप धरि लंक जरावा॥",
  "भीम रूप धरि असुर सँहारे। रामचंन्द्र के काज सँवारे॥",
  "लाय सजीवन लखन जियाये। श्री रघुबीर हरषि उर लाये॥",
  "रघुपति कीन्ही बहुत बड़ाई। तुम मम प्रिय भरत सम भाई॥",
  "सहस बदन तुम्हरो जस गावैं। अस कहि श्रीपति कंठ लगावैं॥",
  "सनकादिक ब्रह्मादि मुनीसा। नारद सारद सहित अहीसा॥",
  "जम कुबेर दिगपाल जहाँ ते। कबि कोबिद कहि सके कहाँ ते॥",
  "तुम उपकार सुग्रीवहिं कीन्हा। राम मिलाय राज पद दीन्हा॥",
  "तुम्हरो मंत्र विभीषन माना। लंकेश्वर भये सब जग जाना॥",
  "जुग सहस्त्र जोजन पर भानू। लील्यो ताहि मधुर फल जानू॥",
  "प्रभु मुद्रिका मेलि मुख माहीं। जलधि लाँघि गये अचरज नाहीं॥",
  "दुर्गम काज जगत के जेते। सुगम अनुग्रह तुम्हरे तेते॥",
  "राम दुआरे तुम रखवारे। होत न आज्ञा बिनु पैसारे॥",
  "सब सुख लहैं तुम्हारी सरना। तुम रच्छक काहू को डर ना॥",
  "आपन तेज सम्हारो आपै। तीनों लोक हाँक तें काँपै॥",
  "भूत पिसाच निकट नहिं आवै। महावीर जब नाम सुनावैं॥",
  "नासै रोग हरै सब पीरा। जपत निरंतर हनुमत बीरा॥",
  "संकट तें हनुमान छुड़ावै। मन क्रम वचन ध्यान जो लावै॥",
  "सब पर राम तपस्वीं राजा। तिन के काज सकल तुम साजा॥",
  "और मनोरथ जो कोई लावै। सोइ अमित जीवन फल पावै॥",
  "चारों जुग परताप तुम्हारा। है परसिद्ध जगत उजियारा॥",
  "साधु संत के तुम रखबारे। असुर निकंदन राम दुलारे॥",
  "अष्ट सिद्धि नौ निधि के दाता। अस बर दीन जानकी माता॥",
  "राम रसायन तुम्हरे पासा। सदा रहो रघुपति के दासा॥",
  "तुम्हरे भजन राम को पावै। जनम जनम के दुख बिसरावै॥",
  "अंत काल रघुबर पुर जाई। जहाँ जन्म हरि भक्त कहाई॥",
  "और देवता चित्त न धरई। हनुमत सेइ सर्ब सुख करई॥",
  "संकट कटै मिटै सब पीरा। जो सुमिरैं हनुमत बलबीरा॥",
  "जै जै जै हनुमान गोसाईं। कृपा करहु गुरू देव की नाईं॥",
  "जो सत बार पाठ कर कोई। छूटहि बन्दि महासुख होई॥",
  "जो यह पढै हनुमान चलीसा। होय सिद्धि साखी गौरीसा॥",
  "तुलसीदास सदा हरि चेरा। कीजै नाथ हृदय महँ डेरा॥",
  "पवनतनय संकट हरन, मंगल मूरति रुप।",
  "राम लखन सीता सहित, हृदय बसहु सुर भूप॥",
];

// ─── LYRICS SCROLL VIEW ───────────────────────────────────────────────────
function LyricsScroll({ mantra }) {
  return (
    <div style={{ padding: '20px 26px', position: 'relative', zIndex: 1 }}>
      <p style={{
        fontFamily: "'Glacial Indifference', serif",
        fontSize: 8.5,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: mantra.accent,
        margin: '0 0 14px',
        transition: 'color 0.8s ease',
      }}>Chalisa · Lyrics</p>

      <div
        style={{
          height: 340,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: `${mantra.color}40 transparent`,
          paddingRight: 6,
        }}
      >
        {hanumanLyrics.map((line, i) => (
          <p
            key={i}
            style={{
              fontFamily: "'Noto Serif Devanagari', serif",
              fontSize: 15,
              lineHeight: 2,
              color: 'rgba(245,237,224,0.75)',
              margin: '0 0 2px',
              padding: '2px 0',
              borderBottom: i % 2 === 1 ? `1px solid ${mantra.color}15` : 'none',
            }}
          >
            {line}
          </p>
        ))}
      </div>

      <p style={{
        fontFamily: "'Glacial Indifference', serif",
        fontSize: 9,
        letterSpacing: '0.14em',
        color: 'rgba(255,255,255,0.18)',
        textAlign: 'right',
        margin: '8px 0 0',
      }}>
        {hanumanLyrics.length} lines · scroll to read
      </p>
    </div>
  );
}

// ─── PARALLAX (original) ──────────────────────────────────────────────────
function ParallaxImages() {
  const stoneRef = useRef(null);
  const crystalRef = useRef(null);
  useEffect(() => {
    gsap.to(stoneRef.current, { y: 240, rotation: 150, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.5 } });
    gsap.to(crystalRef.current, { y: -200, rotation: -100, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.9 } });
  }, []);
  return (
    <>
      <div ref={stoneRef} style={{ position: 'fixed', top: 50, right: -20, width: 230, height: 230, pointerEvents: 'none', zIndex: 2, willChange: 'transform' }}>
        <img src="/assets/stone.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.85 }} />
      </div>
      <div ref={crystalRef} style={{ position: 'fixed', top: '44%', left: -35, width: 290, height: 290, pointerEvents: 'none', zIndex: 2, willChange: 'transform' }}>
        <img src="/assets/beigecrystal.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.78 }} />
      </div>
    </>
  );
}

// ─── SCROLL MARQUEE (original) ────────────────────────────────────────────
function ScrollMarquee({ color }) {
  const trackRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(trackRef.current, { x: '0%' }, { x: '-50%', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.5 } });
  }, []);
  const items = ['Hanuman Chalisa', 'ॐ', 'Navagraha', 'ॐ', 'Lakshmi', 'ॐ', 'Shani', 'ॐ', 'Rahu Ketu', 'ॐ', 'Gayatri', 'ॐ', 'Mahamrityunjaya', 'ॐ'];
  return (
    <div style={{ overflow: 'hidden', padding: '13px 0'}}>
      <div ref={trackRef} style={{ display: 'flex', gap: 44, whiteSpace: 'nowrap', width: 'max-content' }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: item === 'ॐ' ? "'Noto Serif Devanagari', serif" : "'Ibarra Real Nova', serif", fontSize: item === 'ॐ' ? 44 : 40, fontStyle: item === 'ॐ' ? 'normal' : 'normal', color: item === 'ॐ' ? color : '#1a1206', letterSpacing: '0.04em', fontWeight: 300, transition: 'color 0.8s ease' }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── DEITY ORB (original) ─────────────────────────────────────────────────
function DeityOrb({ mantra }) {
  const ring1Ref = useRef(null), ring2Ref = useRef(null), ring3Ref = useRef(null);
  const glowRef = useRef(null), orbFillRef = useRef(null), imgRef = useRef(null);
  const prevIdRef = useRef(mantra.id), rafRef = useRef(null);

  useEffect(() => {
    const rot = { r1: 0, r2: 0, r3: 0 };
    const tick = () => {
      rot.r1 += 0.18; rot.r2 -= 0.11; rot.r3 += 0.07;
      if (ring1Ref.current) ring1Ref.current.style.transform = `rotate(${rot.r1}deg)`;
      if (ring2Ref.current) ring2Ref.current.style.transform = `rotate(${rot.r2}deg)`;
      if (ring3Ref.current) ring3Ref.current.style.transform = `rotate(${rot.r3}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (glowRef.current) gsap.to(glowRef.current, { boxShadow: `0 0 100px 40px ${mantra.color}45, 0 0 200px 90px ${mantra.color}18`, duration: 1.2, ease: 'power2.inOut' });
    if (orbFillRef.current) gsap.to(orbFillRef.current, { background: `radial-gradient(circle at 38% 32%, ${mantra.accent}70 0%, ${mantra.color}55 38%, ${mantra.color}25 65%, ${mantra.color}08 100%)`, duration: 1.0, ease: 'power2.inOut' });
    if (imgRef.current && prevIdRef.current !== mantra.id) gsap.fromTo(imgRef.current, { opacity: 0, scale: 0.85, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    prevIdRef.current = mantra.id;
  }, [mantra]);

  const outerDots = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  const midDots   = Array.from({ length: 10 }, (_, i) => (i * 360) / 10);
  const innerDots = Array.from({ length: 6  }, (_, i) => (i * 360) / 6);

  return (
    <div style={{ position: 'relative', width: 380, height: 430, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={glowRef} style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div ref={ring1Ref} style={{ position: 'absolute', width: 358, height: 358, borderRadius: '50%', border: `1.5px solid ${mantra.color}35`, willChange: 'transform', zIndex: 1 }}>
        {outerDots.map((angle, i) => (<div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: i%4===0?7:i%2===0?5:3, height: i%4===0?7:i%2===0?5:3, borderRadius:'50%', background: i%4===0?mantra.accent:i%2===0?`${mantra.color}90`:`${mantra.color}50`, transform:`rotate(${angle}deg) translateX(178px) translateY(-50%)`, transition:'background 0.8s ease' }} />))}
      </div>
      <div ref={ring2Ref} style={{ position: 'absolute', width: 286, height: 286, borderRadius: '50%', border: `1px dashed ${mantra.color}40`, willChange: 'transform', zIndex: 1 }}>
        {midDots.map((angle, i) => (<div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: i%2===0?5:3, height: i%2===0?5:3, borderRadius:'50%', background: i%2===0?`${mantra.accent}85`:`${mantra.color}65`, transform:`rotate(${angle}deg) translateX(142px) translateY(-50%)`, transition:'background 0.8s ease' }} />))}
      </div>
      <div ref={ring3Ref} style={{ position: 'absolute', width: 228, height: 228, borderRadius: '50%', border: `1px solid ${mantra.accent}30`, willChange: 'transform', zIndex: 1 }}>
        {innerDots.map((angle, i) => (<div key={i} style={{ position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius:'50%', background:`${mantra.accent}90`, transform:`rotate(${angle}deg) translateX(113px) translateY(-50%)`, transition:'background 0.8s ease' }} />))}
      </div>
      <div ref={orbFillRef} style={{ position: 'relative', width: 212, height: 212, borderRadius: '50%', border: `2px solid ${mantra.color}60`, boxShadow: `0 0 32px ${mantra.color}35, inset 0 0 28px ${mantra.color}18`, zIndex: 2, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.8s ease, box-shadow 0.8s ease' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 38% 32%, ${mantra.accent}70 0%, ${mantra.color}55 38%, ${mantra.color}25 65%, ${mantra.color}08 100%)`, transition: 'background 0.8s ease', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: `radial-gradient(ellipse at bottom, ${mantra.color}55 0%, transparent 70%)`, borderRadius: '0 0 50% 50%', pointerEvents: 'none', zIndex: 1, transition: 'background 0.8s ease' }} />
        <img ref={imgRef} src={mantra.image} alt={mantra.deity} style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', width: '120%', maxWidth: '900px', height: '200%', objectFit: 'contain', objectPosition: 'center bottom', zIndex: 3, pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

// ─── UNIFIED MANTRA PANEL (replaces 3 disconnected boxes) ────────────────
// One single dark card: player → divider → sanskrit → divider → meaning → divider → benefits
function MantraPanel({ mantra, isPlaying, onToggle, progress, onSeek }) {
  const panelRef = useRef(null);
  const barRef   = useRef(null);

  useEffect(() => {
    gsap.fromTo(panelRef.current, { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' });
  }, [mantra.id]);

  const handleBarClick = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  // thin horizontal rule between sections
  const HR = ({ top = 0, bottom = 0 }) => (
    <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${mantra.color}28 30%, ${mantra.color}28 70%, transparent)`, margin: `${top}px 0 ${bottom}px`, transition: 'background 0.8s ease' }} />
  );

  return (
    <div ref={panelRef} style={{
      background: 'rgba(52,33,10,0.96)',
      border: `2px dashed ${mantra.color}`,
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: `0 2px 8px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)`,
      transition: 'border-color 0.8s ease',
      position: 'relative',
    }}>

      {/* Ambient top-right glow */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${mantra.color}18 0%, transparent 70%)`, pointerEvents: 'none', transition: 'background 0.8s ease', zIndex: 0 }} />

      {/* Ghost OM watermark spanning full card */}
      <div style={{ position: 'absolute', right: -4, top: '18%', fontFamily: "'Noto Serif Devanagari', serif", fontSize: 180, color: `${mantra.color}20`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', zIndex: 0, transition: 'color 0.8s ease' }}>ॐ</div>

      {/* ── 1. PLAYER ──────────────────────────────────────────────── */}
      <div style={{ padding: '24px 26px 20px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: mantra.accent, margin: '0 0 5px', transition: 'color 0.8s ease' }}>Now Playing</p>
            <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 28, fontWeight: 400, color: '#f5ede0', margin: 0, lineHeight: 1.1 }}>{mantra.name}</h3>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', margin: '5px 0 0', textTransform: 'uppercase' }}>{mantra.deity}</p>
          </div>
          <span style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: mantra.accent, background: `${mantra.color}22`, border: `1px solid ${mantra.color}45`, padding: '5px 13px', borderRadius: 20, marginTop: 2, flexShrink: 0, transition: 'all 0.8s ease' }}>{mantra.planet}</span>
        </div>

        {/* Progress bar */}
        <div ref={barRef} onClick={handleBarClick} style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, cursor: 'pointer', marginBottom: 20 }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${mantra.color}, ${mantra.accent})`, borderRadius: 2, transition: 'width 0.1s linear' }} />
          <div style={{ position: 'absolute', top: '50%', left: `${progress * 100}%`, transform: 'translate(-50%,-50%)', width: 11, height: 11, borderRadius: '50%', background: mantra.accent, boxShadow: `0 0 8px ${mantra.accent}80`, transition: 'left 0.1s linear, background 0.8s ease' }} />
        </div>

        {/* Controls row: meta left, play center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 3px' }}>Chant Count</p>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 20, color: mantra.accent, margin: 0, transition: 'color 0.8s ease' }}>{mantra.chantCount}</p>
          </div>
          <button onClick={onToggle}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{ width: 54, height: 54, borderRadius: '50%', background: `linear-gradient(135deg, ${mantra.color}, ${mantra.accent})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 28px ${mantra.color}55`, transition: 'transform 0.15s ease, box-shadow 0.8s ease, background 0.8s ease', flexShrink: 0 }}>
            {isPlaying
              ? <svg width={18} height={18} viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="4" height="12" rx="1" fill="white" /><rect x="11" y="3" width="4" height="12" rx="1" fill="white" /></svg>
              : <svg width={18} height={18} viewBox="0 0 18 18" fill="none"><path d="M5 3.5L15 9L5 14.5V3.5Z" fill="white" /></svg>}
          </button>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', margin: '0 0 3px' }}>Best Time</p>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 14, color: '#d4c4a0', margin: 0, lineHeight: 1.3 }}>{mantra.bestTime}</p>
          </div>
        </div>
      </div>

      <HR top={0} bottom={0} />

{/* ── 2. SANSKRIT / LYRICS ──────────────────────────────────────── */}
{mantra.id === 'hanuman-chalisa' ? (
  <LyricsScroll mantra={mantra} />
) : (
  <div style={{ padding: '20px 26px', position: 'relative', zIndex: 1 }}>
    <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: mantra.accent, margin: '0 0 10px', transition: 'color 0.8s ease' }}>Sanskrit</p>
    <p style={{ fontFamily: "'Noto Serif Devanagari', serif", fontSize: 'clamp(14px,1.9vw,17px)', color: '#f5ede0', lineHeight: 2, margin: 0 }}>{mantra.sanskrit}</p>
    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0 14px' }} />
    <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', margin: '0 0 8px' }}>Transliteration</p>
    <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 15, color: '#d4c4a0', lineHeight: 1.85, margin: 0 }}>{mantra.transliteration}</p>
  </div>
)}

      <HR top={0} bottom={0} />

      {/* ── 3. MEANING ─────────────────────────────────────────────── */}
      <div style={{ padding: '20px 26px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: mantra.color, margin: '0 0 8px', transition: 'color 0.8s ease' }}>Meaning</p>
        <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 16, color: 'rgba(255,255,255,0.52)', lineHeight: 1.85, margin: 0 }}>{mantra.meaning}</p>
      </div>

      <HR top={0} bottom={0} />

      {/* ── 4. COSMIC BENEFITS ─────────────────────────────────────── */}
      <div style={{ padding: '18px 26px 24px', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: mantra.color, margin: '0 0 12px', transition: 'color 0.8s ease' }}>Cosmic Benefits</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {mantra.benefits.map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: mantra.accent, fontSize: 9, flexShrink: 0, transition: 'color 0.8s ease' }}>✦</span>
              <span style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 15, color: 'rgba(255,255,255,0.48)', lineHeight: 1.3 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MANTRA CARD (original, minor border-radius tweak) ────────────────────
function MantraCard({ mantra, isActive, isPlaying, onClick, onPlay }) {
  const cardRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: cardRef.current, start: 'top 88%' } });
  }, []);

  return (
<div
  ref={cardRef}
  onClick={onClick}
  style={{
    position: 'relative',
    background: isActive ? 'rgba(18,12,3,1)' : 'rgba(253,248,240,0.9)',
    backdropFilter: 'blur(20px)',
    border: isActive
      ? `1.5px solid ${mantra.color}65`
      : '1px solid rgba(200,185,160,0.3)',
    borderRadius: 20,
    padding: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isActive
      ? `0 8px 40px ${mantra.color}20`
      : '0 2px 8px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  }}
>
  {isActive && (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        background: `linear-gradient(180deg, ${mantra.color}, ${mantra.accent})`,
        borderRadius: '6px 0 0 6px',
      }}
    />
  )}

  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 9,
    }}
  >
    {/* 🔥 CLEAN IMAGE CONTAINER */}
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent', // removed oval bg
        border: `1px solid ${mantra.color}30`,
      }}
    >
      <img
        src={mantra.image}
        alt={mantra.deity}
        style={{
          width: '75%',
          height: '75%',
          objectFit: 'contain',
        }}
      />
    </div>

    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontFamily: "'Glacial Indifference', sans-serif",
          fontSize: 8,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isActive ? mantra.accent : mantra.color,
          margin: '0 0 3px',
          transition: 'color 0.3s ease',
        }}
      >
        {mantra.deity}
      </p>

      <h3
        style={{
          fontFamily: "'Ibarra Real Nova', serif",
          fontSize: 17,
          fontWeight: 400,
          color: isActive ? '#f5ede0' : '#1a1206',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {mantra.name}
      </h3>
    </div>
  
        <button onClick={(e) => { e.stopPropagation(); onPlay(); }} style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: isActive && isPlaying ? `linear-gradient(135deg, ${mantra.color}, ${mantra.accent})` : `${mantra.color}18`, border: `1px solid ${mantra.color}45`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
          {isActive && isPlaying
            ? <svg width={11} height={11} viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="3.5" height="10" rx="1" fill="white" /><rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="white" /></svg>
            : <svg width={11} height={11} viewBox="0 0 14 14" fill="none"><path d="M4 2.5L12 7L4 11.5V2.5Z" fill={isActive ? mantra.accent : mantra.color} /></svg>}
        </button>
      </div>
      <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 11, color: isActive ? 'rgba(255,255,255,0.35)' : '#8a7060', margin: '0 0 9px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {mantra.transliteration.split('|')[0].trim()}…
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {mantra.benefits.slice(0, 2).map(b => (
          <span key={b} style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 7.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: isActive ? mantra.accent : mantra.color, background: isActive ? `${mantra.color}20` : `${mantra.color}10`, border: `1px solid ${mantra.color}25`, padding: '3px 8px', borderRadius: 20 }}>{b}</span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────
export default function MantrasPage() {
  const [active, setActive]       = useState(mantras[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const audioRef   = useRef(null);
  const activeRef  = useRef(active);
  const headingRef = useRef(null);
  activeRef.current = active;

  useEffect(() => {
    gsap.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;
    const onEnded      = () => { setIsPlaying(false); setProgress(0); };
    const onTimeUpdate = () => { if (audio.duration) setProgress(audio.currentTime / audio.duration); };
    const onError      = (e) => console.warn('Audio error:', audio.error, e);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('error', onError);
    audio.src = audioSrc(mantras[0].audio);
    audio.load();
    return () => { audio.pause(); audio.removeEventListener('ended', onEnded); audio.removeEventListener('timeupdate', onTimeUpdate); audio.removeEventListener('error', onError); audio.src = ''; };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause(); audio.src = audioSrc(active.audio); audio.load();
    setIsPlaying(false); setProgress(0);
  }, [active.id]);

  const handleToggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setIsPlaying(true)).catch(err => console.warn('Play blocked:', err));
    else { audio.pause(); setIsPlaying(false); }
  }, []);

  const handleSeek = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio) return;
    const doSeek = () => { if (audio.duration) { audio.currentTime = pct * audio.duration; setProgress(pct); } };
    audio.readyState >= 1 ? doSeek() : audio.addEventListener('loadedmetadata', doSeek, { once: true });
  }, []);

  const handleSelect = useCallback((m) => setActive(m), []);
  const handleCardPlay = useCallback((mantra) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeRef.current.id === mantra.id) { handleToggle(); return; }
    audio.pause(); audio.src = audioSrc(mantra.audio); audio.load();
    setProgress(0); setActive(mantra);
    audio.addEventListener('canplay', () => audio.play().then(() => setIsPlaying(true)).catch(() => {}), { once: true });
  }, [handleToggle]);

  return (
    <div style={{ minHeight: '100vh', backgroundImage: "url('/assets/Mantra-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', position: 'relative' }}>

      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* HERO */}
        <div style={{ textAlign: 'center', padding: '72px 32px 0' }}>
          <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
            Vedic Mantra Sadhana
            <span style={{ display: 'block', width: 32, height: 1, background: '#b8860b' }} />
          </p>
          <div ref={headingRef}>
            <h1 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 300, color: '#1a1206', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.01em' }}>Sacred <b style={{ color: '#b8860b' }}>Mantras</b></h1>
            <h1 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 'clamp(38px,6vw,72px)', fontWeight: 300, color: '#1a1206', lineHeight: 1, marginBottom: 20, letterSpacing: '-0.01em' }}>of the <b style={{ color: active.accent, transition: 'color 0.8s ease' }}>Cosmos</b></h1>
          </div>
          <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 17, color: '#9a7b6a', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Ancient Vedic sound vibrations aligned to the nine planetary forces. Each mantra carries the resonance of its ruling deity — chant with devotion to harmonize your cosmic energy.
          </p>
        </div>

        <ScrollMarquee color={active.color} />

        {/* ORB + PANEL */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'start' }}>
          {/* Left — sticky orb */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'sticky', top: 40 }}>
            <DeityOrb mantra={active} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: active.accent, marginBottom: 4, transition: 'color 0.8s ease' }}>Currently Selected</p>
              <h2 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 26, fontWeight: 400, color: '#1a1206', margin: 0 }}>{active.name}</h2>
              <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 14, color: '#9a8060', margin: '4px 0 0' }}>{active.deity}</p>
            </div>
          </div>

          {/* Right — ONE unified panel */}
          <MantraPanel mantra={active} isPlaying={isPlaying} onToggle={handleToggle} progress={progress} onSeek={handleSeek} />
        </div>

        {/* MANTRA GRID */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', whiteSpace: 'nowrap' }}>All Mantras</p>
            <div style={{ flex: 1, height: 1, background: 'rgba(184,134,11,0.2)' }} />
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 14, color: '#9a8060', whiteSpace: 'nowrap' }}>{mantras.length} sacred hymns</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {mantras.map((m) => (
              <MantraCard key={m.id} mantra={m} isActive={active.id === m.id} isPlaying={isPlaying && active.id === m.id} onClick={() => handleSelect(m)} onPlay={() => handleCardPlay(m)} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '0 32px 80px' }}>
          <div style={{ display: 'inline-block',  padding: '40px 48px', backdropFilter: 'blur(10px)', maxWidth: 560 }}>
            <p style={{ fontFamily: "'Glacial Indifference', sans-serif", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b8860b', marginBottom: 10 }}>✦ Personalized Sadhana</p>
            <h3 style={{ fontFamily: "'Ibarra Real Nova', serif", fontSize: 28, fontWeight: 400, color: '#1a1206', marginBottom: 12, lineHeight: 1.2 }}>Which Mantra is <em style={{ color: '#b8860b' }}>Right for You?</em></h3>
            <p style={{ fontFamily: "'Glacial Indifference', serif", fontSize: 15, color: '#6b5a40', lineHeight: 1.75, marginBottom: 20 }}>Our Vedic astrologers will analyze your birth chart and prescribe the exact mantras, japa count, and timing aligned to your planetary placements.</p>
            <button style={{ background: 'black', color: 'white', fontFamily: "'Glacial Indifference', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', border: '2px dashed rgba(201,169,110,0.65)', borderRadius: 0, cursor: 'pointer' }}>Book Mantra Consultation</button>
          </div>
        </div>

      </div>
    </div>
  );
}