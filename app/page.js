'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../components/PageTransition'

const COLORS = {
  bg: '#08080d',
  panel: 'rgba(16,16,23,.78)',
  panel2: 'rgba(255,255,255,.035)',
  border: 'rgba(255,255,255,.075)',
  purple: '#765cff',
  purple2: '#927dff',
  purpleSoft: 'rgba(118,92,255,.13)',
  white: '#fff',
  muted: 'rgba(255,255,255,.52)',
  faint: 'rgba(255,255,255,.28)',
}

function Capsule({ size = 1, style }) {
  return (
    <svg
      width={64 * size}
      height={26 * size}
      viewBox="0 0 64 26"
      style={style}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="pillClip">
          <rect x="1" y="1" width="62" height="24" rx="12" />
        </clipPath>
      </defs>

      <g clipPath="url(#pillClip)">
        <rect x="1" y="1" width="31" height="24" fill={COLORS.purple} />
        <rect x="32" y="1" width="31" height="24" fill="#fff" />
      </g>

      <rect
        x="1"
        y="1"
        width="62"
        height="24"
        rx="12"
        fill="none"
        stroke="rgba(255,255,255,.22)"
      />

      <ellipse
        cx="16"
        cy="7.5"
        rx="8"
        ry="2.3"
        fill="rgba(255,255,255,.3)"
      />
    </svg>
  )
}

function Arrow() {
  return <span style={{ fontSize: 15 }}>→</span>
}

