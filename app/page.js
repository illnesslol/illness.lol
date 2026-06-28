'use client'

import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2, a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005, twinkle: Math.random() * Math.PI * 2,
    }))

    const shootingStars = []
    let frameCount = 0
    const spawnShooting = () => shootingStars.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 120 + 60, speed: Math.random() * 8 + 6,
      angle: Math.PI / 5, alpha: 1, active: true,
    })

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const blobs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 400, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.85, y: canvas.height * 0.6, r: 350, color: 'rgba(20,50,110,' },
        { x: canvas.width * 0.5, y: canvas.height * 0.85, r: 300, color: 'rgba(80,20,80,' },
        { x: canvas.width * 0.6, y: canvas.height * 0.2, r: 250, color: 'rgba(30,80,100,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.2)'); grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      })
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,220,255,${alpha})`; ctx.fill()
      })
      frameCount++
      if (frameCount % 160 === 0) spawnShooting()
      shootingStars.forEach(s => {
        if (!s.active) return
        s.x += Math.cos(s.angle) * s.speed; s.y += Math.sin(s.angle) * s.speed; s.alpha -= 0.018
        if (s.alpha <= 0) { s.active = false; return }
        const tailX = s.x - Math.cos(s.angle) * s.len, tailY = s.y - Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, `rgba(255,255,255,0)`); grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`)
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#06060f',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', position: 'relative',
    }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* spotlight */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '100vh',
        background: 'conic-gradient(from 270deg at 50% 0%, transparent 70deg, rgba(255,255,255,0.04) 90deg, transparent 110deg)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* navbar */}
      <nav style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '4px',
        background: 'rgba(15,15,25,0.8)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '100px',
        padding: '6px 6px 6px 16px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
      }}>
        {/* logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <img src="/icon.png" alt="illness.lol" style={{ width: '22px', height: '22px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>illness.lol</span>
        </div>

        {/* nav links */}
        {['Discord', 'Leaderboard', 'Pricing'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`} style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
            padding: '7px 14px', borderRadius: '100px', whiteSpace: 'nowrap',
            transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
          >
            {item}
          </a>
        ))}

        {/* divider */}
        <div style={{ width: '0.5px', height: '18px', background: 'rgba(255,255,255,0.12)', margin: '0 4px' }} />

        {/* auth buttons */}
        <a href="/login" style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          padding: '7px 14px', borderRadius: '100px', whiteSpace: 'nowrap',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          Log in
        </a>
        <a href="/signup" style={{
          fontSize: '13px', color: '#06060f', textDecoration: 'none',
          padding: '8px 18px', borderRadius: '100px', whiteSpace: 'nowrap',
          background: 'rgba(255,255,255,0.92)',
          fontWeight: 600,
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
        >
          Sign up
        </a>
      </nav>

      {/* hero */}
      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        maxWidth: '680px', padding: '0 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <h1 style={{
          fontSize: '68px', fontWeight: 800, color: '#fff',
          letterSpacing: '-3px', lineHeight: 1.05, marginBottom: '20px',
        }}>
          Everything you want,{' '}
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>right here.</span>
        </h1>

        <p style={{
          fontSize: '16px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
          marginBottom: '48px', maxWidth: '440px', margin: '0 auto 48px',
        }}>
          illness.lol is your go-to modern, feature-rich bio link site for you.
        </p>

        {/* claim box */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(15,15,25,0.85)',
          border: '0.5px solid rgba(255,255,255,0.12)',
          borderRadius: '100px',
          padding: '6px 6px 6px 20px',
          backdropFilter: 'blur(16px)',
          maxWidth: '460px', margin: '0 auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            illness.lol/
          </span>
          <input
            type="text"
            placeholder="yourname"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: '14px', color: '#fff', fontFamily: 'inherit',
              padding: '6px 8px',
            }}
          />
          <a href="/signup" style={{
            fontSize: '13px', fontWeight: 600, color: '#06060f',
            textDecoration: 'none', padding: '10px 22px',
            borderRadius: '100px', background: 'rgba(255,255,255,0.92)',
            whiteSpace: 'nowrap', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
          >
            Claim →
          </a>
        </div>
      </div>

      {/* bottom watermark */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, fontSize: '11px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em',
      }}>
        illness.lol
      </div>
    </div>
  )
}