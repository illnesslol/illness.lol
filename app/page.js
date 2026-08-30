'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../components/PageTransition'

const COLORS = {
  bg: '#07070c',
  panel: 'rgba(13,13,20,0.85)',
  border: 'rgba(255,255,255,0.08)',
  indigo: '#6E5BFF',
  indigoSoft: 'rgba(110,91,255,0.15)',
  white: '#ffffff',
  textMuted: 'rgba(255,255,255,0.45)',
  textFaint: 'rgba(255,255,255,0.25)',
}

function Capsule({ size = 1, style }) {
  // two-tone pill capsule glyph — indigo cap / white body
  return (
    <svg width={64 * size} height={26 * size} viewBox="0 0 64 26" style={style}>
      <defs>
        <clipPath id={`clip-${size}`}>
          <rect x="1" y="1" width="62" height="24" rx="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${size})`}>
        <rect x="1" y="1" width="31" height="24" fill="#6E5BFF" />
        <rect x="32" y="1" width="31" height="24" fill="#ffffff" />
      </g>
      <rect x="1" y="1" width="62" height="24" rx="12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <ellipse cx="16" cy="8" rx="8" ry="2.5" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

export default function HomePage() {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [liveCount, setLiveCount] = useState(148204)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)

    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(data.loggedIn)
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))

    const tick = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 2)), 3000)

    // ---- floating capsule particle field, fixed behind entire page ----
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const pills = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      w: Math.random() * 26 + 18,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.002,
      speed: Math.random() * 0.15 + 0.05,
      drift: Math.random() * 0.3 - 0.15,
      alpha: Math.random() * 0.08 + 0.03,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pills.forEach(p => {
        p.y -= p.speed
        p.x += Math.sin(p.y * 0.01) * p.drift * 0.4
        p.rot += p.spin
        if (p.y < -40) { p.y = canvas.height + 40; p.x = Math.random() * canvas.width }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha
        const h = p.w * 0.42
        const r = h
        ctx.beginPath()
        ctx.moveTo(-p.w / 2 + r, -h)
        ctx.arcTo(p.w / 2, -h, p.w / 2, h, r)
        ctx.arcTo(p.w / 2, h, -p.w / 2, h, r)
        ctx.arcTo(-p.w / 2, h, -p.w / 2, -h, r)
        ctx.arcTo(-p.w / 2, -h, p.w / 2, -h, r)
        ctx.closePath()
        ctx.fillStyle = '#8b7bff'
        ctx.fill()
        ctx.restore()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      clearInterval(tick)
    }
  }, [])

  const navLinks = [
    ['Discord', 'https://discord.gg/illness'],
    ['Leaderboard', '/leaderboard'],
    ['Pricing', '/pricing'],
  ]

  const stats = [
    ['148K+', 'profiles claimed'],
    ['2.1M+', 'link clicks routed'],
    ['40+', 'countries repping it'],
  ]

  const features = [
    ['Custom cursors', 'Swap the pointer for something that actually matches your page.'],
    ['Animated backgrounds', 'Video, GIF, or particle backgrounds — set the mood on load.'],
    ['Audio player', 'Drop a track that plays the second someone lands on your page.'],
    ['Badges & flexes', 'Show off premium status, join dates, and earned badges.'],
    ['Real-time analytics', 'See views, clicks, and where your traffic is actually coming from.'],
    ['Custom aliases', 'Point more than one name at the same profile.'],
  ]

  const faqs = [
    ['Is illness.lol free?', 'Yes — the free plan covers a fully working profile: links, socials, and basic customization. Premium unlocks the rest.'],
    ['Can I change my username later?', 'You get one free alias change. After that, aliases are a premium feature.'],
    ['Is my data safe?', 'Everything is served over encrypted connections and moderated — no ads, no data resale.'],
    ['How fast can I set this up?', 'Under a minute. Claim a name, add your links, pick a theme — you\u2019re live.'],
  ]

  return (
    <div style={{
      background: COLORS.bg, fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative', color: '#fff',
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        @keyframes blink { 0%, 45% { opacity: 1 } 50%, 100% { opacity: 0 } }
        @keyframes floatCap { 0%, 100% { transform: translateY(0) rotate(-8deg) } 50% { transform: translateY(-18px) rotate(-2deg) } }
        @keyframes bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        html { scroll-behavior: smooth; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, filter: 'blur(1px)' }} />

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, display: 'flex', alignItems: 'center', gap: '2px',
        background: COLORS.panel, border: `0.5px solid ${COLORS.border}`, borderRadius: '100px',
        padding: '8px 8px 8px 20px', backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.6)',
      }}>
        <TransitionLink href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', marginRight: '10px', textDecoration: 'none' }}>
          <Capsule size={0.42} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
            illness.lol
          </span>
        </TransitionLink>

        {navLinks.map(([label, href]) => (
          <TransitionLink key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{
            fontSize: '13.5px', color: COLORS.textMuted, textDecoration: 'none',
            padding: '8px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = COLORS.indigoSoft }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.background = 'transparent' }}
          >
            {label}
          </TransitionLink>
        ))}

        {authChecked && loggedIn && (
          <TransitionLink href="/dashboard" style={{
            fontSize: '13.5px', color: COLORS.textMuted, textDecoration: 'none',
            padding: '8px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = COLORS.indigoSoft }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.background = 'transparent' }}
          >
            Dashboard
          </TransitionLink>
        )}

        <div style={{ width: '0.5px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />

        <TransitionLink href="/login" style={{
          fontSize: '13.5px', color: COLORS.textMuted, textDecoration: 'none',
          padding: '8px 16px', borderRadius: '100px', whiteSpace: 'nowrap', transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = COLORS.textMuted}
        >
          Log in
        </TransitionLink>
        <TransitionLink href="/signup" style={{
          fontSize: '13.5px', color: '#07070c', textDecoration: 'none',
          padding: '10px 22px', borderRadius: '100px', whiteSpace: 'nowrap',
          background: '#fff', fontWeight: 600,
          boxShadow: '0 0 20px rgba(110,91,255,0.35)', transition: 'box-shadow 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(110,91,255,0.6)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(110,91,255,0.35)'}
        >
          Sign up
        </TransitionLink>
      </nav>

      {/* HERO */}
      <section style={{
        position: 'relative', zIndex: 1, minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 60px', textAlign: 'center',
      }}>
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease', maxWidth: '720px',
        }}>
          <Capsule size={1.5} style={{ marginBottom: '28px', animation: 'floatCap 5s ease-in-out infinite', filter: 'drop-shadow(0 10px 40px rgba(110,91,255,0.45))' }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
            color: 'rgba(110,91,255,0.9)', letterSpacing: '0.03em',
            border: `0.5px solid rgba(110,91,255,0.3)`, borderRadius: '100px',
            padding: '6px 14px', marginBottom: '26px', background: COLORS.indigoSoft,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6E5BFF', boxShadow: '0 0 8px #6E5BFF', animation: 'blink 1.4s infinite' }} />
            {liveCount.toLocaleString()} profiles claimed
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '58px', fontWeight: 700, color: '#fff',
            letterSpacing: '-2px', lineHeight: 1.08, marginBottom: '18px',
          }}>
            Take one link<br />daily.
          </h1>

          <p style={{ fontSize: '12.5px', fontFamily: "'JetBrains Mono', monospace", color: COLORS.textFaint, marginBottom: '18px', letterSpacing: '0.02em' }}>
            side effects may include: more followers, more clout, more clicks
          </p>

          <p style={{ fontSize: '16px', color: COLORS.textMuted, lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 44px' }}>
            illness.lol packs every link, badge, and vibe you've got into one profile —
            customizable down to the pixel, prescribed by no one but you.
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', background: COLORS.panel,
            border: `0.5px solid ${COLORS.border}`, borderRadius: '100px', padding: '7px 7px 7px 22px',
            backdropFilter: 'blur(16px)', maxWidth: '480px', margin: '0 auto',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'rgba(110,91,255,0.7)', whiteSpace: 'nowrap' }}>
              illness.lol/
            </span>
            <input
              type="text" placeholder="yourname" value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: '#fff', fontFamily: "'JetBrains Mono', monospace", padding: '6px 10px' }}
            />
            <TransitionLink href="/signup" style={{
              fontSize: '13.5px', fontWeight: 600, color: '#07070c', textDecoration: 'none',
              padding: '11px 24px', borderRadius: '100px', background: '#fff', whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(110,91,255,0.3)', transition: 'box-shadow 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(110,91,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(110,91,255,0.3)'}
            >
              Claim →
            </TransitionLink>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', animation: 'bob 2.4s ease-in-out infinite' }}>
          <span style={{ fontSize: '11px', color: COLORS.textFaint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>SCROLL</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', gap: '64px',
        flexWrap: 'wrap', padding: '0 24px 100px',
      }}>
        {stats.map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', fontWeight: 700, color: '#fff' }}>{n}</div>
            <div style={{ fontSize: '13px', color: COLORS.textMuted, marginTop: '4px' }}>{l}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '980px', margin: '0 auto', padding: '0 24px 120px' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '34px', fontWeight: 700, textAlign: 'center', marginBottom: '10px' }}>
          Full dosage of features
        </h2>
        <p style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: '15px', marginBottom: '56px' }}>
          Everything a profile needs, none of the bloat.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {features.map(([title, desc]) => (
            <div key={title} style={{
              background: COLORS.panel, border: `0.5px solid ${COLORS.border}`, borderRadius: '20px',
              padding: '26px', transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(110,91,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ width: '34px', height: '10px', borderRadius: '100px', background: 'linear-gradient(90deg, #6E5BFF, #fff)', marginBottom: '18px' }} />
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{title}</div>
              <div style={{ fontSize: '13.5px', color: COLORS.textMuted, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '980px', margin: '0 auto', padding: '0 24px 120px', display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 320px', maxWidth: '420px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, marginBottom: '14px' }}>
            See it before you take it
          </h2>
          <p style={{ color: COLORS.textMuted, fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
            Your profile updates live as you edit — theme, links, badges, all of it.
            What you see in the dashboard is exactly what people get.
          </p>
          <TransitionLink href="/signup" style={{
            display: 'inline-block', fontSize: '13.5px', fontWeight: 600, color: '#07070c',
            textDecoration: 'none', padding: '12px 26px', borderRadius: '100px', background: '#fff',
          }}>
            Build your profile →
          </TransitionLink>
        </div>

        <div style={{
          flex: '0 1 300px', background: COLORS.panel, border: `0.5px solid ${COLORS.border}`,
          borderRadius: '28px', padding: '32px 24px', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #6E5BFF, #fff)',
          }} />
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px' }}>yourname</div>
          <div style={{ fontSize: '11px', color: COLORS.textFaint, marginBottom: '20px' }}>illness.lol/yourname</div>
          {['Twitch', 'YouTube', 'Discord'].map(l => (
            <div key={l} style={{
              background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${COLORS.border}`,
              borderRadius: '100px', padding: '10px', fontSize: '13px', marginBottom: '8px', color: 'rgba(255,255,255,0.7)',
            }}>{l}</div>
          ))}
        </div>
      </section>

      {/* PRICING TEASER */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '820px', margin: '0 auto', padding: '0 24px 120px' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, textAlign: 'center', marginBottom: '44px' }}>
          Pick your dose
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: COLORS.panel, border: `0.5px solid ${COLORS.border}`, borderRadius: '24px', padding: '32px' }}>
            <div style={{ fontSize: '13px', color: COLORS.textMuted, marginBottom: '6px' }}>Free</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, marginBottom: '18px' }}>$0</div>
            <div style={{ fontSize: '13.5px', color: COLORS.textMuted, lineHeight: 2 }}>
              Custom links & socials<br />Basic theming<br />Profile analytics
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(160deg, rgba(110,91,255,0.15), rgba(13,13,20,0.85))',
            border: '0.5px solid rgba(110,91,255,0.4)', borderRadius: '24px', padding: '32px',
          }}>
            <div style={{ fontSize: '13px', color: '#a89bff', marginBottom: '6px' }}>Premium</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, marginBottom: '18px' }}>illness.lol/pricing</div>
            <div style={{ fontSize: '13.5px', color: COLORS.textMuted, lineHeight: 2 }}>
              Everything in Free, plus<br />Custom cursors & audio<br />Aliases, badges & more
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '0 24px 140px' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '30px', fontWeight: 700, textAlign: 'center', marginBottom: '36px' }}>
          Questions, answered
        </h2>
        {faqs.map(([q, a], i) => (
          <div key={q} style={{ borderBottom: `0.5px solid ${COLORS.border}`, padding: '18px 4px' }}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', color: '#fff', fontSize: '15px', fontWeight: 500,
                cursor: 'pointer', padding: 0, fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              {q}
              <span style={{ color: COLORS.textFaint, fontSize: '18px' }}>{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && (
              <p style={{ fontSize: '13.5px', color: COLORS.textMuted, lineHeight: 1.7, marginTop: '12px' }}>{a}</p>
            )}
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 1, borderTop: `0.5px solid ${COLORS.border}`,
        padding: '36px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px',
        alignItems: 'center', justifyContent: 'space-between', maxWidth: '980px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Capsule size={0.34} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700 }}>illness.lol</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {navLinks.map(([label, href]) => (
            <TransitionLink key={label} href={href} style={{ fontSize: '13px', color: COLORS.textMuted, textDecoration: 'none' }}>
              {label}
            </TransitionLink>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: COLORS.textFaint }}>© {new Date().getFullYear()} illness.lol</div>
      </footer>
    </div>
  )
}