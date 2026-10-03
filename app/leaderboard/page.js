'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../components/PageTransition'

const COLORS = {
  bg: '#000000',
  orange: '#ff6a1a',
  orangeBright: '#ff8a3d',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
}

/* =========================================================
   ACCENT LINK
========================================================= */

function AccentLink({
  href,
  children,
  style = {},
  className = '',
  target,
  rel,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <TransitionLink
      href={href}
      target={target}
      rel={rel}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,

        transition:
          'color .2s ease, background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease',

        color: hovered
          ? '#ffffff'
          : style.color || COLORS.muted,

        background: hovered
          ? 'rgba(255,106,26,.11)'
          : style.background || 'transparent',

        borderColor: hovered
          ? 'rgba(255,106,26,.34)'
          : style.borderColor || 'transparent',

        boxShadow: hovered
          ? '0 0 18px rgba(255,106,26,.08), inset 0 0 14px rgba(255,106,26,.035)'
          : style.boxShadow || 'none',

        transform: hovered
          ? 'translateY(-1px)'
          : style.transform || 'none',
      }}
    >
      {children}
    </TransitionLink>
  )
}

/* =========================================================
   FALLING LEAVES
========================================================= */

function drawLeaf(ctx, size, color, opacity) {
  ctx.globalAlpha = opacity
  ctx.fillStyle = color

  ctx.beginPath()

  ctx.moveTo(0, -size)

  ctx.bezierCurveTo(
    size * 0.95,
    -size * 0.45,
    size * 0.7,
    size * 0.65,
    0,
    size
  )

  ctx.bezierCurveTo(
    -size * 0.7,
    size * 0.65,
    -size * 0.95,
    -size * 0.45,
    0,
    -size
  )

  ctx.fill()

  ctx.globalAlpha = opacity * 0.9
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1

  ctx.beginPath()

  ctx.moveTo(0, -size * 0.85)
  ctx.lineTo(0, size * 1.15)

  ctx.stroke()

  ctx.globalAlpha = 1
}

/* =========================================================
   LEADERBOARD PAGE
========================================================= */

