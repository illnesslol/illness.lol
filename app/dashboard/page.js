'use client'

import { useEffect, useRef } from 'react'

export default function DashboardPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2, a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005, twinkle: Math.random() * Math.PI * 2,
    }))
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const blobs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 350, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.85, y: canvas.height * 0.6, r: 300, color: 'rgba(20,50,110,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.15)'); grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      })
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,220,255,${alpha})`; ctx.fill()
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
      fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <img src="/icon.png" alt="illness.lol" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '24px' }} />
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-1px', marginBottom: '12px' }}>
          Welcome to your dashboard
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>
          this page is just a placeholder for now — more coming soon
        </p>
        <a href="/" style={{
          display: 'inline-block', fontSize: '14px', fontWeight: 600, color: '#06060f',
          textDecoration: 'none', padding: '12px 28px', borderRadius: '10px',
          background: '#fff', boxShadow: '0 0 20px rgba(255,255,255,0.2)',
        }}>
          Back to home
        </a>
      </div>
    </div>
  )
}