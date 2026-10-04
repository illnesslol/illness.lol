'use client'

import { useState } from 'react'
import {
  useDashboardData,
  Spark,
  ActivityChart,
  fmt,
  trend,
  LINK_LIMIT,
} from './dashboardKit'

const ICONS = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),

  customize: (
    <>
      <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
    </>
  ),

  profile: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0Z" />
    </>
  ),

  premium: (
    <>
      <path d="m3 8 4 4 5-8 5 8 4-4-2 11H5L3 8Z" />
      <path d="M7 22h10" />
    </>
  ),

  templates: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),

  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m5 17 5-5 3 3 2-2 4 4" />
    </>
  ),

  account: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M7.5 17a5 5 0 0 1 9 0" />
    </>
  ),

  assets: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m7 15 3-3 2 2 3-4 3 5" />
    </>
  ),

  badges: (
    <path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />
  ),

  links: (
    <>
      <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
    </>
  ),

  projects: (
    <>
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <path d="M8 5V3h8v2M3 10h18" />
    </>
  ),

  widgets: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),

  section: (
    <path d="M4 5h16M4 10h16M4 15h10M4 20h10" />
  ),

  backgrounds: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="16" cy="8" r="2" />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </>
  ),

  metadata: (
    <>
      <path d="M4 5h16M4 12h16M4 19h10" />
      <circle cx="18" cy="19" r="2" />
    </>
  ),

  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),

  domains: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </>
  ),

  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
}

function Icon({ name, size = 16 }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name] || ICONS.overview}
    </svg>
  )
}

function Panel({ children, className = '' }) {
  return <section className={`panel ${className}`}>{children}</section>
}

const PROFILE_ITEMS = [
  ['Assets', 'assets'],
  ['Badges', 'badges'],
  ['Links', 'links'],
  ['Projects', 'projects'],
  ['Widgets', 'widgets'],
  ['Section Builder', 'section'],
].map(([l, i]) => [l, l, i])

const PREMIUM_ITEMS = [
  ['Customize', 'Premium Customize', 'customize'],
  ['Backgrounds', 'Backgrounds', 'backgrounds'],
  ['Metadata', 'Metadata', 'metadata'],
]

const ACCOUNT_ITEMS = [
  ['Settings', 'Settings', 'settings'],
  ['Domains', 'Domains', 'domains'],
]

const QUICK_ACTIONS = [
  ['Edit your page', 'Update your bio and style', '✳', 'orange', 'Customize page'],
  ['Manage links', 'Add or organize your links', '↗', 'gold', 'Links'],
  ['Change appearance', 'Colors, backgrounds, effects', '◐', 'green', 'Appearance'],
]

function NavItem({
  label,
  value = label,
  icon,
  active,
  setActive,
  className = '',
  children,
}) {
  return (
    <button
      className={`nav-item ${className} ${
        active === value ? 'active' : ''
      }`}
      onClick={() => setActive(value)}
    >
      <Icon name={icon} />
      <span>{label}</span>
      {children}
    </button>
  )
}

