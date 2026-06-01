import { useState, useRef, useEffect } from 'react'
import { useBooking } from './BookingContext'

/* ── API config ────────────────────────────────────────────────────────────── */
const ASTRO_EP   = '/api/astro/chart'
const ASTRO_KEY  = import.meta.env.VITE_FREEAASTRO_API_KEY
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_EP  = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`
const FREE_LIMIT = 3
const gold  = '#c9a96e'
const panel = '#1a1410'

/* ── City coordinates ──────────────────────────────────────────────────────── */
const CITIES = {
  'delhi':{'lat':28.6139,'lng':77.2090},'new delhi':{'lat':28.6139,'lng':77.2090},
  'mumbai':{'lat':19.0760,'lng':72.8777},'bombay':{'lat':19.0760,'lng':72.8777},
  'bangalore':{'lat':12.9716,'lng':77.5946},'bengaluru':{'lat':12.9716,'lng':77.5946},
  'hyderabad':{'lat':17.3850,'lng':78.4867},'chennai':{'lat':13.0827,'lng':80.2707},
  'kolkata':{'lat':22.5726,'lng':88.3639},'calcutta':{'lat':22.5726,'lng':88.3639},
  'pune':{'lat':18.5204,'lng':73.8567},'ahmedabad':{'lat':23.0225,'lng':72.5714},
  'jaipur':{'lat':26.9124,'lng':75.7873},'lucknow':{'lat':26.8467,'lng':80.9462},
  'chandigarh':{'lat':30.7333,'lng':76.7794},'patna':{'lat':25.5941,'lng':85.1376},
  'bhopal':{'lat':23.2599,'lng':77.4126},'nagpur':{'lat':21.1458,'lng':79.0882},
  'indore':{'lat':22.7196,'lng':75.8577},'surat':{'lat':21.1702,'lng':72.8311},
  'varanasi':{'lat':25.3176,'lng':82.9739},'amritsar':{'lat':31.6340,'lng':74.8723},
  'agra':{'lat':27.1767,'lng':78.0081},'jodhpur':{'lat':26.2389,'lng':73.0243},
  'kochi':{'lat':9.9312,'lng':76.2673},'coimbatore':{'lat':11.0168,'lng':76.9558},
  'guwahati':{'lat':26.1445,'lng':91.7362},'dehradun':{'lat':30.3165,'lng':78.0322},
  'bhubaneswar':{'lat':20.2961,'lng':85.8245},'visakhapatnam':{'lat':17.6868,'lng':83.2185},
  'thiruvananthapuram':{'lat':8.5241,'lng':76.9366},'madurai':{'lat':9.9252,'lng':78.1198},
  'noida':{'lat':28.5355,'lng':77.3910},'gurgaon':{'lat':28.4595,'lng':77.0266},
  'gurugram':{'lat':28.4595,'lng':77.0266},'kanpur':{'lat':26.4499,'lng':80.3319},
  'prayagraj':{'lat':25.4358,'lng':81.8463},'allahabad':{'lat':25.4358,'lng':81.8463},
  'shimla':{'lat':31.1048,'lng':77.1734},'faridabad':{'lat':28.4089,'lng':77.3178},
  'meerut':{'lat':28.9845,'lng':77.7064},'srinagar':{'lat':34.0837,'lng':74.7973},
  'ranchi':{'lat':23.3441,'lng':85.3096},'raipur':{'lat':21.2514,'lng':81.6296},
}
const cityCoords = c => {
  const key = c.trim().toLowerCase()
  for (const [name, coords] of Object.entries(CITIES)) {
    if (key.includes(name) || name.includes(key)) return { name, ...coords }
  }
  return null
}

/* ── Parsers ───────────────────────────────────────────────────────────────── */
const MONTHS = { jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12,
  january:1,february:2,march:3,april:4,june:6,july:7,august:8,september:9,october:10,november:11,december:12 }

function parseDob(t) {
  let m
  m = t.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/)
  if (m) return { year:+m[1], month:+m[2], day:+m[3] }
  m = t.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if (m) return { day:+m[1], month:+m[2], year:+m[3] }
  m = t.match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/i)
  if (m && MONTHS[m[2].toLowerCase()]) return { day:+m[1], month:MONTHS[m[2].toLowerCase()], year:+m[3] }
  m = t.match(/([a-z]+)\s+(\d{1,2})[,\s]+(\d{4})/i)
  if (m && MONTHS[m[1].toLowerCase()]) return { day:+m[2], month:MONTHS[m[1].toLowerCase()], year:+m[3] }
  return null
}
function parseTob(t) {
  let m
  m = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i)
  if (m) {
    let h=+m[1], mn=+m[2]
    if (m[3].toLowerCase()==='pm' && h<12) h+=12
    if (m[3].toLowerCase()==='am' && h===12) h=0
    return { hour:h, minute:mn }
  }
  m = t.match(/(\d{1,2}):(\d{2})/)
  if (m) return { hour:+m[1], minute:+m[2] }
  return null
}

/* ── Parse all birth info from a single message ───────────────────────────── */
function parseBirthInfo(text) {
  const dob  = parseDob(text)
  const tob  = parseTob(text)
  const city = cityCoords(text)
  return { dob, tob, city }
}

/* ── Chart formatting ──────────────────────────────────────────────────────── */
const nkStr = n => !n ? '' : typeof n==='string' ? n : (n.name||n.nakshatra_name||n.nak||'')
const P_EMOJI = { Sun:'☀️',Moon:'🌙',Mars:'♂️',Mercury:'☿',Jupiter:'♃',Venus:'♀️',Saturn:'♄',Rahu:'☊',Ketu:'☋',Ascendant:'⬆️' }

function buildSummary(planets, dobStr, tobStr, city) {
  const find = n => planets.find(p=>p.name===n)
  const asc=find('Ascendant'), sun=find('Sun'), moon=find('Moon')
  const rows = []
  if (asc)  rows.push(`Ascendant (Lagna): ${asc.sign}`)
  if (sun)  rows.push(`Sun: ${sun.sign}, House ${sun.house}, Nakshatra: ${nkStr(sun.nakshatra)}`)
  if (moon) rows.push(`Moon: ${moon.sign}, House ${moon.house}, Nakshatra: ${nkStr(moon.nakshatra)}`)
  rows.push('')
  ;['Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'].forEach(name => {
    const p=find(name)
    if (p) rows.push(`${name}: ${p.sign}, House ${p.house}${p.retrograde?' (Retrograde)':''}`)
  })
  rows.push(`\nDOB: ${dobStr}  Time: ${tobStr}  Place: ${city}`)
  return rows.join('\n')
}

function formatChart(planets, dobStr, tobStr, city) {
  const pad=(s,n)=>String(s).padEnd(n)
  return [
    '✦ Janma Kundli — Vedic Birth Chart',
    `📅 ${dobStr}   🕐 ${tobStr}   📍 ${city}`,
    '',
    'PLANETARY POSITIONS  (Sidereal · Lahiri)',
    '─'.repeat(54),
    `${pad('Planet',14)} ${pad('Sign',13)} ${pad('House',7)} Nakshatra`,
    '─'.repeat(54),
    ...planets.map(p =>
      `${pad((P_EMOJI[p.name]||'·')+' '+p.name+(p.retrograde?' ℞':''),14)} ${pad(p.sign,13)} ${pad(p.house,7)} ${nkStr(p.nakshatra)}`
    ),
    '─'.repeat(54),
    '',
    'Your chart is ready! Ask me anything — career, love,',
    'health, marriage, current Dasha, or spiritual path. 🪐',
  ].join('\n')
}

/* ── Gemini Q&A ────────────────────────────────────────────────────────────── */
async function callGemini(astroSummary, question) {
  const res = await fetch(GEMINI_EP, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      contents:[{role:'user',parts:[{text:
        `You are a calm, emotionally intelligent Vedic astrologer. Respond naturally like a conversation, not bullet points.

