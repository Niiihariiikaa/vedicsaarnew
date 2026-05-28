import { useState, useEffect } from 'react'

const gold  = '#c9a96e'
const dark  = '#1a1410'
const cream = '#fdfcf8'

function reduceNum(n) {
  while (n > 9) n = String(n).split('').reduce((a, c) => a + Number(c), 0)
  return n
}
function getBirthNumber(dateStr) {
  return reduceNum(parseInt(dateStr.split('-')[2], 10))
}
function getDestinyNumber(dateStr) {
  return reduceNum(dateStr.replace(/-/g, '').split('').reduce((a, c) => a + Number(c), 0))
}

const NUM_DATA = {
  1: { birthTitle:'The Pioneer',      birthDesc:'Natural leader with an independent spirit. You carry an innate drive to initiate and innovate, rarely content to follow another\'s path.',        destinyTitle:'The Pioneer Path',      destinyDesc:'Your life purpose is to stand alone, lead boldly, and carve new trails. Independence and originality are your karmic assignments.' },
  2: { birthTitle:'The Peacemaker',   birthDesc:'Sensitive, intuitive, and deeply cooperative. Your strength lies in diplomacy and your ability to sense what others feel before they speak.',      destinyTitle:'The Diplomat\'s Path',  destinyDesc:'You are here to foster peace, build partnerships, and master patience. Your soul lesson is trust and cooperation.' },
  3: { birthTitle:'The Creator',      birthDesc:'Expressive, optimistic, and charming. Words and art flow through you naturally — your joy is contagious and your imagination boundless.',          destinyTitle:'The Creative Path',     destinyDesc:'Self-expression and joy are your dharma. Your karmic purpose is to uplift others through communication, art, and authentic voice.' },
  4: { birthTitle:'The Builder',      birthDesc:'Disciplined, reliable, and methodical. You lay foundations others stand on, driven by a need to create lasting, tangible results.',               destinyTitle:'The Builder\'s Path',   destinyDesc:'You came to build systems, structures, and stability. Discipline and persistence are the karmic tools of your soul\'s journey.' },
  5: { birthTitle:'The Explorer',     birthDesc:'Versatile, restless, and freedom-loving. Change doesn\'t unsettle you — it energises you; routine feels like a cage.',                          destinyTitle:'The Freedom Path',      destinyDesc:'Your soul chose a life of change, travel, and expansion. The lesson is to find freedom within, not just around you.' },
  6: { birthTitle:'The Nurturer',     birthDesc:'Responsible, compassionate, and harmony-seeking. You are the one people lean on, carrying an instinctive need to care and protect.',             destinyTitle:'The Caregiver\'s Path', destinyDesc:'Responsibility, love, and service define your karmic journey. You are here to nurture, heal, and create beautiful harmony.' },
  7: { birthTitle:'The Seeker',       birthDesc:'Analytical, introspective, and spiritual. Beneath your quiet surface runs a deep river of questions about life, truth, and the unseen.',         destinyTitle:'The Spiritual Path',    destinyDesc:'Wisdom, solitude, and inner mastery are your destiny. Your soul came to understand the mysteries beneath the surface of life.' },
  8: { birthTitle:'The Achiever',     birthDesc:'Ambitious, powerful, and results-driven. Material mastery comes naturally to you; you understand the language of effort and reward.',             destinyTitle:'The Executive\'s Path', destinyDesc:'Power, abundance, and achievement are your karmic curriculum. You are here to master both the material and spiritual worlds.' },
  9: { birthTitle:'The Humanitarian', birthDesc:'Idealistic, empathetic, and wise. You carry a soul-level understanding that life is larger than any one person\'s story.',                       destinyTitle:'The Humanitarian Path', destinyDesc:'Your destiny is to serve humanity and embody compassion. You are a soul completing a long and magnificent journey.' },
}

