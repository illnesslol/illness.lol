'use client'

import { useState } from 'react'

const C = {
  bg: '#070707', surface: '#0d0d0d', raised: '#121212', line: 'rgba(255,255,255,.08)',
  orange: '#ff6a1a', orange2: '#ff9a52', muted: 'rgba(255,255,255,.62)', faint: 'rgba(255,255,255,.38)',
}

const navItems = [
  { label: 'Overview', icon: '◫' },
  { label: 'Customize page', icon: '✳' },
  { label: 'Links', icon: '↗' },
  { label: 'Appearance', icon: '◐' },
  { label: 'File hosting', icon: '▤' },
]

function Icon({ children }) {
  return <span aria-hidden="true" className="icon">{children}</span>
}

function Panel({ children, className = '' }) {
  return <section className={`panel ${className}`}>{children}</section>
}

export default function DashboardPage() {
  const [active, setActive] = useState('Overview')
  const [copied, setCopied] = useState(false)
  const [profilePublic, setProfilePublic] = useState(true)

  async function copyProfile() {
    try {
      await navigator.clipboard.writeText('https://illness.lol/yourname')
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="dash-shell">
      <aside className="sidebar">
        <a className="brand" href="/">
          <span className="brand-mark">i.</span>
          <span>illness<span className="brand-dot">.lol</span></span>
        </a>

        <div className="user-mini">
          <div className="avatar">A</div>
          <div className="user-mini-text"><strong>yourname</strong><span>Free account</span></div>
          <span className="online-dot" />
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav className="nav-list" aria-label="Dashboard navigation">
          {navItems.map(item => (
            <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => setActive(item.label)}>
              <Icon>{item.icon}</Icon><span>{item.label}</span>
              {item.label === 'Links' && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>

        <p className="nav-label tools-label">ACCOUNT</p>
        <button className={`nav-item ${active === 'Settings' ? 'active' : ''}`} onClick={() => setActive('Settings')}><Icon>⚙</Icon><span>Settings</span></button>
        <div className="sidebar-bottom">
          <div className="season-card">
            <div className="season-leaf">✦</div>
            <strong>Autumn is here</strong>
            <p>Warm tones. Cozy pages.</p>
            <span className="season-pill">FALL THEME <span>↗</span></span>
          </div>
          <a className="discord-link" href="https://discord.gg/illness" target="_blank" rel="noreferrer"><span>◉</span> Need help? Join Discord <span>↗</span></a>
          <button className="account-button" onClick={() => setActive('Account')}><div className="avatar small">A</div><span><strong>yourname</strong><small>Manage account</small></span><span className="account-more">···</span></button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Dashboard</span><b>/</b><strong>{active}</strong></div>
          <div className="top-actions"><span className="season-tag"><span className="tiny-leaf">✦</span> AUTUMN '26</span><button className="icon-button" aria-label="Notifications">♧<i /></button><button className="view-button" onClick={copyProfile}>↗ <span>View profile</span></button></div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div><p className="eyebrow"><span /> YOUR PERSONAL SPACE</p><h1>Good evening, <span>yourname.</span></h1><p className="subheading">Your corner of the internet, looking pretty good.</p></div>
            <button className="primary-button" onClick={() => setActive('Customize page')}><span>✳</span> Customize page <span className="button-arrow">↗</span></button>
          </div>

          <Panel className="profile-banner">
            <div className="banner-art"><div className="sun-glow" /><span className="leaf leaf-one">✦</span><span className="leaf leaf-two">✧</span><span className="leaf leaf-three">❧</span><div className="banner-grid" /></div>
            <div className="profile-info"><div className="profile-avatar">A<span className="avatar-status" /></div><div className="profile-copy"><div className="profile-name">yourname <span className="verified">✓</span></div><div className="profile-url">illness.lol/yourname <span>↗</span></div><p>Your bio goes here — tell the world a little about you.</p></div><div className="profile-controls"><span className={`status-pill ${profilePublic ? '' : 'private'}`}><i />{profilePublic ? 'Public' : 'Private'}</span><button className="switch" aria-label="Toggle profile visibility" aria-pressed={profilePublic} onClick={() => setProfilePublic(v => !v)}><span /></button></div></div>
            <div className="profile-footer"><span><i className="live-dot" /> Profile is {profilePublic ? 'live' : 'hidden'}</span><button onClick={copyProfile}>{copied ? '✓ Copied link' : 'Copy profile link'} <span>⧉</span></button></div>
          </Panel>

          <div className="section-heading"><div><h2>At a glance</h2><p>A little look at how your page is doing.</p></div><span className="period-label">LAST 7 DAYS <span>⌄</span></span></div>
          <div className="stats-grid">
            <Panel className="stat-card"><div className="stat-top"><span className="stat-icon orange">◉</span><span className="trend">↗ 12.8%</span></div><p>Profile views</p><div className="stat-number">2,481</div><div className="mini-chart"><svg viewBox="0 0 220 38" preserveAspectRatio="none"><path d="M0 31 C18 28 18 18 36 23 S57 34 73 18 S98 26 114 15 S140 23 155 10 S180 18 194 5 S210 9 220 2" /></svg></div></Panel>
            <Panel className="stat-card"><div className="stat-top"><span className="stat-icon gold">↗</span><span className="trend">↗ 8.4%</span></div><p>Link clicks</p><div className="stat-number">864</div><div className="mini-chart chart-gold"><svg viewBox="0 0 220 38" preserveAspectRatio="none"><path d="M0 30 C20 24 25 33 42 22 S65 27 80 18 S105 27 120 12 S148 19 165 13 S193 16 220 3" /></svg></div></Panel>
            <Panel className="stat-card"><div className="stat-top"><span className="stat-icon green">⌁</span><span className="trend">↗ 3.2%</span></div><p>Unique visitors</p><div className="stat-number">1,706</div><div className="mini-chart chart-green"><svg viewBox="0 0 220 38" preserveAspectRatio="none"><path d="M0 32 C18 24 30 30 46 20 S70 29 88 15 S112 23 132 18 S155 21 173 9 S200 13 220 4" /></svg></div></Panel>
            <Panel className="stat-card"><div className="stat-top"><span className="stat-icon purple">♡</span><span className="trend neutral">All time</span></div><p>Active links</p><div className="stat-number">04<span className="stat-total"> / 10</span></div><div className="progress-track"><span /></div><div className="progress-caption">4 links published <span>40%</span></div></Panel>
          </div>

          <div className="lower-grid">
            <Panel className="activity-panel"><div className="panel-heading"><div><h2>Profile activity</h2><p>Your traffic over the past week.</p></div><button className="more-button" aria-label="More activity options">···</button></div><div className="chart-legend"><span><i /> Views</span><span><i /> Clicks</span></div><div className="activity-chart"><div className="y-labels"><span>500</span><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div><div className="plot"><div className="grid-lines"><i/><i/><i/><i/><i/><i/></div><svg viewBox="0 0 600 190" preserveAspectRatio="none" className="activity-svg"><defs><linearGradient id="areaOrange" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ff7a2e" stopOpacity=".24"/><stop offset="100%" stopColor="#ff7a2e" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 145 C30 130 45 140 70 108 S115 128 145 90 S180 110 215 70 S260 90 290 80 S330 103 360 55 S410 78 435 46 S480 75 510 30 S565 50 600 14 L600 190 L0 190 Z"/><path className="line-views" d="M0 145 C30 130 45 140 70 108 S115 128 145 90 S180 110 215 70 S260 90 290 80 S330 103 360 55 S410 78 435 46 S480 75 510 30 S565 50 600 14"/><path className="line-clicks" d="M0 164 C40 155 50 170 85 145 S130 158 160 133 S205 145 240 120 S285 140 320 112 S360 130 395 105 S440 118 470 91 S520 106 555 75 S580 85 600 68"/></svg><div className="x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div></Panel>
            <Panel className="quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Make something happen.</p></div></div><button className="quick-action" onClick={() => setActive('Customize page')}><span className="quick-icon orange">✳</span><span><strong>Edit your page</strong><small>Update your bio and style</small></span><b>↗</b></button><button className="quick-action" onClick={() => setActive('Links')}><span className="quick-icon gold">↗</span><span><strong>Manage links</strong><small>Add or organize your links</small></span><b>↗</b></button><button className="quick-action" onClick={() => setActive('Appearance')}><span className="quick-icon green">◐</span><span><strong>Change appearance</strong><small>Colors, backgrounds, effects</small></span><b>↗</b></button><div className="tip-box"><span>✦</span><div><strong>A little seasonal tip</strong><p>Try a burnt-orange accent to match the autumn vibes.</p></div></div></Panel>
          </div>
          <footer className="footer"><span>© 2026 illness.lol</span><span>Made for your little corner of the internet <b>♥</b></span><a href="/help">Help center ↗</a></footer>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; color: #f7f5f2; font-family: 'DM Sans', sans-serif; }
        button, a { font: inherit; }
        button { cursor: pointer; }
        .dash-shell { min-height: 100vh; display: flex; background: radial-gradient(ellipse at 75% 0%, rgba(120,57,20,.09), transparent 35%), ${C.bg}; }
        .sidebar { width: 248px; flex: 0 0 248px; border-right: 1px solid ${C.line}; background: rgba(10,10,10,.96); padding: 27px 15px 17px; display: flex; flex-direction: column; min-height: 100vh; position: sticky; top: 0; height: 100vh; }
        .brand { display: flex; align-items: center; gap: 10px; color: #fff; text-decoration: none; font: 600 21px 'Space Grotesk',sans-serif; letter-spacing: -.7px; padding: 0 11px; }
        .brand-mark { width: 30px; height: 30px; border-radius: 10px; display: grid; place-items: center; background: linear-gradient(135deg,${C.orange},${C.orange2}); color: #160a03; font-size: 19px; font-weight: 700; box-shadow: 0 0 22px #ff6a1a30; }
        .brand-dot { color: ${C.orange2}; }
        .user-mini { display: flex; align-items: center; gap: 10px; margin: 34px 0 31px; padding: 12px 10px; border: 1px solid ${C.line}; border-radius: 13px; background: linear-gradient(120deg,#15120f,#0e0e0e); }
        .avatar { width: 35px; height: 35px; flex-shrink: 0; display: grid; place-items: center; border-radius: 11px; background: linear-gradient(140deg,#d87535,#f5b56b); color: #211006; font: 700 15px 'Space Grotesk'; }
        .user-mini-text { min-width: 0; display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .user-mini-text strong, .account-button strong { font-size: 12px; font-weight: 600; }
        .user-mini-text span, .account-button small { font-size: 11px; color: ${C.faint}; }
        .online-dot { width: 7px; height: 7px; border-radius: 50%; background: #75c994; box-shadow: 0 0 9px #75c99450; }
        .nav-label { color: #65615d; font-size: 10px; font-weight: 700; letter-spacing: 1.35px; padding: 0 12px; margin: 0 0 10px; }
        .nav-list { display: grid; gap: 5px; }
        .nav-item { width: 100%; border: 1px solid transparent; border-radius: 10px; background: transparent; color: #99938d; display: flex; align-items: center; gap: 12px; padding: 11px 12px; font-size: 12px; text-align: left; transition: .18s ease; }
        .nav-item:hover { background: #ffffff07; color: #fff; }
        .nav-item.active { color: #fff; border-color: #ff8a3d25; background: linear-gradient(100deg,#ff7a2e1c,#ff7a2e08); box-shadow: inset 2px 0 ${C.orange}; }
        .icon { width: 18px; text-align: center; color: ${C.orange2}; font-size: 16px; }
        .nav-count { margin-left: auto; color: #d5a17d; background: #ff8a3d18; border-radius: 5px; padding: 2px 6px; font-size: 10px; }
        .tools-label { margin-top: 30px; }
        .sidebar-bottom { margin-top: auto; }
        .season-card { overflow: hidden; position: relative; padding: 15px 13px 13px; margin: 0 2px 15px; border: 1px solid #ff8a3d20; border-radius: 13px; background: radial-gradient(ellipse at 100% 0%,#a84e2225,transparent 60%), #12100e; }
        .season-leaf { position: absolute; right: 13px; top: 8px; color: #b96b3b; font-size: 24px; transform: rotate(18deg); }
        .season-card strong { font-size: 12px; display: block; }
        .season-card p { margin: 5px 0 13px; font-size: 10px; color: ${C.muted}; }
        .season-pill { display: inline-flex; gap: 8px; align-items: center; padding: 5px 7px; border-radius: 6px; color: #e8a273; background: #ff8a3d12; font-size: 8px; letter-spacing: .7px; font-weight: 700; }
        .discord-link { display: flex; align-items: center; gap: 7px; padding: 8px 7px 16px; color: #8e8983; text-decoration: none; font-size: 10px; }
        .discord-link span:first-child { color: ${C.orange2}; }.discord-link span:last-child { margin-left: auto; }
        .account-button { width: 100%; display: flex; align-items: center; gap: 10px; text-align: left; border: 0; border-top: 1px solid ${C.line}; padding: 15px 5px 0; background: transparent; color: #fff; }
        .avatar.small { width: 32px; height: 32px; border-radius: 10px; font-size: 13px; }
        .account-button > span:nth-child(2) { display: flex; flex-direction: column; gap: 3px; flex: 1; }.account-more { color: ${C.muted}; letter-spacing: 2px; }
        .main-area { flex: 1; min-width: 0; }
        .topbar { height: 76px; display: flex; align-items: center; justify-content: space-between; padding: 0 42px; border-bottom: 1px solid ${C.line}; background: #080808c9; }
        .breadcrumbs { display: flex; align-items: center; gap: 11px; color: #77716b; font-size: 12px; }.breadcrumbs b { color: #48433f; font-weight: 400; }.breadcrumbs strong { color: #e8e3de; font-weight: 500; }
        .top-actions { display: flex; align-items: center; gap: 17px; }.season-tag { display: flex; align-items: center; gap: 7px; color: #d5a17d; border: 1px solid #ff8a3d24; border-radius: 7px; padding: 7px 9px; font-size: 9px; letter-spacing: .8px; }.tiny-leaf { font-size: 12px; }
        .icon-button { position: relative; width: 33px; height: 33px; border: 1px solid ${C.line}; border-radius: 9px; color: #b5aea7; background: #111; font-size: 17px; }.icon-button i { position: absolute; right: 7px; top: 6px; width: 5px; height: 5px; border-radius: 50%; background: ${C.orange}; }
        .view-button { display: flex; align-items: center; gap: 8px; border: 1px solid #ff8a3d40; border-radius: 9px; padding: 9px 13px; background: #ff8a3d12; color: #f0c2a0; font-size: 11px; }
        .content { max-width: 1450px; padding: 37px 42px 20px; margin: 0 auto; }
        .welcome-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 28px; }
        .eyebrow { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; color: #a87a5a; font-size: 9px; letter-spacing: 1.6px; font-weight: 700; }.eyebrow span { width: 6px; height: 6px; border-radius: 2px; background: ${C.orange}; box-shadow: 0 0 10px #ff6a1a80; }
        h1,h2,p { margin-top: 0; }.welcome-row h1 { margin: 0; font: 600 clamp(24px,2.2vw,31px)/1.2 'Space Grotesk',sans-serif; letter-spacing: -1px; }.welcome-row h1 span { color: ${C.orange2}; }.subheading { margin: 9px 0 0; color: #8e8983; font-size: 12px; }
        .primary-button { display: flex; align-items: center; gap: 9px; border: 1px solid #ff8a3d40; border-radius: 10px; padding: 12px 14px; color: #170b04; background: linear-gradient(120deg,#ff8a3d,#ffb16c); font-size: 11px; font-weight: 700; box-shadow: 0 4px 22px #ff6a1a17; transition: transform .2s, box-shadow .2s; }.primary-button:hover { transform: translateY(-1px); box-shadow: 0 6px 25px #ff6a1a30; }.button-arrow { margin-left: 6px; }
        .panel { min-width: 0; border: 1px solid ${C.line}; border-radius: 14px; background: linear-gradient(145deg,#111 0%,#0b0b0b 100%); box-shadow: 0 12px 35px #00000012; }
        .profile-banner { overflow: hidden; margin-bottom: 29px; }.banner-art { height: 112px; position: relative; overflow: hidden; background: linear-gradient(105deg,#21150e 0%,#3b2114 42%,#19100b 100%); }.sun-glow { position: absolute; width: 250px; height: 170px; right: 16%; top: -110px; border-radius: 50%; background: #d46b2e; filter: blur(60px); opacity: .42; }.banner-grid { position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(#e99b6720 1px,transparent 1px),linear-gradient(90deg,#e99b6720 1px,transparent 1px); background-size: 30px 30px; mask-image: linear-gradient(90deg,transparent,#000 45%,#000); }.leaf { position: absolute; color: #d98a4d; opacity: .65; }.leaf-one { right: 15%; top: 13px; font-size: 43px; transform: rotate(25deg); }.leaf-two { right: 9%; top: 48px; font-size: 28px; transform: rotate(-20deg); }.leaf-three { right: 23%; top: 53px; font-size: 46px; transform: rotate(18deg); color: #a85a32; }
        .profile-info { display: flex; align-items: center; gap: 15px; padding: 0 23px 18px; min-height: 94px; }.profile-avatar { position: relative; display: grid; place-items: center; width: 62px; height: 62px; margin-top: -28px; flex-shrink: 0; border: 4px solid #0e0e0e; border-radius: 18px; background: linear-gradient(140deg,#d87535,#f5b56b); color: #251106; font: 700 25px 'Space Grotesk'; box-shadow: 0 5px 20px #0007; }.avatar-status { position: absolute; right: -2px; bottom: -2px; width: 13px; height: 13px; border: 3px solid #0d0d0d; border-radius: 50%; background: #78ca91; }.profile-copy { min-width: 0; padding-top: 13px; }.profile-name { font: 600 16px 'Space Grotesk'; }.verified { display: inline-grid; place-items: center; width: 14px; height: 14px; margin-left: 3px; border-radius: 50%; background: #cf7b42; color: #140a04; font: 700 9px sans-serif; vertical-align: 2px; }.profile-url { margin-top: 5px; color: #d08a5c; font-size: 10px; }.profile-url span { margin-left: 4px; }.profile-copy p { margin: 8px 0 0; color: #817a73; font-size: 11px; }.profile-controls { display: flex; align-items: center; gap: 10px; margin-left: auto; align-self: flex-start; padding-top: 17px; }.status-pill { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border: 1px solid #75c99427; border-radius: 7px; color: #8dd5a5; background: #75c9940b; font-size: 10px; }.status-pill i { width: 5px; height: 5px; border-radius: 50%; background: #75c994; }.status-pill.private { color: #d0a27f; border-color: #ff8a3d25; background: #ff8a3d0b; }.status-pill.private i { background: ${C.orange}; }
        .switch { width: 32px; height: 18px; padding: 2px; border: 0; border-radius: 20px; background: ${C.orange}; transition: .2s; }.switch span { display: block; width: 14px; height: 14px; border-radius: 50%; background: white; margin-left: 14px; transition: .2s; }.switch[aria-pressed="false"] { background: #393632; }.switch[aria-pressed="false"] span { margin-left: 0; }
        .profile-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 23px; border-top: 1px solid ${C.line}; color: #77716b; font-size: 10px; }.profile-footer > span { display: flex; align-items: center; gap: 7px; }.live-dot { width: 5px; height: 5px; border-radius: 50%; background: #75c994; }.profile-footer button { border: 0; color: #dca178; background: transparent; font-size: 10px; }.profile-footer button span { margin-left: 6px; }
        .section-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }.section-heading h2, .panel-heading h2 { margin: 0; font: 600 15px 'Space Grotesk'; letter-spacing: -.3px; }.section-heading p, .panel-heading p { margin: 5px 0 0; color: #77716b; font-size: 10px; }.period-label { display: flex; align-items: center; gap: 10px; border: 1px solid ${C.line}; border-radius: 7px; padding: 7px 9px; color: #aaa29a; font-size: 9px; letter-spacing: .6px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin-bottom: 24px; }.stat-card { padding: 16px 16px 12px; min-height: 155px; overflow: hidden; }.stat-top { display: flex; justify-content: space-between; align-items: center; }.stat-icon,.quick-icon { display: grid; place-items: center; border-radius: 9px; width: 30px; height: 30px; font-size: 16px; }.orange { color: #ff9a5c; background: #ff8a3d16; }.gold { color: #e5bd76; background: #e5bd7616; }.green { color: #88c7a0; background: #88c7a016; }.purple { color: #c4a3df; background: #c4a3df16; }.trend { color: #8fc99e; font-size: 9px; }.trend.neutral { color: #716b65; }.stat-card > p { margin: 14px 0 4px; color: #969089; font-size: 10px; }.stat-number { font: 600 25px 'Space Grotesk'; letter-spacing: -.8px; }.stat-total { color: #77716b; font: 400 13px 'DM Sans'; }.mini-chart { height: 28px; margin: 3px -2px 0; }.mini-chart svg { width: 100%; height: 100%; overflow: visible; }.mini-chart path { fill: none; stroke: #ff8a3d; stroke-width: 2; vector-effect: non-scaling-stroke; }.chart-gold path { stroke: #d6ae68; }.chart-green path { stroke: #7fbd95; }.progress-track { height: 4px; margin-top: 15px; border-radius: 5px; background: #292522; overflow: hidden; }.progress-track span { display: block; height: 100%; width: 40%; border-radius: 5px; background: linear-gradient(90deg,#d36a32,#ffb16c); }.progress-caption { display: flex; justify-content: space-between; margin-top: 7px; color: #77716b; font-size: 9px; }.progress-caption span { color: #c18a62; }
        .lower-grid { display: grid; grid-template-columns: minmax(0,1.65fr) minmax(280px,1fr); gap: 14px; }.activity-panel,.quick-panel { padding: 19px; }.panel-heading { display: flex; justify-content: space-between; align-items: flex-start; }.more-button { border: 1px solid ${C.line}; border-radius: 7px; background: #ffffff04; color: #8f8880; padding: 2px 8px; letter-spacing: 2px; }.chart-legend { display: flex; gap: 14px; margin-top: 20px; font-size: 9px; color: #99918a; }.chart-legend span { display: flex; align-items: center; gap: 6px; }.chart-legend i { width: 6px; height: 6px; border-radius: 2px; background: ${C.orange}; }.chart-legend span + span i { background: #d6ae68; }
        .activity-chart { display: flex; gap: 10px; height: 220px; padding-top: 13px; }.y-labels { display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 21px; color: #69635d; font-size: 9px; }.plot { position: relative; flex: 1; min-width: 0; }.grid-lines { position: absolute; inset: 0 0 21px; display: flex; flex-direction: column; justify-content: space-between; }.grid-lines i { border-top: 1px dashed #ffffff0d; }.activity-svg { position: absolute; inset: 0 0 21px; width: 100%; height: calc(100% - 21px); overflow: visible; }.activity-svg .area { fill: url(#areaOrange); }.line-views,.line-clicks { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; }.line-views { stroke: ${C.orange}; }.line-clicks { stroke: #d6ae68; stroke-dasharray: 4 4; }.x-labels { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-between; color: #69635d; font-size: 9px; }
        .quick-panel { display: flex; flex-direction: column; }.quick-panel .panel-heading { margin-bottom: 12px; }.quick-action { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; padding: 12px 0; border: 0; border-bottom: 1px solid ${C.line}; background: transparent; color: #eee; }.quick-icon { width: 34px; height: 34px; flex-shrink: 0; }.quick-action > span:nth-child(2) { display: flex; flex-direction: column; gap: 4px; flex: 1; }.quick-action strong { font-size: 11px; font-weight: 600; }.quick-action small { color: #77716b; font-size: 9px; }.quick-action > b { color: #77716b; font-weight: 400; }.quick-action:hover > b { color: ${C.orange2}; }.tip-box { display: flex; gap: 10px; margin-top: 16px; padding: 12px; border: 1px solid #ff8a3d1e; border-radius: 10px; background: #ff8a3d08; }.tip-box > span { color: ${C.orange2}; }.tip-box strong { font-size: 10px; color: #e2b18d; }.tip-box p { margin: 5px 0 0; color: #8e8176; font-size: 9px; line-height: 1.5; }
        .footer { display: flex; align-items: center; gap: 22px; margin-top: 25px; padding: 15px 1px 5px; color: #5f5a55; font-size: 9px; }.footer span:nth-child(2) { margin: 0 auto; }.footer b { color: ${C.orange}; }.footer a { color: #8b8178; text-decoration: none; }
        @media (max-width: 1150px) { .sidebar { width: 215px; flex-basis: 215px; }.content { padding: 30px 25px 20px; }.topbar { padding: 0 25px; }.stats-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
        @media (max-width: 800px) { .sidebar { width: 66px; flex-basis: 66px; padding: 22px 8px; }.brand { padding: 0 9px; }.brand > span:last-child,.user-mini-text,.online-dot,.nav-label,.nav-item > span:not(.icon),.sidebar-bottom { display: none; }.user-mini { justify-content: center; padding: 7px 0; border: 0; background: transparent; margin: 27px 0 20px; }.nav-item { justify-content: center; padding: 12px 0; }.nav-item .icon { font-size: 18px; }.tools-label { display: none; }.topbar { height: 64px; padding: 0 17px; }.content { padding: 25px 17px; }.lower-grid { grid-template-columns: 1fr; }.season-tag { display: none; } }
        @media (max-width: 520px) { .welcome-row { align-items: flex-start; flex-direction: column; }.welcome-row h1 { font-size: 25px; }.primary-button { padding: 10px 12px; }.stats-grid { gap: 9px; }.stat-card { padding: 12px; min-height: 145px; }.stat-number { font-size: 22px; }.profile-info { padding: 0 13px 15px; gap: 10px; flex-wrap: wrap; }.profile-controls { padding-top: 13px; }.profile-copy p { line-height: 1.4; }.profile-footer { padding: 11px 13px; }.footer { flex-wrap: wrap; gap: 10px; }.footer span:nth-child(2) { margin: 0; order: 3; width: 100%; }.view-button { padding: 8px 9px; }.view-button span { display: none; } }
      `}</style>
    </main>
  )
}
