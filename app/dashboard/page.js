'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ================================================================== */
/*  illness.lol — advanced customization dashboard                    */
/* ================================================================== */

const ACCOUNT_GROUP = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'analytics', label: 'Analytics', icon: 'M3 3v18h18M7 15l3-4 4 3 5-7' },
  { id: 'badges', label: 'Badges', icon: 'M12 2l3 6 6 .5-4.5 4 1.5 6-6-3.5L6 18.5 7.5 12.5 3 8.5 9 8z' },
  { id: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1L14.5 3h-4L10 5.5a7 7 0 00-1.7 1l-2.4-1-2 3.4L4 10.9a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1L10 21h4l.5-2.5a7 7 0 001.7-1l2.4 1 2-3.4-2-1.6a7 7 0 00.1-1z' },
]

const NAV = [
  { id: 'customize', label: 'Customize', icon: 'M12 2l2.4 7.4H22l-6 4.5 2.3 7.1L12 16.6 5.7 21l2.3-7.1-6-4.5h7.6z' },
  { id: 'links', label: 'Links', icon: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1' },
  { id: 'premium', label: 'Premium', icon: 'M3 7l4 5 5-7 5 7 4-5v11H3z' },
  { id: 'buttons', label: 'Buttons', icon: 'M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8zM4 16a2 2 0 012-2h5a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z' },
]

const EFFECTS = [
  { key: 'particles', label: 'Particles', hint: 'floating orbs' },
  { key: 'rain', label: 'Rain', hint: 'falling streaks' },
  { key: 'snow', label: 'Snow', hint: 'drifting flakes' },
  { key: 'sparkles', label: 'Sparkles', hint: 'twinkling accent' },
]

const SOCIAL_TYPES = ['Discord', 'Instagram', 'TikTok', 'X / Twitter', 'YouTube', 'GitHub', 'Spotify', 'Telegram', 'Custom']

const DEFAULT_CFG = {
  displayName: 'yourname',
  username: 'yourname',
  bio: 'just another star in the void ✦',
  location: '',
  avatar: '',
  background: '',
  audio: '',
  accent: '#8b5cf6',
  accent2: '#3b82f6',
  bgColor: '#06060f',
  gradientBg: true,
  cardOpacity: 82,
  blur: 16,
  glow: true,
  tilt: true,
  monochromeIcons: true,
  animatedTitle: true,
  typewriterBio: false,
  customCursor: false,
  clickToEnter: true,
  volume: 40,
  effects: { particles: true, rain: false, snow: false, sparkles: true },
  socials: [
    { id: 1, type: 'Discord', url: '' },
    { id: 2, type: 'Instagram', url: '' },
  ],
  views: 1284,
}

export default function DashboardPage() {
  const bgCanvasRef = useRef(null)
  const [section, setSection] = useState('customize')
  const [cfg, setCfg] = useState(DEFAULT_CFG)
  const [toast, setToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  // load persisted config
  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        if (data.loggedIn && data.config) {
          setCfg({ ...DEFAULT_CFG, ...data.config })
        }
      })
      .catch(() => {})
      .finally(() => setMounted(true))
  }, [])

  const set = (k, v) => setCfg(c => ({ ...c, [k]: v }))
  const toggleEffect = (k) => setCfg(c => ({ ...c, effects: { ...c.effects, [k]: !c.effects[k] } }))
  const addSocial = () => setCfg(c => ({ ...c, socials: [...c.socials, { id: Date.now(), type: 'Custom', url: '' }] }))
  const updSocial = (id, patch) => setCfg(c => ({ ...c, socials: c.socials.map(s => s.id === id ? { ...s, ...patch } : s) }))
  const rmSocial = (id) => setCfg(c => ({ ...c, socials: c.socials.filter(s => s.id !== id) }))

  const save = () => {
    fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setToast(true)
          setTimeout(() => setToast(false), 1900)
        }
      })
      .catch(() => {})
  }

  // ---- ambient site background canvas ----
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2, a: Math.random(),
      speed: Math.random() * 0.003 + 0.0005, twinkle: Math.random() * Math.PI * 2,
    }))
    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const blobs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 340, color: 'rgba(60,20,120,' },
        { x: canvas.width * 0.85, y: canvas.height * 0.7, r: 300, color: 'rgba(20,60,100,' },
      ]
      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, b.color + '0.15)'); g.addColorStop(1, b.color + '0)')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill()
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

  const activeIdx = NAV.findIndex(n => n.id === section)
  const accountActive = ACCOUNT_GROUP.some(n => n.id === section)
  const [accountOpen, setAccountOpenState] = useState(true)

  return (
    <div style={{ minHeight: '100vh', background: '#06060f', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', display: 'flex' }}>
      <GlobalStyles accent={cfg.accent} />
      <canvas ref={bgCanvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* loading overlay — hides default config flash until real data arrives, without unmounting the canvas */}
      {!mounted && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: '#06060f',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src="/icon.png"
            alt=""
            style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.6 }}
          />
        </div>
      )}

      {/* ---------------- Sidebar ---------------- */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 18px' }}>
          <img src="/icon.png" alt="" style={{ width: '26px', height: '26px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px' }}>illness.lol</span>
        </div>

        <div className="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search features..." />
          <span className="kbd">Ctrl K</span>
        </div>

        {/* Account collapsible group */}
        <button className={`nav-group-header ${accountActive ? 'active' : ''}`} onClick={() => setAccountOpenState(o => !o)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
            Account
          </span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: accountOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}><path d="M18 15l-6-6-6 6"/></svg>
        </button>
        {accountOpen && (
          <div className="nav-group-body">
            {ACCOUNT_GROUP.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)} className={`nav-subitem ${section === n.id ? 'active' : ''}`}>
                {n.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ height: '10px' }} />

        <div style={{ position: 'relative' }}>
          <div className="nav-indicator" style={{ transform: `translateY(${activeIdx * 44}px)`, boxShadow: `0 0 24px ${cfg.accent}66`, background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent2})` }} />
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)} className={`nav-item ${section === n.id ? 'active' : ''}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div className="help-card">
          <div style={{ fontSize: '12.5px', fontWeight: 600, marginBottom: '10px', lineHeight: 1.4 }}>Have a question or need support?</div>
          <a href="/support" className="help-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
            Help Center
          </a>
          <div style={{ fontSize: '12.5px', fontWeight: 600, margin: '12px 0 10px' }}>Check out your page</div>
          <a href={`/${cfg.username}`} target="_blank" rel="noopener noreferrer" className="help-btn" style={{ background: `${cfg.accent}22`, color: cfg.accent }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
            My Page
          </a>
        </div>

        <button className="share-btn" style={{ background: `linear-gradient(135deg, ${cfg.accent}33, ${cfg.accent2}33)`, borderColor: `${cfg.accent}55` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
          Share Your Profile
        </button>

        <div className="user-chip">
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
            {cfg.displayName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.displayName}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>illness.lol/{cfg.username}</div>
          </div>
        </div>
      </aside>


      {/* ---------------- Main ---------------- */}
      <main style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', minWidth: 0 }}>
        <div className="editor-col scroll">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', textTransform: 'capitalize' }}>{section}</h1>
            <button className="save-btn" onClick={save}>
              <span>Save changes</span>
            </button>
          </div>
          <p style={{ margin: '0 0 26px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            {section === 'customize' && 'Personalize how your illness.lol page looks and feels.'}
            {section === 'analytics' && 'How your page has been performing this week.'}
            {section === 'links' && 'Manage the links visitors see on your page.'}
            {!['customize', 'analytics', 'links'].includes(section) && 'Coming soon.'}
          </p>

          <div key={section} className="section-enter">
            {section === 'customize' && <CustomizePanel cfg={cfg} set={set} toggleEffect={toggleEffect} addSocial={addSocial} updSocial={updSocial} rmSocial={rmSocial} />}
            {section === 'analytics' && <AnalyticsPanel cfg={cfg} mounted={mounted} />}
            {section === 'links' && <LinksPanel cfg={cfg} updSocial={updSocial} rmSocial={rmSocial} addSocial={addSocial} />}
            {!['customize', 'analytics', 'links'].includes(section) && (
              <Card title={`${section} — coming soon`} desc="This panel is a placeholder.">
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>
                  The <b style={{ color: '#fff' }}>{section}</b> section isn't built out yet. Try <b style={{ color: '#fff' }}>Customize</b> and <b style={{ color: '#fff' }}>Analytics</b>.
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* ---------------- Live preview ---------------- */}
        <div className="preview-col scroll">
          <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Live preview</span>
            <span className="live-dot">live</span>
          </div>
          <TiltPreview cfg={cfg} />
          <a href="/" style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>illness.lol/{cfg.username} ↗</a>
        </div>
      </main>

      {/* toast */}
      <div className={`toast ${toast ? 'show' : ''}`}>
        <span style={{ color: cfg.accent }}>✓</span> Changes saved
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Customize panel                                                   */
/* ================================================================== */
function CustomizePanel({ cfg, set, toggleEffect, addSocial, updSocial, rmSocial }) {
  return (
    <>
      <Card title="Profile" desc="The basics visitors see first.">
        <Row>
          <Field label="Display name"><input style={inp} value={cfg.displayName} onChange={e => set('displayName', e.target.value)} /></Field>
          <Field label="Username">
            <div style={{ position: 'relative' }}>
              <span style={prefix}>illness.lol/</span>
              <input style={{ ...inp, paddingLeft: '88px' }} value={cfg.username} onChange={e => set('username', e.target.value)} />
            </div>
          </Field>
        </Row>
        <Field label="Bio">
          <textarea style={{ ...inp, minHeight: '64px', resize: 'vertical', paddingTop: '10px' }} value={cfg.bio} onChange={e => set('bio', e.target.value)} maxLength={120} />
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', textAlign: 'right' }}>{cfg.bio.length}/120</div>
        </Field>
        <Row>
          <Field label="Location (optional)"><input style={inp} placeholder="Earth" value={cfg.location} onChange={e => set('location', e.target.value)} /></Field>
          <Field label="Avatar URL"><input style={inp} placeholder="https://…" value={cfg.avatar} onChange={e => set('avatar', e.target.value)} /></Field>
        </Row>
        <Toggle label="Typewriter bio animation" checked={cfg.typewriterBio} onChange={() => set('typewriterBio', !cfg.typewriterBio)} accent={cfg.accent} />
      </Card>

      <Card title="Appearance" desc="Colors, glass, and depth.">
        <Row>
          <Field label="Accent color"><ColorInput value={cfg.accent} onChange={v => set('accent', v)} /></Field>
          <Field label="Secondary accent"><ColorInput value={cfg.accent2} onChange={v => set('accent2', v)} /></Field>
        </Row>
        <Field label="Background color"><ColorInput value={cfg.bgColor} onChange={v => set('bgColor', v)} /></Field>
        <Toggle label="Gradient background" checked={cfg.gradientBg} onChange={() => set('gradientBg', !cfg.gradientBg)} accent={cfg.accent} />
        <Slider label="Card opacity" value={cfg.cardOpacity} min={20} max={100} suffix="%" accent={cfg.accent} onChange={v => set('cardOpacity', v)} />
        <Slider label="Background blur" value={cfg.blur} min={0} max={40} suffix="px" accent={cfg.accent} onChange={v => set('blur', v)} />
        <Toggle label="Card glow" checked={cfg.glow} onChange={() => set('glow', !cfg.glow)} accent={cfg.accent} />
        <Toggle label="3D tilt on hover" checked={cfg.tilt} onChange={() => set('tilt', !cfg.tilt)} accent={cfg.accent} />
        <Toggle label="Monochrome social icons" checked={cfg.monochromeIcons} onChange={() => set('monochromeIcons', !cfg.monochromeIcons)} accent={cfg.accent} />
      </Card>

      <Card title="Effects" desc="Ambient motion layered over your page — watch the preview.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {EFFECTS.map(e => {
            const on = cfg.effects[e.key]
            return (
              <button key={e.key} onClick={() => toggleEffect(e.key)} className="effect-chip" style={{
                borderColor: on ? cfg.accent : 'rgba(255,255,255,0.1)',
                background: on ? `${cfg.accent}1f` : 'rgba(255,255,255,0.03)',
              }}>
                <span className="effect-glow" style={{ background: on ? cfg.accent : 'rgba(255,255,255,0.2)', boxShadow: on ? `0 0 12px ${cfg.accent}` : 'none' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: on ? '#fff' : 'rgba(255,255,255,0.65)' }}>{e.label}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{e.hint}</div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Media" desc="Background media and profile song.">
        <Field label="Background image / video URL"><input style={inp} placeholder="https://… (.jpg, .gif, .mp4)" value={cfg.background} onChange={e => set('background', e.target.value)} /></Field>
        <Field label="Profile song URL"><input style={inp} placeholder="https://… (.mp3)" value={cfg.audio} onChange={e => set('audio', e.target.value)} /></Field>
        <Slider label="Default volume" value={cfg.volume} min={0} max={100} suffix="%" accent={cfg.accent} onChange={v => set('volume', v)} />
        <Toggle label='"Click to enter" splash' checked={cfg.clickToEnter} onChange={() => set('clickToEnter', !cfg.clickToEnter)} accent={cfg.accent} />
      </Card>

      <Card title="Social links" desc="Where your visitors go next.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {cfg.socials.map(s => (
            <div key={s.id} className="social-row">
              <select style={{ ...inp, width: '150px', flexShrink: 0, cursor: 'pointer' }} value={s.type} onChange={e => updSocial(s.id, { type: e.target.value })}>
                {SOCIAL_TYPES.map(t => <option key={t} value={t} style={{ background: '#12121a' }}>{t}</option>)}
              </select>
              <input style={inp} placeholder="https://…" value={s.url} onChange={e => updSocial(s.id, { url: e.target.value })} />
              <button onClick={() => rmSocial(s.id)} style={iconBtn} title="Remove">✕</button>
            </div>
          ))}
        </div>
        <button onClick={addSocial} style={{ ...ghostBtn, marginTop: '12px' }}>+ Add link</button>
      </Card>

      <Card title="General" desc="Extra behavior toggles.">
        <Toggle label="Animated page title" checked={cfg.animatedTitle} onChange={() => set('animatedTitle', !cfg.animatedTitle)} accent={cfg.accent} />
        <Toggle label="Custom cursor" checked={cfg.customCursor} onChange={() => set('customCursor', !cfg.customCursor)} accent={cfg.accent} />
      </Card>
    </>
  )
}

/* ================================================================== */
/*  Analytics panel — animated                                        */
/* ================================================================== */
function AnalyticsPanel({ cfg, mounted }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const data = [42, 68, 55, 90, 73, 120, 98]
  const max = Math.max(...data)
  const stats = [
    { label: 'Total views', value: cfg.views.toLocaleString(), delta: '+12.4%' },
    { label: 'Link clicks', value: '463', delta: '+8.1%' },
    { label: 'Unique visitors', value: '921', delta: '+5.6%' },
    { label: 'Avg. time', value: '38s', delta: '+2.0%' },
  ]
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '18px' }}>
        {stats.map((s, i) => (
          <div key={s.label} className="stat-tile" style={{ animationDelay: `${i * 70}ms` }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: cfg.accent }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <Card title="Views this week" desc="Daily page views.">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '10px' }}>
          {data.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <div className="bar" style={{
                width: '100%', borderRadius: '6px 6px 2px 2px',
                background: `linear-gradient(to top, ${cfg.accent}, ${cfg.accent2})`,
                height: mounted ? `${(v / max) * 100}%` : '0%',
                transition: `height 0.8s cubic-bezier(.2,.8,.2,1) ${i * 60}ms`,
                boxShadow: `0 0 18px ${cfg.accent}55`,
              }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Top links" desc="Most clicked destinations.">
        {[['Discord', 182, 62], ['Instagram', 121, 41], ['Spotify', 96, 33], ['TikTok', 64, 22]].map(([name, clicks, pct], i) => (
          <div key={name} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span>{name}</span><span style={{ color: 'rgba(255,255,255,0.5)' }}>{clicks} clicks</span>
            </div>
            <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '4px', width: mounted ? `${pct}%` : '0%', background: `linear-gradient(90deg, ${cfg.accent}, ${cfg.accent2})`, transition: `width 0.9s cubic-bezier(.2,.8,.2,1) ${i * 80}ms` }} />
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}

/* ================================================================== */
/*  Links panel                                                       */
/* ================================================================== */
function LinksPanel({ cfg, updSocial, rmSocial, addSocial }) {
  return (
    <Card title="Your links" desc="Drag-free list of destinations shown on your page.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {cfg.socials.map(s => (
          <div key={s.id} className="social-row">
            <select style={{ ...inp, width: '150px', flexShrink: 0, cursor: 'pointer' }} value={s.type} onChange={e => updSocial(s.id, { type: e.target.value })}>
              {SOCIAL_TYPES.map(t => <option key={t} value={t} style={{ background: '#12121a' }}>{t}</option>)}
            </select>
            <input style={inp} placeholder="https://…" value={s.url} onChange={e => updSocial(s.id, { url: e.target.value })} />
            <button onClick={() => rmSocial(s.id)} style={iconBtn}>✕</button>
          </div>
        ))}
      </div>
      <button onClick={addSocial} style={{ ...ghostBtn, marginTop: '12px' }}>+ Add link</button>
    </Card>
  )
}

/* ================================================================== */
/*  Tilt preview wrapper + animated effects canvas                    */
/* ================================================================== */
function TiltPreview({ cfg }) {
  const wrapRef = useRef(null)
  const [t, setT] = useState({ rx: 0, ry: 0 })

  const onMove = useCallback((e) => {
    if (!cfg.tilt) return
    const r = wrapRef.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setT({ rx: -py * 10, ry: px * 12 })
  }, [cfg.tilt])
  const onLeave = () => setT({ rx: 0, ry: 0 })

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ width: '100%', perspective: '1000px' }}>
      <div style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, transition: 'transform 0.12s ease-out', transformStyle: 'preserve-3d' }}>
        <ProfilePreview cfg={cfg} />
      </div>
    </div>
  )
}

