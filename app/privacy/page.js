'use client'

import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '../../components/PageTransition'

const LAST_UPDATED = 'June 27, 2026'

const COLORS = {
  bg: '#17101a',
  purple: '#9b4dcc',
  purpleBright: '#b75be8',
  purpleBorder: 'rgba(181,91,232,.55)',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.72)',
  faint: 'rgba(255,255,255,.4)',
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
        ctx.fillStyle = `rgba(180,100,235,${p.opacity})`
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
        * { box-sizing: border-box; }
        body { margin: 0; background: #17101a; }
        ::selection { background: rgba(181,91,232,.35); color: #fff; }
        .nav-link { transition: .2s ease; }
        .nav-link:hover { color: #fff !important; }
        .hero-button { transition: .2s ease; }
        .hero-button:hover { transform: translateY(-2px); }
        .primary-button:hover { box-shadow: 0 0 30px rgba(181,91,232,.45) !important; }
        @media (max-width: 800px) {
          .desktop-links { display: none !important; }
        }
        @media (max-width: 520px) {
          .nav { width: calc(100% - 24px) !important; }
          .nav-brand { font-size: 14px !important; }
          .nav-login { display: none !important; }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      />

      <div
        style={{
          position: 'fixed',
          top: -350,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1000,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(120,54,150,.18),transparent 68%)',
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
          background: 'rgba(12,10,13,.92)',
          border: '1px solid rgba(255,255,255,.035)',
          boxShadow: '0 15px 50px rgba(0,0,0,.3)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px 0 28px',
          zIndex: 20,
        }}
      >
        <TransitionLink
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', textDecoration: 'none', minWidth: 200 }}
        >
          <div
            style={{
              width: 29,
              height: 29,
              borderRadius: 8,
              background: 'linear-gradient(135deg,#8d45b9,#c05de9)',
              transform: 'rotate(-18deg)',
              boxShadow: '0 0 16px rgba(181,91,232,.25)',
            }}
          />
          <span
            className="nav-brand"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 600, letterSpacing: '-.7px' }}
          >
            illness.lol
          </span>
        </TransitionLink>

        <div
          className="desktop-links"
          style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}
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
              style={{ color: COLORS.muted, textDecoration: 'none', fontSize: 14, padding: '10px 12px', whiteSpace: 'nowrap' }}
            >
              {label}
            </TransitionLink>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {!loggedIn && (
            <TransitionLink
              href="/login"
              className="nav-login"
              style={{ color: COLORS.muted, textDecoration: 'none', fontSize: 14, padding: '11px 14px' }}
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
                background: 'linear-gradient(135deg,rgba(155,77,204,.32),rgba(110,54,140,.22))',
                border: '1px solid rgba(181,91,232,.5)',
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
                background: 'linear-gradient(135deg,#7b3d9c,#9b4dcc)',
                border: '1px solid rgba(210,140,239,.25)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 19px',
                borderRadius: 25,
                boxShadow: '0 0 18px rgba(155,77,204,.2)',
              }}
            >
              Sign up
            </TransitionLink>
          )}
        </div>
      </nav>

      {/* CONTENT CARD */}
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
          style={{
            background: 'rgba(20,18,21,.85)',
            border: '1px solid rgba(181,91,232,.25)',
            borderRadius: 24,
            padding: '48px 44px',
            boxShadow: '0 20px 70px rgba(0,0,0,.55), 0 0 40px rgba(155,77,204,.08)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg,#8d45b9,#c05de9)',
                transform: 'rotate(-14deg)',
                boxShadow: '0 0 24px rgba(181,91,232,.3)',
              }}
            />
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              textAlign: 'center',
              margin: '0 0 8px',
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.8px',
              color: '#fff',
            }}
          >
            Privacy Policy
          </h1>
          <div style={{ textAlign: 'center', marginBottom: 40, fontSize: 13, color: COLORS.faint }}>
            Last updated {LAST_UPDATED}
          </div>

          <p style={paragraphStyle}>
            This Privacy Policy explains how illness.lol collects, uses, and protects your information when you
            create a profile, link page, or account on our service. By using the Service, you agree to the practices
            described below.
          </p>

          <Section title="1. Information We Collect">
            <p style={paragraphStyle}>We collect the following categories of information:</p>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Account information.</strong> Your username, email address, and a
                securely hashed password. We never store your password in plain text.
              </li>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Profile content.</strong> Anything you choose to add to your public page
                — display name, bio, avatar, background images, links, and social handles. This information is
                public by design.
              </li>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Usage and analytics data.</strong> Aggregate metrics such as page views,
                link clicks, referring sites, approximate location, device type, and browser.
              </li>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Technical data.</strong> IP address, log files, and timestamps collected
                automatically to operate the Service securely and prevent abuse.
              </li>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Cookies.</strong> Small files used to keep you logged in and remember your
                preferences. See Section 6.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul style={listStyle}>
              <li style={listItemStyle}>To create and maintain your account and public biolink page.</li>
              <li style={listItemStyle}>To display your profile and links to visitors.</li>
              <li style={listItemStyle}>To provide analytics about how your page is performing.</li>
              <li style={listItemStyle}>To send essential service emails (verification, password resets, security notices).</li>
              <li style={listItemStyle}>To detect, prevent, and respond to fraud, abuse, spam, and security issues.</li>
              <li style={listItemStyle}>To comply with legal obligations and enforce our Terms of Service.</li>
            </ul>
            <p style={paragraphStyle}>
              We do <strong style={strongStyle}>not</strong> sell your personal information.
            </p>
          </Section>

          <Section title="3. Public Nature of Your Page">
            <p style={paragraphStyle}>
              Your biolink page and everything you publish on it are public and may be viewed, indexed by search
              engines, and shared by anyone. Please do not put information on your public page that you want to keep
              private. Your email address and password are never shown publicly.
            </p>
          </Section>

          <Section title="4. How We Share Information">
            <p style={paragraphStyle}>We share information only in these limited situations:</p>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Service providers.</strong> Trusted vendors that host our servers, store
                data, send email, and provide analytics, acting on our behalf under confidentiality obligations.
              </li>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Legal reasons.</strong> When required by law, subpoena, or to protect the
                rights, safety, and property of illness.lol, our users, or the public.
              </li>
              <li style={listItemStyle}>
                <strong style={strongStyle}>Business transfers.</strong> In connection with a merger, acquisition, or
                sale of assets, in which case we will notify you of any change.
              </li>
            </ul>
          </Section>

          <Section title="5. Third-Party Links and Embeds">
            <p style={paragraphStyle}>
              When you or your visitors click a link, or when you embed third-party content, those third parties have
              their own privacy policies and may collect data independently of us. We are not responsible for the
              practices of sites you link to.
            </p>
          </Section>

          <Section title="6. Cookies and Tracking">
            <p style={paragraphStyle}>
              We use strictly necessary cookies to keep you signed in and functional cookies to remember preferences.
              You can control cookies through your browser settings, though disabling them may break parts of the
              Service such as staying logged in.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p style={paragraphStyle}>
              We keep your information for as long as your account is active. If you delete your account, we remove
              your public page and personal data within a reasonable period, except where we must retain certain
              records to comply with legal obligations.
            </p>
          </Section>

          <Section title="8. Security">
            <p style={paragraphStyle}>
              We use industry-standard measures — encrypted connections (HTTPS), hashed passwords, and access
              controls — to protect your data. Keep your password confidential and use a strong, unique one.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p style={paragraphStyle}>
              Depending on where you live, you may have the right to access, correct, export, or delete your personal
              data. You can manage most of this from your account settings, or contact us using the details below.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p style={paragraphStyle}>
              The Service is not directed to children under 13. We do not knowingly collect personal information from
              children. If you believe a child has provided us with personal data, contact us and we will delete it.
            </p>
          </Section>

          <Section title="11. International Users">
            <p style={paragraphStyle}>
              We may process and store your information on servers located in countries other than your own. By
              using the Service, you consent to the transfer of your information to those locations.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p style={paragraphStyle}>
              We may update this Privacy Policy from time to time. When we make material changes, we will update the
              &quot;Last updated&quot; date above. Continued use of the Service after changes take effect constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          <Section title="13. Contact">
            <p style={paragraphStyle}>
              Got a question or something to flag? Reach us on our Discord server at discord.gg/illness or through the
              platform.
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
  color: '#c688ec',
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
const strongStyle = {
  color: 'rgba(255,255,255,.92)',
  fontWeight: 600,
}