Use ONLY this birth chart to answer the question — do not ask for more details:
${astroSummary}

Question: ${question}

Answer in 2–3 focused, conversational paragraphs. Be specific about planetary placements.`
      }]}],
      generationConfig:{temperature:0.82,maxOutputTokens:2048,thinkingConfig:{thinkingBudget:0}},
    })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || `Gemini ${res.status}`)
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

/* ── Reading count ─────────────────────────────────────────────────────────── */
function getCount() {
  try { const r=JSON.parse(localStorage.getItem('vs_rc')||'{}'); return r.day===new Date().toDateString()?r.c||0:0 } catch{return 0}
}
function bumpCount() {
  try { const c=getCount()+1; localStorage.setItem('vs_rc',JSON.stringify({c,day:new Date().toDateString()})); return c } catch{return 1}
}

/* ── Bubble messages ───────────────────────────────────────────────────────── */
const BUBBLE_MSGS = [
  '🌟 Generate your free Kundli now',
  '🔮 Know your planetary positions',
  '✨ Ask about career, love, Dasha',
  '💫 Free Janma Kundli — instant results',
  '☽ Discover your Moon & Ascendant',
]

/* ── UI atoms ──────────────────────────────────────────────────────────────── */
function BotAvatar() {
  return <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#2a1f14,#1a1410)',border:`1px solid rgba(201,169,110,0.4)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:gold}}>✦</div>
}
function TypingDots() {
  return (
    <div style={{display:'flex',gap:4,padding:'10px 14px',alignItems:'center'}}>
      {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:'50%',background:gold,animation:`chatDot 1.2s ${i*0.2}s ease-in-out infinite`}}/>)}
    </div>
  )
}
function AttentionBubble({msg,onOpen,onClose}) {
  return (
    <div style={{position:'absolute',bottom:66,right:0,animation:'bubbleIn 0.4s cubic-bezier(.22,1,.36,1)',zIndex:1}}>
      <div onClick={onOpen} style={{background:'linear-gradient(135deg,#2a1f12,#1e1810)',border:'1px solid rgba(201,169,110,0.4)',borderRadius:'14px 14px 4px 14px',padding:'10px 14px 10px 12px',cursor:'pointer',boxShadow:'0 8px 28px rgba(0,0,0,0.45)',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:8}} onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,169,110,0.7)'} onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,169,110,0.4)'}>
        <span style={{fontFamily:"'Glacial Indifference',sans-serif",fontSize:12.5,color:'#f5ede0'}}>{msg}</span>
        <button onClick={e=>{e.stopPropagation();onClose()}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',fontSize:14,lineHeight:1,padding:'0 0 0 4px',flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>×</button>
      </div>
      <div style={{position:'absolute',bottom:-7,right:20,width:14,height:8,background:'linear-gradient(135deg,#2a1f12,#1e1810)',clipPath:'polygon(0 0, 100% 0, 100% 100%)',borderRight:'1px solid rgba(201,169,110,0.4)',borderBottom:'1px solid rgba(201,169,110,0.4)'}}/>
    </div>
  )
}
function BlurredMessage({onBook}) {
  return (
    <div style={{maxWidth:'84%',position:'relative'}}>
      <div style={{padding:'9px 13px',borderRadius:'13px 13px 13px 3px',background:'rgba(255,255,255,0.045)',border:'1px solid rgba(255,255,255,0.06)',fontSize:13,lineHeight:1.75,color:'rgba(255,255,255,0.84)',filter:'blur(5px)',userSelect:'none',pointerEvents:'none'}}>Your Saturn is in a powerful position and the 10th house activation suggests...</div>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,background:'rgba(26,20,16,0.65)',backdropFilter:'blur(2px)',borderRadius:'13px 13px 13px 3px',border:'1px solid rgba(201,169,110,0.25)',padding:16}}>
        <span style={{fontSize:18,color:gold}}>🔒</span>
        <p style={{fontFamily:"'Ibarra Real Nova',serif",fontSize:13,color:'#f5ede0',textAlign:'center',lineHeight:1.5,margin:0}}>Free readings used up today</p>
        <p style={{fontFamily:"'Glacial Indifference',sans-serif",fontSize:11,color:'rgba(255,255,255,0.5)',textAlign:'center',margin:0}}>Unlock Saturn transit · Dasha timeline · Soulmate reading</p>
        <button onClick={onBook} style={{marginTop:4,padding:'8px 20px',borderRadius:7,cursor:'pointer',background:'rgba(201,169,110,0.15)',border:'1px solid rgba(201,169,110,0.5)',color:gold,fontFamily:"'Glacial Indifference',sans-serif",fontSize:11,letterSpacing:1.5,textTransform:'uppercase'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(201,169,110,0.28)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(201,169,110,0.15)'}>Book Expert Session</button>
      </div>
    </div>
  )
}