function ProfilePreview({ cfg }) {
  const fxRef = useRef(null)
  const [typed, setTyped] = useState('')

  // typewriter bio
  useEffect(() => {
    if (!cfg.typewriterBio) { setTyped(cfg.bio); return }
    let i = 0; setTyped('')
    const id = setInterval(() => {
      i++; setTyped(cfg.bio.slice(0, i))
      if (i >= cfg.bio.length) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [cfg.typewriterBio, cfg.bio])

  // animated effects canvas
  useEffect(() => {
    const canvas = fxRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, dpr = window.devicePixelRatio || 1
    const fit = () => {
      const r = canvas.getBoundingClientRect()
      W = r.width; H = r.height
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()

    const hex = cfg.accent.replace('#', '')
    const ar = parseInt(hex.substring(0, 2) || 'ff', 16)
    const ag = parseInt(hex.substring(2, 4) || 'ff', 16)
    const ab = parseInt(hex.substring(4, 6) || 'ff', 16)

    const mk = () => {
      const arr = []
      if (cfg.effects.particles) for (let i = 0; i < 26; i++) arr.push({ t: 'p', x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.4 + 0.6, vy: -(Math.random() * 0.3 + 0.1), vx: (Math.random() - 0.5) * 0.2, a: Math.random() * 0.5 + 0.2 })
      if (cfg.effects.rain) for (let i = 0; i < 40; i++) arr.push({ t: 'r', x: Math.random() * W, y: Math.random() * H, len: Math.random() * 12 + 8, vy: Math.random() * 3 + 4 })
      if (cfg.effects.snow) for (let i = 0; i < 34; i++) arr.push({ t: 's', x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + 1, vy: Math.random() * 0.6 + 0.3, drift: Math.random() * Math.PI * 2 })
      if (cfg.effects.sparkles) for (let i = 0; i < 22; i++) arr.push({ t: 'k', x: Math.random() * W, y: Math.random() * H, tw: Math.random() * Math.PI * 2, sp: Math.random() * 0.06 + 0.02, sz: Math.random() * 1.6 + 0.6 })
      return arr
    }
    let parts = mk()
    let raf
    const loop = () => {
      ctx.clearRect(0, 0, W, H)
      parts.forEach(p => {
        if (p.t === 'p') {
          p.y += p.vy; p.x += p.vx
          if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${p.a})`; ctx.fill()
        } else if (p.t === 'r') {
          p.y += p.vy
          if (p.y > H + p.len) { p.y = -p.len; p.x = Math.random() * W }
          ctx.strokeStyle = 'rgba(180,200,255,0.35)'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.len); ctx.stroke()
        } else if (p.t === 's') {
          p.drift += 0.02; p.y += p.vy; p.x += Math.sin(p.drift) * 0.4
          if (p.y > H + 4) { p.y = -4; p.x = Math.random() * W }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill()
        } else if (p.t === 'k') {
          p.tw += p.sp
          const a = 0.3 + 0.7 * Math.abs(Math.sin(p.tw))
          const s = p.sz * (0.6 + 0.4 * Math.abs(Math.sin(p.tw)))
          ctx.fillStyle = `rgba(${ar},${ag},${ab},${a})`
          ctx.beginPath()
          ctx.moveTo(p.x, p.y - s * 2); ctx.lineTo(p.x + s, p.y); ctx.lineTo(p.x, p.y + s * 2); ctx.lineTo(p.x - s, p.y); ctx.closePath(); ctx.fill()
        }
      })
      raf = requestAnimationFrame(loop)
    }
    loop()
    const onResize = () => { fit() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [cfg.effects, cfg.accent])

  const bgIsMedia = cfg.background && cfg.background.trim() !== ''
  const pageBg = cfg.gradientBg
    ? `radial-gradient(120% 90% at 50% 0%, ${cfg.accent}22, transparent 60%), ${cfg.bgColor}`
    : cfg.bgColor

  return (
    <div style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: '18px', overflow: 'hidden', position: 'relative', background: pageBg, border: '0.5px solid rgba(255,255,255,0.1)', boxShadow: cfg.glow ? `0 20px 60px ${cfg.accent}33` : '0 20px 50px rgba(0,0,0,0.5)' }}>
      {bgIsMedia && <img src={cfg.background} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />}
      <canvas ref={fxRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', inset: '18px', borderRadius: '14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '20px', textAlign: 'center',
        background: `rgba(12,12,22,${cfg.cardOpacity / 100})`,
        backdropFilter: `blur(${cfg.blur}px)`, WebkitBackdropFilter: `blur(${cfg.blur}px)`,
        border: '0.5px solid rgba(255,255,255,0.12)',
        boxShadow: cfg.glow ? `0 0 60px ${cfg.accent}44, inset 0 0 40px ${cfg.accent}11` : 'none',
      }}>
        <div className="pfp" style={{
          width: '76px', height: '76px', borderRadius: '50%', marginBottom: '14px',
          background: cfg.avatar ? `center/cover url(${cfg.avatar})` : `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent2})`,
          border: `2px solid ${cfg.accent}`,
          boxShadow: cfg.glow ? `0 0 24px ${cfg.accent}aa` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 700, color: '#fff',
        }}>
          {!cfg.avatar && (cfg.displayName.charAt(0).toUpperCase() || 'U')}
        </div>

        <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>{cfg.displayName || 'yourname'}</div>
        {cfg.location && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>📍 {cfg.location}</div>}
        <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', lineHeight: 1.5, maxWidth: '85%', minHeight: '19px' }}>
          {typed}{cfg.typewriterBio && typed.length < cfg.bio.length && <span className="caret">|</span>}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cfg.socials.map(s => (
            <div key={s.id} className="soc-icon" title={s.type} style={{
              background: cfg.monochromeIcons ? 'rgba(255,255,255,0.08)' : `${cfg.accent}33`,
              color: cfg.monochromeIcons ? 'rgba(255,255,255,0.8)' : cfg.accent,
            }}>{s.type.charAt(0)}</div>
          ))}
        </div>

        <div style={{ marginTop: '18px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.accent, boxShadow: `0 0 8px ${cfg.accent}` }} />
          {cfg.views.toLocaleString()} views
        </div>
      </div>

      {cfg.audio && (
        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="eq"><i></i><i></i><i></i></span> {cfg.volume}%
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/*  Reusable bits                                                     */
/* ================================================================== */
function Card({ title, desc, children }) {
  return (
    <div className="card">
      <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>{title}</div>
      {desc && <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '18px' }}>{desc}</div>}
      {children}
    </div>
  )
}
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>{children}</div> }
function Field({ label, children }) { return <div style={{ marginBottom: '14px' }}><label style={lbl}>{label}</label>{children}</div> }

function Slider({ label, value, min, max, suffix, onChange, accent }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '9px' }}>
        <label style={lbl}>{label}</label>
        <span style={{ fontSize: '12px', color: accent, fontWeight: 600 }}>{value}{suffix}</span>
      </div>
      <input type="range" className="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(90deg, ${accent} ${pct}%, rgba(255,255,255,0.1) ${pct}%)` }} />
    </div>
  )
}

function Toggle({ label, checked, onChange, accent }) {
  return (
    <div onClick={onChange} className="toggle-row">
      <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.75)' }}>{label}</span>
      <div style={{ width: '38px', height: '22px', borderRadius: '11px', flexShrink: 0, background: checked ? accent : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', boxShadow: checked ? `0 0 12px ${accent}66` : 'none' }}>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: checked ? '19px' : '3px', transition: 'left 0.2s cubic-bezier(.34,1.56,.64,1)' }} />
      </div>
    </div>
  )
}

function ColorInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="color-swatch" />
      <input style={inp} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

/* ================================================================== */
/*  Global styles / keyframes                                         */
/* ================================================================== */
function GlobalStyles({ accent }) {
  return (
    <style>{`
      * { box-sizing: border-box; }
      .scroll::-webkit-scrollbar { width: 8px; }
      .scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      .scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

      .sidebar { position: relative; z-index: 2; width: 220px; flex-shrink: 0; border-right: 0.5px solid rgba(255,255,255,0.08); background: rgba(10,10,18,0.6); backdrop-filter: blur(16px); padding: 24px 16px; display: flex; flex-direction: column; gap: 4px; min-height: 100vh; }
      .nav-indicator { position: absolute; top: 0; left: 0; width: 100%; height: 40px; border-radius: 10px; opacity: 0.9; transition: transform 0.32s cubic-bezier(.34,1.3,.5,1); z-index: 0; }
      .nav-item { position: relative; z-index: 1; display: flex; align-items: center; gap: 11px; padding: 10px 12px; margin-bottom: 4px; height: 40px; border-radius: 10px; cursor: pointer; border: none; text-align: left; width: 100%; font-family: inherit; font-size: 13.5px; font-weight: 500; background: transparent; color: rgba(255,255,255,0.5); transition: color 0.2s; }
      .nav-item:hover { color: rgba(255,255,255,0.85); }
      .nav-item.active { color: #fff; font-weight: 600; }
      .user-chip { display: flex; align-items: center; gap: 10px; padding: 12px 8px 2px; border-top: 0.5px solid rgba(255,255,255,0.08); margin-top: 10px; }

      .search-box { display: flex; align-items: center; gap: 8px; padding: 9px 10px; margin-bottom: 14px; border-radius: 9px; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.35); }
      .search-box input { flex: 1; background: none; border: none; outline: none; color: #fff; font-family: inherit; font-size: 12.5px; min-width: 0; }
      .search-box input::placeholder { color: rgba(255,255,255,0.3); }
      .kbd { font-size: 10px; padding: 2px 5px; border-radius: 4px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.35); flex-shrink: 0; }

      .nav-group-header { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 9px 10px; border-radius: 9px; border: none; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.6); margin-bottom: 4px; transition: background 0.15s, color 0.15s; }
      .nav-group-header:hover { background: rgba(255,255,255,0.06); color: #fff; }
      .nav-group-header.active { color: #fff; }
      .nav-group-body { display: flex; flex-direction: column; margin-bottom: 6px; }
      .nav-subitem { text-align: left; padding: 7px 10px 7px 38px; border: none; background: none; cursor: pointer; font-family: inherit; font-size: 12.5px; color: rgba(255,255,255,0.4); border-radius: 7px; transition: color 0.15s, background 0.15s; }
      .nav-subitem:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.03); }
      .nav-subitem.active { color: #fff; font-weight: 600; }

      .help-card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; margin-bottom: 10px; }
      .help-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; border-radius: 8px; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); text-decoration: none; font-size: 12.5px; font-weight: 600; box-sizing: border-box; transition: transform 0.15s, background 0.15s; }
      .help-btn:hover { transform: translateY(-1px); }

      .share-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px; border-radius: 10px; border: 0.5px solid; color: #fff; font-family: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: transform 0.15s; }
      .share-btn:hover { transform: translateY(-1px); }

      .editor-col { flex: 1; min-width: 0; padding: 32px 36px; overflow-y: auto; max-height: 100vh; }
      .preview-col { width: 400px; flex-shrink: 0; padding: 32px 28px; border-left: 0.5px solid rgba(255,255,255,0.08); background: rgba(8,8,14,0.4); backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; position: sticky; top: 0; max-height: 100vh; overflow-y: auto; }

      .card { background: rgba(12,12,22,0.7); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 22px 24px; margin-bottom: 18px; backdrop-filter: blur(16px); transition: border-color 0.2s, transform 0.2s; animation: rise 0.45s cubic-bezier(.2,.8,.2,1) both; }
      .card:hover { border-color: rgba(255,255,255,0.18); }

      .section-enter { animation: sectionIn 0.4s cubic-bezier(.2,.8,.2,1); }
      @keyframes sectionIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

      .save-btn { position: relative; padding: 9px 18px; background: rgba(255,255,255,0.9); color: #06060f; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; overflow: hidden; transition: transform 0.1s, box-shadow 0.2s; }
      .save-btn:hover { box-shadow: 0 6px 20px rgba(255,255,255,0.2); }
      .save-btn:active { transform: scale(0.96); }
      .save-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%); transform: translateX(-120%); }
      .save-btn:hover::after { animation: shine 0.7s; }
      @keyframes shine { to { transform: translateX(120%); } }

      .effect-chip { display: flex; align-items: center; gap: 11px; padding: 13px 14px; border-radius: 12px; border: 1px solid; cursor: pointer; font-family: inherit; transition: all 0.2s; }
      .effect-chip:hover { transform: translateY(-2px); }
      .effect-glow { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; transition: all 0.25s; }

      .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; cursor: pointer; border-radius: 6px; transition: background 0.15s; }
      .toggle-row:hover { background: rgba(255,255,255,0.02); }

      .range { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; outline: none; cursor: pointer; }
      .range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 0 10px ${accent}, 0 2px 4px rgba(0,0,0,0.4); transition: transform 0.15s; }
      .range::-webkit-slider-thumb:hover { transform: scale(1.25); }
      .range::-moz-range-thumb { width: 16px; height: 16px; border: none; border-radius: 50%; background: #fff; cursor: pointer; }

      .color-swatch { width: 40px; height: 38px; padding: 0; border: 0.5px solid rgba(255,255,255,0.15); border-radius: 8px; background: none; cursor: pointer; }
      .color-swatch::-webkit-color-swatch { border: none; border-radius: 6px; }
      .color-swatch::-webkit-color-swatch-wrapper { padding: 3px; }

      .social-row { display: flex; gap: 8px; animation: rise 0.3s ease both; }

      .stat-tile { background: rgba(12,12,22,0.7); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 16px 18px; backdrop-filter: blur(16px); animation: rise 0.5s cubic-bezier(.2,.8,.2,1) both; transition: transform 0.2s, border-color 0.2s; }
      .stat-tile:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.2); }

      .preview-col .live-dot, .live-dot { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${accent}; display: flex; align-items: center; gap: 5px; }
      .live-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: ${accent}; box-shadow: 0 0 8px ${accent}; animation: pulse 1.4s infinite; }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

      .pfp { animation: floaty 5s ease-in-out infinite; }
      @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
      .soc-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 0.5px solid rgba(255,255,255,0.12); transition: transform 0.15s; cursor: pointer; }
      .soc-icon:hover { transform: translateY(-3px) scale(1.08); }
      .caret { animation: blink 1s step-end infinite; }
      @keyframes blink { 50% { opacity: 0; } }

      .eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 10px; }
      .eq i { width: 2px; background: ${accent}; border-radius: 1px; animation: eq 0.8s ease-in-out infinite; }
      .eq i:nth-child(1){ height: 40%; animation-delay: 0s; }
      .eq i:nth-child(2){ height: 100%; animation-delay: 0.2s; }
      .eq i:nth-child(3){ height: 60%; animation-delay: 0.4s; }
      @keyframes eq { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }

      .toast { position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%) translateY(20px); z-index: 50; background: rgba(18,18,28,0.95); border: 0.5px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 20px; font-size: 13.5px; font-weight: 500; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(16px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); opacity: 0; pointer-events: none; transition: opacity 0.3s, transform 0.3s cubic-bezier(.34,1.56,.64,1); }
      .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

      input:focus, textarea:focus, select:focus { border-color: rgba(255,255,255,0.4) !important; background: rgba(255,255,255,0.06) !important; }
    `}</style>
  )
}

/* inline style tokens */
const inp = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', fontSize: '13.5px', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.15s, background 0.15s' }
const lbl = { display: 'block', fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '7px' }
const prefix = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', fontWeight: 500 }
const ghostBtn = { padding: '10px 14px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
const iconBtn = { width: '38px', flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }