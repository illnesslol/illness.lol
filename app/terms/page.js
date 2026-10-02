'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../../components/PageTransition'

const LAST_UPDATED = 'June 27, 2026'

const COLORS = {
  bg: '#000000',
  surface: '#0c0c0c',
  surfaceAlt: '#141414',
  orange: '#ff6a1a',
  orangeBright: '#ff8a3d',
  orangeSoft: 'rgba(255,106,26,.12)',
  orangeHover: 'rgba(255,106,26,.18)',
  orangeBorder: 'rgba(255,106,26,.5)',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
  line: 'rgba(255,255,255,.08)',
}

export default function TermsPage() {
  const canvasRef = useRef(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(Boolean(data.loggedIn))
        setAuthChecked(true)
      })
      .catch(() => setAuthChecked(true))

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const leafColors = [
      '#ff6a1a',
      '#ff8a3d',
      '#e85a0c',
      '#ffffff',
    ]

    const makeLeaf = () => ({
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * window.innerHeight,
      size: Math.random() * 5 + 7,
      speed: Math.random() * 0.35 + 0.35,
      swayAmp: Math.random() * 28 + 18,
      swaySpeed: Math.random() * 0.012 + 0.006,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.012,
      opacity: Math.random() * 0.2 + 0.18,
      color: leafColors[
        Math.floor(Math.random() * leafColors.length)
      ],
      baseX: 0,
    })

    const leaves = Array.from({ length: 10 }, makeLeaf)

    leaves.forEach(leaf => {
      leaf.baseX = leaf.x
    })

    const drawLeaf = (leaf) => {
      ctx.globalAlpha = leaf.opacity
      ctx.fillStyle = leaf.color

      ctx.beginPath()
      ctx.moveTo(0, -leaf.size)

      ctx.bezierCurveTo(
        leaf.size * 0.95,
        -leaf.size * 0.45,
        leaf.size * 0.7,
        leaf.size * 0.65,
        0,
        leaf.size
      )

      ctx.bezierCurveTo(
        -leaf.size * 0.7,
        leaf.size * 0.65,
        -leaf.size * 0.95,
        -leaf.size * 0.45,
        0,
        -leaf.size
      )

      ctx.fill()

      ctx.globalAlpha = leaf.opacity * 0.8
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1

      ctx.beginPath()
      ctx.moveTo(0, -leaf.size * 0.8)
      ctx.lineTo(0, leaf.size)
      ctx.stroke()

      ctx.globalAlpha = 1
    }

    let animationFrame
    let tick = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick += 1

      leaves.forEach(leaf => {
        if (!reduceMotion) {
          leaf.y += leaf.speed
          leaf.rotation += leaf.spin
        }

        const sway = reduceMotion
          ? 0
          : Math.sin(
              tick * leaf.swaySpeed + leaf.phase
            ) * leaf.swayAmp

        const x = leaf.baseX + sway

        if (leaf.y > canvas.height + 40) {
          leaf.y = -30
          leaf.baseX = Math.random() * canvas.width
        }

        ctx.save()

        ctx.translate(x, leaf.y)

        ctx.rotate(
          leaf.rotation +
            Math.sin(
              tick * leaf.swaySpeed + leaf.phase
            ) *
              0.5
        )

        drawLeaf(leaf)

        ctx.restore()
      })

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
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
        padding: '0 20px 100px',
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
          background: #000000;
        }

        ::selection {
          background: rgba(255, 106, 26, 0.4);
          color: #fff;
        }

        /* NAVBAR HOVER */

        .nav-link {
          position: relative;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .nav-link:hover {
          color: #fff !important;
          background: rgba(255, 106, 26, 0.12);
          box-shadow:
            0 0 18px rgba(255, 106, 26, 0.12),
            inset 0 0 12px rgba(255, 106, 26, 0.04);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 5px;
          height: 2px;
          border-radius: 999px;
          background: #ff6a1a;
          box-shadow: 0 0 10px rgba(255, 106, 26, 0.8);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.2s ease;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .hero-button {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
        }

        .primary-button:hover {
          box-shadow:
            0 0 30px rgba(255, 106, 26, 0.5) !important;
        }

        /* TERMS CARDS */

        .terms-section {
          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }

        .terms-section:hover {
          border-color: rgba(255, 106, 26, 0.28) !important;
          background: rgba(14, 12, 12, 0.96) !important;
          box-shadow:
            0 18px 55px rgba(0, 0, 0, 0.45),
            0 0 30px rgba(255, 106, 26, 0.045);
          transform: translateY(-1px);
        }

        .terms-link {
          transition:
            color 0.2s ease,
            border-color 0.2s ease;
        }

        .terms-link:hover {
          color: #ff8a3d !important;
          border-color: rgba(255, 138, 61, 0.7) !important;
        }

        @media (max-width: 800px) {
          .desktop-links {
            display: none !important;
          }

          .terms-section {
            padding: 25px 22px !important;
          }

          .terms-header {
            padding: 34px 24px !important;
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

          .terms-section {
            padding: 22px 18px !important;
          }

          .terms-header {
            padding: 30px 18px !important;
          }

          .terms-title {
            font-size: 25px !important;
          }
        }
      `}</style>

      {/* FALLING LEAVES */}
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

      {/* DOT GRID */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',
        }}
      />

      {/* ORANGE GLOW */}
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
            'radial-gradient(circle,rgba(255,106,26,.15),transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* NAVBAR */}
      <nav
        className="nav"
        style={{
          position: 'fixed',
          top: 21,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(1180px, calc(100% - 40px))',
          height: 70,
          borderRadius: 40,
          background: 'rgba(10,10,10,.92)',
          border: '1px solid rgba(255,255,255,.06)',
          boxShadow: '0 15px 50px rgba(0,0,0,.4)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px 0 28px',
          zIndex: 20,
          backdropFilter: 'blur(12px)',
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
              fontFamily: "'Space Grotesk', sans-serif",
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
            ['Leaderboard', '/leaderboard'],
            ['Pricing', '/pricing'],
            ['Questions', '/questions'],
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
                borderRadius: 9,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </TransitionLink>
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
          {!loggedIn && (
            <TransitionLink
              href="/login"
              className="nav-link nav-login"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 14,
                padding: '11px 14px',
                borderRadius: 9,
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
                background: 'rgba(255,106,26,.16)',
                border: '1px solid rgba(255,106,26,.55)',
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
                color: '#000',
                background: COLORS.orange,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 19px',
                borderRadius: 25,
                boxShadow:
                  '0 0 18px rgba(255,106,26,.25)',
              }}
            >
              Sign up
            </TransitionLink>
          )}
        </div>
      </nav>

      {/* CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 850,
          margin: '0 auto',
          paddingTop: 130,
        }}
      >
        {/* HEADER */}
        <div
          className="terms-header"
          style={{
            textAlign: 'center',
            padding: '45px 40px 38px',
            marginBottom: 18,
            borderRadius: 24,
            background:
              'linear-gradient(180deg,rgba(14,14,14,.96),rgba(8,8,8,.94))',
            border: '1px solid rgba(255,106,26,.22)',
            boxShadow:
              '0 20px 70px rgba(0,0,0,.5), 0 0 45px rgba(255,106,26,.05)',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              margin: '0 auto 18px',
              borderRadius: 11,
              overflow: 'hidden',
              boxShadow:
                '0 0 25px rgba(255,106,26,.3)',
            }}
          >
            <img
              src="/icon.png"
              alt=""
              width={48}
              height={48}
              style={{
                display: 'block',
                filter:
                  'drop-shadow(0 0 8px rgba(255,106,26,.45))',
              }}
            />
          </div>

          <h1
            className="terms-title"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              margin: 0,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: '-1px',
              color: '#fff',
            }}
          >
            Terms of Service
          </h1>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: COLORS.faint,
            }}
          >
            Last updated {LAST_UPDATED}
          </div>

          <div
            style={{
              width: 55,
              height: 2,
              margin: '22px auto 0',
              borderRadius: 999,
              background: COLORS.orange,
              boxShadow:
                '0 0 14px rgba(255,106,26,.7)',
            }}
          />
        </div>

        {/* INTRO */}
        <div
          className="terms-section"
          style={cardStyle}
        >
          <p style={paragraphStyle}>
            By using illness.lol, these Terms apply. They set
            out what you can put on your page, what we can do
            as the platform, and how we handle things when
            something doesn&apos;t go as planned.
          </p>
        </div>

        <Section title="1. Welcome">
          <p style={paragraphStyle}>
            illness.lol is a bio link platform — one shareable
            page where you collect your links, socials, and
            more. Pages can be public depending on your
            settings, so anything you put on yours might be
            visible to anyone. Only publish things you actually
            have the right to share.
          </p>

          <p style={paragraphStyle}>
            These Terms apply whenever you visit, sign in, or
            otherwise use illness.lol. Sticking around after we
            update them counts as agreeing to the new version.
          </p>
        </Section>

        <Section title="2. Changes to These Terms">
          <p style={paragraphStyle}>
            We can revise these Terms whenever it makes sense —
            to reflect new features, legal requirements, or how
            the Service works in practice. Updates go live when
            published here, and continuing to use illness.lol
            after that means you&apos;re on board.
          </p>

          <p style={paragraphStyle}>
            When a change meaningfully affects a paid plan,
            we&apos;ll do our best to give you a heads-up before
            it takes effect.
          </p>
        </Section>

        <Section title="3. Use of the Service">
          <p style={paragraphStyle}>
            illness.lol is here for you to use lawfully and
            within these Terms. Don&apos;t do anything that
            breaks, slows down, or destabilizes the Service, or
            makes it harder for others to enjoy their own page.
            In particular:
          </p>

          <ul style={listStyle}>
            <li style={listItemStyle}>
              Don&apos;t try to bypass our security, rate
              limits, or access controls.
            </li>

            <li style={listItemStyle}>
              Don&apos;t pretend to be someone else or imply
              we&apos;ve endorsed you when we haven&apos;t.
            </li>

            <li style={listItemStyle}>
              Don&apos;t access other users&apos; accounts or
              private data.
            </li>

            <li style={listItemStyle}>
              Don&apos;t run bots, scrapers, or automated
              tooling against the Service without written
              permission.
            </li>

            <li style={listItemStyle}>
              Don&apos;t upload or host malware, exploits, or
              harmful payloads.
            </li>

            <li style={listItemStyle}>
              Don&apos;t publish sexually explicit material,
              content that sexualizes minors, or content
              glorifying real-world violence.
            </li>
          </ul>
        </Section>

        <Section title="4. Account Usage">
          <p style={paragraphStyle}>
            Your account is yours alone. Don&apos;t share your
            credentials, hand out logins, or resell access —
            anything that happens under your account gets
            attributed to you.
          </p>

          <p style={paragraphStyle}>
            Patterns like coordinated abuse, ban evasion, or
            payment-method recycling usually trigger action
            across every account we can tie to the same
            activity.
          </p>
        </Section>

        <Section title="5. User-Posted Content">
          <p style={paragraphStyle}>
            Anything you put on the Service is yours to stand
            behind. By posting it, you confirm you own it or
            have permission to use it, and that it doesn&apos;t
            break the law or step on someone else&apos;s rights.
          </p>

          <p style={paragraphStyle}>
            When you post content, you grant illness.lol a
            worldwide, royalty-free license to host, store,
            copy, and display that content to the extent needed
            to run the Service. Your content stays yours
            throughout.
          </p>
        </Section>

        <Section title="6. Prohibited Content">
          <p style={paragraphStyle}>
            Some content and conduct we won&apos;t host on
            illness.lol, period:
          </p>

          <ul style={listStyle}>
            <li style={listItemStyle}>
              Anything that breaks local, national, or
              international law.
            </li>

            <li style={listItemStyle}>
              Content that infringes someone else&apos;s
              intellectual property or privacy rights.
            </li>

            <li style={listItemStyle}>
              Defamatory, pornographic, harassing, hateful, or
              exploitative material — and absolutely no
              sexualization of minors.
            </li>

            <li style={listItemStyle}>
              Scams, phishing pages, impersonation campaigns,
              or spam.
            </li>

            <li style={listItemStyle}>
              Malware, exploits, or tools meant to disrupt the
              Service.
            </li>

            <li style={listItemStyle}>
              Content glorifying violence, terrorism,
              discrimination, or self-harm.
            </li>
          </ul>
        </Section>

        <Section title="7. Purchases & Billing">
          <p style={paragraphStyle}>
            Whenever you buy something through the Service, the
            account and purchase details you provide need to be
            accurate and current. Placing an order means
            agreeing to pay the price shown at checkout.
          </p>

          <p style={paragraphStyle}>
            We may turn down any order or cap quantities per
            person. Orders that appear to be for resale may be
            refused.
          </p>
        </Section>

        <Section title="8. No Refund Policy">
          <p style={paragraphStyle}>
            Payments to illness.lol are final. Unless the law
            requires a refund, we don&apos;t refund for change
            of mind, unused services, or partial use of a plan.
          </p>

          <p style={paragraphStyle}>
            Filing a chargeback against a valid charge breaks
            these Terms and may result in account suspension.
          </p>
        </Section>

        <Section title="9. Privacy">
          <p style={paragraphStyle}>
            Using illness.lol also means our{' '}
            <TransitionLink
              href="/privacy"
              style={linkStyle}
              className="terms-link"
            >
              Privacy Policy
            </TransitionLink>{' '}
            applies. It explains what we collect, why we
            collect it, and the choices you have.
          </p>
        </Section>

        <Section title="10. Intellectual Property">
          <p style={paragraphStyle}>
            The Service and materials we provide — your own
            content excepted — are protected by copyright and
            other IP laws. Unless explicitly permitted, you
            can&apos;t copy, redistribute, or reverse-engineer
            any part of the Service without our written
            permission.
          </p>
        </Section>

        <Section title="11. Disclaimer of Warranties">
          <p style={paragraphStyle}>
            illness.lol is provided &quot;as is&quot; and
            &quot;as available,&quot; with no warranties of any
            kind. We can&apos;t promise the Service will always
            be online, secure, or free of errors. You use it at
            your own risk.
          </p>
        </Section>

        <Section title="12. Term & Termination">
          <p style={paragraphStyle}>
            These Terms apply from the moment you first use the
            Service. You can leave whenever you want. On our
            side, we can suspend, restrict, or terminate
            accounts for any reason these Terms allow —
            violations, misuse, fraud, or operational needs.
          </p>
        </Section>

        <Section title="13. Contact">
          <p style={paragraphStyle}>
            Got a question or something to flag? Reach us on
            our Discord server at discord.gg/illness or through
            the platform.
          </p>
        </Section>

        {/* BOTTOM */}
        <div
          style={{
            textAlign: 'center',
            padding: '25px 0 10px',
            color: 'rgba(255,255,255,.3)',
            fontSize: 12,
          }}
        >
          illness.lol
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <div
      className="terms-section"
      style={cardStyle}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 3,
            height: 18,
            borderRadius: 999,
            background: COLORS.orange,
            boxShadow:
              '0 0 10px rgba(255,106,26,.55)',
            flexShrink: 0,
          }}
        />

        <h2 style={headingStyle}>
          {title}
        </h2>
      </div>

      {children}
    </div>
  )
}

const cardStyle = {
  background:
    'linear-gradient(180deg,rgba(14,14,14,.94),rgba(9,9,9,.94))',
  border: '1px solid rgba(255,255,255,.07)',
  borderRadius: 18,
  padding: '30px 32px',
  marginBottom: 14,
  boxShadow:
    '0 15px 50px rgba(0,0,0,.35)',
}

const headingStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: COLORS.orangeBright,
  margin: 0,
}

const paragraphStyle = {
  fontSize: 14.5,
  lineHeight: 1.75,
  color: 'rgba(255,255,255,.72)',
  margin: '0 0 13px',
}

const listStyle = {
  margin: '4px 0 4px',
  paddingLeft: 19,
  display: 'flex',
  flexDirection: 'column',
  gap: 9,
}

const listItemStyle = {
  fontSize: 14.5,
  lineHeight: 1.65,
  color: 'rgba(255,255,255,.72)',
  paddingLeft: 3,
}

const linkStyle = {
  color: COLORS.orangeBright,
  textDecoration: 'none',
  borderBottom:
    '1px solid rgba(255,138,61,.35)',
}