/* ── Main component ────────────────────────────────────────────────────────── */
export default function AstroChat() {
  const { openBooking } = useBooking()

  const [open,          setOpen]          = useState(false)
  const [msgs,          setMsgs]          = useState([{role:'bot',text:'Namaste 🙏 I\'m Vedic Saar AI.\n\nShare your birth details and I\'ll generate your Janma Kundli and answer anything — career, love, Dasha, spirituality.\n\nWhat would you like to explore?'}])
  const [input,         setInput]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [unread,        setUnread]        = useState(0)
  const [astroSummary,  setAstroSummary]  = useState(null)
  const [readingCount,  setReadingCount]  = useState(getCount)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [bubbleIdx,     setBubbleIdx]     = useState(0)

  // 'collecting' = asked user for all birth details at once
  // 'need_city'  = got DOB+TOB but city not recognised, ask again
  const [kundliStep, setKundliStep] = useState(null)
  const [kundliBuf,  setKundliBuf]  = useState({})

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(()=>{const t=setTimeout(()=>setBubbleVisible(true),4000);return()=>clearTimeout(t)},[])
  useEffect(()=>{
    if(!bubbleVisible) return
    const t=setInterval(()=>setBubbleIdx(i=>(i+1)%BUBBLE_MSGS.length),4000)
    return()=>clearInterval(t)
  },[bubbleVisible])
  useEffect(()=>{if(open){setUnread(0);setBubbleVisible(false);setTimeout(()=>inputRef.current?.focus(),120)}},[open])
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'})},[msgs,loading])

  /* ── Generate kundli via FreeAstro API ── */
  async function generateKundli(dob, tob, cityName, coords) {
    setLoading(true)
    try {
      const res = await fetch(ASTRO_EP, {
        method:'POST',
        headers:{'x-api-key':ASTRO_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({
          year:dob.year, month:dob.month, day:dob.day,
          hour:tob.hour, minute:tob.minute,
          lat:coords.lat, lng:coords.lng,
          city:cityName.trim(),
          ayanamsha:'lahiri', house_system:'whole_sign', node_type:'mean',
        }),
      })
      const raw = await res.text()
      if (!res.ok) throw new Error(`API ${res.status}: ${raw.slice(0,120)}`)
      const data = JSON.parse(raw)
      const rawPlanets = data.planets || []
      const asc = data.ascendant
      const planets = [
        ...(asc ? [{name:'Ascendant',sign:asc.sign,nakshatra:asc.nakshatra,house:1,retrograde:false}] : []),
        ...rawPlanets,
      ]
      const dobStr = `${dob.day}/${dob.month}/${dob.year}`
      const tobStr = `${String(tob.hour).padStart(2,'0')}:${String(tob.minute).padStart(2,'0')}`
      const summary = buildSummary(planets, dobStr, tobStr, cityName)
      setAstroSummary(summary)
      setMsgs(m=>[...m,{role:'bot',text:formatChart(planets,dobStr,tobStr,cityName),mono:true}])
    } catch(e) {
      setMsgs(m=>[...m,{role:'bot',text:`Couldn't generate chart: ${e.message}`}])
    } finally {
      setLoading(false)
    }
  }

  async function send(overrideText) {
    const text = (overrideText || input).trim()
    if (!text || loading) return
    setInput('')
    setBubbleVisible(false)
    setMsgs(m=>[...m,{role:'user',text}])

    /* ── Step 1: collecting all birth details in one message ── */
    if (kundliStep === 'collecting') {
      const { dob, tob, city } = parseBirthInfo(text)
      if (!dob) {
        setMsgs(m=>[...m,{role:'bot',text:"I couldn't find your date of birth in that message.\n\nPlease share all three together, e.g:\n26 April 1997, 10:30 AM, Delhi"}])
        return
      }
      const tobFinal = tob || { hour:12, minute:0 }
      if (!city) {
        setKundliBuf({ dob, tob:tobFinal })
        setKundliStep('need_city')
        setMsgs(m=>[...m,{role:'bot',text:`Got your date of birth ✓\n\nI couldn't recognise the city. Which city were you born in?\n(Try: Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Jaipur, Pune, Kolkata…)`}])
        return
      }
      setKundliStep(null)
      setKundliBuf({})
      await generateKundli(dob, tobFinal, city.name, city)
      return
    }

    /* ── Step 2: just waiting for city name ── */
    if (kundliStep === 'need_city') {
      const city = cityCoords(text)
      if (!city) {
        setMsgs(m=>[...m,{role:'bot',text:`I couldn't find "${text}". Try a major city like Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Jaipur, Pune, or Kolkata.`}])
        return
      }
      const { dob, tob } = kundliBuf
      setKundliStep(null)
      setKundliBuf({})
      await generateKundli(dob, tob, city.name, city)
      return
    }

    /* ── IMPORTANT: check astroSummary BEFORE kundli trigger ──
       Once kundli is generated, every message goes to Gemini.
       We never re-ask for birth details. ── */
    if (astroSummary) {
      if (readingCount >= FREE_LIMIT) {
        setMsgs(m=>[...m,{role:'bot',text:'',blurred:true}])
        return
      }
      setLoading(true)
      try {
        const reply = await callGemini(astroSummary, text)
        const newCount = bumpCount()
        setReadingCount(newCount)
        const left = FREE_LIMIT - newCount
        const footer = left > 0
          ? `\n\n— ${left} free reading${left===1?'':'s'} left today —`
          : `\n\n— Book a session for unlimited insights. —`
        setMsgs(m=>[...m,{role:'bot',text:reply+footer}])
        if (!open) setUnread(u=>u+1)
      } catch(err) {
        setMsgs(m=>[...m,{role:'bot',text:`Couldn't reach AI: ${err.message}`}])
      } finally {
        setLoading(false)
      }
      return
    }

    /* ── Kundli trigger ── */
    const isKundliReq = ['kundli','kundali','birth chart','janam','natal','generate','my chart','reading','create'].some(k=>text.toLowerCase().includes(k))
    if (isKundliReq) {
      setKundliStep('collecting')
      setMsgs(m=>[...m,{role:'bot',text:'Sure! 🔯 Please share your birth details in one message:\n\n• Date of birth (e.g. 26 April 1997)\n• Time of birth (e.g. 10:30 AM) — type "don\'t know" if unsure\n• Place of birth (e.g. Delhi)'}])
      return
    }

    /* ── No kundli yet ── */
    setMsgs(m=>[...m,{role:'bot',text:'I need your Kundli first to give accurate insights.\n\nShare your date of birth, time, and city — or tap the chip below. 🔯'}])
  }

  function onKey(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }
  function handleBook() { setOpen(false); openBooking('Vedic Astrology') }

  const placeholder = kundliStep==='collecting'
    ? 'e.g. 26 April 1997, 10:30 AM, Delhi'
    : kundliStep==='need_city'
    ? 'e.g. Delhi, Mumbai, Bangalore…'
    : astroSummary
    ? 'Ask anything about your chart…'
    : 'Ask about your Kundli or astrology…'

  return (
    <>
      <style>{`
        @keyframes chatDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
        @keyframes chatSlideUp{from{opacity:0;transform:translateY(12px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes bubbleIn{from{opacity:0;transform:translateY(10px) scale(0.92)}to{opacity:1;transform:translateY(0) scale(1)}}
        .chat-panel{animation:chatSlideUp 0.28s cubic-bezier(.22,1,.36,1)}
        .chat-msg{animation:chatSlideUp 0.2s ease}
        .chat-send:hover{background:rgba(201,169,110,0.2)!important}
        .chat-tog:hover{transform:scale(1.08)}
        .chat-chip:hover{background:rgba(201,169,110,0.14)!important;border-color:rgba(201,169,110,0.55)!important}
        .chat-scroll::-webkit-scrollbar{width:3px}
        .chat-scroll::-webkit-scrollbar-thumb{background:rgba(201,169,110,0.2);border-radius:2px}
        textarea.chat-input:focus{outline:none;border-color:rgba(201,169,110,0.4)!important}
      `}</style>

      {open && (
        <div className="chat-panel" style={{position:'fixed',bottom:90,right:24,zIndex:9999,width:'min(400px,calc(100vw - 32px))',height:'min(640px,calc(100vh - 110px))',background:panel,border:'1px solid rgba(201,169,110,0.22)',borderRadius:16,boxShadow:'0 28px 80px rgba(0,0,0,0.6)',display:'flex',flexDirection:'column',overflow:'hidden',fontFamily:"'Glacial Indifference',sans-serif"}}>

          {/* Header */}
          <div style={{padding:'12px 16px',flexShrink:0,borderBottom:'1px solid rgba(201,169,110,0.12)',background:'linear-gradient(90deg,#201a12,#1a1410)',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,borderRadius:'50%',border:`1px solid rgba(201,169,110,0.35)`,background:'rgba(201,169,110,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,color:gold}}>✦</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:"'Ibarra Real Nova',serif",fontSize:15,color:'#fff',letterSpacing:0.3}}>Vedic Saar AI</div>
              <div style={{fontSize:9,color:'rgba(201,169,110,0.6)',letterSpacing:1.2,textTransform:'uppercase'}}>
                Kundli · AI Readings · {FREE_LIMIT-readingCount > 0 ? `${FREE_LIMIT-readingCount} free readings left` : 'Upgrade for more'}
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',fontSize:22,lineHeight:1,padding:'2px 6px',flexShrink:0}} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>×</button>
          </div>

          {/* Messages */}
          <div className="chat-scroll" style={{flex:1,overflowY:'auto',padding:'12px 12px 6px',display:'flex',flexDirection:'column',gap:10,scrollbarWidth:'thin',scrollbarColor:'rgba(201,169,110,0.2) transparent'}}>
            {msgs.map((m,i)=>(
              <div key={i} className="chat-msg" style={{display:'flex',gap:7,alignItems:'flex-end',flexDirection:m.role==='user'?'row-reverse':'row'}}>
                {m.role==='bot' && <BotAvatar/>}
                {m.blurred
                  ? <BlurredMessage onBook={handleBook}/>
                  : <div style={{maxWidth:'84%',padding:'9px 12px',borderRadius:m.role==='user'?'13px 13px 3px 13px':'13px 13px 13px 3px',background:m.role==='user'?'linear-gradient(135deg,rgba(201,169,110,0.16),rgba(201,169,110,0.08))':'rgba(255,255,255,0.045)',border:m.role==='user'?'1px solid rgba(201,169,110,0.28)':'1px solid rgba(255,255,255,0.06)',fontSize:m.mono?10.5:13,lineHeight:1.75,color:m.role==='user'?'#f5ede0':'rgba(255,255,255,0.84)',whiteSpace:'pre-wrap',fontFamily:m.mono?"'Courier New',monospace":undefined}}>{m.text}</div>
                }
              </div>
            ))}

            {loading && (
              <div className="chat-msg" style={{display:'flex',gap:7,alignItems:'flex-end'}}>
                <BotAvatar/>
                <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'13px 13px 13px 3px'}}><TypingDots/></div>
              </div>
            )}

            {/* Initial chips */}
            {msgs.length===1 && !loading && (
              <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:2}}>
                {[
                  {label:'🔯 Generate my Kundli',          action:()=>send('generate my kundli')},
                  {label:'💼 Career & life purpose',        action:()=>send('generate my kundli')},
                  {label:'💍 Love & marriage timing',       action:()=>send('generate my kundli')},
                  {label:'🪐 Current Dasha & its effects',  action:()=>send('generate my kundli')},
                  {label:'📅 Book expert consultation',     action:handleBook},
                ].map((s,i)=>(
                  <button key={i} className="chat-chip" onClick={s.action}
                    style={{background:'rgba(201,169,110,0.06)',border:'1px solid rgba(201,169,110,0.18)',borderRadius:8,padding:'8px 12px',cursor:'pointer',fontFamily:"'Glacial Indifference',sans-serif",fontSize:12.5,color:'rgba(201,169,110,0.88)',textAlign:'left',transition:'background 0.18s,border-color 0.18s'}}
                  >{s.label}</button>
                ))}
              </div>
            )}

            {/* Post-chart question chips */}
            {astroSummary && !loading && msgs[msgs.length-1]?.role==='bot' && !msgs[msgs.length-1]?.blurred && (
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:2}}>
                {[
                  {label:'💼 Career',          q:'What does my chart say about my career and life purpose?'},
                  {label:'💍 Love & marriage',  q:'What does my chart say about love and marriage?'},
                  {label:'🪐 Current Dasha',    q:'What is my current Mahadasha and how is it affecting my life?'},
                  {label:'🧘 Spiritual path',   q:'What does my chart reveal about my spiritual path?'},
                  {label:'💎 Lucky gemstone',   q:'Which gemstone is most beneficial for me?'},
                ].map((c,i)=>(
                  <button key={i} className="chat-chip" onClick={()=>send(c.q)}
                    style={{background:'rgba(201,169,110,0.06)',border:'1px solid rgba(201,169,110,0.18)',borderRadius:20,padding:'6px 12px',cursor:'pointer',fontFamily:"'Glacial Indifference',sans-serif",fontSize:11.5,color:'rgba(201,169,110,0.85)',transition:'background 0.18s,border-color 0.18s'}}
                  >{c.label}</button>
                ))}
              </div>
            )}

            {/* Prompt chip when no chart yet */}
            {!astroSummary && !loading && msgs.length>1 && kundliStep===null && msgs[msgs.length-1]?.role==='bot' && (
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:2}}>
                {[
                  {label:'🔯 Generate my Kundli', action:()=>send('generate my kundli')},
                  {label:'📅 Book expert consultation', action:handleBook},
                ].map((c,i)=>(
                  <button key={i} className="chat-chip" onClick={c.action}
                    style={{background:'rgba(201,169,110,0.06)',border:'1px solid rgba(201,169,110,0.18)',borderRadius:20,padding:'6px 12px',cursor:'pointer',fontFamily:"'Glacial Indifference',sans-serif",fontSize:11.5,color:'rgba(201,169,110,0.85)',transition:'background 0.18s,border-color 0.18s'}}
                  >{c.label}</button>
                ))}
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{padding:'8px 10px',borderTop:'1px solid rgba(201,169,110,0.1)',display:'flex',gap:8,alignItems:'flex-end',flexShrink:0,background:'rgba(0,0,0,0.18)'}}>
            <textarea ref={inputRef} className="chat-input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey}
              placeholder={placeholder} rows={1}
              style={{flex:1,resize:'none',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,169,110,0.16)',borderRadius:10,padding:'9px 12px',color:'#f5ede0',fontSize:13,fontFamily:"'Glacial Indifference',sans-serif",lineHeight:1.5,maxHeight:80,overflowY:'auto',transition:'border-color 0.2s'}}
              onInput={e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,80)+'px'}}/>
            <button className="chat-send" onClick={()=>send()} disabled={!input.trim()||loading}
              style={{width:38,height:38,borderRadius:'50%',flexShrink:0,background:input.trim()&&!loading?'rgba(201,169,110,0.12)':'rgba(255,255,255,0.04)',border:`1px solid ${input.trim()&&!loading?'rgba(201,169,110,0.4)':'rgba(255,255,255,0.07)'}`,cursor:input.trim()&&!loading?'pointer':'default',color:input.trim()&&!loading?gold:'rgba(255,255,255,0.18)',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'}}>➤</button>
          </div>
        </div>
      )}

      {/* FAB + bubble */}
      <div style={{position:'fixed',bottom:24,right:24,zIndex:10000,display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
        {bubbleVisible&&!open&&<AttentionBubble msg={BUBBLE_MSGS[bubbleIdx]} onOpen={()=>{setBubbleVisible(false);setOpen(true)}} onClose={()=>setBubbleVisible(false)}/>}
        <button className="chat-tog" onClick={()=>setOpen(o=>!o)}
          style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,#2e200f,#1a1410)',border:`1.5px solid rgba(201,169,110,${open?0.55:0.38})`,boxShadow:open?'0 8px 30px rgba(0,0,0,0.5)':'0 8px 30px rgba(0,0,0,0.4), 0 0 0 4px rgba(201,169,110,0.07)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.25s cubic-bezier(.22,1,.36,1)',fontSize:22,color:gold,position:'relative'}}
          aria-label="Open Vedic Saar AI chat"
        >
          {open?'×':'✦'}
          {!open&&unread>0&&<div style={{position:'absolute',top:-3,right:-3,width:18,height:18,borderRadius:'50%',background:'#c0392b',color:'#fff',fontSize:10,fontFamily:'sans-serif',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #0f0c09'}}>{unread}</div>}
        </button>
      </div>
    </>
  )
}
