import { useState, useEffect, useRef } from "react";
import { useBooking } from "../components/BookingContext";


const H    = "'Ibarra Real Nova', serif";
const B    = "'Glacial Indifference', sans-serif";
const GOLD = "#c9a96e";
const DARK = "#0d0a06";

/* Navbar top-bar (38px) + nav row (112px) = 150px */
const NAV_H = 150;

const remedies = [
  { planet: "Saturn",  symbol: "♄", img: "/assets/lovelogos/planets/saturn.png",  text: "Feed black dogs or crows. Donate black sesame on Saturdays. Pour mustard oil on a peepal tree." },
  { planet: "Rahu",    symbol: "☊", img: "/assets/lovelogos/planets/rahu.png",    text: "Feed stray dogs. Offer coal or coconut in flowing water. Wear Hessonite (Gomed) as prescribed." },
  { planet: "Ketu",    symbol: "☋", img: "/assets/lovelogos/planets/Ketu.png",    text: "Feed spotted dogs. Donate blankets to the needy. Keep a dog at home to absorb Ketu's influence." },
  { planet: "Mars",    symbol: "♂", img: "/assets/lovelogos/planets/mars.png",    text: "Feed chapatis with jaggery to monkeys. Donate red lentils on Tuesdays. Plant a red flower tree." },
  { planet: "Jupiter", symbol: "♃", img: "/assets/lovelogos/planets/jupiter.png", text: "Respect elders and teachers daily. Donate yellow items on Thursdays. Keep gold or yellow objects at home." },
  { planet: "Venus",   symbol: "♀", img: "/assets/lovelogos/planets/venus.png",   text: "Donate white items on Fridays. Treat women with sincere respect. Feed white cows." },
  { planet: "Mercury", symbol: "☿", img: "/assets/lovelogos/planets/mercury.png", text: "Donate green items on Wednesdays. Feed green grass to cows. Respect sisters and maternal aunts." },
  { planet: "Sun",     symbol: "☉", img: "/assets/lovelogos/planets/sun.png",     text: "Offer water to the Sun at sunrise daily. Donate wheat or copper on Sundays. Serve father figures." },
  { planet: "Moon",    symbol: "☽", img: "/assets/lovelogos/planets/moon.png",    text: "Keep silver objects at home. Fast on Mondays. Donate milk or rice to the needy." },
];