export default function LeaderboardPage() {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 100)

    const canvas = canvasRef.current

    if (!canvas) {
      return () => clearTimeout(timer)
    }

    const ctx = canvas.getContext('2d')

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()

    window.addEventListener('resize', resize)

    const leafColors = [
      '#ff6a1a',
      '#ff8a3d',
      '#e85a0c',
      '#ffffff',
    ]

    const makeLeaf = () => ({
      x: Math.random() * window.innerWidth,
      y:
        Math.random() * window.innerHeight,
      size: Math.random() * 6 + 9,
      speed: Math.random() * 0.35 + 0.35,
      swayAmp: Math.random() * 30 + 20,
      swaySpeed: Math.random() * 0.012 + 0.006,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.012,
      opacity: Math.random() * 0.2 + 0.22,
      color:
        leafColors[
          Math.floor(Math.random() * leafColors.length)
        ],
      baseX: 0,
    })

    const leaves = Array.from(
      { length: 7 },
      makeLeaf
    )

    leaves.forEach((leaf) => {
      leaf.baseX = leaf.x
    })

    let animationFrame
    let tick = 0

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      tick += 1

      leaves.forEach((leaf) => {
        if (!reduceMotion) {
          leaf.y += leaf.speed
          leaf.rotation += leaf.spin
        }

        const sway = reduceMotion
          ? 0
          : Math.sin(
              tick * leaf.swaySpeed +
                leaf.phase
            ) * leaf.swayAmp

        const x = leaf.baseX + sway

        if (leaf.y > canvas.height + 40) {
          leaf.y = -30
          leaf.baseX =
            Math.random() * canvas.width
        }

        ctx.save()

        ctx.translate(x, leaf.y)

        ctx.rotate(
          leaf.rotation +
            Math.sin(
              tick * leaf.swaySpeed +
                leaf.phase
            ) *
              0.5
        )

        drawLeaf(
          ctx,
          leaf.size,
          leaf.color,
          leaf.opacity
        )

        ctx.restore()
      })

      animationFrame =
        requestAnimationFrame(draw)
    }

    draw()

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationFrame)

      window.removeEventListener(
        'resize',
        resize
      )
    }
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: '#fff',
        fontFamily:
          "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #000000;
        }

        ::selection {
          background: rgba(255,106,26,.4);
          color: #fff;
        }

        a:focus-visible {
          outline: 2px solid #ff6a1a;
          outline-offset: 3px;
        }

        .nav-link {
          transition:
            color .2s ease,
            background .2s ease,
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }

        @media (max-width: 800px) {
          .desktop-links {
            display: none !important;
          }

          .coming-soon-title {
            font-size: 42px !important;
          }
        }

        @media (max-width: 520px) {
          .nav {
            width: calc(100% - 24px) !important;
          }

          .nav-brand {
            font-size: 14px !important;
          }

          .nav-login {
            display: none !important;
          }

          .coming-soon-title {
            font-size: 35px !important;
          }

          .coming-soon-subtitle {
            font-size: 14px !important;
          }
        }
      `}</style>

      {/* =====================================================
          FALLING LEAVES
      ===================================================== */}

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* =====================================================
          DOT GRID
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',

          backgroundImage:
            'radial-gradient(rgba(255,255,255,.1) 1px, transparent 1px)',

          backgroundSize: '28px 28px',

          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',

          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',
        }}
      />

      {/* =====================================================
          ORANGE GLOW
      ===================================================== */}

      <div
        style={{
          position: 'fixed',
          top: -380,
          left: '50%',
          transform: 'translateX(-50%)',

          width: 1000,
          height: 700,

          borderRadius: '50%',

          background:
            'radial-gradient(circle,rgba(255,106,26,.16),transparent 68%)',

          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className="nav"
        style={{
          position: 'absolute',
          top: 21,
          left: '50%',
          transform: 'translateX(-50%)',

          width:
            'min(1180px, calc(100% - 40px))',

          height: 70,

          borderRadius: 40,

          background:
            'rgba(10,10,10,.92)',

          border:
            '1px solid rgba(255,255,255,.06)',

          boxShadow:
            '0 15px 50px rgba(0,0,0,.4)',

          display: 'flex',
          alignItems: 'center',

          padding: '0 22px 0 28px',

          zIndex: 20,
        }}
      >
        {/* BRAND */}

        <TransitionLink
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,

            color: '#fff',
            textDecoration: 'none',

            minWidth: 200,
          }}
        >
          <img
            src="/icon.png"
            alt=""
            width={30}
            height={30}
            style={{
              display: 'block',
              filter:
                'drop-shadow(0 0 10px rgba(255,106,26,.35))',
            }}
          />

          <span
            className="nav-brand"
            style={{
              fontFamily:
                "'Space Grotesk', sans-serif",

              fontSize: 21,
              fontWeight: 600,
              letterSpacing: '-.7px',
            }}
          >
            illness.lol
          </span>
        </TransitionLink>

        {/* CENTER LINKS */}

        <div
          className="desktop-links"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',

            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {[
            ['Help Center', '/help'],
            [
              'Discord',
              'https://discord.gg/R4tyQ4h3K5',
            ],
            ['Leaderboard', '/leaderboard'],
            ['Pricing', '/pricing'],
            ['Questions', '/questions'],
          ].map(([label, href]) => (
            <AccentLink
              key={label}
              href={href}
              className="nav-link"
              target={
                label === 'Discord'
                  ? '_blank'
                  : undefined
              }
              rel={
                label === 'Discord'
                  ? 'noopener noreferrer'
                  : undefined
              }
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 14,
                padding: '9px 13px',
                whiteSpace: 'nowrap',
                border:
                  '1px solid transparent',
                borderRadius: 12,
                background: 'transparent',
                boxShadow: 'none',
              }}
            >
              {label}
            </AccentLink>
          ))}
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AccentLink
            href="/login"
            className="nav-login nav-link"
            style={{
              color: COLORS.muted,
              textDecoration: 'none',
              fontSize: 14,
              padding: '9px 13px',
              border:
                '1px solid transparent',
              borderRadius: 12,
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
            Log in
          </AccentLink>

          <AccentLink
            href="/signup"
            className="nav-link"
            style={{
              color: '#000',
              background: COLORS.orange,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              padding: '12px 19px',
              borderRadius: 25,
              border:
                '1px solid transparent',
              boxShadow:
                '0 0 18px rgba(255,106,26,.25)',
            }}
          >
            Sign up
          </AccentLink>
        </div>
      </nav>

      {/* =====================================================
          COMING SOON
      ===================================================== */}

      <section
        style={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 2,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          textAlign: 'center',

          padding:
            '120px 24px 80px',

          opacity: visible ? 1 : 0,

          transform: visible
            ? 'translateY(0)'
            : 'translateY(14px)',

          transition:
            'opacity .7s ease, transform .7s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 3,
              borderRadius: 10,
              background:
                'linear-gradient(90deg, #ff6a1a, #ff8a3d)',

              boxShadow:
                '0 0 20px rgba(255,106,26,.45)',

              marginBottom: 28,
            }}
          />

          <h1
            className="coming-soon-title"
            style={{
              fontFamily:
                "'Space Grotesk', sans-serif",

              fontSize: 58,
              lineHeight: 1.1,

              letterSpacing: '-2px',
              fontWeight: 600,

              margin: 0,

              color: '#fff',

              textShadow:
                '0 0 35px rgba(255,106,26,.12)',
            }}
          >
            Coming Soon
          </h1>

          <p
            className="coming-soon-subtitle"
            style={{
              margin:
                '18px 0 0',

              maxWidth: 500,

              color: COLORS.muted,

              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            The illness.lol leaderboard
            is currently under development.
          </p>

          <AccentLink
            href="/"
            style={{
              marginTop: 28,

              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',

              padding: '12px 18px',

              borderRadius: 14,

              color: '#fff',

              background:
                'rgba(255,255,255,.04)',

              border:
                '1px solid rgba(255,255,255,.14)',

              textDecoration: 'none',

              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Back Home
          </AccentLink>
        </div>
      </section>
    </main>
  )
}