function NavGroup({
  label,
  icon,
  items,
  open,
  toggle,
  active,
  setActive,
  lock,
  groupClass = '',
  triggerClass = '',
}) {
  const current =
    active === label || items.some(([, v]) => v === active)

  return (
    <div className={`nav-group ${groupClass}`}>
      <button
        className={`nav-item group-trigger ${triggerClass} ${
          current ? 'group-current' : ''
        }`}
        onClick={toggle}
        aria-expanded={open}
      >
        <Icon name={icon} />
        <span>{label}</span>

        {lock && <span className="premium-lock">🔒</span>}

        <span className={`chevron ${open ? 'expanded' : ''}`}>
          ⌃
        </span>
      </button>

      {open && (
        <div className="subnav">
          {items.map(([text, value, ic]) => (
            <button
              key={value}
              className={`subnav-item ${
                active === value ? 'selected' : ''
              }`}
              onClick={() => setActive(value)}
            >
              <Icon name={ic} size={14} />
              <span>{text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [active, setActive] = useState('Overview')
  const [copied, setCopied] = useState(false)

  const [open, setOpen] = useState({
    profile: true,
    premium: true,
    account: true,
  })

  const {
    username,
    initial,
    bio,
    greeting,
    stats,
    profilePublic,
    setProfilePublic,
  } = useDashboardData()

  const profileUrl = `https://illness.lol/${username}`

  const flip = (k) =>
    setOpen((o) => ({
      ...o,
      [k]: !o[k],
    }))

  const nav = {
    active,
    setActive,
  }

  const pct = Math.min(
    100,
    Math.round((stats.activeLinks / LINK_LIMIT) * 100)
  )

  async function copyProfile() {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setCopied(false)
    }
  }

  const statCards = [
    {
      icon: '◉',
      tone: 'orange',
      label: 'Profile views',
      value: stats.views,
      prev: stats.prev.views,
      series: 'views',
      chart: '',
    },
    {
      icon: '↗',
      tone: 'gold',
      label: 'Link clicks',
      value: stats.clicks,
      prev: stats.prev.clicks,
      series: 'clicks',
      chart: 'chart-gold',
    },
    {
      icon: '⌁',
      tone: 'green',
      label: 'Unique visitors',
      value: stats.visitors,
      prev: stats.prev.visitors,
      series: 'views',
      chart: 'chart-green',
    },
  ]

  return (
    <main className="dash-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <a className="brand" href="/">
          <img
            className="brand-image"
            src="/icon.png"
            alt=""
          />

          <span>
            illness<span className="brand-dot">.lol</span>
          </span>
        </a>

        <button
          className="sidebar-search"
          onClick={() => setActive('Search')}
        >
          <Icon name="search" size={17} />

          <span>Search illness</span>

          <kbd>Ctrl K</kbd>
        </button>

        <nav
          className="nav-list"
          aria-label="Dashboard navigation"
        >
          <NavItem
            label="Overview"
            icon="overview"
            {...nav}
          />

          <NavItem
            label="Customize"
            value="Customize page"
            icon="customize"
            {...nav}
          />

          <NavGroup
            label="Profile"
            icon="profile"
            items={PROFILE_ITEMS}
            open={open.profile}
            toggle={() => flip('profile')}
            {...nav}
          />

          <NavGroup
            label="Premium"
            icon="premium"
            items={PREMIUM_ITEMS}
            open={open.premium}
            toggle={() => flip('premium')}
            lock
            {...nav}
          />

          <NavItem
            label="Templates"
            icon="templates"
            {...nav}
          />

          <NavItem
            label="Image Host"
            icon="image"
            className="disabled-item"
            {...nav}
          >
            <small>SOON</small>
          </NavItem>

          <NavGroup
            label="Account"
            icon="account"
            items={ACCOUNT_ITEMS}
            open={open.account}
            toggle={() => flip('account')}
            groupClass="account-nav-group"
            triggerClass="account-trigger"
            {...nav}
          />
        </nav>

        <div className="sidebar-bottom">
          <button
            className="share-profile"
            onClick={copyProfile}
          >
            <span className="share-icon">
              <Icon name="profile" size={16} />
            </span>

            <span>
              <small>Profile</small>

              <strong>
                {copied
                  ? 'Link copied!'
                  : 'Share your profile'}
              </strong>
            </span>

            <span className="share-arrow">↗</span>
          </button>

          <button
            className="account-button"
            onClick={() => setActive('Account')}
          >
            <div className="avatar small">
              {initial}
            </div>

            <span>
              <small>Signed in as</small>

              <strong>{username}</strong>
            </span>

            <span className="account-settings">
              <Icon name="settings" size={15} />
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <div className="main-area">

        {/* TOP BAR */}

        <header className="topbar">
          <div className="breadcrumbs">
            <span>Dashboard</span>
            <b>/</b>
            <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <span className="season-tag">
              <span className="tiny-leaf">✦</span>
              AUTUMN '26
            </span>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              ♧
              <i />
            </button>

            <button
              className="view-button"
              onClick={() =>
                window.open(profileUrl, '_blank')
              }
            >
              ↗
              <span>View profile</span>
            </button>
          </div>
        </header>

        <div className="content">

          {/* WELCOME */}

          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                <span />
                YOUR PERSONAL SPACE
              </p>

              <h1>
                {greeting},{' '}
                <span>{username}.</span>
              </h1>

              <p className="subheading">
                Your corner of the internet, looking pretty good.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setActive('Customize page')
              }
            >
              <span>✳</span>
              Customize page
              <span className="button-arrow">↗</span>
            </button>
          </div>

          {/* PROFILE CARD */}

          <Panel className="profile-banner">
            <div className="banner-art">
              <div className="sun-glow" />

              <span className="leaf leaf-one">
                ✦
              </span>

              <span className="leaf leaf-two">
                ✧
              </span>

              <span className="leaf leaf-three">
                ❧
              </span>

              <div className="banner-grid" />
            </div>

            <div className="profile-info">
              <div className="profile-avatar">
                {initial}

                <span className="avatar-status" />
              </div>

              <div className="profile-copy">
                <div className="profile-name">
                  {username}

                  <span className="verified">
                    ✓
                  </span>
                </div>

                <div className="profile-url">
                  illness.lol/{username}
                  <span>↗</span>
                </div>

                <p>
                  {bio ||
                    'Your bio goes here — tell the world a little about you.'}
                </p>
              </div>

              <div className="profile-controls">
                <span
                  className={`status-pill ${
                    profilePublic ? '' : 'private'
                  }`}
                >
                  <i />

                  {profilePublic
                    ? 'Public'
                    : 'Private'}
                </span>

                <button
                  className="switch"
                  aria-label="Toggle profile visibility"
                  aria-pressed={profilePublic}
                  onClick={() =>
                    setProfilePublic(
                      (v) => !v
                    )
                  }
                >
                  <span />
                </button>
              </div>
            </div>

            <div className="profile-footer">
              <span>
                <i className="live-dot" />

                Profile is{' '}
                {profilePublic
                  ? 'live'
                  : 'hidden'}
              </span>

              <button onClick={copyProfile}>
                {copied
                  ? '✓ Copied link'
                  : 'Copy profile link'}

                <span>⧉</span>
              </button>
            </div>
          </Panel>

          {/* STATS */}

          <div className="section-heading">
            <div>
              <h2>At a glance</h2>

              <p>
                A little look at how your page is doing.
              </p>
            </div>

            <span className="period-label">
              LAST 7 DAYS
              <span>⌄</span>
            </span>
          </div>

          <div className="stats-grid">
            {statCards.map((c) => (
              <Panel
                key={c.label}
                className="stat-card"
              >
                <div className="stat-top">
                  <span
                    className={`stat-icon ${c.tone}`}
                  >
                    {c.icon}
                  </span>

                  <span className="trend">
                    {trend(
                      c.value,
                      c.prev
                    )}
                  </span>
                </div>

                <p>{c.label}</p>

                <div className="stat-number">
                  {fmt(c.value)}
                </div>

                <Spark
                  values={stats.daily.map(
                    (d) => d[c.series]
                  )}
                  className={c.chart}
                />
              </Panel>
            ))}

            <Panel className="stat-card">
              <div className="stat-top">
                <span className="stat-icon purple">
                  ♡
                </span>

                <span className="trend neutral">
                  All time
                </span>
              </div>

              <p>Active links</p>

              <div className="stat-number">
                {String(
                  stats.activeLinks
                ).padStart(2, '0')}

                <span className="stat-total">
                  {' '}
                  / {LINK_LIMIT}
                </span>
              </div>

              <div className="progress-track">
                <span
                  style={{
                    width: `${pct}%`,
                  }}
                />
              </div>

              <div className="progress-caption">
                {stats.activeLinks}{' '}
                {stats.activeLinks === 1
                  ? 'link'
                  : 'links'}{' '}
                published

                <span>
                  {pct}%
                </span>
              </div>
            </Panel>
          </div>

          {/* LOWER */}

          <div className="lower-grid">

            <Panel className="activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>Profile activity</h2>

                  <p>
                    Your traffic over the past week.
                  </p>
                </div>

                <button
                  className="more-button"
                  aria-label="More activity options"
                >
                  ···
                </button>
              </div>

              <div className="chart-legend">
                <span>
                  <i />
                  Views
                </span>

                <span>
                  <i />
                  Clicks
                </span>
              </div>

              <ActivityChart
                daily={stats.daily}
              />
            </Panel>

            <Panel className="quick-panel">
              <div className="panel-heading">
                <div>
                  <h2>Quick actions</h2>

                  <p>
                    Make something happen.
                  </p>
                </div>
              </div>

              {QUICK_ACTIONS.map(
                ([
                  title,
                  sub,
                  icon,
                  tone,
                  target,
                ]) => (
                  <button
                    key={title}
                    className="quick-action"
                    onClick={() =>
                      setActive(target)
                    }
                  >
                    <span
                      className={`quick-icon ${tone}`}
                    >
                      {icon}
                    </span>

                    <span>
                      <strong>{title}</strong>
                      <small>{sub}</small>
                    </span>

                    <b>↗</b>
                  </button>
                )
              )}

              <div className="tip-box">
                <span>✦</span>

                <div>
                  <strong>
                    A little seasonal tip
                  </strong>

                  <p>
                    Try a burnt-orange accent
                    to match the autumn vibes.
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          {/* =====================================================
              LARGE SITE FOOTER
          ===================================================== */}

          <footer className="site-footer">
            <div className="footer-glow" />

            <div className="footer-top">

              {/* FOOTER BRAND */}

              <div className="footer-brand">
                <a
                  href="/"
                  className="footer-logo"
                >
                  <img
                    src="/icon.png"
                    alt=""
                  />

                  <span>
                    illness
                    <span>.lol</span>
                  </span>
                </a>

                <p>
                  Your little corner of the
                  internet.
                  <br />
                  Make it yours.
                </p>

                <div className="footer-status">
                  <i />
                  All systems operational
                </div>
              </div>

              {/* FOOTER LINKS */}

              <div className="footer-links">

                <div className="footer-column">
                  <h3>Product</h3>

                  <a href="/pricing">
                    Pricing
                    <span>↗</span>
                  </a>

                  <a href="/templates">
                    Templates
                    <span>↗</span>
                  </a>

                  <a href="/questions">
                    Questions
                    <span>↗</span>
                  </a>

                  <a href="/help">
                    Help center
                    <span>↗</span>
                  </a>
                </div>

                <div className="footer-column">
                  <h3>Account</h3>

                  <a href="/signup">
                    Create account
                    <span>↗</span>
                  </a>

                  <a href="/login">
                    Sign in
                    <span>↗</span>
                  </a>

                  <a href="/dashboard">
                    Dashboard
                    <span>↗</span>
                  </a>
                </div>

                <div className="footer-column">
                  <h3>Legal</h3>

                  <a href="/terms">
                    Terms of service
                    <span>↗</span>
                  </a>

                  <a href="/privacy">
                    Privacy policy
                    <span>↗</span>
                  </a>
                </div>

                <div className="footer-column">
                  <h3>Community</h3>

                  <a href="/discord">
                    Discord
                    <span>↗</span>
                  </a>

                  <a href="/help">
                    Support
                    <span>↗</span>
                  </a>
                </div>

              </div>
            </div>

            <div className="footer-divider" />

            <div className="footer-bottom">
              <span>
                © 2026 illness.lol. All rights reserved.
              </span>

              <span className="footer-made">
                Made with <b>♥</b> for your little
                corner of the internet
              </span>

              <span className="footer-version">
                <i />
                illness.lol
              </span>
            </div>
          </footer>

        </div>
      </div>

      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #070707;
          color: #f7f5f2;
          font-family: 'DM Sans', sans-serif;
        }

        button,
        a {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        h1,
        h2,
        p {
          margin-top: 0;
        }

        /* =====================================================
           DASHBOARD
        ===================================================== */

        .dash-shell {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(
              ellipse at 75% 0%,
              rgba(120,57,20,.09),
              transparent 35%
            ),
            #070707;
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          width: 252px;
          flex: 0 0 252px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 20px 12px 12px;
          background: #080808;
          border-right: 1px solid rgba(255,255,255,.07);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 9px;
          margin: 0 0 24px;
          color: #f5f5f5;
          text-decoration: none;
          font: 700 21px 'Space Grotesk';
          letter-spacing: -.8px;
        }

        .brand-image {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        .brand-dot {
          color: #ff6a1a;
        }

        .sidebar-search {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          margin: 0 0 16px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 13px;
          background: #0d0d0d;
          color: #858585;
          text-align: left;
          font-size: 12px;
        }

        .sidebar-search span {
          flex: 1;
          color: #a4a4a4;
        }

        .sidebar-search kbd {
          padding: 4px 6px;
          border: 1px solid #252525;
          border-radius: 6px;
          color: #777;
          font: 10px 'DM Sans';
        }

        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 39px;
          padding: 0 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #b7b7b7;
          text-align: left;
          font: 500 12px 'DM Sans';
          transition:
            background .15s,
            border-color .15s,
            color .15s;
        }

        .nav-item:hover,
        .subnav-item:hover {
          background: #ffffff08;
          color: #f5f5f5;
        }

        .nav-item .icon {
          flex-shrink: 0;
          color: #777;
        }

        .nav-item.active {
          border-color: rgba(255,106,26,.35);
          background: rgba(255,106,26,.12);
          color: #ff8a3d;
        }

        .nav-item.active .icon {
          color: #ff8a3d;
        }

        .nav-item span:nth-child(2) {
          flex: 1;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
        }

        .group-current:not(.active) {
          color: #e3e3e3;
        }

        .chevron {
          margin-left: auto;
          color: #777;
          font-size: 13px;
          transform: rotate(180deg);
          transition: transform .15s;
        }

        .chevron.expanded {
          transform: rotate(0);
        }

        .premium-lock {
          margin-left: auto;
          font-size: 10px;
          opacity: .65;
        }

        .subnav {
          display: flex;
          flex-direction: column;
          margin: 1px 0 7px 19px;
          padding: 1px 0 1px 14px;
          border-left: 1px solid #222;
          gap: 1px;
        }

        .subnav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 33px;
          padding: 0 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #b4b4b4;
          text-align: left;
          font: 400 11.5px 'DM Sans';
        }

        .subnav-item .icon {
          color: #686868;
          flex-shrink: 0;
        }

        .subnav-item.selected {
          color: #ff8a3d;
          background: rgba(255,106,26,.07);
        }

        .subnav-item.selected .icon {
          color: #ff8a3d;
        }

        .disabled-item,
        .disabled-item .icon {
          color: #4f4f4f;
        }

        .disabled-item small {
          margin-left: auto;
          color: #454545;
          font-size: 9px;
          letter-spacing: .4px;
        }

        .account-nav-group {
          margin-top: 5px;
        }

        .account-trigger {
          border: 1px solid #666;
          border-radius: 22px;
          color: #d4d4d4;
        }

        .account-trigger .icon {
          color: #929292;
        }

        .sidebar-bottom {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
          padding-top: 22px;
        }

        .share-profile,
        .account-button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 11px;
          border: 1px solid #242424;
          border-radius: 15px;
          background: #0d0d0d;
          color: #eee;
          text-align: left;
        }

        .share-icon {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #171717;
          color: #aaa;
        }

        .share-profile > span:nth-child(2),
        .account-button > span:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .share-profile small,
        .account-button small {
          color: #777;
          font-size: 9px;
        }

        .share-profile strong,
        .account-button strong {
          color: #eee;
          font-size: 11px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .share-arrow {
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: #222;
          color: #888;
          font-size: 11px;
        }

        .account-button {
          padding: 9px 10px;
        }

        .avatar.small {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          background: linear-gradient(
            140deg,
            #d87535,
            #f5b56b
          );
          color: #251106;
          font: 700 11px 'Space Grotesk';
        }

        .account-settings {
          color: #777;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main-area {
          flex: 1;
          min-width: 0;
        }

        .topbar {
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
          border-bottom: 1px solid rgba(255,255,255,.08);
          background: #080808c9;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #77716b;
          font-size: 12px;
        }

        .breadcrumbs b {
          color: #48433f;
          font-weight: 400;
        }

        .breadcrumbs strong {
          color: #e8e3de;
          font-weight: 500;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .season-tag {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #d5a17d;
          border: 1px solid #ff8a3d24;
          border-radius: 7px;
          padding: 7px 9px;
          font-size: 9px;
          letter-spacing: .8px;
        }

        .tiny-leaf {
          font-size: 12px;
        }

        .icon-button {
          position: relative;
          width: 33px;
          height: 33px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          color: #b5aea7;
          background: #111;
          font-size: 17px;
        }

        .icon-button i {
          position: absolute;
          right: 7px;
          top: 6px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ff6a1a;
        }

        .view-button {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #ff8a3d40;
          border-radius: 9px;
          padding: 9px 13px;
          background: #ff8a3d12;
          color: #f0c2a0;
          font-size: 11px;
        }

        .content {
          max-width: 1450px;
          padding: 37px 42px 20px;
          margin: 0 auto;
        }

        .welcome-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 10px;
          color: #a87a5a;
          font-size: 9px;
          letter-spacing: 1.6px;
          font-weight: 700;
        }

        .eyebrow span {
          width: 6px;
          height: 6px;
          border-radius: 2px;
          background: #ff6a1a;
          box-shadow: 0 0 10px #ff6a1a80;
        }

        .welcome-row h1 {
          margin: 0;
          font: 600 clamp(24px,2.2vw,31px)/1.2
            'Space Grotesk', sans-serif;
          letter-spacing: -1px;
        }

        .welcome-row h1 span {
          color: #ff9a52;
        }

        .subheading {
          margin: 9px 0 0;
          color: #8e8983;
          font-size: 12px;
        }

        .primary-button {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #ff8a3d40;
          border-radius: 10px;
          padding: 12px 14px;
          color: #170b04;
          background: linear-gradient(
            120deg,
            #ff8a3d,
            #ffb16c
          );
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 4px 22px #ff6a1a17;
          transition:
            transform .2s,
            box-shadow .2s;
        }

        .primary-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 25px #ff6a1a30;
        }

        .button-arrow {
          margin-left: 6px;
        }

        .panel {
          min-width: 0;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          background: linear-gradient(
            145deg,
            #111,
            #0b0b0b
          );
          box-shadow: 0 12px 35px #00000012;
        }

        /* =====================================================
           PROFILE
        ===================================================== */

        .profile-banner {
          overflow: hidden;
          margin-bottom: 29px;
        }

        .banner-art {
          height: 112px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            105deg,
            #21150e,
            #3b2114 42%,
            #19100b
          );
        }

        .sun-glow {
          position: absolute;
          width: 250px;
          height: 170px;
          right: 16%;
          top: -110px;
          border-radius: 50%;
          background: #d46b2e;
          filter: blur(60px);
          opacity: .42;
        }

        .banner-grid {
          position: absolute;
          inset: 0;
          opacity: .18;
          background-image:
            linear-gradient(
              #e99b6720 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              #e99b6720 1px,
              transparent 1px
            );
          background-size: 30px 30px;
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 45%,
            #000
          );
        }

        .leaf {
          position: absolute;
          color: #d98a4d;
          opacity: .65;
        }

        .leaf-one {
          right: 15%;
          top: 13px;
          font-size: 43px;
          transform: rotate(25deg);
        }

        .leaf-two {
          right: 9%;
          top: 48px;
          font-size: 28px;
          transform: rotate(-20deg);
        }

        .leaf-three {
          right: 23%;
          top: 53px;
          font-size: 46px;
          transform: rotate(18deg);
          color: #a85a32;
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 23px 18px;
          min-height: 94px;
        }

        .profile-avatar {
          position: relative;
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          margin-top: -28px;
          flex-shrink: 0;
          border: 4px solid #0e0e0e;
          border-radius: 18px;
          background: linear-gradient(
            140deg,
            #d87535,
            #f5b56b
          );
          color: #251106;
          font: 700 25px 'Space Grotesk';
          box-shadow: 0 5px 20px #0007;
        }

        .avatar-status {
          position: absolute;
          right: -2px;
          bottom: -2px;
          width: 13px;
          height: 13px;
          border: 3px solid #0d0d0d;
          border-radius: 50%;
          background: #78ca91;
        }

        .profile-copy {
          min-width: 0;
          padding-top: 13px;
        }

        .profile-name {
          font: 600 16px 'Space Grotesk';
        }

        .verified {
          display: inline-grid;
          place-items: center;
          width: 14px;
          height: 14px;
          margin-left: 3px;
          border-radius: 50%;
          background: #cf7b42;
          color: #140a04;
          font: 700 9px sans-serif;
          vertical-align: 2px;
        }

        .profile-url {
          margin-top: 5px;
          color: #d08a5c;
          font-size: 10px;
        }

        .profile-url span {
          margin-left: 4px;
        }

        .profile-copy p {
          margin: 8px 0 0;
          color: #817a73;
          font-size: 11px;
        }

        .profile-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
          align-self: flex-start;
          padding-top: 17px;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px;
          border: 1px solid #75c99427;
          border-radius: 7px;
          color: #8dd5a5;
          background: #75c9940b;
          font-size: 10px;
        }

        .status-pill i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #75c994;
        }

        .status-pill.private {
          color: #d0a27f;
          border-color: #ff8a3d25;
          background: #ff8a3d0b;
        }

        .status-pill.private i {
          background: #ff6a1a;
        }

        .switch {
          width: 32px;
          height: 18px;
          padding: 2px;
          border: 0;
          border-radius: 20px;
          background: #ff6a1a;
          transition: .2s;
        }

        .switch span {
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          margin-left: 14px;
          transition: .2s;
        }

        .switch[aria-pressed="false"] {
          background: #393632;
        }

        .switch[aria-pressed="false"] span {
          margin-left: 0;
        }

        .profile-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 23px;
          border-top: 1px solid rgba(255,255,255,.08);
          color: #77716b;
          font-size: 10px;
        }

        .profile-footer > span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #75c994;
        }

        .profile-footer button {
          border: 0;
          color: #dca178;
          background: transparent;
          font-size: 10px;
        }

        .profile-footer button span {
          margin-left: 6px;
        }

        /* =====================================================
           STATS
        ===================================================== */

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .section-heading h2,
        .panel-heading h2 {
          margin: 0;
          font: 600 15px 'Space Grotesk';
          letter-spacing: -.3px;
        }

        .section-heading p,
        .panel-heading p {
          margin: 5px 0 0;
          color: #77716b;
          font-size: 10px;
        }

        .period-label {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 7px;
          padding: 7px 9px;
          color: #aaa29a;
          font-size: 9px;
          letter-spacing: .6px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0,1fr)
          );
          gap: 13px;
          margin-bottom: 24px;
        }

        .stat-card {
          padding: 16px 16px 12px;
          min-height: 155px;
          overflow: hidden;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-icon,
        .quick-icon {
          display: grid;
          place-items: center;
          border-radius: 9px;
          width: 30px;
          height: 30px;
          font-size: 16px;
        }

        .orange {
          color: #ff9a5c;
          background: #ff8a3d16;
        }

        .gold {
          color: #e5bd76;
          background: #e5bd7616;
        }

        .green {
          color: #88c7a0;
          background: #88c7a016;
        }

        .purple {
          color: #c4a3df;
          background: #c4a3df16;
        }

        .trend {
          color: #8fc99e;
          font-size: 9px;
        }

        .trend.neutral {
          color: #716b65;
        }

        .stat-card > p {
          margin: 14px 0 4px;
          color: #969089;
          font-size: 10px;
        }

        .stat-number {
          font: 600 25px 'Space Grotesk';
          letter-spacing: -.8px;
        }

        .stat-total {
          color: #77716b;
          font: 400 13px 'DM Sans';
        }

        .mini-chart {
          height: 28px;
          margin: 3px -2px 0;
        }

        .mini-chart svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .mini-chart path {
          fill: none;
          stroke: #ff8a3d;
          stroke-width: 2;
          vector-effect: non-scaling-stroke;
        }

        .chart-gold path {
          stroke: #d6ae68;
        }

        .chart-green path {
          stroke: #7fbd95;
        }

        .progress-track {
          height: 4px;
          margin-top: 15px;
          border-radius: 5px;
          background: #292522;
          overflow: hidden;
        }

        .progress-track span {
          display: block;
          height: 100%;
          border-radius: 5px;
          background: linear-gradient(
            90deg,
            #d36a32,
            #ffb16c
          );
        }

        .progress-caption {
          display: flex;
          justify-content: space-between;
          margin-top: 7px;
          color: #77716b;
          font-size: 9px;
        }

        .progress-caption span {
          color: #c18a62;
        }

        /* =====================================================
           LOWER
        ===================================================== */

        .lower-grid {
          display: grid;
          grid-template-columns:
            minmax(0,1.65fr)
            minmax(280px,1fr);
          gap: 14px;
        }

        .activity-panel,
        .quick-panel {
          padding: 19px;
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .more-button {
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 7px;
          background: #ffffff04;
          color: #8f8880;
          padding: 2px 8px;
          letter-spacing: 2px;
        }

        .chart-legend {
          display: flex;
          gap: 14px;
          margin-top: 20px;
          font-size: 9px;
          color: #99918a;
        }

        .chart-legend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .chart-legend i {
          width: 6px;
          height: 6px;
          border-radius: 2px;
          background: #ff6a1a;
        }

        .chart-legend span + span i {
          background: #d6ae68;
        }

        .activity-chart {
          display: flex;
          gap: 10px;
          height: 220px;
          padding-top: 13px;
        }

        .y-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 21px;
          color: #69635d;
          font-size: 9px;
        }

        .plot {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .grid-lines {
          position: absolute;
          inset: 0 0 21px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-lines i {
          border-top: 1px dashed #ffffff0d;
        }

        .activity-svg {
          position: absolute;
          inset: 0 0 21px;
          width: 100%;
          height: calc(100% - 21px);
          overflow: visible;
        }

        .activity-svg .area {
          fill: url(#areaOrange);
        }

        .line-views,
        .line-clicks {
          fill: none;
          stroke-width: 2;
          vector-effect: non-scaling-stroke;
        }

        .line-views {
          stroke: #ff6a1a;
        }

        .line-clicks {
          stroke: #d6ae68;
          stroke-dasharray: 4 4;
        }

        .x-labels {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          color: #69635d;
          font-size: 9px;
        }

        .quick-panel {
          display: flex;
          flex-direction: column;
        }

        .quick-panel .panel-heading {
          margin-bottom: 12px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          text-align: left;
          padding: 12px 0;
          border: 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
          background: transparent;
          color: #eee;
        }

        .quick-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
        }

        .quick-action > span:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .quick-action strong {
          font-size: 11px;
          font-weight: 600;
        }

        .quick-action small {
          color: #77716b;
          font-size: 9px;
        }

        .quick-action > b {
          color: #77716b;
          font-weight: 400;
        }

        .quick-action:hover > b {
          color: #ff9a52;
        }

        .tip-box {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          padding: 12px;
          border: 1px solid #ff8a3d1e;
          border-radius: 10px;
          background: #ff8a3d08;
        }

        .tip-box > span {
          color: #ff9a52;
        }

        .tip-box strong {
          font-size: 10px;
          color: #e2b18d;
        }

        .tip-box p {
          margin: 5px 0 0;
          color: #8e8176;
          font-size: 9px;
          line-height: 1.5;
        }

        /* =====================================================
           LARGE FOOTER
        ===================================================== */

        .site-footer {
          position: relative;
          margin-top: 42px;
          padding: 38px 0 18px;
          border-top: 1px solid rgba(255,255,255,.07);
          overflow: hidden;
        }

        .footer-glow {
          position: absolute;
          width: 420px;
          height: 180px;
          left: 8%;
          bottom: -150px;
          border-radius: 50%;
          background: #ff6a1a;
          filter: blur(100px);
          opacity: .055;
          pointer-events: none;
        }

        .footer-top {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 70px;
        }

        .footer-brand {
          min-width: 230px;
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #f4f1ed;
          text-decoration: none;
          font: 700 18px 'Space Grotesk';
          letter-spacing: -.7px;
        }

        .footer-logo img {
          width: 19px;
          height: 19px;
          object-fit: contain;
        }

        .footer-logo > span > span {
          color: #ff6a1a;
        }

        .footer-brand > p {
          margin: 11px 0 15px;
          color: #716b65;
          font-size: 10px;
          line-height: 1.7;
        }

        .footer-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border: 1px solid rgba(117,201,148,.13);
          border-radius: 7px;
          background: rgba(117,201,148,.04);
          color: #7fa78c;
          font-size: 8px;
        }

        .footer-status i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #75c994;
          box-shadow: 0 0 8px rgba(117,201,148,.5);
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(100px, 1fr)
          );
          gap: 45px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .footer-column h3 {
          margin: 0 0 4px;
          color: #aaa29a;
          font: 600 10px 'Space Grotesk';
          letter-spacing: .2px;
        }

        .footer-column a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: #6f6963;
          text-decoration: none;
          font-size: 10px;
          transition:
            color .15s,
            transform .15s;
        }

        .footer-column a span {
          color: #4c4844;
          font-size: 9px;
          opacity: 0;
          transform: translateX(-3px);
          transition:
            opacity .15s,
            transform .15s;
        }

        .footer-column a:hover {
          color: #e2dcd5;
          transform: translateX(2px);
        }

        .footer-column a:hover span {
          opacity: 1;
          transform: translateX(0);
        }

        .footer-divider {
          height: 1px;
          margin: 32px 0 16px;
          background: rgba(255,255,255,.06);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: #504b46;
          font-size: 9px;
        }

        .footer-made {
          color: #625b55;
        }

        .footer-made b {
          color: #ff6a1a;
          font-size: 10px;
        }

        .footer-version {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-version i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #75c994;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1150px) {
          .sidebar {
            width: 235px;
            flex-basis: 235px;
          }

          .content {
            padding: 30px 25px 20px;
          }

          .topbar {
            padding: 0 25px;
          }

          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0,1fr));
          }

          .footer-links {
            gap: 25px;
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            width: 66px;
            flex-basis: 66px;
            padding: 22px 8px;
            overflow: hidden;
          }

          .brand {
            justify-content: center;
            padding: 0;
          }

          .brand > span:last-child,
          .sidebar-search,
          .subnav,
          .sidebar-bottom,
          .disabled-item small {
            display: none;
          }

          .nav-item > span:not(.chevron):not(.premium-lock) {
            display: none;
          }

          .nav-item {
            justify-content: center;
            padding: 12px 0;
          }

          .nav-item .icon {
            width: 18px;
            height: 18px;
          }

          .account-trigger {
            border-radius: 12px;
          }

          .topbar {
            height: 64px;
            padding: 0 17px;
          }

          .content {
            padding: 25px 17px;
          }

          .lower-grid {
            grid-template-columns: 1fr;
          }

          .season-tag {
            display: none;
          }

          .site-footer {
            margin-top: 32px;
            padding-top: 30px;
          }

          .footer-top {
            flex-direction: column;
            gap: 32px;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 28px 35px;
          }
        }

        @media (max-width: 520px) {
          .welcome-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome-row h1 {
            font-size: 25px;
          }

          .primary-button {
            padding: 10px 12px;
          }

          .stats-grid {
            gap: 9px;
          }

          .stat-card {
            padding: 12px;
            min-height: 145px;
          }

          .stat-number {
            font-size: 22px;
          }

          .profile-info {
            padding: 0 13px 15px;
            gap: 10px;
            flex-wrap: wrap;
          }

          .profile-controls {
            padding-top: 13px;
          }

          .profile-footer {
            padding: 11px 13px;
          }

          .view-button {
            padding: 8px 9px;
          }

          .view-button span {
            display: none;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px 20px;
          }

          .footer-bottom {
            flex-wrap: wrap;
            gap: 9px;
          }

          .footer-made {
            width: 100%;
            order: 3;
          }
        }
      `}</style>
    </main>
  )
}
