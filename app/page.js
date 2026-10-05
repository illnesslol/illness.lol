'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../components/PageTransition'

const COLORS = {
  bg: '#050505',
  surface: '#0c0c0c',
  surfaceAlt: '#141414',
  orange: '#ff6a1a',
  orangeBright: '#ff8a3d',
  orangeSoft: 'rgba(255,106,26,.16)',
  orangeBorder: 'rgba(255,106,26,.5)',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
  line: 'rgba(255,255,255,.08)',
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
   FOOTER COMPONENTS
========================================================= */

function FooterTitle({ children }) {
  return (
    <div
      style={{
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 17,
      }}
    >
      {children}
    </div>
  )
}


function FooterLink({
  href,
  children,
  target,
  rel,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <TransitionLink
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        width: 'fit-content',
        marginBottom: 11,

        color: hovered
          ? COLORS.orangeBright
          : 'rgba(255,255,255,.48)',

        textDecoration: 'none',
        fontSize: 13,

        transition:
          'color .2s ease, transform .2s ease',

        transform: hovered
          ? 'translateX(2px)'
          : 'translateX(0)',
      }}
    >
      {children}
    </TransitionLink>
  )
}


/* =========================================================
   FALLING LEAVES
========================================================= */

function drawLeaf(
  ctx,
  size,
  color,
  opacity
) {
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

  ctx.globalAlpha =
    opacity * 0.9

  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1

  ctx.beginPath()

  ctx.moveTo(
    0,
    -size * 0.85
  )

  ctx.lineTo(
    0,
    size * 1.15
  )

  ctx.stroke()

  ctx.globalAlpha = 1
}


