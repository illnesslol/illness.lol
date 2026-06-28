'use client'

import { useEffect, useRef } from 'react'

export default function TermsPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2, a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005, twinkle: Math.random() * Math.PI * 2,
    }))
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const blobs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 350, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.85, y: canvas.height * 0.6, r: 300, color: 'rgba(20,50,110,' },
        { x: canvas.width * 0.5, y: canvas.height * 0.85, r: 250, color: 'rgba(80,20,80,' },
      ]
      blobs.forEach(b => {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color + '0.15)'); grad.addColorStop(1, b.color + '0)')
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
      })
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,220,255,${alpha})`; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const sections = [
    {
      title: 'Welcome',
      content: `illness.lol is a bio link platform — one shareable page where you collect your links, socials, and more. Pages can be public depending on your settings, so anything you put on yours might be visible to anyone. Only publish things you actually have the right to share.

These Terms ("Terms") apply whenever you visit, sign in, or otherwise use illness.lol (the "Service"). Sticking around after we update them counts as agreeing to the new version, alongside any laws that apply where you live.

The Service itself — our code, branding, design, and the materials we provide — is covered by copyright and other IP laws. Copying or redistributing it without permission may result in your account being suspended.`
    },
    {
      title: 'Changes to These Terms',
      content: `We can revise these Terms whenever it makes sense — to reflect new features, legal requirements, or how the Service works in practice. Updates go live when published here, and continuing to use illness.lol after that means you're on board with the new version.

When a change meaningfully affects a paid plan, we'll do our best to give you a heads-up before it takes effect.`
    },
    {
      title: 'Use of the Service',
      content: `illness.lol is here for you to use lawfully and within these Terms. Don't do anything that breaks, slows down, or destabilizes the Service, or makes it harder for others to enjoy their own page.

Pick a username that's legal, honest, and isn't stepping on anyone's rights. Anything misleading, offensive, or that pretends to be an official illness.lol account may be reclaimed or suspended.

Whatever shows up on your page — every link, every image, every choice — is on you. In particular:

• Don't try to bypass our security, rate limits, or access controls.
• Don't pretend to be someone else or imply we've endorsed you when we haven't.
• Don't access other users' accounts or private data.
• Don't run bots, scrapers, or automated tooling against the Service without written permission.
• Don't upload or host malware, exploits, or harmful payloads.
• Don't publish sexually explicit material, content that sexualizes minors, or content glorifying real-world violence.

When something breaks these Terms or hurts the community, we can pause, restrict, or terminate the account involved.`
    },
    {
      title: 'Account Usage',
      content: `Your account is yours alone. Don't share your credentials, hand out logins, or resell access — anything that happens under your account gets attributed to you.

Patterns like coordinated abuse, ban evasion, or payment-method recycling usually trigger action across every account we can tie to the same activity.`
    },
    {
      title: 'User-Posted Content',
      content: `Anything you put on the Service is yours to stand behind. By posting it, you confirm you own it or have permission to use it, and that it doesn't break the law or step on someone else's rights.

When you post content, you grant illness.lol a worldwide, royalty-free license to host, store, copy, and display that content to the extent needed to run the Service. Your content stays yours throughout.

If a third party comes after us because of something you posted, you agree to defend illness.lol and cover any resulting costs.`
    },
    {
      title: 'Prohibited Content',
      content: `Some content and conduct we won't host on illness.lol, period:

• Anything that breaks local, national, or international law.
• Content that infringes someone else's intellectual property or privacy rights.
• Defamatory, pornographic, harassing, hateful, or exploitative material — and absolutely no sexualization of minors.
• Scams, phishing pages, impersonation campaigns, or spam.
• Malware, exploits, or tools meant to disrupt the Service.
• Content glorifying violence, terrorism, discrimination, or self-harm.

When something crosses these lines we can remove the content, restrict features, or act on the account. We may also report to law enforcement when required.`
    },
    {
      title: 'Purchases & Billing',
      content: `Whenever you buy something through the Service, the account and purchase details you provide need to be accurate and current.

Placing an order means agreeing to pay the price shown at checkout and authorizing us to charge your selected payment provider. If we discover a pricing error, we can correct it.

We may turn down any order or cap quantities per person. Orders that appear to be for resale may be refused.`
    },
    {
      title: 'No Refund Policy',
      content: `Payments to illness.lol are final. Unless the law requires a refund, we don't refund for change of mind, unused services, or partial use of a plan.

When we make a billing error, we may refund or credit the difference at our discretion. Email us with the details if you think a charge needs a second look.

Filing a chargeback against a valid charge breaks these Terms and may result in account suspension.`
    },
    {
      title: 'Privacy',
      content: `Using illness.lol also means our Privacy Policy applies. It explains what we collect, why we collect it, and the choices you have. By using the Service, you're consenting to the practices described in that policy.

Once an account deletion request is verified, all of your personal data and posted content are permanently removed from our active systems.`
    },
    {
      title: 'Intellectual Property',
      content: `The Service and materials we provide — your own content excepted — are protected by copyright and other IP laws. Unless explicitly permitted, you can't copy, redistribute, reverse-engineer, or build derivative works from any part of the Service without our written permission.

These Terms give you the narrow set of rights you need to access and use the Service — nothing more.`
    },
    {
      title: 'Disclaimer of Warranties',
      content: `illness.lol is provided "as is" and "as available," with no warranties of any kind. To the fullest extent the law permits, we disclaim every express, implied, and statutory warranty.

We can't promise the Service will always be online, secure, or free of errors. You use it at your own risk.`
    },
    {
      title: 'Term & Termination',
      content: `These Terms apply from the moment you first use the Service. You can leave whenever you want. On our side, we can suspend, restrict, or terminate accounts for any reason these Terms allow — violations, misuse, fraud, or operational needs.

Once the agreement ends, the rights we granted you end with it. Clauses covering ownership, disclaimers, indemnities, and liability limits survive termination.`
    },
    {
      title: 'Contact',
      content: `Got a question or something to flag? Reach us on our Discord server at discord.gg/illness or through the platform.`
    },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: '#06060f',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* spotlight */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '100vh',
        background: 'conic-gradient(from 270deg at 50% 0%, transparent 68deg, rgba(180,140,255,0.06) 90deg, transparent 112deg)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* nav */}
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
            padding: '8px 16px', borderRadius: '100px',
            transition: 'color 0.15s, background 0.15s',
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

      {/* content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto', padding: '140px 24px 80px' }}>
        
        {/* header */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
            Last updated: June 27, 2026
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: '16px', textShadow: '0 0 60px rgba(160,120,255,0.3)' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '560px' }}>
            By using illness.lol, these Terms apply. They set out what you can put on your page, what we can do as the platform, and how we handle things when something doesn't go as planned.
          </p>
        </div>

        {/* divider */}
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', marginBottom: '56px' }} />

        {/* sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {sections.map((section, i) => (
            <div key={i}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '12px', letterSpacing: '-0.3px' }}>
                {section.title}
              </h2>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ marginTop: '80px', paddingTop: '32px', borderTop: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>© 2026 illness.lol</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Discord', 'https://discord.gg/illness']].map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}