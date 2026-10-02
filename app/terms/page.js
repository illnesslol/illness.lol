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
  orangeSoft: 'rgba(255,106,26,.16)',
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

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.18 + 0.025,
    }))

    let animationFrame

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,106,26,${p.opacity})`
        ctx.fill()
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
        padding: '0 20px 80px',
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
          background: rgba(255,106,26,.4);
          color: #fff;
        }

        a:focus-visible {
          outline: 2px solid #ff6a1a;
          outline-offset: 3px;
        }

        /* NAV LINKS */

        .nav-link {
          transition:
            color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
        }

        .nav-link:hover {
          color: #fff !important;
          background: rgba(255,106,26,.10);
          box-shadow: inset 0 0 0 1px rgba(255,106,26,.12);
        }

        /* BRAND
           Intentionally no box/background hover.
        */

        .brand-link {
          transition: color .2s ease;
        }

        .brand-link:hover {
          color: #ff8a3d !important;
        }

        .brand-link:hover img {
          filter: drop-shadow(0 0 12px rgba(255,106,26,.65));
        }

        /* BUTTONS */

        .hero-button {
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
        }

        .primary-button:hover {
          box-shadow: 0 0 30px rgba(255,106,26,.5) !important;
        }

        /* CONTENT */

        .terms-card {
          transition:
            border-color .25s ease,
            box-shadow .25s ease;
        }

        .terms-card:hover {
          border-color: rgba(255,106,26,.32) !important;
          box-shadow:
            0 20px 70px rgba(0,0,0,.55),
            0 0 45px rgba(255,106,26,.08) !important;
        }

        .terms-link {
          transition:
            color .2s ease,
            border-color .2s ease;
        }

        .terms-link:hover {
          color: #ff8a3d !important;
          border-color: rgba(255,138,61,.7) !important;
        }

        @media (max-width: 800px) {
          .desktop-links {
            display: none !important;
          }

          .terms-card {
            padding: 36px 28px !important;
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

          .terms-card {
            padding: 30px 22px !important;
            border-radius: 20px !important;
          }

          .terms-title {
            font-size: 25px !important;
          }
        }
      `}</style>

      {/* PARTICLES */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
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
            'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 25%, #000 15%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 25%, #000 15%, transparent 78%)',
        }}
      />

      {/* ORANGE GLOW */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -380,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1000,
          height: 700,
          borderRadius: '50%',
          background:
            'radial-gradient(circle,rgba(255,106,26,.14),transparent 68%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* NAV */}
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
        }}
      >
        {/* BRAND */}
        <TransitionLink
          href="/"
          className="brand-link"
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
              filter: 'drop-shadow(0 0 10px rgba(255,106,26,.35))',
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
                whiteSpace: 'nowrap',
                borderRadius: 12,
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
              className="nav-login nav-link"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 14,
                padding: '11px 14px',
                borderRadius: 12,
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
              className="hero-button primary-button"
              style={{
                color: '#000',
                background: COLORS.orange,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 19px',
                borderRadius: 25,
                boxShadow: '0 0 18px rgba(255,106,26,.25)',
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
          zIndex: 1,
          maxWidth: 760,
          margin: '0 auto',
          paddingTop: 130,
        }}
      >
        <div
          className="terms-card"
          style={{
            background: 'rgba(12,12,12,.88)',
            border: '1px solid rgba(255,106,26,.22)',
            borderRadius: 24,
            padding: '48px 44px',
            boxShadow:
              '0 20px 70px rgba(0,0,0,.55), 0 0 40px rgba(255,106,26,.06)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* ICON */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <img
              src="/icon.png"
              alt=""
              width={44}
              height={44}
              style={{
                display: 'block',
                objectFit: 'contain',
                filter:
                  'drop-shadow(0 0 14px rgba(255,106,26,.4))',
              }}
            />
          </div>

          {/* TITLE */}
          <h1
            className="terms-title"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              textAlign: 'center',
              margin: '0 0 8px',
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-.8px',
              color: '#fff',
            }}
          >
            Terms of Service
          </h1>

          <div
            style={{
              textAlign: 'center',
              marginBottom: 40,
              fontSize: 13,
              color: COLORS.faint,
            }}
          >
            Last updated {LAST_UPDATED}
          </div>

          <p style={paragraphStyle}>
            By using illness.lol, these Terms apply. They set out what you
            can put on your page, what we can do as the platform, and how we
            handle things when something doesn&apos;t go as planned.
          </p>

          <Section title="1. Welcome">
            <p style={paragraphStyle}>
              illness.lol is a bio link platform — one shareable page where
              you collect your links, socials, and more. Pages can be public
              depending on your settings, so anything you put on yours might
              be visible to anyone. Only publish things you actually have the
              right to share.
            </p>

            <p style={paragraphStyle}>
              These Terms apply whenever you visit, sign in, or otherwise use
              illness.lol. Sticking around after we update them counts as
              agreeing to the new version.
            </p>
          </Section>

          <Section title="2. Changes to These Terms">
            <p style={paragraphStyle}>
              We can revise these Terms whenever it makes sense — to reflect
              new features, legal requirements, or how the Service works in
              practice. Updates go live when published here, and continuing to
              use illness.lol after that means you&apos;re on board.
            </p>

            <p style={paragraphStyle}>
              When a change meaningfully affects a paid plan, we&apos;ll do
              our best to give you a heads-up before it takes effect.
            </p>
          </Section>

          <Section title="3. Use of the Service">
            <p style={paragraphStyle}>
              illness.lol is here for you to use lawfully and within these
              Terms. Don&apos;t do anything that breaks, slows down, or
              destabilizes the Service, or makes it harder for others to enjoy
              their own page. In particular:
            </p>

            <ul style={listStyle}>
              <li style={listItemStyle}>
                Don&apos;t try to bypass our security, rate limits, or access
                controls.
              </li>

              <li style={listItemStyle}>
                Don&apos;t pretend to be someone else or imply we&apos;ve
                endorsed you when we haven&apos;t.
              </li>

              <li style={listItemStyle}>
                Don&apos;t access other users&apos; accounts or private data.
              </li>

              <li style={listItemStyle}>
                Don&apos;t run bots, scrapers, or automated tooling against the
                Service without written permission.
              </li>

              <li style={listItemStyle}>
                Don&apos;t upload or host malware, exploits, or harmful
                payloads.
              </li>

              <li style={listItemStyle}>
                Don&apos;t publish sexually explicit material, content that
                sexualizes minors, or content glorifying real-world violence.
              </li>
            </ul>
          </Section>

          <Section title="4. Account Usage">
            <p style={paragraphStyle}>
              Your account is yours alone. Don&apos;t share your credentials,
              hand out logins, or resell access — anything that happens under
              your account gets attributed to you.
            </p>

            <p style={paragraphStyle}>
              Patterns like coordinated abuse, ban evasion, or
              payment-method recycling usually trigger action across every
              account we can tie to the same activity.
            </p>
          </Section>

          <Section title="5. User-Posted Content">
            <p style={paragraphStyle}>
              Anything you put on the Service is yours to stand behind. By
              posting it, you confirm you own it or have permission to use it,
              and that it doesn&apos;t break the law or step on someone
              else&apos;s rights.
            </p>

            <p style={paragraphStyle}>
              When you post content, you grant illness.lol a worldwide,
              royalty-free license to host, store, copy, and display that
              content to the extent needed to run the Service. Your content
              stays yours throughout.
            </p>
          </Section>

          <Section title="6. Prohibited Content">
            <p style={paragraphStyle}>
              Some content and conduct we won&apos;t host on illness.lol,
              period:
            </p>

            <ul style={listStyle}>
              <li style={listItemStyle}>
                Anything that breaks local, national, or international law.
              </li>

              <li style={listItemStyle}>
                Content that infringes someone else&apos;s intellectual
                property or privacy rights.
              </li>

              <li style={listItemStyle}>
                Defamatory, pornographic, harassing, hateful, or exploitative
                material — and absolutely no sexualization of minors.
              </li>

              <li style={listItemStyle}>
                Scams, phishing pages, impersonation campaigns, or spam.
              </li>

              <li style={listItemStyle}>
                Malware, exploits, or tools meant to disrupt the Service.
              </li>

              <li style={listItemStyle}>
                Content glorifying violence, terrorism, discrimination, or
                self-harm.
              </li>
            </ul>
          </Section>

          <Section title="7. Purchases & Billing">
            <p style={paragraphStyle}>
              Whenever you buy something through the Service, the account and
              purchase details you provide need to be accurate and current.
              Placing an order means agreeing to pay the price shown at
              checkout.
            </p>

            <p style={paragraphStyle}>
              We may turn down any order or cap quantities per person. Orders
              that appear to be for resale may be refused.
            </p>
          </Section>

          <Section title="8. No Refund Policy">
            <p style={paragraphStyle}>
              Payments to illness.lol are final. Unless the law requires a
              refund, we don&apos;t refund for change of mind, unused
              services, or partial use of a plan.
            </p>

            <p style={paragraphStyle}>
              Filing a chargeback against a valid charge breaks these Terms
              and may result in account suspension.
            </p>
          </Section>

          <Section title="9. Privacy">
            <p style={paragraphStyle}>
              Using illness.lol also means our{' '}
              <TransitionLink
                href="/privacy"
                className="terms-link"
                style={linkStyle}
              >
                Privacy Policy
              </TransitionLink>{' '}
              applies. It explains what we collect, why we collect it, and the
              choices you have.
            </p>
          </Section>

          <Section title="10. Intellectual Property">
            <p style={paragraphStyle}>
              The Service and materials we provide — your own content excepted
              — are protected by copyright and other IP laws. Unless explicitly
              permitted, you can&apos;t copy, redistribute, or reverse-engineer
              any part of the Service without our written permission.
            </p>
          </Section>

          <Section title="11. Disclaimer of Warranties">
            <p style={paragraphStyle}>
              illness.lol is provided &quot;as is&quot; and &quot;as
              available,&quot; with no warranties of any kind. We can&apos;t
              promise the Service will always be online, secure, or free of
              errors. You use it at your own risk.
            </p>
          </Section>

          <Section title="12. Term & Termination">
            <p style={paragraphStyle}>
              These Terms apply from the moment you first use the Service. You
              can leave whenever you want. On our side, we can suspend,
              restrict, or terminate accounts for any reason these Terms allow
              — violations, misuse, fraud, or operational needs.
            </p>
          </Section>

          <Section title="13. Contact">
            <p style={paragraphStyle}>
              Got a question or something to flag? Reach us on our Discord
              server at discord.gg/illness or through the platform.
            </p>
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <h2 style={headingStyle}>{title}</h2>
      {children}
    </div>
  )
}

const headingStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#ff8a3d',
  margin: '0 0 12px',
}

const paragraphStyle = {
  fontSize: 14.5,
  lineHeight: 1.75,
  color: 'rgba(255,255,255,.72)',
  margin: '0 0 12px',
}

const listStyle = {
  margin: '0 0 12px',
  paddingLeft: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const listItemStyle = {
  fontSize: 14.5,
  lineHeight: 1.65,
  color: 'rgba(255,255,255,.72)',
}

const linkStyle = {
  color: '#ff8a3d',
  textDecoration: 'none',
  borderBottom: '1px solid rgba(255,138,61,.35)',
}
