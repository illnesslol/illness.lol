'use client'

import { useEffect, useRef } from 'react'

const LAST_UPDATED = 'June 27, 2026'

export default function TermsPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2, a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005, twinkle: Math.random() * Math.PI * 2,
    }))
    const shootingStars = []
    let frameCount = 0
    const spawnShooting = () => shootingStars.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 120 + 60, speed: Math.random() * 8 + 6,
      angle: Math.PI / 5, alpha: 1, active: true,
    })
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const blobs = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 300, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.8, y: canvas.height * 0.6, r: 250, color: 'rgba(20,60,100,' },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, r: 200, color: 'rgba(80,20,80,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.18)'); grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      })
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,220,255,${alpha})`; ctx.fill()
      })
      frameCount++
      if (frameCount % 180 === 0) spawnShooting()
      shootingStars.forEach(s => {
        if (!s.active) return
        s.x += Math.cos(s.angle) * s.speed; s.y += Math.sin(s.angle) * s.speed; s.alpha -= 0.018
        if (s.alpha <= 0) { s.active = false; return }
        const tailX = s.x - Math.cos(s.angle) * s.len, tailY = s.y - Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, `rgba(255,255,255,0)`); grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`)
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#06060f',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', position: 'relative',
      padding: '64px 20px',
    }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '100vh',
        background: 'conic-gradient(from 270deg at 50% 0%, transparent 70deg, rgba(255,255,255,0.045) 90deg, transparent 110deg)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* navbar */}
      <nav style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', alignItems: 'center', gap: '2px',
        background: 'rgba(15,15,25,0.85)',
        border: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: '100px', padding: '8px 8px 8px 20px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="illness.lol" style={{ width: '26px', height: '26px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>
            illness.lol
          </span>
        </a>
        {[['Discord', 'https://discord.gg/illness'], ['Leaderboard', '/leaderboard'], ['Pricing', '/pricing']].map(([label, href]) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} style={{
            fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
            padding: '8px 16px', borderRadius: '100px', transition: 'color 0.15s, background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent' }}
          >{label}</a>
        ))}
        <div style={{ width: '0.5px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />
        <a href="/login" style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '8px 16px', borderRadius: '100px', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
        >Log in</a>
        <a href="/signup" style={{
          fontSize: '13.5px', color: '#06060f', textDecoration: 'none', padding: '10px 22px',
          borderRadius: '100px', background: '#fff', fontWeight: 600,
          boxShadow: '0 0 20px rgba(255,255,255,0.25)', transition: 'box-shadow 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.45)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.25)'}
        >Sign up</a>
      </nav>

      <div style={{
        position: 'relative', zIndex: 1, marginTop: '80px',
        background: 'rgba(12,12,22,0.82)',
        border: '0.5px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '44px 40px', width: '720px', maxWidth: '100%',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 80px rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
          <img src="/icon.png" alt="illness.lol" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>

        <h1 style={{ textAlign: 'center', margin: '0 0 6px', fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.4px' }}>
          Terms of Service
        </h1>
        <div style={{ textAlign: 'center', marginBottom: '36px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          Last updated {LAST_UPDATED}
        </div>

        <p style={paragraphStyle}>
          By using illness.lol, these Terms apply. They set out what you can put on your page, what we can do as the platform, and how we handle things when something doesn&apos;t go as planned.
        </p>

        <Section title="1. Welcome">
          <p style={paragraphStyle}>
            illness.lol is a bio link platform — one shareable page where you collect your links, socials, and more. Pages can be public depending on your settings, so anything you put on yours might be visible to anyone. Only publish things you actually have the right to share.
          </p>
          <p style={paragraphStyle}>
            These Terms apply whenever you visit, sign in, or otherwise use illness.lol. Sticking around after we update them counts as agreeing to the new version.
          </p>
        </Section>

        <Section title="2. Changes to These Terms">
          <p style={paragraphStyle}>
            We can revise these Terms whenever it makes sense — to reflect new features, legal requirements, or how the Service works in practice. Updates go live when published here, and continuing to use illness.lol after that means you&apos;re on board.
          </p>
          <p style={paragraphStyle}>
            When a change meaningfully affects a paid plan, we&apos;ll do our best to give you a heads-up before it takes effect.
          </p>
        </Section>

        <Section title="3. Use of the Service">
          <p style={paragraphStyle}>
            illness.lol is here for you to use lawfully and within these Terms. Don&apos;t do anything that breaks, slows down, or destabilizes the Service, or makes it harder for others to enjoy their own page. In particular:
          </p>
          <ul style={listStyle}>
            <li style={listItemStyle}>Don&apos;t try to bypass our security, rate limits, or access controls.</li>
            <li style={listItemStyle}>Don&apos;t pretend to be someone else or imply we&apos;ve endorsed you when we haven&apos;t.</li>
            <li style={listItemStyle}>Don&apos;t access other users&apos; accounts or private data.</li>
            <li style={listItemStyle}>Don&apos;t run bots, scrapers, or automated tooling against the Service without written permission.</li>
            <li style={listItemStyle}>Don&apos;t upload or host malware, exploits, or harmful payloads.</li>
            <li style={listItemStyle}>Don&apos;t publish sexually explicit material, content that sexualizes minors, or content glorifying real-world violence.</li>
          </ul>
        </Section>

        <Section title="4. Account Usage">
          <p style={paragraphStyle}>
            Your account is yours alone. Don&apos;t share your credentials, hand out logins, or resell access — anything that happens under your account gets attributed to you.
          </p>
          <p style={paragraphStyle}>
            Patterns like coordinated abuse, ban evasion, or payment-method recycling usually trigger action across every account we can tie to the same activity.
          </p>
        </Section>

        <Section title="5. User-Posted Content">
          <p style={paragraphStyle}>
            Anything you put on the Service is yours to stand behind. By posting it, you confirm you own it or have permission to use it, and that it doesn&apos;t break the law or step on someone else&apos;s rights.
          </p>
          <p style={paragraphStyle}>
            When you post content, you grant illness.lol a worldwide, royalty-free license to host, store, copy, and display that content to the extent needed to run the Service. Your content stays yours throughout.
          </p>
        </Section>

        <Section title="6. Prohibited Content">
          <p style={paragraphStyle}>Some content and conduct we won&apos;t host on illness.lol, period:</p>
          <ul style={listStyle}>
            <li style={listItemStyle}>Anything that breaks local, national, or international law.</li>
            <li style={listItemStyle}>Content that infringes someone else&apos;s intellectual property or privacy rights.</li>
            <li style={listItemStyle}>Defamatory, pornographic, harassing, hateful, or exploitative material — and absolutely no sexualization of minors.</li>
            <li style={listItemStyle}>Scams, phishing pages, impersonation campaigns, or spam.</li>
            <li style={listItemStyle}>Malware, exploits, or tools meant to disrupt the Service.</li>
            <li style={listItemStyle}>Content glorifying violence, terrorism, discrimination, or self-harm.</li>
          </ul>
        </Section>

        <Section title="7. Purchases & Billing">
          <p style={paragraphStyle}>
            Whenever you buy something through the Service, the account and purchase details you provide need to be accurate and current. Placing an order means agreeing to pay the price shown at checkout.
          </p>
          <p style={paragraphStyle}>
            We may turn down any order or cap quantities per person. Orders that appear to be for resale may be refused.
          </p>
        </Section>

        <Section title="8. No Refund Policy">
          <p style={paragraphStyle}>
            Payments to illness.lol are final. Unless the law requires a refund, we don&apos;t refund for change of mind, unused services, or partial use of a plan.
          </p>
          <p style={paragraphStyle}>
            Filing a chargeback against a valid charge breaks these Terms and may result in account suspension.
          </p>
        </Section>

        <Section title="9. Privacy">
          <p style={paragraphStyle}>
            Using illness.lol also means our <a href="/privacy" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Privacy Policy</a> applies. It explains what we collect, why we collect it, and the choices you have.
          </p>
        </Section>

        <Section title="10. Intellectual Property">
          <p style={paragraphStyle}>
            The Service and materials we provide — your own content excepted — are protected by copyright and other IP laws. Unless explicitly permitted, you can&apos;t copy, redistribute, or reverse-engineer any part of the Service without our written permission.
          </p>
        </Section>

        <Section title="11. Disclaimer of Warranties">
          <p style={paragraphStyle}>
            illness.lol is provided &quot;as is&quot; and &quot;as available,&quot; with no warranties of any kind. We can&apos;t promise the Service will always be online, secure, or free of errors. You use it at your own risk.
          </p>
        </Section>

        <Section title="12. Term & Termination">
          <p style={paragraphStyle}>
            These Terms apply from the moment you first use the Service. You can leave whenever you want. On our side, we can suspend, restrict, or terminate accounts for any reason these Terms allow — violations, misuse, fraud, or operational needs.
          </p>
        </Section>

        <Section title="13. Contact">
          <p style={paragraphStyle}>
            Got a question or something to flag? Reach us on our Discord server at discord.gg/illness or through the platform.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={headingStyle}>{title}</h2>
      {children}
    </div>
  )
}

const headingStyle = {
  fontSize: '11px', fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)', margin: '0 0 12px',
}
const paragraphStyle = {
  fontSize: '14px', lineHeight: 1.7,
  color: 'rgba(255,255,255,0.7)', margin: '0 0 12px',
}
const listStyle = {
  margin: '0 0 12px', paddingLeft: '18px',
  display: 'flex', flexDirection: 'column', gap: '8px',
}
const listItemStyle = {
  fontSize: '14px', lineHeight: 1.6,
  color: 'rgba(255,255,255,0.7)',
}