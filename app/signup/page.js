'use client'

import { useState, useEffect, useRef } from 'react'
import { useTransition } from '@/components/PageTransition'

export default function SignupPage() {
  const { navigate } = useTransition()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
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
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 300, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 250, color: 'rgba(20,60,100,' },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, r: 200, color: 'rgba(80,20,80,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.18)'); grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      })
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,220,255,${alpha})`; ctx.fill()
      })
      frameCount++
      if (frameCount % 180 === 0) spawnShooting()
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

  const handleSubmit = async () => {
    setError('')
    if (!username || !email || !password) return

    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      // hand off to the site's existing page transition
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
    border: focused === name ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '11px 12px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border 0.15s, background 0.15s',
    boxSizing: 'border-box',
  })

  return (
    <div style={{
      minHeight: '100vh', background: '#06060f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden', position: 'relative',
    }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '100vh',
        background: 'conic-gradient(from 270deg at 50% 0%, transparent 70deg, rgba(255,255,255,0.045) 90deg, transparent 110deg)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(12,12,22,0.82)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '44px 40px', width: '420px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 80px rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <img src="/icon.png" alt="illness.lol" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '6px', fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>
          Create an account
        </div>
        <div style={{ textAlign: 'center', marginBottom: '28px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Log in</a>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Username</label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '13px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', fontWeight: 500,
            }}>illness.lol/</span>
            <input
              type="text" placeholder="yourname" value={username}
              onChange={e => setUsername(e.target.value)}
              onFocus={() => setFocused('username')} onBlur={() => setFocused('')}
              style={{ ...inputStyle('username'), paddingLeft: '88px' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email" placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
            style={inputStyle('email')}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
              style={{ ...inputStyle('password'), paddingRight: '42px' }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center',
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ fontSize: '13px', color: '#ff6b6b', marginBottom: '12px' }}>{error}</div>
        )}

        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '20px 0' }} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none', borderRadius: '8px',
            color: '#06060f', fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#fff')}
          onMouseLeave={e => !loading && (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '11px', fontWeight: 500,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)', marginBottom: '6px',
}