export default function NumerologyWidget() {
  const [visible, setVisible] = useState(false)  // main popup
  const [mini,    setMini]    = useState(false)   // pill after dismiss
  const [dob,     setDob]     = useState('')
  const [result,  setResult]  = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('nw_seen')) {
      setMini(true)
      return
    }
    const t = setTimeout(() => {
      setVisible(true)
      sessionStorage.setItem('nw_seen', '1')
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  function calculate() {
    if (!dob) return
    const birthNum   = getBirthNumber(dob)
    const destinyNum = getDestinyNumber(dob)
    const bd = NUM_DATA[birthNum]   || NUM_DATA[9]
    const dd = NUM_DATA[destinyNum] || NUM_DATA[9]
    setResult({ birthNum, destinyNum, birthTitle: bd.birthTitle, birthDesc: bd.birthDesc, destinyTitle: dd.destinyTitle, destinyDesc: dd.destinyDesc })
  }

  function dismiss() { setVisible(false); setMini(true) }
  function reopen()  { setMini(false); setVisible(true) }

  return (
    <>
      <style>{`
        @keyframes nwSlideUp {
          from { opacity:0; transform:translateY(28px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
        @keyframes nwGlow {
          0%,100% { box-shadow: 0 20px 60px rgba(0,0,0,0.32), 0 0 0 1px rgba(201,169,110,0.22), 0 0 40px rgba(201,169,110,0.12); }
          50%     { box-shadow: 0 20px 70px rgba(0,0,0,0.38), 0 0 0 1px rgba(201,169,110,0.45), 0 0 60px rgba(201,169,110,0.22); }
        }
        @keyframes nwPillIn {
          from { opacity:0; transform:translateY(14px) scale(0.9); }
          to   { opacity:1; transform:translateY(0)    scale(1); }
        }
        @keyframes nwBadgePulse {
          0%,100% { transform:scale(1); }
          50%     { transform:scale(1.08); }
        }
        @keyframes nwStarSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        .nw-reveal-btn:hover:not(:disabled) {
          background: #2a2018 !important;
          border-color: rgba(201,169,110,0.8) !important;
          box-shadow: 0 4px 20px rgba(201,169,110,0.2) !important;
        }
        .nw-reveal-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .nw-input:focus { outline:none; border-color:rgba(201,169,110,0.65) !important; box-shadow:0 0 0 3px rgba(201,169,110,0.1) !important; }
        .nw-pill:hover { background:linear-gradient(135deg,#2a2018,#1f1a14) !important; border-color:rgba(201,169,110,0.65) !important; }
        .nw-close-btn:hover { color:${dark} !important; background:rgba(201,169,110,0.12) !important; }
        .nw-scroll::-webkit-scrollbar { width:3px; }
        .nw-scroll::-webkit-scrollbar-thumb { background:rgba(201,169,110,0.25); border-radius:2px; }
      `}</style>

      {/* ── Main popup ── */}
      {visible && (
        <div
          className="nw-scroll"
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 9997,
            width: 'min(340px, calc(100vw - 48px))',
            maxHeight: 'calc(100vh - 48px)',
            overflowY: 'auto',
            borderRadius: 18,
            overflow: 'hidden',
            animation: 'nwSlideUp 0.42s cubic-bezier(.22,1,.36,1), nwGlow 3s 0.5s ease-in-out infinite',
            fontFamily: "'Glacial Indifference', sans-serif",
          }}
        >

          {/* ── Dark header band ── */}
          <div style={{
            background: 'linear-gradient(135deg, #1f1a14 0%, #2e2318 50%, #1a1410 100%)',
            padding: '18px 18px 16px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Corner ornaments */}
            {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h],i) => (
              <span key={i} style={{ position:'absolute',[v]:10,[h]:12,fontSize:7,color:gold,opacity:0.35 }}>✦</span>
            ))}
            {/* Watermark wheel */}
            <img src="/assets/wheel.png" alt="" aria-hidden decoding="async" style={{
              position:'absolute',right:-20,top:'50%',transform:'translateY(-50%)',
              width:110,height:110,objectFit:'contain',opacity:0.06,pointerEvents:'none',
            }}/>

            <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                {/* FREE badge */}
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  background:'rgba(201,169,110,0.15)',
                  border:'1px solid rgba(201,169,110,0.4)',
                  borderRadius:20, padding:'3px 10px',
                  marginBottom:10,
                  animation:'nwBadgePulse 2.4s ease-in-out infinite',
                }}>
                  <span style={{ fontSize:8, color:gold, animation:'nwStarSpin 4s linear infinite', display:'inline-block' }}>✦</span>
                  <span style={{ fontSize:8, letterSpacing:2.5, textTransform:'uppercase', color:gold }}>Free · Instant</span>
                </div>

                <h3 style={{
                  fontFamily: "'Ibarra Real Nova', serif",
                  fontSize: 22, fontWeight: 400, color: cream,
                  lineHeight: 1.2, margin: 0,
                }}>
                  What do your numbers<br/>
                  <em style={{ color:gold }}>say about you?</em>
                </h3>
              </div>

              <button
                className="nw-close-btn"
                onClick={dismiss}
                style={{
                  background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:'50%', width:28, height:28, cursor:'pointer',
                  color:'rgba(255,255,255,0.35)', fontSize:16, lineHeight:1,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'color 0.2s,background 0.2s', flexShrink:0, marginLeft:8,
                }}
              >×</button>
            </div>

            <p style={{ position:'relative', zIndex:1, fontSize:11, color:'rgba(201,169,110,0.6)', letterSpacing:0.3, marginTop:8, marginBottom:0, lineHeight:1.5 }}>
              Enter your date of birth — your Vedic Moolank &amp; Bhagyank are revealed in seconds.
            </p>
          </div>

          {/* ── Cream body ── */}
          <div style={{ background:'linear-gradient(180deg,#fdfcf8,#f7f2e9)', padding:'18px 18px 20px' }}>

            {!result ? (
              <>
                <p style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'rgba(138,126,118,0.7)', marginBottom:10, textAlign:'center' }}>
                  Date of Birth
                </p>
                <input
                  type="date"
                  className="nw-input"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width:'100%', padding:'12px 14px', boxSizing:'border-box',
                    background:'#fff',
                    border:'1.5px solid rgba(201,169,110,0.35)',
                    borderRadius:10, color:dark,
                    fontFamily:"'Glacial Indifference',sans-serif",
                    fontSize:14, colorScheme:'light',
                    transition:'border-color 0.2s,box-shadow 0.2s',
                    marginBottom:12,
                  }}
                />
                <button
                  className="nw-reveal-btn"
                  onClick={calculate}
                  disabled={!dob}
                  style={{
                    width:'100%', padding:'13px',
                    background: dark,
                    border:'1.5px dashed rgba(201,169,110,0.6)',
                    borderRadius:10,
                    color:'#fff',
                    fontFamily:"'Glacial Indifference',sans-serif",
                    fontSize:11, letterSpacing:2.5,
                    textTransform:'uppercase', cursor:'pointer',
                    transition:'background 0.22s,border-color 0.22s,box-shadow 0.22s',
                  }}
                >
                  ✦ Reveal My Numbers
                </button>
                <p style={{ textAlign:'center', fontSize:10, color:'rgba(138,126,118,0.5)', marginTop:10, letterSpacing:0.3 }}>
                  No sign-up · No cost · Pure Vedic numerology
                </p>
              </>
            ) : (
              <>
                {/* Result — two compact rows */}
                {[
                  { num:result.birthNum,   label:'Birth Number · Moolank',     title:result.birthTitle,   desc:result.birthDesc   },
                  { num:result.destinyNum, label:'Destiny Number · Bhagyank',   title:result.destinyTitle, desc:result.destinyDesc },
                ].map((r,i) => (
                  <div key={i} style={{
                    background:'linear-gradient(135deg,#1f1a14,#2a2018)',
                    border:'1px solid rgba(201,169,110,0.25)',
                    borderRadius:12, padding:'14px 16px',
                    marginBottom: i === 0 ? 10 : 0,
                    position:'relative', overflow:'hidden',
                  }}>
                    <div style={{ position:'absolute',inset:5,border:'1px solid rgba(201,169,110,0.08)',borderRadius:8,pointerEvents:'none' }}/>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6, position:'relative', zIndex:1 }}>
                      <span style={{ fontFamily:"'Ibarra Real Nova',serif", fontSize:46, color:gold, lineHeight:1, opacity:0.85, flexShrink:0 }}>{r.num}</span>
                      <div>
                        <p style={{ fontSize:7.5, letterSpacing:2, textTransform:'uppercase', color:'rgba(201,169,110,0.5)', marginBottom:3, fontFamily:"'Glacial Indifference',sans-serif" }}>{r.label}</p>
                        <p style={{ fontFamily:"'Ibarra Real Nova',serif", fontSize:14, color:'#faf8f5', fontStyle:'italic', lineHeight:1.2, margin:0 }}>{r.title}</p>
                      </div>
                    </div>
                    <div style={{ height:1, background:'rgba(201,169,110,0.14)', marginBottom:8, position:'relative', zIndex:1 }}/>
                    <p style={{ fontSize:11.5, color:'rgba(250,248,245,0.68)', lineHeight:1.7, position:'relative', zIndex:1, margin:0, fontFamily:"'Glacial Indifference',sans-serif" }}>{r.desc}</p>
                  </div>
                ))}

                <div style={{ display:'flex', gap:8, marginTop:12 }}>
                  <button
                    onClick={() => { setResult(null); setDob('') }}
                    style={{
                      flex:1, padding:'10px',
                      background:'transparent',
                      border:'1px dashed rgba(26,20,16,0.25)',
                      borderRadius:8, color:'rgba(26,20,16,0.55)',
                      fontFamily:"'Glacial Indifference',sans-serif",
                      fontSize:10, letterSpacing:1.8, textTransform:'uppercase',
                      cursor:'pointer', transition:'border-color 0.2s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,169,110,0.6)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(26,20,16,0.25)'}
                  >Try Another</button>
                  <button
                    onClick={dismiss}
                    style={{
                      flex:1, padding:'10px',
                      background:dark,
                      border:'1px dashed rgba(201,169,110,0.5)',
                      borderRadius:8, color:gold,
                      fontFamily:"'Glacial Indifference',sans-serif",
                      fontSize:10, letterSpacing:1.8, textTransform:'uppercase',
                      cursor:'pointer', transition:'background 0.2s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background='#2a2018'}
                    onMouseLeave={e=>e.currentTarget.style.background=dark}
                  >Close</button>
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* ── Mini pill — shown after dismiss ── */}
      {mini && !visible && (
        <button
          className="nw-pill"
          onClick={reopen}
          style={{
            position:'fixed', bottom:24, left:24, zIndex:9997,
            display:'flex', alignItems:'center', gap:8,
            background:'linear-gradient(135deg,#241c14,#1a1410)',
            border:'1px solid rgba(201,169,110,0.38)',
            borderRadius:30, padding:'10px 16px',
            cursor:'pointer',
            boxShadow:'0 8px 28px rgba(0,0,0,0.38),0 0 20px rgba(201,169,110,0.08)',
            animation:'nwPillIn 0.3s cubic-bezier(.22,1,.36,1)',
            transition:'background 0.2s,border-color 0.2s',
          }}
        >
          <span style={{ fontSize:13, color:gold }}>🔢</span>
          <span style={{ fontFamily:"'Glacial Indifference',sans-serif", fontSize:10, letterSpacing:2, textTransform:'uppercase', color:'rgba(201,169,110,0.85)' }}>Know Your Numbers</span>
        </button>
      )}
    </>
  )
}