export default function HomePage() {
  const canvasRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const [liveCount, setLiveCount] = useState(148204)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)

    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(Boolean(data.loggedIn))
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))

    const countTimer = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 2))
    }, 3000)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.15 + 0.04,
      opacity: Math.random() * 0.25 + 0.04,
    }))

    let animationFrame

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.y -= p.speed

        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(146,125,255,${p.opacity})`
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      clearTimeout(timer)
      clearInterval(countTimer)
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const navLinks = [
    ['Leaderboard', '/leaderboard'],
    ['Pricing', '/pricing'],
    ['Discord', 'https://discord.gg/illness'],
  ]

  const stats = [
    ['148K+', 'profiles'],
    ['2.1M+', 'clicks'],
    ['40+', 'countries'],
  ]

  const features = [
    {
      number: '01',
      title: 'Custom profiles',
      description:
        'Build a profile that actually looks like you. Customize your colors, background, links and more.',
    },
    {
      number: '02',
      title: 'Custom cursors',
      description:
        'Give your profile another layer of personality with custom cursor support.',
    },
    {
      number: '03',
      title: 'Audio player',
      description:
        'Add music to your profile and let visitors experience your page exactly how you want.',
    },
    {
      number: '04',
      title: 'Badges',
      description:
        'Show off your premium status, achievements and other profile badges.',
    },
    {
      number: '05',
      title: 'Analytics',
      description:
        'Track profile views, link clicks and other useful statistics in real time.',
    },
    {
      number: '06',
      title: 'Aliases',
      description:
        'Use additional profile names and make it easier for people to find you.',
    },
  ]

  const faqs = [
    [
      'What is illness.lol?',
      'illness.lol is a customizable profile platform that lets you put your links, socials, music and personality into one page.',
    ],
    [
      'Is illness.lol free?',
      'Yes. You can create a profile for free. Premium features are available for users who want additional customization.',
    ],
    [
      'Can I customize my profile?',
      'Absolutely. You can customize your theme, links, background, music, cursor and other profile elements.',
    ],
    [
      'How long does setup take?',
      'Only a few minutes. Create your account, claim your username and start customizing your profile.',
    ],
  ]

  return (
    <main
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: '#fff',
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #08080d;
        }

        ::selection {
          background: rgba(118,92,255,.35);
          color: white;
        }

        input::placeholder {
          color: rgba(255,255,255,.25);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: .45;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .illness-link:hover {
          color: #fff !important;
          background: rgba(118,92,255,.1) !important;
        }

        .illness-card:hover {
          transform: translateY(-4px);
          border-color: rgba(118,92,255,.35) !important;
          background: rgba(20,19,30,.9) !important;
        }

        .illness-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(118,92,255,.28) !important;
        }

        @media (max-width: 700px) {
          .desktop-nav {
            display: none !important;
          }

          .hero-title {
            font-size: 46px !important;
            letter-spacing: -2px !important;
          }

          .claim-box {
            flex-direction: column !important;
            border-radius: 18px !important;
            padding: 10px !important;
          }

          .claim-input {
            width: 100% !important;
            padding: 15px 12px !important;
          }

          .claim-button {
            width: 100% !important;
          }

          .stats-grid {
            gap: 30px !important;
          }
        }
      `}</style>

      {/* BACKGROUND */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: .55,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'fixed',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(118,92,255,.08), transparent 68%)',
          top: -350,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* NAVBAR */}
      <nav
        style={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 1040,
          height: 62,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 8px 7px 20px',
          borderRadius: 18,
          background: 'rgba(10,10,15,.72)',
          border: `1px solid ${COLORS.border}`,
          backdropFilter: 'blur(24px)',
          boxShadow: '0 15px 60px rgba(0,0,0,.45)',
        }}
      >
        <TransitionLink
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          <Capsule size={.55} />

          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '-.5px',
            }}
          >
            illness.lol
          </span>
        </TransitionLink>

        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {navLinks.map(([label, href]) => (
            <TransitionLink
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={
                href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="illness-link"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 13,
                padding: '10px 14px',
                borderRadius: 10,
                transition: '.2s',
              }}
            >
              {label}
            </TransitionLink>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {authChecked && loggedIn && (
            <TransitionLink
              href="/dashboard"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 13,
                padding: '10px 13px',
              }}
            >
              Dashboard
            </TransitionLink>
          )}

          <TransitionLink
            href="/login"
            style={{
              color: COLORS.muted,
              textDecoration: 'none',
              fontSize: 13,
              padding: '10px 14px',
            }}
          >
            Log in
          </TransitionLink>

          <TransitionLink
            href="/signup"
            className="illness-button"
            style={{
              color: '#09090e',
              background: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 13,
              padding: '11px 18px',
              borderRadius: 11,
              transition: '.2s',
            }}
          >
            Sign up
          </TransitionLink>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '150px 20px 100px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 800,
            width: '100%',
            opacity: visible ? 1 : 0,
            transform: visible
              ? 'translateY(0)'
              : 'translateY(20px)',
            transition: 'opacity .8s ease, transform .8s ease',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: 100,
              border: `1px solid rgba(118,92,255,.22)`,
              background: 'rgba(118,92,255,.07)',
              marginBottom: 25,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: 'rgba(190,180,255,.8)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: COLORS.purple,
                boxShadow: `0 0 12px ${COLORS.purple}`,
                animation: 'pulse 1.5s infinite',
              }}
            />

            {liveCount.toLocaleString()} profiles claimed
          </div>

          <div
            style={{
              animation: 'float 4s ease-in-out infinite',
              marginBottom: 25,
            }}
          >
            <Capsule
              size={1.45}
              style={{
                filter:
                  'drop-shadow(0 12px 45px rgba(118,92,255,.38))',
              }}
            />
          </div>

          <h1
            className="hero-title"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 66,
              lineHeight: 1.02,
              letterSpacing: '-3px',
              margin: '0 auto 22px',
              fontWeight: 700,
              maxWidth: 750,
            }}
          >
            Your profile.
            <br />
            <span
              style={{
                background:
                  'linear-gradient(90deg,#fff,#9c8dff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your identity.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 510,
              margin: '0 auto 35px',
              color: COLORS.muted,
              fontSize: 15,
              lineHeight: 1.75,
            }}
          >
            Everything you are, in one place. Create a profile
            that represents you, share your links and make your
            corner of the internet yours.
          </p>

          {/* CLAIM */}
          <div
            className="claim-box"
            style={{
              width: '100%',
              maxWidth: 590,
              margin: '0 auto',
              padding: 7,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15,15,22,.82)',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 15,
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 25px 80px rgba(0,0,0,.45), 0 0 50px rgba(118,92,255,.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 15,
                color: 'rgba(146,125,255,.65)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              illness.lol/
            </div>

            <input
              className="claim-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username"
              style={{
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 0,
                background: 'transparent',
                color: '#fff',
                padding: '13px 10px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
              }}
            />

            <TransitionLink
              href="/signup"
              className="claim-button illness-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                padding: '13px 20px',
                borderRadius: 11,
                background: '#fff',
                color: '#08080d',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 13,
                transition: '.2s',
                whiteSpace: 'nowrap',
              }}
            >
              Claim username <Arrow />
            </TransitionLink>
          </div>

          <div
            style={{
              marginTop: 18,
              color: COLORS.faint,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
          >
            free forever · no credit card required
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
          background: 'rgba(255,255,255,.012)',
        }}
      >
        <div
          className="stats-grid"
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '55px 25px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 50,
          }}
        >
          {stats.map(([number, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: '-1px',
                }}
              >
                {number}
              </div>

              <div
                style={{
                  marginTop: 5,
                  color: COLORS.faint,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1040,
          margin: '0 auto',
          padding: '125px 25px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: COLORS.purple2,
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              marginBottom: 13,
            }}
          >
            everything you need
          </div>

          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 38,
              letterSpacing: '-1.5px',
              margin: '0 0 12px',
            }}
          >
            Built for your identity.
          </h2>

          <p
            style={{
              color: COLORS.muted,
              fontSize: 14,
              margin: 0,
            }}
          >
            Powerful customization without the unnecessary clutter.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12,
          }}
        >
          {features.map(feature => (
            <div
              key={feature.number}
              className="illness-card"
              style={{
                padding: 28,
                minHeight: 190,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panel,
                transition: '.25s ease',
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: COLORS.purple2,
                  marginBottom: 30,
                }}
              >
                {feature.number}
              </div>

              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 17,
                  margin: '0 0 9px',
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: COLORS.muted,
                  fontSize: 13,
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFILE PREVIEW */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1040,
          margin: '0 auto',
          padding: '0 25px 130px',
        }}
      >
        <div
          style={{
            border: `1px solid ${COLORS.border}`,
            background:
              'linear-gradient(145deg,rgba(118,92,255,.08),rgba(255,255,255,.015))',
            borderRadius: 24,
            padding: '70px 35px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 60,
            flexWrap: 'wrap',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
              background:
                'radial-gradient(circle,rgba(118,92,255,.12),transparent 70%)',
              right: -180,
              top: -180,
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: 460 }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: COLORS.purple2,
                textTransform: 'uppercase',
                letterSpacing: '.12em',
                marginBottom: 14,
              }}
            >
              profile system
            </div>

            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                letterSpacing: '-1.5px',
                margin: '0 0 15px',
              }}
            >
              One link.
              <br />
              Infinite possibilities.
            </h2>

            <p
              style={{
                color: COLORS.muted,
                fontSize: 14,
                lineHeight: 1.75,
                marginBottom: 25,
              }}
            >
              Your profile is more than a collection of links.
              Make it yours with custom themes, music, effects,
              badges and everything in between.
            </p>

            <TransitionLink
              href="/signup"
              className="illness-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 18px',
                background: '#fff',
                color: '#08080d',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                transition: '.2s',
              }}
            >
              Create your profile <Arrow />
            </TransitionLink>
          </div>

          {/* MOCK PROFILE */}
          <div
            style={{
              width: 290,
              borderRadius: 20,
              border: `1px solid ${COLORS.border}`,
              background: 'rgba(8,8,13,.78)',
              padding: 25,
              textAlign: 'center',
              boxShadow: '0 25px 70px rgba(0,0,0,.45)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                margin: '0 auto 13px',
                background:
                  'linear-gradient(135deg,#765cff,#fff)',
                boxShadow:
                  '0 8px 35px rgba(118,92,255,.25)',
              }}
            />

            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              yourname
            </div>

            <div
              style={{
                color: COLORS.faint,
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                marginTop: 5,
                marginBottom: 20,
              }}
            >
              illness.lol/yourname
            </div>

            {['Discord', 'YouTube', 'Twitch'].map(link => (
              <div
                key={link}
                style={{
                  padding: 11,
                  marginBottom: 7,
                  borderRadius: 9,
                  border: `1px solid ${COLORS.border}`,
                  background: 'rgba(255,255,255,.025)',
                  color: 'rgba(255,255,255,.65)',
                  fontSize: 12,
                }}
              >
                {link}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 25px 130px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 55 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              letterSpacing: '-1.5px',
              margin: '0 0 10px',
            }}
          >
            Choose your plan.
          </h2>

          <p
            style={{
              color: COLORS.muted,
              fontSize: 14,
            }}
          >
            Start free. Upgrade whenever you want.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(280px,1fr))',
            gap: 14,
          }}
        >
          {/* FREE */}
          <div
            className="illness-card"
            style={{
              border: `1px solid ${COLORS.border}`,
              background: COLORS.panel,
              borderRadius: 18,
              padding: 30,
              transition: '.25s',
            }}
          >
            <div
              style={{
                color: COLORS.muted,
                fontSize: 12,
                marginBottom: 9,
              }}
            >
              Free
            </div>

            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: '-2px',
                marginBottom: 20,
              }}
            >
              $0
            </div>

            <div
              style={{
                color: COLORS.muted,
                fontSize: 13,
                lineHeight: 2,
              }}
            >
              ✓ Custom profile
              <br />
              ✓ Links & socials
              <br />
              ✓ Basic customization
              <br />
              ✓ Profile analytics
            </div>
          </div>

          {/* PREMIUM */}
          <div
            className="illness-card"
            style={{
              border: '1px solid rgba(118,92,255,.35)',
              background:
                'linear-gradient(145deg,rgba(118,92,255,.13),rgba(16,16,23,.8))',
              borderRadius: 18,
              padding: 30,
              transition: '.25s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '6px 10px',
                background: 'rgba(118,92,255,.16)',
                borderBottomLeftRadius: 10,
                color: '#b3a8ff',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
              }}
            >
              PREMIUM
            </div>

            <div
              style={{
                color: '#a99cff',
                fontSize: 12,
                marginBottom: 9,
              }}
            >
              Premium
            </div>

            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '-1px',
                marginBottom: 20,
              }}
            >
              More customization
            </div>

            <div
              style={{
                color: COLORS.muted,
                fontSize: 13,
                lineHeight: 2,
              }}
            >
              ✓ Everything in Free
              <br />
              ✓ Custom cursors
              <br />
              ✓ Audio player
              <br />
              ✓ Premium badges & aliases
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 25px 140px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 45 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 34,
              letterSpacing: '-1.5px',
              margin: 0,
            }}
          >
            Frequently asked.
          </h2>
        </div>

        {faqs.map(([question, answer], index) => {
          const open = openFaq === index

          return (
            <div
              key={question}
              style={{
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <button
                onClick={() =>
                  setOpenFaq(open ? -1 : index)
                }
                style={{
                  width: '100%',
                  border: 0,
                  background: 'none',
                  color: '#fff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '21px 3px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  textAlign: 'left',
                }}
              >
                {question}

                <span
                  style={{
                    color: COLORS.faint,
                    fontSize: 20,
                    fontWeight: 300,
                  }}
                >
                  {open ? '−' : '+'}
                </span>
              </button>

              <div
                style={{
                  maxHeight: open ? 150 : 0,
                  overflow: 'hidden',
                  transition: 'max-height .25s ease',
                }}
              >
                <p
                  style={{
                    color: COLORS.muted,
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: '0 3px 20px',
                  }}
                >
                  {answer}
                </p>
              </div>
            </div>
          )
        })}
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 25px 130px',
        }}
      >
        <Capsule
          size={1}
          style={{
            marginBottom: 25,
            filter:
              'drop-shadow(0 10px 35px rgba(118,92,255,.3))',
          }}
        />

        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 40,
            letterSpacing: '-1.8px',
            margin: '0 0 14px',
          }}
        >
          Ready to make it yours?
        </h2>

        <p
          style={{
            color: COLORS.muted,
            fontSize: 14,
            marginBottom: 25,
          }}
        >
          Claim your username and create your profile today.
        </p>

        <TransitionLink
          href="/signup"
          className="illness-button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 21px',
            background: '#fff',
            color: '#08080d',
            borderRadius: 11,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 13,
            transition: '.2s',
          }}
        >
          Get started <Arrow />
        </TransitionLink>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: `1px solid ${COLORS.border}`,
          maxWidth: 1040,
          margin: '0 auto',
          padding: '30px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <Capsule size={.45} />

          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            illness.lol
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          {navLinks.map(([label, href]) => (
            <TransitionLink
              key={label}
              href={href}
              style={{
                color: COLORS.faint,
                fontSize: 12,
                textDecoration: 'none',
              }}
            >
              {label}
            </TransitionLink>
          ))}
        </div>

        <div
          style={{
            color: COLORS.faint,
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          © {new Date().getFullYear()} illness.lol
        </div>
      </footer>
    </main>
  )
}