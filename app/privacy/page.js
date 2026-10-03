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

export default function PrivacyPage() {
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

    const leafColors = [
      '#ff6a1a',
      '#ff8a3d',
      '#e85a0c',
      '#ffffff',
    ]

    const makeLeaf = (spreadY = false) => ({
      x: Math.random() * window.innerWidth,
      y: spreadY
        ? Math.random() * window.innerHeight
        : -30 - Math.random() * 120,
      size: Math.random() * 6 + 9,
      speed: Math.random() * 0.35 + 0.35,
      swayAmp: Math.random() * 30 + 20,
      swaySpeed: Math.random() * 0.012 + 0.006,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.012,
      opacity: Math.random() * 0.2 + 0.22,
      color:
        leafColors[Math.floor(Math.random() * leafColors.length)],
      baseX: 0,
    })

    const leaves = Array.from({ length: 8 }, () =>
      makeLeaf(true)
    )

    leaves.forEach(leaf => {
      leaf.baseX = leaf.x
    })

    let animationFrame
    let tick = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      tick += 1

      leaves.forEach(leaf => {
        leaf.y += leaf.speed
        leaf.rotation += leaf.spin

        const sway =
          Math.sin(
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

        drawLeaf(
          ctx,
          leaf.size,
          leaf.color,
          leaf.opacity
        )

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

        body {
          margin: 0;
          background: #000;
        }

        ::selection {
          background: rgba(255,106,26,.4);
          color: #fff;
        }

        .nav-link {
          position: relative;
          transition:
            color .2s ease,
            background .2s ease,
            box-shadow .2s ease;
          border-radius: 10px;
        }

        .nav-link:hover {
          color: #fff !important;
          background: rgba(255,106,26,.13);
          box-shadow:
            inset 0 0 0 1px rgba(255,106,26,.32),
            0 0 18px rgba(255,106,26,.10);
        }

        .nav-link:active {
          background: rgba(255,106,26,.2);
        }

        .hero-button {
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .hero-button:hover {
          transform: translateY(-2px);
        }

        .primary-button:hover {
          box-shadow:
            0 0 30px rgba(255,106,26,.5) !important;
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

          .privacy-content {
            width: min(100%, 700px) !important;
          }

          .privacy-section {
            padding: 24px 22px !important;
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

          .privacy-content {
            padding-top: 115px !important;
          }

          .privacy-section {
            padding: 21px 18px !important;
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
            'radial-gradient(circle,rgba(255,106,26,.15),transparent 68%)',
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
            'radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 35%, #000 20%, transparent 78%)',
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
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
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
            gap: 5,
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
              className="nav-link nav-login"
              style={{
                color: COLORS.muted,
                textDecoration: 'none',
                fontSize: 14,
                padding: '10px 12px',
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
                  'rgba(255,106,26,.16)',
                border:
                  '1px solid rgba(255,106,26,.55)',
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

      {/* CENTERED PRIVACY CONTENT */}
      <div
        className="privacy-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'min(820px, 100%)',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingTop: 135,
          paddingBottom: 40,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 46,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              margin: '0 auto 22px',
              borderRadius: 15,
              background:
                'linear-gradient(135deg,#ff6a1a,#ff8a3d)',
              transform: 'rotate(-10deg)',
              boxShadow:
                '0 0 30px rgba(255,106,26,.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              style={{
                filter:
                  'brightness(0) invert(1)',
              }}
            />
          </div>

          <h1
            style={{
              fontFamily:
                "'Space Grotesk', sans-serif",
              margin: 0,
              fontSize: 38,
              fontWeight: 600,
              letterSpacing: '-1.2px',
              color: '#fff',
            }}
          >
            Privacy Policy
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
        </div>

        {/* INTRO */}
        <div
          className="privacy-section"
          style={{
            padding: '30px 34px',
            marginBottom: 14,
            borderRadius: 18,
            background:
              'rgba(12,12,12,.72)',
            border:
              '1px solid rgba(255,106,26,.16)',
          }}
        >
          <p style={paragraphStyle}>
            This Privacy Policy explains how illness.lol
            collects, uses, and protects your information when
            you create a profile, link page, or account on our
            Service. By using the Service, you agree to the
            practices described below.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p style={paragraphStyle}>
            We collect the following categories of
            information:
          </p>

          <ul style={listStyle}>
            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Account information.
              </strong>{' '}
              Your username, email address, and a securely
              hashed password. We never store your password in
              plain text.
            </li>

            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Profile content.
              </strong>{' '}
              Anything you choose to add to your public page —
              display name, bio, avatar, background images,
              links, and social handles. This information is
              public by design.
            </li>

            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Usage and analytics data.
              </strong>{' '}
              Aggregate metrics such as page views, link
              clicks, referring sites, approximate location,
              device type, and browser.
            </li>

            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Technical data.
              </strong>{' '}
              IP address, log files, and timestamps collected
              automatically to operate the Service securely
              and prevent abuse.
            </li>

            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Cookies.
              </strong>{' '}
              Small files used to keep you logged in and
              remember your preferences. See Section 6.
            </li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul style={listStyle}>
            <li style={listItemStyle}>
              To create and maintain your account and public
              biolink page.
            </li>

            <li style={listItemStyle}>
              To display your profile and links to visitors.
            </li>

            <li style={listItemStyle}>
              To provide analytics about how your page is
              performing.
            </li>

            <li style={listItemStyle}>
              To send essential service emails, including
              verification, password resets, and security
              notices.
            </li>

            <li style={listItemStyle}>
              To detect, prevent, and respond to fraud, abuse,
              spam, and security issues.
            </li>

            <li style={listItemStyle}>
              To comply with legal obligations and enforce our
              Terms of Service.
            </li>
          </ul>

          <p style={paragraphStyle}>
            We do{' '}
            <strong style={strongStyle}>
              not
            </strong>{' '}
            sell your personal information.
          </p>
        </Section>

        <Section title="3. Public Nature of Your Page">
          <p style={paragraphStyle}>
            Your biolink page and everything you publish on it
            are public and may be viewed, indexed by search
            engines, and shared by anyone.
          </p>

          <p style={paragraphStyle}>
            Please do not put information on your public page
            that you want to keep private. Your email address
            and password are never shown publicly.
          </p>
        </Section>

        <Section title="4. How We Share Information">
          <p style={paragraphStyle}>
            We share information only in these limited
            situations:
          </p>

          <ul style={listStyle}>
            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Service providers.
              </strong>{' '}
              Trusted vendors that host our servers, store
              data, send email, and provide analytics, acting
              on our behalf under confidentiality obligations.
            </li>

            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Legal reasons.
              </strong>{' '}
              When required by law, subpoena, or to protect
              the rights, safety, and property of illness.lol,
              our users, or the public.
            </li>

            <li style={listItemStyle}>
              <strong style={strongStyle}>
                Business transfers.
              </strong>{' '}
              In connection with a merger, acquisition, or
              sale of assets, in which case we will notify you
              of any applicable change.
            </li>
          </ul>
        </Section>

        <Section title="5. Third-Party Links and Embeds">
          <p style={paragraphStyle}>
            When you or your visitors click a link, or when you
            embed third-party content, those third parties have
            their own privacy policies and may collect data
            independently of us.
          </p>

          <p style={paragraphStyle}>
            We are not responsible for the privacy practices of
            sites or services that you link to or embed.
          </p>
        </Section>

        <Section title="6. Cookies and Tracking">
          <p style={paragraphStyle}>
            We use strictly necessary cookies to keep you
            signed in and functional cookies to remember
            preferences.
          </p>

          <p style={paragraphStyle}>
            You can control cookies through your browser
            settings, though disabling them may break parts of
            the Service, such as staying logged in.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p style={paragraphStyle}>
            We keep your information for as long as your
            account is active.
          </p>

          <p style={paragraphStyle}>
            If you delete your account, we remove your public
            page and personal data within a reasonable period,
            except where we must retain certain records to
            comply with legal obligations.
          </p>
        </Section>

        <Section title="8. Security">
          <p style={paragraphStyle}>
            We use industry-standard measures — including
            encrypted connections (HTTPS), hashed passwords,
            and access controls — to protect your data.
          </p>

          <p style={paragraphStyle}>
            No method of transmission or storage can be
            guaranteed to be completely secure. You should
            keep your password confidential and use a strong,
            unique password for your account.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p style={paragraphStyle}>
            Depending on where you live, you may have the right
            to access, correct, export, or delete your personal
            data.
          </p>

          <p style={paragraphStyle}>
            You can manage most of this information from your
            account settings, or contact us using the details
            below.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p style={paragraphStyle}>
            The Service is not directed to children under 13.
            We do not knowingly collect personal information
            from children.
          </p>

          <p style={paragraphStyle}>
            If you believe a child has provided us with
            personal data, contact us and we will take
            reasonable steps to delete it.
          </p>
        </Section>

        <Section title="11. International Users">
          <p style={paragraphStyle}>
            We may process and store your information on
            servers located in countries other than your own.
          </p>

          <p style={paragraphStyle}>
            By using the Service, you acknowledge that your
            information may be transferred to and processed in
            those locations.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p style={paragraphStyle}>
            We may update this Privacy Policy from time to
            time.
          </p>

          <p style={paragraphStyle}>
            When we make material changes, we will update the
            &quot;Last updated&quot; date above. Continued use
            of the Service after changes take effect
            constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact">
          <p style={paragraphStyle}>
            Got a question or something to flag? Reach us on
            our Discord server at{' '}
            <a
              href="https://discord.gg/illness"
              target="_blank"
              rel="noreferrer"
              className="terms-link"
              style={linkStyle}
            >
              discord.gg/illness
            </a>{' '}
            or through the platform.
          </p>
        </Section>
      </div>
    </main>
  )
}

function Section({ title, children }) {
  return (
    <section
      className="privacy-section"
      style={{
        padding: '28px 34px',
        marginBottom: 12,
        borderRadius: 18,
        background: 'rgba(8,8,8,.58)',
        border:
          '1px solid rgba(255,255,255,.055)',
        boxShadow:
          '0 15px 45px rgba(0,0,0,.18)',
      }}
    >
      <h2 style={headingStyle}>
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ff6a1a',
            boxShadow:
              '0 0 10px rgba(255,106,26,.65)',
            marginRight: 9,
            verticalAlign: 'middle',
            marginTop: -2,
          }}
        />

        {title}
      </h2>

      {children}
    </section>
  )
}

const headingStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#ff8a3d',
  margin: '0 0 15px',
}

const paragraphStyle = {
  fontSize: 14.5,
  lineHeight: 1.75,
  color: 'rgba(255,255,255,.72)',
  margin: '0 0 12px',
}

const listStyle = {
  margin: '0 0 12px',
  paddingLeft: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const listItemStyle = {
  fontSize: 14.5,
  lineHeight: 1.65,
  color: 'rgba(255,255,255,.72)',
}

const strongStyle = {
  color: 'rgba(255,255,255,.92)',
  fontWeight: 600,
}

const linkStyle = {
  color: '#ff8a3d',
  textDecoration: 'none',
  borderBottom:
    '1px solid rgba(255,138,61,.35)',
}