/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  const canvasRef = useRef(null)

  const [visible, setVisible] =
    useState(false)

  const [authChecked, setAuthChecked] =
    useState(false)

  const [loggedIn, setLoggedIn] =
    useState(false)


  /* =======================================================
     ANIMATION + AUTH
  ======================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 100)

    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(
          Boolean(data.loggedIn)
        )

        setAuthChecked(true)
      })
      .catch(() => {
        setAuthChecked(true)
      })


    const canvas = canvasRef.current

    if (!canvas) {
      return () =>
        clearTimeout(timer)
    }

    const ctx =
      canvas.getContext('2d')

    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches


    const resize = () => {
      canvas.width =
        window.innerWidth

      canvas.height =
        window.innerHeight
    }

    resize()

    window.addEventListener(
      'resize',
      resize
    )


    const leafColors = [
      '#ff6a1a',
      '#ff8a3d',
      '#e85a0c',
      '#ffffff',
    ]


    const makeLeaf = (
      spreadY = false
    ) => ({
      x:
        Math.random() *
        window.innerWidth,

      y: spreadY
        ? Math.random() *
          window.innerHeight
        : -30 -
          Math.random() * 120,

      size:
        Math.random() * 6 + 9,

      speed:
        Math.random() * 0.35 +
        0.35,

      swayAmp:
        Math.random() * 30 +
        20,

      swaySpeed:
        Math.random() * 0.012 +
        0.006,

      phase:
        Math.random() *
        Math.PI *
        2,

      rotation:
        Math.random() *
        Math.PI *
        2,

      spin:
        (Math.random() - 0.5) *
        0.012,

      opacity:
        Math.random() * 0.2 +
        0.22,

      color:
        leafColors[
          Math.floor(
            Math.random() *
              leafColors.length
          )
        ],

      baseX: 0,
    })


    const leaves =
      Array.from(
        { length: 7 },
        () => makeLeaf(true)
      )


    leaves.forEach(l => {
      l.baseX = l.x
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


      leaves.forEach(l => {
        if (!reduceMotion) {
          l.y += l.speed
          l.rotation += l.spin
        }


        const sway =
          reduceMotion
            ? 0
            : Math.sin(
                tick *
                  l.swaySpeed +
                  l.phase
              ) *
              l.swayAmp


        const x =
          l.baseX + sway


        if (
          l.y >
          canvas.height + 40
        ) {
          l.y = -30

          l.baseX =
            Math.random() *
            canvas.width
        }


        ctx.save()


        ctx.translate(
          x,
          l.y
        )


        ctx.rotate(
          l.rotation +
            Math.sin(
              tick *
                l.swaySpeed +
                l.phase
            ) *
              0.5
        )


        drawLeaf(
          ctx,
          l.size,
          l.color,
          l.opacity
        )


        ctx.restore()
      })


      animationFrame =
        requestAnimationFrame(draw)
    }


    draw()


    return () => {
      clearTimeout(timer)

      cancelAnimationFrame(
        animationFrame
      )

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

        background:
          '#050505',

        color: '#fff',

        fontFamily:
          "'Inter', system-ui, sans-serif",

        position: 'relative',

        overflow: 'hidden',
      }}
    >

      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',

          background: `
            radial-gradient(
              ellipse 75% 60% at 50% 0%,
              rgba(255,106,26,.18) 0%,
              rgba(255,106,26,.08) 28%,
              rgba(255,106,26,.025) 48%,
              transparent 72%
            ),
            radial-gradient(
              ellipse 50% 55% at 5% 48%,
              rgba(255,106,26,.075),
              transparent 70%
            ),
            radial-gradient(
              ellipse 50% 55% at 95% 62%,
              rgba(255,80,10,.055),
              transparent 70%
            ),
            radial-gradient(
              ellipse 60% 40% at 50% 100%,
              rgba(255,106,26,.025),
              transparent 70%
            ),
            linear-gradient(
              180deg,
              #0a0a0a 0%,
              #070707 30%,
              #050505 65%,
              #020202 100%
            )
          `,
        }}
      />


      {/* =====================================================
          LARGE SOFT CENTER LIGHT
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',

          width: 1000,
          height: 1000,

          left: '50%',
          top: '28%',

          transform:
            'translate(-50%, -50%)',

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(255,106,26,.065), rgba(255,106,26,.018) 38%, transparent 70%)',

          filter:
            'blur(25px)',

          pointerEvents: 'none',

          zIndex: 0,
        }}
      />


      {/* =====================================================
          TOP ORANGE LIGHT
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',

          top: -500,
          left: '50%',

          transform:
            'translateX(-50%)',

          width: 1200,
          height: 850,

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(255,106,26,.16), rgba(255,106,26,.04) 42%, transparent 70%)',

          filter:
            'blur(12px)',

          pointerEvents: 'none',

          zIndex: 0,
        }}
      />


      {/* =====================================================
          SIDE AMBIENT GLOW — LEFT
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',

          left: -350,
          top: '38%',

          width: 700,
          height: 700,

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(255,106,26,.055), transparent 68%)',

          filter:
            'blur(20px)',

          pointerEvents: 'none',

          zIndex: 0,
        }}
      />


      {/* =====================================================
          SIDE AMBIENT GLOW — RIGHT
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',

          right: -350,
          top: '48%',

          width: 700,
          height: 700,

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(255,80,10,.045), transparent 68%)',

          filter:
            'blur(20px)',

          pointerEvents: 'none',

          zIndex: 0,
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
            'radial-gradient(rgba(255,255,255,.065) 1px, transparent 1px)',

          backgroundSize:
            '28px 28px',

          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 15%, transparent 78%)',

          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 15%, transparent 78%)',
        }}
      />


      {/* =====================================================
          SUBTLE VIGNETTE
      ===================================================== */}

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',

          inset: 0,

          zIndex: 0,

          pointerEvents: 'none',

          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.38) 100%)',
        }}
      />


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
          background: #050505;
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

        .hero-button {
          transition:
            color .2s ease,
            background .2s ease,
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }

        .primary-button:hover {
          box-shadow:
            0 0 25px rgba(255,106,26,.35),
            0 0 55px rgba(255,106,26,.12) !important;
        }

        .footer-link {
          transition:
            color .2s ease,
            transform .2s ease;
        }

        @media (max-width: 1100px) {
          .showcase {
            transform:
              translateX(-50%)
              scale(.82) !important;

            transform-origin:
              top center;
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
            transform:
              translateX(-50%)
              scale(.58) !important;

            height: 300px !important;

            margin-top: 10px !important;
          }

          .footer-grid {
            grid-template-columns:
              1fr 1fr !important;
          }
        }

        @media (max-width: 520px) {
          .nav {
            width:
              calc(100% - 24px) !important;
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
            transform:
              translateX(-50%)
              scale(.42) !important;

            height: 220px !important;
          }

          .footer-grid {
            grid-template-columns:
              1fr !important;

            gap: 32px !important;
          }

          .bottom-cta {
            padding:
              45px 24px !important;
          }

          .footer-bottom {
            align-items:
              flex-start !important;

            flex-direction:
              column !important;
          }
        }
      `}</style>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className="nav"
        style={{
          position: 'absolute',

          top: 21,

          left: '50%',

          transform:
            'translateX(-50%)',

          width:
            'min(1180px, calc(100% - 40px))',

          height: 70,

          borderRadius: 40,

          background:
            'rgba(10,10,10,.88)',

          backdropFilter:
            'blur(18px)',

          WebkitBackdropFilter:
            'blur(18px)',

          border:
            '1px solid rgba(255,255,255,.07)',

          boxShadow:
            '0 15px 50px rgba(0,0,0,.4), 0 0 35px rgba(255,106,26,.025)',

          display: 'flex',

          alignItems: 'center',

          padding:
            '0 22px 0 28px',

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

            transform:
              'translateX(-50%)',

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

            [
              'Leaderboard',
              '/leaderboard',
            ],

            [
              'Pricing',
              '/pricing',
            ],

            [
              'Questions',
              '/questions',
            ],
          ].map(
            ([label, href]) => (
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
                  color:
                    COLORS.muted,

                  textDecoration:
                    'none',

                  fontSize: 14,

                  padding:
                    '9px 13px',

                  whiteSpace:
                    'nowrap',

                  border:
                    '1px solid transparent',

                  borderRadius: 12,

                  background:
                    'transparent',

                  boxShadow:
                    'none',
                }}
              >
                {label}
              </AccentLink>
            )
          )}
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

          {!loggedIn && (
            <AccentLink
              href="/login"
              className="nav-login nav-link"
              style={{
                color:
                  COLORS.muted,

                textDecoration:
                  'none',

                fontSize: 14,

                padding:
                  '9px 13px',

                border:
                  '1px solid transparent',

                borderRadius: 12,

                background:
                  'transparent',

                boxShadow:
                  'none',
              }}
            >
              Log in
            </AccentLink>
          )}


          {authChecked &&
          loggedIn ? (
            <AccentLink
              href="/dashboard"
              className="hero-button"
              style={{
                color: '#fff',

                background:
                  'rgba(255,106,26,.16)',

                border:
                  '1px solid rgba(255,106,26,.55)',

                textDecoration:
                  'none',

                fontSize: 14,

                fontWeight: 500,

                padding:
                  '11px 17px',

                borderRadius: 25,

                boxShadow:
                  '0 0 12px rgba(255,106,26,.08)',
              }}
            >
              Dashboard
            </AccentLink>
          ) : (
            <AccentLink
              href="/signup"
              className="hero-button"
              style={{
                color: '#000',

                background:
                  COLORS.orange,

                textDecoration:
                  'none',

                fontSize: 14,

                fontWeight: 600,

                padding:
                  '12px 19px',

                borderRadius: 25,

                border:
                  '1px solid transparent',

                boxShadow:
                  '0 0 18px rgba(255,106,26,.25)',
              }}
            >
              Sign up
            </AccentLink>
          )}

        </div>
      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

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

          opacity:
            visible ? 1 : 0,

          transform:
            visible
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

            letterSpacing:
              '-1.5px',

            fontWeight: 600,

            margin: 0,

            color: '#fff',

            textShadow:
              '0 4px 35px rgba(0,0,0,.55)',
          }}
        >
          Everything you want,
          right here.
        </h1>


        <p
          className="hero-subtitle"
          style={{
            maxWidth: 720,

            margin:
              '17px auto 25px',

            fontSize: 17,

            lineHeight: 1.6,

            color:
              COLORS.muted,

            textShadow:
              '0 2px 20px rgba(0,0,0,.5)',
          }}
        >
          illness.lol is your go-to
          for modern, feature rich
          custom bio pages and fast,
          secure file hosting
        </p>


        <div
          style={{
            display: 'flex',

            gap: 10,

            alignItems: 'center',

            justifyContent:
              'center',

            flexWrap: 'wrap',
          }}
        >

          <AccentLink
            href="/signup"
            className="hero-button primary-button"
            style={{
              display:
                'inline-flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              padding:
                '12px 18px',

              borderRadius: 14,

              color: '#000',

              background:
                COLORS.orange,

              textDecoration:
                'none',

              fontSize: 14,

              fontWeight: 600,

              border:
                '1px solid transparent',

              boxShadow:
                '0 0 20px rgba(255,106,26,.3)',
            }}
          >
            Sign Up for Free
          </AccentLink>


          <AccentLink
            href="/pricing"
            className="hero-button"
            style={{
              display:
                'inline-flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              padding:
                '12px 18px',

              borderRadius: 14,

              color: '#fff',

              background:
                'rgba(255,255,255,.04)',

              border:
                '1px solid rgba(255,255,255,.14)',

              textDecoration:
                'none',

              fontSize: 14,

              fontWeight: 500,

              backdropFilter:
                'blur(10px)',
            }}
          >
            View Pricing
          </AccentLink>

        </div>
      </section>


      {/* =====================================================
          SHOWCASE
      ===================================================== */}

      <section
        className="showcase"
        style={{
          position: 'relative',

          zIndex: 3,

          width: 1500,

          height: 500,

          margin:
            '-160px auto 0',

          left: '50%',

          transform:
            'translateX(-50%)',
        }}
      >

        {/* =================================================
            REAL DASHBOARD IMAGE — LEFT
        ================================================= */}

        <div
          style={{
            position: 'absolute',

            /*
             * Move the dashboard farther left.
             * Change this to -150, -200, etc.
             * if you want it even farther out.
             */
            left: -100,

            top: 20,

            width: 820,

            height: 480,

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            perspective: 1400,

            zIndex: 2,
          }}
        >
          <img
            src="/dashboard.png"
            alt="Dashboard preview"
            style={{
              display: 'block',

              width: 790,

              height: 'auto',

              borderRadius: 26,

              border:
                `2px solid ${COLORS.orangeBorder}`,

              boxShadow:
                '0 0 35px rgba(255,106,26,.14), 0 30px 100px rgba(0,0,0,.85)',

              objectFit: 'cover',

              /*
               * Positive Y rotation makes the
               * dashboard face inward toward the right.
               */
              transform:
                'perspective(1400px) rotateY(8deg) rotateZ(4deg)',

              transformOrigin:
                'center center',
            }}
          />
        </div>


        {/* =================================================
            RIGHT PLACEHOLDER
        ================================================= */}

        <div
          style={{
            position: 'absolute',

            right: 20,

            top: 85,

            width: 500,

            height: 330,

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'center',

            border:
              '1px solid rgba(255,106,26,.16)',

            borderRadius: 26,

            background:
              'linear-gradient(135deg, rgba(255,106,26,.035), rgba(255,255,255,.012))',

            boxShadow:
              '0 25px 80px rgba(0,0,0,.5)',

            transform:
              'perspective(1200px) rotateY(-5deg) rotateZ(-2deg)',

            overflow: 'hidden',

            zIndex: 1,
          }}
        >

          <div
            style={{
              textAlign: 'center',

              color:
                'rgba(255,255,255,.28)',

              fontFamily:
                "'Space Grotesk', sans-serif",
            }}
          >

            <div
              style={{
                fontSize: 28,

                fontWeight: 600,

                marginBottom: 8,
              }}
            >
              Placeholder
            </div>


            <div
              style={{
                fontSize: 13,

                color:
                  'rgba(255,255,255,.18)',
              }}
            >
              Your profile preview goes here
            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM FADE
        ================================================= */}

        <div
          style={{
            position: 'absolute',

            left: -150,

            right: -150,

            bottom: -80,

            height: 180,

            background:
              'linear-gradient(to bottom, transparent, #050505 72%)',

            pointerEvents:
              'none',

            zIndex: 10,
          }}
        />

      </section>


      {/* =====================================================
          SMALL BOTTOM FADE
      ===================================================== */}

      <div
        style={{
          height: 160,

          marginTop: -100,

          position: 'relative',

          zIndex: 5,

          background:
            'linear-gradient(to bottom, transparent, #050505)',
        }}
      />


      {/* =====================================================
          LOWER CONTENT
      ===================================================== */}

      <section
        style={{
          position: 'relative',

          zIndex: 6,

          maxWidth: 1180,

          margin: '0 auto',

          padding:
            '80px 24px 0',
        }}
      >

        {/* =================================================
            CTA
        ================================================= */}

        <div
          className="bottom-cta"
          style={{
            position: 'relative',

            overflow: 'hidden',

            padding:
              '65px 40px',

            borderRadius: 28,

            border:
              '1px solid rgba(255,106,26,.22)',

            background:
              'linear-gradient(135deg, rgba(255,106,26,.10), rgba(255,255,255,.025) 55%, rgba(255,255,255,.015))',

            boxShadow:
              '0 25px 80px rgba(0,0,0,.45), 0 0 60px rgba(255,106,26,.025)',

            textAlign: 'center',

            backdropFilter:
              'blur(8px)',
          }}
        >

          {/* CTA GLOW */}

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',

              width: 450,

              height: 450,

              left: '50%',

              top: '50%',

              transform:
                'translate(-50%, -50%)',

              background:
                'radial-gradient(circle, rgba(255,106,26,.13), transparent 68%)',

              pointerEvents:
                'none',
            }}
          />


          <div
            style={{
              position: 'relative',

              zIndex: 1,
            }}
          >

            <div
              style={{
                display:
                  'inline-flex',

                padding:
                  '7px 12px',

                borderRadius:
                  999,

                border:
                  '1px solid rgba(255,106,26,.25)',

                background:
                  'rgba(255,106,26,.08)',

                color:
                  COLORS.orangeBright,

                fontSize: 12,

                fontWeight: 600,

                marginBottom: 18,
              }}
            >
              illness.lol
            </div>


            <h2
              style={{
                margin: 0,

                fontFamily:
                  "'Space Grotesk', sans-serif",

                fontSize: 34,

                letterSpacing:
                  '-1px',

                lineHeight: 1.2,
              }}
            >
              Your corner of the internet.
            </h2>


            <p
              style={{
                maxWidth: 560,

                margin:
                  '14px auto 25px',

                color:
                  COLORS.muted,

                lineHeight: 1.6,

                fontSize: 15,
              }}
            >
              Create your custom profile,
              share your links, host your
              files, and make your presence
              yours.
            </p>


            <div
              style={{
                display: 'flex',

                justifyContent:
                  'center',

                gap: 10,

                flexWrap: 'wrap',
              }}
            >

              <AccentLink
                href="/signup"
                style={{
                  display:
                    'inline-flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  padding:
                    '12px 20px',

                  borderRadius: 13,

                  background:
                    COLORS.orange,

                  color: '#000',

                  textDecoration:
                    'none',

                  fontSize: 14,

                  fontWeight: 600,
                }}
              >
                Get Started
              </AccentLink>


              <AccentLink
                href="/pricing"
                style={{
                  display:
                    'inline-flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  padding:
                    '12px 20px',

                  borderRadius: 13,

                  background:
                    'rgba(255,255,255,.05)',

                  border:
                    '1px solid rgba(255,255,255,.12)',

                  color: '#fff',

                  textDecoration:
                    'none',

                  fontSize: 14,
                }}
              >
                View Pricing
              </AccentLink>

            </div>

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer
          style={{
            marginTop: 75,

            padding:
              '50px 0 35px',

            borderTop:
              '1px solid rgba(255,255,255,.07)',
          }}
        >

          <div
            className="footer-grid"
            style={{
              display: 'grid',

              gridTemplateColumns:
                'minmax(240px, 1.8fr) repeat(3, minmax(120px, 1fr))',

              gap: 45,
            }}
          >

            {/* BRAND */}

            <div>

              <TransitionLink
                href="/"
                style={{
                  display:
                    'inline-flex',

                  alignItems:
                    'center',

                  gap: 11,

                  color: '#fff',

                  textDecoration:
                    'none',
                }}
              >

                <img
                  src="/icon.png"
                  alt=""
                  width={29}
                  height={29}
                  style={{
                    filter:
                      'drop-shadow(0 0 10px rgba(255,106,26,.3))',
                  }}
                />

                <span
                  style={{
                    fontFamily:
                      "'Space Grotesk', sans-serif",

                    fontSize: 19,

                    fontWeight: 600,
                  }}
                >
                  illness.lol
                </span>

              </TransitionLink>


              <p
                style={{
                  maxWidth: 290,

                  margin:
                    '16px 0 0',

                  color:
                    COLORS.faint,

                  fontSize: 13,

                  lineHeight: 1.7,
                }}
              >
                Hello absentvirtue was
                here 10/8
              </p>

            </div>


            {/* PRODUCT */}

            <div>

              <FooterTitle>
                Product
              </FooterTitle>

              <FooterLink href="/pricing">
                Pricing
              </FooterLink>

              <FooterLink href="/dashboard">
                Dashboard
              </FooterLink>

              <FooterLink href="/leaderboard">
                Leaderboard
              </FooterLink>

              <FooterLink href="/questions">
                Questions
              </FooterLink>

            </div>


            {/* RESOURCES */}

            <div>

              <FooterTitle>
                Resources
              </FooterTitle>

              <FooterLink href="/help">
                Help Center
              </FooterLink>

              <FooterLink
                href="https://discord.gg/R4tyQ4h3K5"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </FooterLink>

              <FooterLink href="/login">
                Log in
              </FooterLink>

              <FooterLink href="/signup">
                Sign up
              </FooterLink>

            </div>


            {/* LEGAL */}

            <div>

              <FooterTitle>
                Legal
              </FooterTitle>

              <FooterLink href="/privacy">
                Privacy Policy
              </FooterLink>

              <FooterLink href="/terms">
                Terms of Service
              </FooterLink>

              <FooterLink href="/help">
                Contact / Support
              </FooterLink>

            </div>

          </div>


          {/* FOOTER BOTTOM */}

          <div
            className="footer-bottom"
            style={{
              marginTop: 45,

              paddingTop: 22,

              borderTop:
                '1px solid rgba(255,255,255,.06)',

              display: 'flex',

              alignItems: 'center',

              justifyContent:
                'space-between',

              gap: 20,

              flexWrap: 'wrap',
            }}
          >

            <span
              style={{
                color:
                  'rgba(255,255,255,.35)',

                fontSize: 12,
              }}
            >
              © {new Date().getFullYear()} illness.lol.
              All rights reserved.
            </span>


            <span
              style={{
                color:
                  'rgba(255,255,255,.25)',

                fontSize: 12,
              }}
            >
              Made with ♥
            </span>

          </div>

        </footer>

      </section>

    </main>
  )
}
