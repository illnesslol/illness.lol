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

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      twinkle: Math.random() * Math.PI * 2,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 220, 255, ${alpha})`
        ctx.fill()
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
      background: '#0a0a0f',
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
        background: 'rgba(15, 15, 25, 0.85)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '40px 36px',
        width: '380px',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          illness.lol
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
          request an account
        </div>

        {!submitted ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{
                  position: 'absolute', left: '12px',
                  fontSize: '13px', color: 'rgba(255,255,255,0.35)',
                  pointerEvents: 'none', fontWeight: 500,
                }}>illness.lol/</span>
                <input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '82px' }}
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

            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '24px 0' }} />

            <button onClick={handleRequest} style={btnStyle}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.13)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
            >
              Request account
            </button>
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
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '14px',
  color: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
}

const btnStyle = {
  width: '100%',
  padding: '11px',
  background: 'rgba(255,255,255,0.08)',
  border: '0.5px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '0.01em',
}