export default function LalKitab() {
  /* 0 = book closed | 1 = book open | 2 = content panel up */
  const [phase, setPhase]  = useState(0);
  const lastWheel          = useRef(0);
  const touchStartY        = useRef(null);
  const phaseRef           = useRef(0);
  const transitioning      = useRef(false);
  const { openBooking } = useBooking();   /* blocks extra scroll during animation */
  phaseRef.current         = phase;

  /* ── body scroll lock (phases 0 & 1) ── */
  useEffect(() => {
    document.body.style.overflow = phase < 2 ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  /* ── non-passive wheel — preventDefault blocks page scroll ── */
  useEffect(() => {
    const onWheel = (e) => {
      if (phaseRef.current >= 2) return;
      e.preventDefault();
      if (transitioning.current) return;       /* lock during animation */
      const now = Date.now();
      if (now - lastWheel.current < 400) return;
      lastWheel.current = now;
      transitioning.current = true;
      setTimeout(() => { transitioning.current = false; }, 1600); /* full animation window */
      if (e.deltaY > 0) setPhase(p => Math.min(p + 1, 2));
      if (e.deltaY < 0) setPhase(p => Math.max(p - 1, 0));
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  /* ── touch ── */
  useEffect(() => {
    const onStart = (e) => { if (phaseRef.current < 2) touchStartY.current = e.touches[0].clientY; };
    const onEnd   = (e) => {
      if (touchStartY.current == null || phaseRef.current >= 2) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 50) { touchStartY.current = null; return; }
      if (!transitioning.current) {
        transitioning.current = true;
        setTimeout(() => { transitioning.current = false; }, 1600);
        if (dy > 0) setPhase(p => Math.min(p + 1, 2));
        else        setPhase(p => Math.max(p - 1, 0));
      }
      touchStartY.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
    };
  }, []);

  const sectionH = `calc(100vh - ${NAV_H}px)`;

  return (
    <>
      <style>{`
        @keyframes lk-pulse  { 0%,100%{opacity:.45} 50%{opacity:1} }
        @keyframes lk-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes lk-twinkle{ 0%,100%{opacity:.12;transform:scale(.7)} 50%{opacity:.55;transform:scale(1.1)} }
      `}</style>

      <div style={{
        position: "relative", width: "100%", height: sectionH, overflow: "hidden",
        backgroundImage: "url('/assets/Mantra-bg.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>

        {/* ── subtle vignette ── */}

        {/* ══════════════════════════════════════════════════════════
            BOOK SCENE  — visible during phases 0 AND 1
            BUG WAS HERE: was "phase < 1" which hid everything on
            first scroll. Correct: "phase < 2".
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          opacity:       phase < 2 ? 1 : 0,   /* ← fixed: was phase < 1 */
          pointerEvents: phase < 2 ? "auto" : "none",
          transition:    "opacity .7s ease",
        }}>

          {/* ── Book cover ── */}
          <div
            style={{
              perspective: 1200, width: 260, height: 340,
              position: "relative", zIndex: 2,
              cursor: phase === 0 ? "pointer" : "default",
              pointerEvents: phase === 0 ? "auto" : "none",
              /* fade cover out once it has fully swung past viewer (after ~0.9s) */
              opacity:    phase === 0 ? 1 : 0,
              transition: "opacity 0.25s ease 0.85s",
            }}
            onClick={() => phase === 0 && setPhase(1)}
          >
            {/* rotating inner: origin = spine (left edge) */}
            <div style={{
              width: "100%", height: "100%",
              transformStyle: "preserve-3d",
              transformOrigin: "left center",
              transition: "transform 1.1s cubic-bezier(.19,1,.22,1)",
              transform: phase >= 1
                ? "rotateY(-165deg) rotateX(4deg)"
                : "rotateY(0deg)    rotateX(4deg)",
            }}>
              {/* spine */}
              <div style={{ position:"absolute",left:-20,top:0,width:20,height:"100%",background:"#3d0808",borderRadius:"5px 0 0 5px",transform:"rotateY(-90deg)",transformOrigin:"right center" }} />

              {/* front cover — disappears past 90° via backfaceVisibility */}
              <div style={{
                position:"absolute",inset:0,
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,
                background:"linear-gradient(160deg,#9b2020,#6b0f0f)",
                borderRadius:"3px 10px 10px 3px",
                border:"2px solid #5a0d0d",
                boxShadow:"4px 6px 32px rgba(0,0,0,.55), inset -8px 0 18px rgba(0,0,0,.4)",
                backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
              }}>
                <div style={{ position:"absolute",inset:12,border:"1px solid rgba(201,169,110,.35)",borderRadius:5,pointerEvents:"none" }} />
                <div style={{ width:128,height:1,background:"linear-gradient(90deg,transparent,#d4a030,transparent)" }} />
                <div style={{ fontFamily:H,fontSize:22,color:"#e8c060",letterSpacing:2 }}>लाल किताब</div>
                <div style={{ fontFamily:H,fontWeight:700,fontSize:28,letterSpacing:".18em",color:"#f5d080",textShadow:"0 2px 10px rgba(0,0,0,.6)" }}>LAL KITAB</div>
                <div style={{ fontFamily:B,fontSize:9,letterSpacing:".42em",textTransform:"uppercase",color:GOLD,opacity:.85 }}>The Red Book</div>
                <div style={{ width:128,height:1,background:"linear-gradient(90deg,transparent,#d4a030,transparent)" }} />
                <div style={{ fontFamily:B,fontSize:10,letterSpacing:".1em",color:"#8a6020" }}>Practical Remedies of the Stars</div>
              </div>
            </div>

            {/* pages edge */}
            <div style={{ position:"absolute",top:6,right:-12,width:14,height:"calc(100% - 12px)",background:"repeating-linear-gradient(90deg,#f5edd8 0,#f5edd8 2px,#e0d0a0 3px,#e0d0a0 4px)",borderRadius:"0 3px 3px 0",pointerEvents:"none" }} />
          </div>

          {/* ── Open pages — appear at phase 1 (BUG WAS: phase === 2) ── */}
          <div style={{
            position:"absolute",
            width:"min(560px, 88vw)", height:310,
            left:"50%", top:"50%", transform:"translate(-50%,-50%)",
            display:"flex",
            zIndex: 1,
            opacity:       phase === 1 ? 1 : 0,   /* ← fixed: was phase === 2 */
            pointerEvents: "none",
            transition:    "opacity 0.45s ease 0.5s",  /* fade in after cover swings away */
          }}>
            {/* left page */}
            <div style={{ flex:1,position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",padding:"34px 28px",background:"#fdf6e3",borderRadius:"6px 0 0 6px",borderRight:"2px solid #c8b060",boxShadow:"inset -12px 0 24px rgba(0,0,0,.09), 2px 0 16px rgba(0,0,0,.14)" }}>
              <div style={{ textAlign:"center",fontFamily:H,fontSize:20,color:GOLD,marginBottom:10 }}>✦</div>
              <div style={{ fontFamily:H,fontWeight:600,fontSize:16,marginBottom:10,color:"#8b1a1a" }}>Lal Kitab</div>
              <div style={{ width:"100%",height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,opacity:.5,marginBottom:14 }} />
              <p style={{ fontFamily:B,fontSize:12.5,lineHeight:1.95,color:"#3a2a15",margin:0 }}>
                Written in 19th-century Punjab, the Red Book introduced a revolutionary approach — one focused on actively rewriting fate, not merely reading it.
              </p>
              <p style={{ position:"absolute",bottom:14,left:22,fontFamily:H,fontStyle:"italic",fontSize:10,color:"#a08040",margin:0 }}>i</p>
            </div>
            {/* right page */}
            <div style={{ flex:1,position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",padding:"34px 28px",background:"#fdf6e3",borderRadius:"0 6px 6px 0",boxShadow:"inset 12px 0 24px rgba(0,0,0,.07), -2px 0 16px rgba(0,0,0,.14)" }}>
              <div style={{ textAlign:"center",fontFamily:H,fontSize:20,color:GOLD,marginBottom:10 }}>❧</div>
              <div style={{ fontFamily:H,fontWeight:600,fontSize:16,marginBottom:10,color:"#8b1a1a" }}>The Principle</div>
              <div style={{ width:"100%",height:1,background:`linear-gradient(90deg,transparent,${GOLD},transparent)`,opacity:.5,marginBottom:14 }} />
              <p style={{ fontFamily:B,fontSize:12.5,lineHeight:1.95,color:"#3a2a15",margin:0 }}>
                Karmic debts (rin) can be repaid through conscious symbolic actions — freeing you from malefic planetary grip. The universe doesn't require suffering to heal.
              </p>
              <p style={{ position:"absolute",bottom:14,right:22,fontFamily:H,fontStyle:"italic",fontSize:10,color:"#a08040",margin:0 }}>ii</p>
            </div>
          </div>

          {/* ── Scroll hint ── */}
          <div style={{ position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:7,pointerEvents:"none",zIndex:3 }}>
            <p style={{ fontFamily:B,fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"rgba(248,218,148,.92)",textShadow:"0 1px 8px rgba(0,0,0,.8)",animation:"lk-pulse 2.2s ease-in-out infinite",margin:0 }}>
              {phase === 0 ? "Scroll to open" : "Scroll to reveal"}
            </p>
            <span style={{ fontSize:24,color:"rgba(248,210,110,.65)",textShadow:"0 1px 8px rgba(0,0,0,.7)",animation:"lk-bounce 1.7s ease-in-out infinite",lineHeight:1 }}>⌄</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CONTENT PANEL — phase 2
            Slides up from below. Matches site aesthetic.
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          overflowY: "auto",
          background: "#fdf9f3",
          transform:  phase === 2 ? "translateY(0)" : "translateY(100%)",
          transition: "transform .95s cubic-bezier(.19,1,.22,1)",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 40px 60px" }}>

            {/* ── Eyebrow ── */}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:18 }}>
              <div style={{ width:40,height:1,background:`rgba(201,169,110,.45)` }} />
              <span style={{ fontFamily:B,fontSize:10,letterSpacing:".25em",textTransform:"uppercase",color:GOLD,opacity:.85 }}>Vedic Remedies</span>
              <div style={{ width:40,height:1,background:`rgba(201,169,110,.45)` }} />
            </div>

            {/* ── Heading ── */}
            <h1 style={{ fontFamily:H,fontWeight:400,fontSize:"clamp(34px,5vw,70px)",color:DARK,textAlign:"center",margin:"0 0 6px",lineHeight:1.05,letterSpacing:"-.01em" }}>
              Lal Kitab
            </h1>
            <p style={{ fontFamily:H,fontStyle:"italic",fontSize:20,color:GOLD,textAlign:"center",margin:"0 0 14px" }}>
              लाल किताब — Remedies of the Stars
            </p>
            <div style={{ width:160,height:1,margin:"0 auto 18px",background:`linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
            <p style={{ fontFamily:B,textAlign:"center",fontSize:13,lineHeight:2,color:"#6b5a40",maxWidth:540,margin:"0 auto 44px" }}>
              Each planet carries a karmic debt. These time-honoured remedies — drawn from the everyday world — dissolve obstructions and awaken dormant blessings.
            </p>

            {/* ── Remedy Cards ── */}
            <div className="mobile-col-1" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:22,marginBottom:44 }}>
              {remedies.map(r => (
                <div
                  key={r.planet}
                  style={{
                    position:"relative", background:"#ffffff",
                    border:"1px solid rgba(201,169,110,.2)",
                    padding:"38px 32px 34px",
                    overflow:"hidden",
                    transition:"transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s, border-color .3s",
                    cursor:"default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 18px 52px rgba(28,20,13,.1)"; e.currentTarget.style.borderColor="rgba(201,169,110,.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="rgba(201,169,110,.2)"; }}
                >
                  {/* top gold rule */}
                  {/* corner star */}
                  <div style={{ position:"absolute",top:14,right:16,fontFamily:H,fontSize:13,color:GOLD,opacity:.28,lineHeight:1 }}>✦</div>

                  {/* planet name row */}
                  <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:18 }}>
                    <div style={{ width:58,height:58,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {r.img
                        ? <img src={r.img} alt={r.planet} style={{ width:"100%",height:"100%",objectFit:"contain" }} />
                        : <span style={{ fontFamily:H,fontSize:36,color:GOLD,lineHeight:1,opacity:.8 }}>{r.symbol}</span>
                      }
                    </div>
                    <div>
                      <div style={{ fontFamily:B,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:GOLD,marginBottom:3,opacity:.75 }}>Planet</div>
                      <div style={{ fontFamily:H,fontWeight:600,fontSize:22,color:DARK,lineHeight:1.1 }}>{r.planet}</div>
                    </div>
                  </div>

                  {/* divider */}
                  <div style={{ height:1,background:`linear-gradient(90deg,rgba(201,169,110,.4),transparent)`,marginBottom:18 }} />

                  {/* remedy text */}
                  <p style={{ fontFamily:B,fontSize:13.5,lineHeight:1.95,color:"#5a4a30",margin:0 }}>{r.text}</p>
                </div>
              ))}
            </div>

            {/* ── Kundali box — styled like other page callout blocks ── */}
            <div style={{
              background: DARK, color:"#f5f0e8",
              padding:"36px 40px", marginBottom:32,
              textAlign:"center", position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
              <div style={{ fontFamily:B,fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:GOLD,marginBottom:14,opacity:.85 }}>
                Lal Kitab Remedies
              </div>
              <p style={{ fontFamily:B,fontSize:13.5,lineHeight:2,color:"rgba(245,240,232,.75)",marginBottom:10 }}>
                Our experts prepare a dedicated Lal Kitab Kundali mapping your karmic debts (rin), sleeping planets, year-by-year forecasts, and personalised annual remedy prescriptions.
              </p>
              <p style={{ fontFamily:H,fontStyle:"italic",fontSize:14,color:GOLD,margin:0,opacity:.8 }}>
                Especially powerful for those facing sudden reversals, ancestral karma, or limited results from traditional remedies.
              </p>
            </div>

            {/* ── CTA ── */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <button
              onClick={() => openBooking()}
                style={{ fontFamily:B,fontSize:10,letterSpacing:".22em",textTransform:"uppercase",padding:"16px 52px",background:"black",border:"2px dashed rgba(201,169,110,0.65)",color:"white",borderRadius:0,cursor:"pointer",transition:"opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity=".78"}
                onMouseLeave={e => e.currentTarget.style.opacity="1"}
              >
                Book a Reading →
              </button>
            </div>

            {/* ── close ── */}
            <div style={{ textAlign:"center" }}>
              <button
                
                style={{ fontFamily:B,fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:`rgba(201,169,110,.45)`,background:"none",border:"none",cursor:"pointer" }}
                onClick={() => setPhase(1)}
              >
                ↑ close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
