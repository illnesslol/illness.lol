'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../components/PageTransition'

const COLORS = {
  bg: '#17101a',
  bgDark: '#0d0b10',
  purple: '#9b4dcc',
  purpleBright: '#b75be8',
  purpleSoft: 'rgba(155,77,204,.18)',
  purpleBorder: 'rgba(181,91,232,.55)',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
}

function PlaceholderAvatar({ small = false }) {
  return (
    <div
      style={{
        width: small ? 32 : 48,
        height: small ? 32 : 48,
        borderRadius: '50%',
        background:
          'linear-gradient(135deg, #8f48bc, #c27ae8)',
        boxShadow: '0 0 20px rgba(155,77,204,.3)',
        flexShrink: 0,
      }}
    />
  )
}

function FakeIcon() {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: 'rgba(181,91,232,.22)',
        border: '1px solid rgba(181,91,232,.18)',
      }}
    />
  )
}

function DashboardPlaceholder() {
  return (
    <div
      className="dashboard-placeholder"
      style={{
        width: 790,
        height: 465,
        background: '#09090b',
        border: `2px solid ${COLORS.purpleBorder}`,
        borderRadius: 26,
        boxShadow:
          '0 0 35px rgba(155,77,204,.14), 0 30px 100px rgba(0,0,0,.75)',
        overflow: 'hidden',
        display: 'flex',
        transform: 'perspective(1200px) rotateY(8deg) rotateZ(4deg)',
        transformOrigin: 'center center',
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 170,
          background: '#0d0d0f',
          borderRight: '1px solid rgba(255,255,255,.07)',
          padding: 16,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginBottom: 22,
          }}
        >
          <PlaceholderAvatar small />

          <div>
            <div
              style={{
                fontSize: 9,
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Welcome back, $
            </div>

            <div
              style={{
                fontSize: 7,
                color: COLORS.faint,
              }}
            >
              illness.lol
            </div>
          </div>
        </div>

        {[
          'account',
          'customize',
          'links',
          'premium',
          'image host',
        ].map((item, i) => (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '8px 9px',
              borderRadius: 8,
              marginBottom: 4,
              background:
                i === 0
                  ? 'rgba(155,77,204,.22)'
                  : 'transparent',
              color:
                i === 0
                  ? '#fff'
                  : 'rgba(255,255,255,.72)',
              fontSize: 9,
            }}
          >
            <FakeIcon />
            {item}
          </div>
        ))}

        <div
          style={{
            marginTop: 70,
            padding: 10,
            borderRadius: 10,
            background: 'rgba(255,255,255,.025)',
          }}
        >
          <div
            style={{
              fontSize: 8,
              color: COLORS.muted,
              marginBottom: 8,
            }}
          >
            Have a question or need support?
          </div>

          <div
            style={{
              height: 27,
              borderRadius: 7,
              background:
                'linear-gradient(90deg,#7652d9,#9b4dcc)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
            }}
          >
            Join Discord
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: 22,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: '#fff',
            marginBottom: 15,
          }}
        >
          Account Overview
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1.2fr 1fr 1fr 1fr',
            gap: 9,
            marginBottom: 20,
          }}
        >
          {[
            ['Username', '$'],
            ['Alias', 'hirs'],
            ['UID', '1'],
            ['Profile Views', '4,801'],
          ].map(([title, value]) => (
            <div
              key={title}
              style={{
                background: 'rgba(155,77,204,.16)',
                borderRadius: 9,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  marginBottom: 8,
                }}
              >
                <FakeIcon />

                <span
                  style={{
                    fontSize: 7,
                    color: COLORS.muted,
                  }}
                >
                  {title}
                </span>
              </div>

              <div
                style={{
                  fontSize: 10,
                  color: '#fff',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: 9,
            color: '#fff',
            marginBottom: 9,
          }}
        >
          Account Statistics
        </div>

        <div
          style={{
            height: 205,
            borderRadius: 13,
            background: '#0b0b0d',
            border: '1px solid rgba(255,255,255,.035)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 18,
              top: 16,
              color: COLORS.faint,
              fontSize: 7,
            }}
          >
            Profile Views in the last 12 hours
          </div>

          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              left: 15,
              right: 15,
              bottom: 10,
              width: 'calc(100% - 30px)',
              height: 155,
            }}
          >
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#a453cb"
                  stopOpacity=".45"
                />
                <stop
                  offset="100%"
                  stopColor="#a453cb"
                  stopOpacity=".03"
                />
              </linearGradient>
            </defs>

            <path
              d="
                M0 150
                L45 150
                C70 150 75 120 100 120
                C125 120 125 150 150 150
                C175 150 180 50 200 50
                C220 50 235 150 255 150
                C275 150 280 60 305 60
                C330 60 345 150 365 150
                C385 150 390 110 410 110
                C430 110 440 150 460 150
                C480 150 490 75 510 75
                C530 75 545 150 565 150
                L600 150
                L600 180
                L0 180
                Z
              "
              fill="url(#chartGradient)"
            />

            <path
              d="
                M0 150
                L45 150
                C70 150 75 120 100 120
                C125 120 125 150 150 150
                C175 150 180 50 200 50
                C220 50 235 150 255 150
                C275 150 280 60 305 60
                C330 60 345 150 365 150
                C385 150 390 110 410 110
                C430 110 440 150 460 150
                C480 150 490 75 510 75
                C530 75 545 150 565 150
                L600 150
              "
              fill="none"
              stroke="#a453cb"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

function ProfilePlaceholder({
  className = '',
  style = {},
  username = 'username',
  image = 1,
}) {
  const backgrounds = [
    'linear-gradient(135deg,#111827,#26354a)',
    'linear-gradient(135deg,#15202b,#314e63)',
    'linear-gradient(135deg,#15110b,#51421e)',
  ]

  return (
    <div
      className={`profile-placeholder ${className}`}
      style={{
        position: 'absolute',
        width: 390,
        height: 410,
        borderRadius: 24,
        overflow: 'hidden',
        border: `2px solid ${COLORS.purpleBorder}`,
        background: '#0b0b0d',
        boxShadow:
          '0 20px 70px rgba(0,0,0,.7), 0 0 30px rgba(155,77,204,.1)',
        ...style,
      }}
    >
      {/* IMAGE PLACEHOLDER */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: backgrounds[image - 1],
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom,rgba(0,0,0,.05) 20%,rgba(0,0,0,.85) 90%)',
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          right: 22,
          bottom: 20,
        }}
      >
        <PlaceholderAvatar />

        <div
          style={{
            marginTop: 12,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 19,
            fontWeight: 700,
          }}
        >
          {username}
        </div>

        <div
          style={{
            marginTop: 5,
            color: COLORS.faint,
            fontSize: 9,
          }}
        >
          Welcome to my profile!
        </div>

        <div
          style={{
            display: 'flex',
            gap: 7,
            marginTop: 15,
          }}
        >
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: 31,
                height: 31,
                borderRadius: 8,
                background: 'rgba(255,255,255,.1)',
                border:
                  '1px solid rgba(255,255,255,.12)',
              }}
            />
          ))}
        </div>

        <div
          style={{
            height: 39,
            marginTop: 14,
            borderRadius: 10,
            background: 'rgba(255,255,255,.09)',
            border:
              '1px solid rgba(255,255,255,.1)',
          }}
        />
      </div>
    </div>
  )
}

