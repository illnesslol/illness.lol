'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../components/PageTransition'

export default function HomePage() {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [liveCount, setLiveCount] = useState(12482)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)

    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(data.loggedIn)
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))

    // gentle live-counter tick, purely cosmetic
    const tick = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 3))
    }, 2400)

    // ---- EKG / monitor canvas ----
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let animId

    // one QRS-shaped heartbeat pulse, sampled as offsets(dx) -> dy
    const pulseShape = (x) => {
      // x in [0,1] across the spike window
      if (x < 0.12) return -x * 6
      if (x < 0.22) return -0.72 + (x - 0.12) * 34   // sharp down (Q)
      if (x < 0.34) return 2.68 - (x - 0.22) * 62     // sharp up (R)
      if (x < 0.46) return -4.76 + (x - 0.34) * 44    // down (S)
      if (x < 0.62) return 0.52 - (x - 0.46) * 3.2     // settle
      if (x < 0.82) return -0.03 - Math.sin((x - 0.62) / 0.2 * Math.PI) * 1.1 // T wave bump
      return 0
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // faint monitor grid
      ctx.strokeStyle = 'rgba(74,255,160,0.035)'
      ctx.lineWidth = 1
      const grid = 42
      for (let x = 0; x < canvas.width; x += grid) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += grid) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }

      // ambient glow blobs (kept quiet, tinted to the new palette)
      const blobs = [
        { x: canvas.width * 0.18, y: canvas.height * 0.22, r: 380, color: 'rgba(74,255,160,' },
        { x: canvas.width * 0.86, y: canvas.height * 0.7, r: 340, color: 'rgba(255,59,78,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.05)'); grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      })

      // scrolling EKG line, one continuous trace
      const baseY = canvas.height * 0.605
      const period = 340 // px between heartbeats
      const speed = 1.35
      t += speed

      ctx.beginPath()
      ctx.lineWidth = 1.8
      ctx.strokeStyle = 'rgba(120,255,180,0.9)'
      ctx.shadowColor = 'rgba(74,255,160,0.8)'
      ctx.shadowBlur = 8

      let first = true
      for (let px = -period; px < canvas.width + period; px += 2) {
        const phase = (px + t) % period
        const local = phase < 0 ? phase + period : phase
        let dy = 0
        if (local < period * 0.28) {
          dy = pulseShape(local / (period * 0.28)) * 14
        } else {
          // idle baseline flicker
          dy = Math.sin((px + t) * 0.02) * 0.6
        }
        const y = baseY + dy
        if (first) { ctx.moveTo(px, y); first = false } else { ctx.lineTo(px, y) }
      }
      ctx.stroke()
      ctx.shadowBlur = 0

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

  return (
    <div style={{
      minHeight: '100vh', background: '#040505',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden', position: 'relative',
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes blink { 0%, 45% { opacity: 1 } 50%, 100% { opacity: 0 } }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <nav style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '2px',
        background: 'rgba(8,10,9,0.85)',
        border: '0.5px solid rgba(74,255,160,0.15)',
        borderRadius: '100px',
        padding: '8px 8px 8px 20px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(74,255,160,0.05) inset',
      }}>
        <TransitionLink href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="illness.lol" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
            illness.lol
          </span>
        </TransitionLink>

        {navLinks.map(([label, href]) => (
          <TransitionLink key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{
            fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(74,255,160,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent' }}
          >
            {label}
          </TransitionLink>
        ))}

        {authChecked && loggedIn && (
          <TransitionLink href="/dashboard" style={{
            fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(74,255,160,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent' }}
          >
            Dashboard
          </TransitionLink>
        )}

        <div style={{ width: '0.5px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />

        <TransitionLink href="/login" style={{
          fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
          padding: '8px 16px', borderRadius: '100px', whiteSpace: 'nowrap',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
        >
          Log in
        </TransitionLink>
        <TransitionLink href="/signup" style={{
          fontSize: '13.5px', color: '#040505', textDecoration: 'none',
          padding: '10px 22px', borderRadius: '100px', whiteSpace: 'nowrap',
          background: '#4affa0', fontWeight: 600,
          boxShadow: '0 0 20px rgba(74,255,160,0.35)',
          transition: 'box-shadow 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(74,255,160,0.6)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(74,255,160,0.35)'}
        >
          Sign up
        </TransitionLink>
      </nav>

      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        maxWidth: '700px', padding: '0 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
          color: 'rgba(74,255,160,0.85)', letterSpacing: '0.04em',
          border: '0.5px solid rgba(74,255,160,0.2)', borderRadius: '100px',
          padding: '6px 14px', marginBottom: '28px', background: 'rgba(74,255,160,0.05)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#4affa0',
            boxShadow: '0 0 8px #4affa0', animation: 'blink 1.4s infinite',
          }} />
          {liveCount.toLocaleString()} spreading right now
        </div>

        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '62px', fontWeight: 800, color: '#fff',
          letterSpacing: '-2px', lineHeight: 1.05, marginBottom: '20px',
          textShadow: '0 0 60px rgba(74,255,160,0.25)',
        }}>
          Go viral.<br />
          <span style={{ color: '#4affa0', textShadow: '0 0 40px rgba(74,255,160,0.5)' }}>
            On purpose.
          </span>
        </h1>

        <p style={{
          fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
          maxWidth: '440px', margin: '0 auto 48px',
        }}>
          One link that carries everything you are — your socials, your drops, your presence.
          Built to be contagious.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(8,10,9,0.85)',
          border: '0.5px solid rgba(74,255,160,0.18)',
          borderRadius: '100px', padding: '7px 7px 7px 22px',
          backdropFilter: 'blur(16px)', maxWidth: '480px', margin: '0 auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(74,255,160,0.05) inset',
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'rgba(74,255,160,0.5)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            illness.lol/
          </span>
          <input
            type="text" placeholder="yourname" value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: '14px', color: '#fff', fontFamily: "'JetBrains Mono', monospace", padding: '6px 10px',
            }}
          />
          <TransitionLink href="/signup" style={{
            fontSize: '13.5px', fontWeight: 600, color: '#040505',
            textDecoration: 'none', padding: '11px 24px',
            borderRadius: '100px', background: '#4affa0', whiteSpace: 'nowrap',
            boxShadow: '0 0 20px rgba(74,255,160,0.3)', transition: 'box-shadow 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 32px rgba(255,59,78,0.5)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(74,255,160,0.3)'}
          >
            Claim →
          </TransitionLink>
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
        color: 'rgba(255,255,255,0.12)', letterSpacing: '0.05em',
      }}>
        illness.lol
      </div>
    </div>
  )
}