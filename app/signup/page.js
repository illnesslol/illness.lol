'use client'

import { useState, useEffect, useRef } from 'react'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005,
      twinkle: Math.random() * Math.PI * 2,
      vy: Math.random() * 0.08 + 0.02,
    }))

    const shootingStars = []
    let frameCount = 0

    const spawnShooting = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 5,
        alpha: 1,
        active: true,
      })
    }

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const blobs = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 300, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 250, color: 'rgba(20,60,100,' },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, r: 200, color: 'rgba(80,20,80,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.18)')
        grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      stars.forEach(s => {
        s.twinkle += s.speed
        s.y -= s.vy * 0.1
        if (s.y < 0) s.y = canvas.height
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 255, ${alpha})`
        ctx.fill()
      })

      frameCount++
      if (frameCount % 180 === 0) spawnShooting()

      shootingStars.forEach((s) => {
        if (!s.active) return
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.alpha -= 0.018
        if (s.alpha <= 0) { s.active = false; return }
        const tailX = s.x - Math.cos(s.angle) * s.len
        const tailY = s.y - Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`)
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleRequest = () => {
    if (!username || !email || !password) return
    setSubmitted(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06060f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <canvas ref={canvasRef} style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(12, 12, 22, 0.82)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '48px 44px',
        width: '440px',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          illness.lol
        </div>
        <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          Create an account
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}>
          requests are reviewed manually before approval
        </div>

        {!submitted ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute', left: '12px',
                  fontSize: '13px', color: 'rgba(255,255,255,0.3)',
                  pointerEvents: 'none', fontWeight: 500,
                }}>illness.lol/</span>
                <input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '88px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="anything works"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '28px 0' }} />

            <button
              onClick={handleRequest}
              style={btnStyle}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              Request account
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                Sign in
              </a>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0 4px' }}>
            <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>✦</div>
            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 500, marginBottom: '6px' }}>request sent</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              we'll review your request and get back to you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '11px 12px',
  fontSize: '14px',
  color: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
}

const btnStyle = {
  width: '100%',
  padding: '12px',
  background: 'rgba(255,255,255,0.07)',
  border: '0.5px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
  transition: 'background 0.15s',
}