export default function HomePage() {
  const canvasRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 100)

    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(Boolean(data.loggedIn))
        setAuthChecked(true)
      })
      .catch(() => {
        setAuthChecked(true)
      })

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()

    window.addEventListener('resize', resize)

    const particles = Array.from(
      { length: 28 },
      () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + .5,
        opacity: Math.random() * .18 + .025,
      })
    )

    let animationFrame

    const draw = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = `rgba(180,100,235,${p.opacity})`
        ctx.fill()
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
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
          background: #17101a;
        }

        ::selection {
          background: rgba(181,91,232,.35);
          color: #fff;
        }

        .nav-link {
          transition: .2s ease;
        }

        .nav-link:hover {
          color: #fff !important;
        }

        .hero-button {
          transition: .2s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
        }

        .primary-button:hover {
          box-shadow: 0 0 30px rgba(181,91,232,.45) !important;
        }

        @media (max-width: 1100px) {
          .showcase {
            transform: scale(.82);
            transform-origin: top center;
          }
        }

        @media (max-width: 800px) {
          .desktop-links {
            display: none !important;
          }

          .hero {
            padding-top: 145px !important;
          }

          .hero-title {
            font-size: 42px !important;
          }

          .hero-subtitle {
            font-size: 15px !important;
          }

          .showcase {
            transform: scale(.58);
            height: 300px !important;
            margin-top: 10px !important;
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

          .hero-title {
            font-size: 35px !important;
          }

          .hero-subtitle {
            max-width: 330px !important;
          }

          .showcase {
            transform: scale(.42);
            height: 220px !important;
            margin-left: -180px !important;
            margin-right: -180px !important;
          }
        }
      `}</style>

      {/* CANVAS PARTICLES */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* PURPLE ATMOSPHERIC GLOW */}
      <div
        style={{
          position: 'fixed',
          top: -350,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1000,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle,rgba(120,54,150,.18),transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* FAINT PLACEHOLDER SHAPES */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 30,
          width: 80,
          height: 190,
          borderRadius: 18,
          background: 'rgba(160,75,190,.07)',
          transform: 'rotate(-12deg)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: -20,
          right: 80,
          width: 90,
          height: 170,
          borderRadius: 20,
          background: 'rgba(160,75,190,.06)',
          transform: 'rotate(35deg)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 95,
          left: 145,
          width: 70,
          height: 55,
          borderRadius: 12,
          background: 'rgba(160,75,190,.055)',
          transform: 'rotate(-28deg)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* NAV */}
      <nav
        className="nav"
        style={{
          position: 'absolute',
          top: 21,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1180px, calc(100% - 40px))',
          height: 70,
          borderRadius: 40,
          background: 'rgba(12,10,13,.92)',
          border:
            '1px solid rgba(255,255,255,.035)',
          boxShadow:
            '0 15px 50px rgba(0,0,0,.3)',
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
          {/* PLACEHOLDER LOGO */}
          <div
            style={{
              width: 29,
              height: 29,
              borderRadius: 8,
              background:
                'linear-gradient(135deg,#8d45b9,#c05de9)',
              transform: 'rotate(-18deg)',
              boxShadow:
                '0 0 16px rgba(181,91,232,.25)',
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
            gap: 8,
          }}
        >
          {[
            ['Help Center', '/help'],
            ['Discord', 'https://discord.gg/illness'],
            ['Compare', '/compare'],
            ['Leaderboard', '/leaderboard'],
            ['Pricing', '/pricing'],
          ].map(([label, href]) => (
            <TransitionLink
              key={label}
              href={href}
              className="nav-link"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 14,
                padding: '10px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </TransitionLink>
          ))}
        </div>

        {/* RIGHT */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {!loggedIn && (
            <TransitionLink
              href="/login"
              className="nav-login"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 14,
                padding: '11px 14px',
              }}
            >
              Log in
            </TransitionLink>
          )}

          {authChecked && loggedIn ? (
            <TransitionLink
              href="/dashboard"
              className="hero-button"
              style={{
                color: '#fff',
                background:
                  'linear-gradient(135deg,rgba(155,77,204,.32),rgba(110,54,140,.22))',
                border:
                  '1px solid rgba(181,91,232,.5)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                padding: '11px 17px',
                borderRadius: 25,
              }}
            >
              Dashboard
            </TransitionLink>
          ) : (
            <TransitionLink
              href="/signup"
              className="hero-button"
              style={{
                color: '#fff',
                background:
                  'linear-gradient(135deg,#7b3d9c,#9b4dcc)',
                border:
                  '1px solid rgba(210,140,239,.25)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 19px',
                borderRadius: 25,
                boxShadow:
                  '0 0 18px rgba(155,77,204,.2)',
              }}
            >
              Sign up
            </TransitionLink>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        className="hero"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: 650,
          paddingTop: 185,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0)'
            : 'translateY(14px)',
          transition:
            'opacity .7s ease, transform .7s ease',
        }}
      >
        <h1
          className="hero-title"
          style={{
            fontFamily:
              "'Space Grotesk', sans-serif",
            fontSize: 46,
            lineHeight: 1.15,
            letterSpacing: '-1.5px',
            fontWeight: 600,
            margin: 0,
            color: '#fff',
          }}
        >
          Everything you want, right here.
        </h1>

        <p
          className="hero-subtitle"
          style={{
            maxWidth: 720,
            margin: '17px auto 25px',
            fontSize: 17,
            lineHeight: 1.6,
            color: COLORS.muted,
          }}
        >
          illness.lol is your go-to for modern,
          feature rich custom bio pages and fast,
          secure file hosting
        </p>

        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TransitionLink
            href="/signup"
            className="hero-button primary-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              borderRadius: 14,
              color: '#fff',
              background:
                'linear-gradient(135deg,#74409a,#9b4dcc)',
              border:
                '1px solid rgba(194,122,232,.4)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              boxShadow:
                '0 0 20px rgba(155,77,204,.25)',
            }}
          >
            Sign Up for Free
          </TransitionLink>

          <TransitionLink
            href="/pricing"
            className="hero-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              borderRadius: 14,
              color: '#fff',
              background: 'rgba(20,18,21,.8)',
              border:
                '1px solid rgba(255,255,255,.08)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            View Pricing
          </TransitionLink>
        </div>
      </section>

      {/* SHOWCASE */}
      <section
        className="showcase"
        style={{
          position: 'relative',
          zIndex: 3,
          width: 1500,
          height: 500,
          margin: '-160px auto 0',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* DASHBOARD */}
        <DashboardPlaceholder
        />

        {/* RIGHT PROFILE STACK */}
        <div
          style={{
            position: 'absolute',
            right: 45,
            top: 70,
            width: 700,
            height: 450,
          }}
        >
          <ProfilePlaceholder
            username="Azure"
            image={1}
            style={{
              left: 0,
              top: 0,
              transform:
                'perspective(1000px) rotateY(-9deg) rotateZ(3deg)',
              opacity: .65,
            }}
          />

          <ProfilePlaceholder
            username="vue"
            image={2}
            style={{
              left: 140,
              top: 35,
              transform:
                'perspective(1000px) rotateY(-5deg) rotateZ(2deg)',
              zIndex: 2,
            }}
          />

          <ProfilePlaceholder
            username="yourname"
            image={3}
            style={{
              left: 305,
              top: 75,
              transform:
                'perspective(1000px) rotateY(-2deg) rotateZ(-1deg)',
              zIndex: 3,
            }}
          />
        </div>

        {/* BOTTOM FADE */}
        <div
          style={{
            position: 'absolute',
            left: -100,
            right: -100,
            bottom: -80,
            height: 180,
            background:
              'linear-gradient(to bottom,transparent,#17101a 72%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      </section>

      {/* SMALL BOTTOM FADE */}
      <div
        style={{
          height: 160,
          marginTop: -100,
          position: 'relative',
          zIndex: 5,
          background:
            'linear-gradient(to bottom,transparent,#17101a)',
        }}
      />
    </main>
  )
}