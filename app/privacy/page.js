'use client'

import { useEffect, useRef } from 'react'

const LAST_UPDATED = 'June 27, 2026'

export default function PrivacyPage() {
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

      {/* spotlight */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '100vh',
        background: 'conic-gradient(from 270deg at 50% 0%, transparent 70deg, rgba(255,255,255,0.045) 90deg, transparent 110deg)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
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
          Privacy Policy
        </h1>
        <div style={{ textAlign: 'center', marginBottom: '36px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          Last updated {LAST_UPDATED}
        </div>

        <p style={paragraphStyle}>
          This Privacy Policy explains how illness.lol (&quot;illness.lol&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) collects, uses, and protects your information when you create a profile, link page, or
          account on our service (the &quot;Service&quot;). illness.lol is a biolink service that lets you host a
          single public page that points to your other links and content. By using the Service, you agree to the
          practices described below.
        </p>

        <Section title="1. Information We Collect">
          <p style={paragraphStyle}>We collect the following categories of information:</p>
          <ul style={listStyle}>
            <li style={listItemStyle}>
              <strong style={strongStyle}>Account information.</strong> Your username (e.g. illness.lol/yourname),
              email address, and a securely hashed password. We never store your password in plain text.
            </li>
            <li style={listItemStyle}>
              <strong style={strongStyle}>Profile content.</strong> Anything you choose to add to your public page —
              display name, bio, avatar or background images, links, embedded media, and social handles. This
              information is public by design.
            </li>
            <li style={listItemStyle}>
              <strong style={strongStyle}>Usage and analytics data.</strong> Aggregate metrics such as page views,
              link clicks, referring sites, approximate location (country/region), device type, and browser, used to
              power your analytics dashboard and to improve the Service.
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
            The whole point of a biolink is to send visitors elsewhere. When you or your visitors click a link, or
            when you embed third-party content (e.g. music, video, social posts), those third parties have their own
            privacy policies and may collect data independently of us. We are not responsible for the practices of
            sites you link to. Review their policies before sharing information with them.
          </p>
        </Section>

        <Section title="6. Cookies and Tracking">
          <p style={paragraphStyle}>
            We use strictly necessary cookies to keep you signed in and functional cookies to remember preferences.
            We may use privacy-respecting analytics to understand aggregate traffic. You can control cookies through
            your browser settings, though disabling them may break parts of the Service such as staying logged in.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p style={paragraphStyle}>
            We keep your information for as long as your account is active. If you delete your account, we remove your
            public page and personal data within a reasonable period, except where we must retain certain records to
            comply with legal obligations, resolve disputes, or prevent abuse.
          </p>
        </Section>

        <Section title="8. Security">
          <p style={paragraphStyle}>
            We use industry-standard measures — encrypted connections (HTTPS), hashed passwords, and access controls —
            to protect your data. No method of transmission or storage is ever completely secure, so we cannot
            guarantee absolute security. Keep your password confidential and use a strong, unique one.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p style={paragraphStyle}>
            Depending on where you live, you may have the right to access, correct, export, or delete your personal
            data, and to object to or restrict certain processing. You can manage most of this from your account
            settings, or contact us using the details below. We will respond within the time required by applicable
            law.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p style={paragraphStyle}>
            The Service is not directed to children under 13 (or the minimum age required in your country). We do not
            knowingly collect personal information from children. If you believe a child has provided us with personal
            data, contact us and we will delete it.
          </p>
        </Section>

        <Section title="11. International Users">
          <p style={paragraphStyle}>
            We may process and store your information on servers located in countries other than your own. By using
            the Service, you consent to the transfer of your information to those locations, which may have different
            data protection laws than your jurisdiction.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p style={paragraphStyle}>
            We may update this Privacy Policy from time to time. When we make material changes, we will update the
            &quot;Last updated&quot; date above and, where appropriate, notify you by email or through the Service.
            Continued use of the Service after changes take effect constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p style={paragraphStyle}>
            If you have questions about this Privacy Policy or how we handle your data, reach out to us at{' '}
            <a href="mailto:privacy@illness.lol" style={linkStyle}>privacy@illness.lol</a>.
          </p>
        </Section>

        <div style={{
          marginTop: '36px', paddingTop: '24px',
          borderTop: '0.5px solid rgba(255,255,255,0.1)',
          textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)',
        }}>
          <a href="/signup" style={linkStyle}>← Back to sign up</a>
        </div>
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

const strongStyle = {
  color: 'rgba(255,255,255,0.92)', fontWeight: 600,
}

const linkStyle = {
  color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
}