'use client'

import { useEffect, useRef } from 'react'

export default function DashboardPage() {
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

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005,
      twinkle: Math.random() * Math.PI * 2,
    }))

    let animId

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const blobs = [
        {
          x: canvas.width * 0.15,
          y: canvas.height * 0.25,
          r: 350,
          color: 'rgba(60,20,120,',
        },
        {
          x: canvas.width * 0.85,
          y: canvas.height * 0.6,
          r: 300,
          color: 'rgba(20,50,110,',
        },
      ]

      blobs.forEach((b) => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.15)')
        grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      stars.forEach((s) => {
        s.twinkle += s.speed
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,220,255,${alpha})`
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06060f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <img
          src="/icon.png"
          alt="illness.lol"
          style={{
            width: '64px',
            height: '64px',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            marginBottom: '22px',
            display: 'block',
          }}
        />

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-1px',
            margin: 0,
          }}
        >
          Just kidding were free
        </h1>

        <p
          style={{
            marginTop: '14px',
            marginBottom: '32px',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          hi rottingcrime was here
        </p>

        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 28px',
            borderRadius: '10px',
            background: '#fff',
            color: '#06060f',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 0 20px rgba(255,255,255,0.2)',
          }}
        >
          Back to home
        </a>
      </div>
    </div>
  )
}