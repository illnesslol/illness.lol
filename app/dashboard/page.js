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

/* =====================================================
   ICONS
===================================================== */

const ICONS = {
  overview: (
    <>
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
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
      <circle
        cx="12"
        cy="8"
        r="3"
      />
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
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />
      <circle
        cx="8.5"
        cy="9"
        r="1.5"
      />
      <path d="m5 17 5-5 3 3 2-2 4 4" />
    </>
  ),

  account: (
    <>
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
      <path d="M7.5 17a5 5 0 0 1 9 0" />
    </>
  ),

  assets: (
    <>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
      />
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
      <rect
        x="3"
        y="5"
        width="18"
        height="15"
        rx="2"
      />
      <path d="M8 5V3h8v2M3 10h18" />
    </>
  ),

  widgets: (
    <>
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1"
      />
    </>
  ),

  section: (
    <path d="M4 5h16M4 10h16M4 15h10M4 20h10" />
  ),

  backgrounds: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
      />
      <circle
        cx="16"
        cy="8"
        r="2"
      />
      <path d="m4 17 5-5 4 4 2-2 5 5" />
    </>
  ),

  metadata: (
    <>
      <path d="M4 5h16M4 12h16M4 19h10" />
      <circle
        cx="18"
        cy="19"
        r="2"
      />
    </>
  ),

  settings: (
    <>
      <circle
        cx="12"
        cy="12"
        r="3"
      />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),

  domains: (
    <>
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </>
  ),

  search: (
    <>
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
      />
      <path d="m16 16 4 4" />
    </>
  ),
}

function Icon({
  name,
  size = 16,
}) {
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

/* =====================================================
   COMPONENTS
===================================================== */

function Panel({
  children,
  className = '',
}) {
  return (
    <section
      className={`panel ${className}`}
    >
      {children}
    </section>
  )
}

const PROFILE_ITEMS = [
  ['Assets', 'assets'],
  ['Badges', 'badges'],
  ['Links', 'links'],
  ['Projects', 'projects'],
  ['Widgets', 'widgets'],
  ['Section Builder', 'section'],
]

const PREMIUM_ITEMS = [
  [
    'Customize',
    'Premium Customize',
    'customize',
  ],
  [
    'Backgrounds',
    'Backgrounds',
    'backgrounds',
  ],
  [
    'Metadata',
    'Metadata',
    'metadata',
  ],
]

const ACCOUNT_ITEMS = [
  ['Settings', 'Settings', 'settings'],
  ['Domains', 'Domains', 'domains'],
]

const QUICK_ACTIONS = [
  [
    'Edit your page',
    'Update your bio and style',
    '✦',
    'orange',
    'Customize page',
  ],
  [
    'Manage links',
    'Add or organize your links',
    '↗',
    'amber',
    'Links',
  ],
  [
    'Change appearance',
    'Colors, backgrounds, effects',
    '◐',
    'green',
    'Appearance',
  ],
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
      onClick={() =>
        setActive(value)
      }
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
    active === label ||
    items.some(
      ([, value]) =>
        value === active
    )

  return (
    <div
      className={`nav-group ${groupClass}`}
    >
      <button
        className={`nav-item group-trigger ${triggerClass} ${
          current
            ? 'group-current'
            : ''
        }`}
        onClick={toggle}
        aria-expanded={open}
      >
        <Icon name={icon} />

        <span>{label}</span>

        {lock && (
          <span className="premium-lock">
            ✦
          </span>
        )}

        <span
          className={`chevron ${
            open ? 'expanded' : ''
          }`}
        >
          ⌃
        </span>
      </button>

      {open && (
        <div className="subnav">
          {items.map(
            ([
              text,
              value,
              iconName,
            ]) => (
              <button
                key={value}
                className={`subnav-item ${
                  active === value
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  setActive(value)
                }
              >
                <Icon
                  name={iconName}
                  size={14}
                />

                <span>{text}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

/* =====================================================
   FALL DECORATION
===================================================== */

function AutumnLeaves() {
  return (
    <div
      className="autumn-decoration"
      aria-hidden="true"
    >
      <span className="fall-leaf leaf-a">
        🍂
      </span>

      <span className="fall-leaf leaf-b">
        🍁
      </span>

      <span className="fall-leaf leaf-c">
        🍂
      </span>

      <span className="fall-leaf leaf-d">
        ✦
      </span>

      <span className="fall-leaf leaf-e">
        🍁
      </span>
    </div>
  )
}

/* =====================================================
   DASHBOARD
===================================================== */

export default function DashboardPage() {
  const [active, setActive] =
    useState('Overview')

  const [copied, setCopied] =
    useState(false)

  const [open, setOpen] =
    useState({
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

  const profileUrl =
    `https://illness.lol/${username}`

  const flip = (key) => {
    setOpen((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const nav = {
    active,
    setActive,
  }

  const percentage = Math.min(
    100,
    Math.round(
      (stats.activeLinks /
        LINK_LIMIT) *
        100
    )
  )

  async function copyProfile() {
    try {
      await navigator.clipboard.writeText(
        profileUrl
      )

      setCopied(true)

      setTimeout(
        () => setCopied(false),
        1800
      )
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
      tone: 'amber',
      label: 'Link clicks',
      value: stats.clicks,
      prev: stats.prev.clicks,
      series: 'clicks',
      chart: 'chart-amber',
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
      <AutumnLeaves />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">
        <a
          className="brand"
          href="/"
        >
          <div className="brand-mark">
            <span>i</span>
          </div>

          <span>
            illness
            <span className="brand-dot">
              .lol
            </span>
          </span>
        </a>

        <button
          className="sidebar-search"
          onClick={() =>
            setActive('Search')
          }
        >
          <Icon
            name="search"
            size={17}
          />

          <span>
            Search illness
          </span>

          <kbd>
            Ctrl K
          </kbd>
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
            toggle={() =>
              flip('profile')
            }
            {...nav}
          />

          <NavGroup
            label="Premium"
            icon="premium"
            items={PREMIUM_ITEMS}
            open={open.premium}
            toggle={() =>
              flip('premium')
            }
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
            <small>
              SOON
            </small>
          </NavItem>

          <NavGroup
            label="Account"
            icon="account"
            items={ACCOUNT_ITEMS}
            open={open.account}
            toggle={() =>
              flip('account')
            }
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
              <Icon
                name="profile"
                size={16}
              />
            </span>

            <span>
              <small>
                Profile
              </small>

              <strong>
                {copied
                  ? 'Link copied!'
                  : 'Share your profile'}
              </strong>
            </span>

            <span className="share-arrow">
              ↗
            </span>
          </button>

          <button
            className="account-button"
            onClick={() =>
              setActive('Account')
            }
          >
            <div className="avatar small">
              {initial}
            </div>

            <span>
              <small>
                Signed in as
              </small>

              <strong>
                {username}
              </strong>
            </span>

            <span className="account-settings">
              <Icon
                name="settings"
                size={15}
              />
            </span>
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>
              Dashboard
            </span>

            <b>
              /
            </b>

            <strong>
              {active}
            </strong>
          </div>

          <div className="top-actions">
            <span className="season-tag">
              <span>
                🍂
              </span>

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
                window.open(
                  profileUrl,
                  '_blank'
                )
              }
            >
              ↗

              <span>
                View profile
              </span>
            </button>
          </div>
        </header>

        <div className="content">
          {/* =================================================
              WELCOME
          ================================================= */}

          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                <span />
                YOUR LITTLE CORNER
              </p>

              <h1>
                {greeting},{' '}
                <span>
                  {username}.
                </span>
              </h1>

              <p className="subheading">
                Cozy season is here. Your
                corner of the internet is
                looking good.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setActive(
                  'Customize page'
                )
              }
            >
              <span>
                ✦
              </span>

              Customize page

              <span className="button-arrow">
                ↗
              </span>
            </button>
          </div>

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <Panel className="profile-banner">
            <div className="banner-art">
              <div className="autumn-sun" />

              <div className="mountain mountain-one" />
              <div className="mountain mountain-two" />

              <span className="banner-leaf leaf-one">
                🍁
              </span>

              <span className="banner-leaf leaf-two">
                🍂
              </span>

              <span className="banner-leaf leaf-three">
                🍁
              </span>

              <span className="banner-star">
                ✦
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
                  illness.lol/
                  {username}
                  <span>
                    ↗
                  </span>
                </div>

                <p>
                  {bio ||
                    'Your bio goes here — tell the world a little about you.'}
                </p>
              </div>

              <div className="profile-controls">
                <span
                  className={`status-pill ${
                    profilePublic
                      ? ''
                      : 'private'
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
                  aria-pressed={
                    profilePublic
                  }
                  onClick={() =>
                    setProfilePublic(
                      (value) =>
                        !value
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

              <button
                onClick={copyProfile}
              >
                {copied
                  ? '✓ Copied link'
                  : 'Copy profile link'}

                <span>
                  ⧉
                </span>
              </button>
            </div>
          </Panel>

          {/* =================================================
              STATS HEADER
          ================================================= */}

          <div className="section-heading">
            <div>
              <h2>
                At a glance
              </h2>

              <p>
                A little look at how your
                page is doing.
              </p>
            </div>

            <span className="period-label">
              LAST 7 DAYS
              <span>
                ⌄
              </span>
            </span>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="stats-grid">
            {statCards.map((card) => (
              <Panel
                key={card.label}
                className="stat-card"
              >
                <div className="stat-top">
                  <span
                    className={`stat-icon ${card.tone}`}
                  >
                    {card.icon}
                  </span>

                  <span className="trend">
                    {trend(
                      card.value,
                      card.prev
                    )}
                  </span>
                </div>

                <p>
                  {card.label}
                </p>

                <div className="stat-number">
                  {fmt(card.value)}
                </div>

                <Spark
                  values={stats.daily.map(
                    (day) =>
                      day[
                        card.series
                      ]
                  )}
                  className={
                    card.chart
                  }
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

              <p>
                Active links
              </p>

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
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <div className="progress-caption">
                <span>
                  {stats.activeLinks}{' '}
                  {stats.activeLinks ===
                  1
                    ? 'link'
                    : 'links'}{' '}
                  published
                </span>

                <strong>
                  {percentage}%
                </strong>
              </div>
            </Panel>
          </div>

          {/* =================================================
              LOWER CONTENT
          ================================================= */}

          <div className="lower-grid">
            <Panel className="activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>
                    Profile activity
                  </h2>

                  <p>
                    Your traffic over the
                    past week.
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
                  <h2>
                    Quick actions
                  </h2>

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
                      setActive(
                        target
                      )
                    }
                  >
                    <span
                      className={`quick-icon ${tone}`}
                    >
                      {icon}
                    </span>

                    <span>
                      <strong>
                        {title}
                      </strong>

                      <small>
                        {sub}
                      </small>
                    </span>

                    <b>
                      ↗
                    </b>
                  </button>
                )
              )}

              <div className="tip-box">
                <span>
                  🍂
                </span>

                <div>
                  <strong>
                    Autumn tip
                  </strong>

                  <p>
                    Try burnt orange,
                    warm cream and
                    deep brown together
                    for a cozy profile.
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="footer">
            <span>
              © 2026 illness.lol
            </span>

            <span>
              Made for your little corner
              of the internet{' '}
              <b>
                ♥
              </b>
            </span>

            <a href="/help">
              Help center ↗
            </a>
          </footer>
        </div>
      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --bg: #090807;
          --panel: #11100f;
          --panel-2: #151210;

          --cream: #f6eee5;
          --muted: #928981;
          --dim: #655e58;

          --orange: #e26d32;
          --orange-bright: #f08b49;
          --amber: #d49a52;
          --green: #83ad8b;
          --purple: #a98ac3;

          --border: rgba(255,255,255,.075);
        }

        * {
          box-sizing: border-box;
        }

        html {
          background: var(--bg);
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              ellipse at 80% -10%,
              rgba(173, 72, 25, .13),
              transparent 35%
            ),
            radial-gradient(
              ellipse at 15% 90%,
              rgba(116, 53, 22, .08),
              transparent 35%
            ),
            var(--bg);

          color: var(--cream);
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
           GLOBAL FALL DECORATION
        ===================================================== */

        .autumn-decoration {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .fall-leaf {
          position: absolute;
          opacity: .07;
          filter: blur(.1px);
          user-select: none;
        }

        .leaf-a {
          top: 18%;
          right: 4%;
          font-size: 80px;
          transform: rotate(18deg);
        }

        .leaf-b {
          top: 62%;
          left: 1%;
          font-size: 70px;
          transform: rotate(-25deg);
        }

        .leaf-c {
          bottom: 7%;
          right: 12%;
          font-size: 95px;
          transform: rotate(35deg);
        }

        .leaf-d {
          top: 35%;
          left: 17%;
          font-size: 45px;
        }

        .leaf-e {
          top: 8%;
          right: 32%;
          font-size: 38px;
        }

        /* =====================================================
           LAYOUT
        ===================================================== */

        .dash-shell {
          position: relative;
          z-index: 1;

          min-height: 100vh;

          display: flex;

          background:
            radial-gradient(
              ellipse at 70% 0%,
              rgba(126, 51, 18, .10),
              transparent 38%
            );
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          width: 252px;
          flex: 0 0 252px;

          min-height: 100vh;

          display: flex;
          flex-direction: column;

          padding: 20px 12px 12px;

          background:
            linear-gradient(
              180deg,
              #0b0a09,
              #090807
            );

          border-right: 1px solid var(--border);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 0 9px;

          margin-bottom: 24px;

          color: #f8f1e9;

          text-decoration: none;

          font:
            700 21px
            'Space Grotesk',
            sans-serif;

          letter-spacing: -.8px;
        }

        .brand-mark {
          width: 22px;
          height: 22px;

          display: grid;
          place-items: center;

          border-radius: 7px;

          background:
            linear-gradient(
              145deg,
              #f08a48,
              #a94220
            );

          color: #160a04;

          box-shadow:
            0 5px 18px
            rgba(214, 91, 34, .2);
        }

        .brand-mark span {
          font:
            700 13px
            'Space Grotesk';
        }

        .brand-dot {
          color: var(--orange-bright);
        }

        .sidebar-search {
          width: 100%;

          display: flex;
          align-items: center;
          gap: 10px;

          padding: 12px;

          margin-bottom: 16px;

          border: 1px solid var(--border);
          border-radius: 13px;

          background: #0e0d0c;

          color: #85807b;

          text-align: left;
          font-size: 12px;

          transition:
            border-color .2s,
            background .2s;
        }

        .sidebar-search:hover {
          background: #13110f;
          border-color: rgba(226,109,50,.25);
        }

        .sidebar-search span {
          flex: 1;
          color: #aaa29b;
        }

        .sidebar-search kbd {
          padding: 4px 6px;

          border: 1px solid #292522;
          border-radius: 6px;

          color: #706a65;

          font:
            10px
            'DM Sans';
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

          color: #b7b0aa;

          text-align: left;

          font:
            500 12px
            'DM Sans';

          transition:
            background .15s,
            border-color .15s,
            color .15s;
        }

        .nav-item:hover,
        .subnav-item:hover {
          background: rgba(255,255,255,.035);
          color: #f5eee8;
        }

        .nav-item .icon {
          flex-shrink: 0;
          color: #77716b;
        }

        .nav-item.active {
          border-color: rgba(226,109,50,.28);

          background:
            linear-gradient(
              90deg,
              rgba(226,109,50,.16),
              rgba(226,109,50,.055)
            );

          color: #f29a5b;

          box-shadow:
            inset 3px 0 0 #d8662e;
        }

        .nav-item.active .icon {
          color: #ef8b4b;
        }

        .nav-item span:nth-child(2) {
          flex: 1;
        }

        .nav-group {
          display: flex;
          flex-direction: column;
        }

        .group-current:not(.active) {
          color: #e5ded7;
        }

        .chevron {
          margin-left: auto;

          color: #77716b;

          font-size: 13px;

          transform: rotate(180deg);

          transition: transform .15s;
        }

        .chevron.expanded {
          transform: rotate(0);
        }

        .premium-lock {
          margin-left: auto;
          color: #bd7549;
          font-size: 10px;
        }

        .subnav {
          display: flex;
          flex-direction: column;

          margin: 1px 0 7px 19px;

          padding: 1px 0 1px 14px;

          border-left: 1px solid #292421;

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

          color: #aaa39d;

          text-align: left;

          font:
            400 11.5px
            'DM Sans';
        }

        .subnav-item .icon {
          color: #68625d;
          flex-shrink: 0;
        }

        .subnav-item.selected {
          color: #ee9255;
          background: rgba(226,109,50,.08);
        }

        .subnav-item.selected .icon {
          color: #e57c3d;
        }

        .disabled-item,
        .disabled-item .icon {
          color: #4f4b47;
        }

        .disabled-item small {
          margin-left: auto;

          color: #4b4541;

          font-size: 9px;
          letter-spacing: .5px;
        }

        .account-nav-group {
          margin-top: 5px;
        }

        .account-trigger {
          border-color: #4a4540;
          border-radius: 22px;
          color: #d5cec8;
        }

        .account-trigger .icon {
          color: #928a83;
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

          border: 1px solid #282522;
          border-radius: 15px;

          background:
            linear-gradient(
              145deg,
              #11100f,
              #0d0c0b
            );

          color: #eee8e2;

          text-align: left;
        }

        .share-profile:hover,
        .account-button:hover {
          border-color: rgba(226,109,50,.22);
        }

        .share-icon {
          display: grid;
          place-items: center;

          width: 32px;
          height: 32px;

          border-radius: 50%;

          background: #191512;

          color: #aaa19a;
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
          color: #77716b;
          font-size: 9px;
        }

        .share-profile strong,
        .account-button strong {
          color: #eee8e2;

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

          background: #25211e;

          color: #888078;

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

          background:
            linear-gradient(
              140deg,
              #a94d25,
              #e8a15e
            );

          color: #251006;

          font:
            700 11px
            'Space Grotesk';
        }

        .account-settings {
          color: #77716b;
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

          border-bottom: 1px solid var(--border);

          background:
            rgba(8,7,6,.82);

          backdrop-filter: blur(14px);
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 11px;

          color: #746d67;

          font-size: 12px;
        }

        .breadcrumbs b {
          color: #46413d;
          font-weight: 400;
        }

        .breadcrumbs strong {
          color: #e9e0d8;
          font-weight: 500;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .season-tag {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 7px 10px;

          border: 1px solid rgba(226,109,50,.18);
          border-radius: 8px;

          background: rgba(226,109,50,.035);

          color: #c89874;

          font-size: 9px;
          letter-spacing: .8px;
        }

        .icon-button {
          position: relative;

          width: 33px;
          height: 33px;

          border: 1px solid var(--border);
          border-radius: 9px;

          background: #11100f;

          color: #a69d95;

          font-size: 17px;
        }

        .icon-button i {
          position: absolute;

          right: 7px;
          top: 6px;

          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #d8662e;
        }

        .view-button {
          display: flex;
          align-items: center;
          gap: 8px;

          padding: 9px 13px;

          border: 1px solid rgba(226,109,50,.32);
          border-radius: 9px;

          background: rgba(226,109,50,.08);

          color: #e7b38d;

          font-size: 11px;
        }

        .view-button:hover {
          background: rgba(226,109,50,.14);
        }

        .content {
          width: 100%;
          max-width: 1500px;

          padding: 37px 42px 20px;

          margin: 0 auto;
        }

        /* =====================================================
           WELCOME
        ===================================================== */

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

          color: #aa7553;

          font-size: 9px;
          letter-spacing: 1.6px;
          font-weight: 700;
        }

        .eyebrow span {
          width: 6px;
          height: 6px;

          border-radius: 2px;

          background: #d96830;

          box-shadow:
            0 0 12px
            rgba(217,104,48,.55);
        }

        .welcome-row h1 {
          margin: 0;

          font:
            600 clamp(24px,2.2vw,31px)/1.2
            'Space Grotesk',
            sans-serif;

          letter-spacing: -1px;
        }

        .welcome-row h1 span {
          color: #e99455;
        }

        .subheading {
          margin: 9px 0 0;

          color: #8e8780;

          font-size: 12px;
        }

        .primary-button {
          display: flex;
          align-items: center;
          gap: 9px;

          padding: 12px 14px;

          border: 1px solid rgba(245,143,78,.3);
          border-radius: 10px;

          background:
            linear-gradient(
              120deg,
              #d9662d,
              #ef9b5c
            );

          color: #1d0c04;

          font-size: 11px;
          font-weight: 700;

          box-shadow:
            0 7px 30px
            rgba(198,72,28,.16);

          transition:
            transform .2s,
            box-shadow .2s;
        }

        .primary-button:hover {
          transform: translateY(-1px);

          box-shadow:
            0 10px 32px
            rgba(198,72,28,.25);
        }

        .button-arrow {
          margin-left: 6px;
        }

        /* =====================================================
           PANEL
        ===================================================== */

        .panel {
          min-width: 0;

          border: 1px solid var(--border);
          border-radius: 14px;

          background:
            linear-gradient(
              145deg,
              rgba(22,19,17,.96),
              rgba(12,11,10,.98)
            );

          box-shadow:
            0 16px 40px
            rgba(0,0,0,.14);
        }

        /* =====================================================
           PROFILE BANNER
        ===================================================== */

        .profile-banner {
          overflow: hidden;
          margin-bottom: 29px;
        }

        .banner-art {
          position: relative;

          height: 118px;

          overflow: hidden;

          background:
            linear-gradient(
              115deg,
              #25130b,
              #482313 42%,
              #1d110b
            );
        }

        .autumn-sun {
          position: absolute;

          width: 240px;
          height: 170px;

          right: 18%;
          top: -105px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              #e9904d 0%,
              #b84d24 36%,
              transparent 70%
            );

          filter: blur(12px);

          opacity: .55;
        }

        .mountain {
          position: absolute;

          bottom: -65px;

          width: 52%;
          height: 120px;

          background: #1c100b;

          transform: skewX(-25deg)
            rotate(-7deg);
        }

        .mountain-one {
          right: -3%;
          opacity: .8;
        }

        .mountain-two {
          right: 31%;
          width: 40%;
          height: 90px;
          background: #30170d;
          opacity: .65;
        }

        .banner-grid {
          position: absolute;
          inset: 0;

          opacity: .12;

          background-image:
            linear-gradient(
              rgba(245,170,105,.5) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(245,170,105,.5) 1px,
              transparent 1px
            );

          background-size: 30px 30px;

          mask-image:
            linear-gradient(
              90deg,
              transparent,
              #000 40%,
              #000
            );
        }

        .banner-leaf {
          position: absolute;

          z-index: 3;

          color: #e18a4c;

          filter:
            drop-shadow(
              0 7px 18px
              rgba(0,0,0,.35)
            );
        }

        .leaf-one {
          right: 13%;
          top: 12px;
          font-size: 47px;
          transform: rotate(17deg);
        }

        .leaf-two {
          right: 8%;
          top: 56px;
          font-size: 28px;
          transform: rotate(-18deg);
        }

        .leaf-three {
          right: 23%;
          top: 46px;
          font-size: 40px;
          transform: rotate(24deg);
          color: #ad4b24;
        }

        .banner-star {
          position: absolute;

          right: 31%;
          top: 20px;

          color: #f1b16c;

          opacity: .5;

          font-size: 20px;
        }

        .profile-info {
          display: flex;
          align-items: center;

          gap: 15px;

          min-height: 94px;

          padding:
            0 23px 18px;
        }

        .profile-avatar {
          position: relative;

          display: grid;
          place-items: center;

          width: 62px;
          height: 62px;

          margin-top: -28px;

          flex-shrink: 0;

          border: 4px solid #0e0d0c;
          border-radius: 18px;

          background:
            linear-gradient(
              140deg,
              #b94e25,
              #f0ae69
            );

          color: #2b1005;

          font:
            700 25px
            'Space Grotesk';

          box-shadow:
            0 8px 24px
            rgba(0,0,0,.6);
        }

        .avatar-status {
          position: absolute;

          right: -2px;
          bottom: -2px;

          width: 13px;
          height: 13px;

          border: 3px solid #0d0c0b;
          border-radius: 50%;

          background: #76b486;
        }

        .profile-copy {
          min-width: 0;
          padding-top: 13px;
        }

        .profile-name {
          font:
            600 16px
            'Space Grotesk';
        }

        .verified {
          display: inline-grid;
          place-items: center;

          width: 14px;
          height: 14px;

          margin-left: 3px;

          border-radius: 50%;

          background: #d2763e;

          color: #180a04;

          font:
            700 9px
            sans-serif;

          vertical-align: 2px;
        }

        .profile-url {
          margin-top: 5px;

          color: #cc8357;

          font-size: 10px;
        }

        .profile-url span {
          margin-left: 4px;
        }

        .profile-copy p {
          margin: 8px 0 0;

          color: #817a74;

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

          border: 1px solid
            rgba(117,201,148,.15);

          border-radius: 7px;

          color: #8ec79c;

          background:
            rgba(117,201,148,.045);

          font-size: 10px;
        }

        .status-pill i {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #76b486;
        }

        .status-pill.private {
          color: #d09a76;

          border-color:
            rgba(226,109,50,.2);

          background:
            rgba(226,109,50,.04);
        }

        .status-pill.private i {
          background: #d8662e;
        }

        .switch {
          width: 32px;
          height: 18px;

          padding: 2px;

          border: 0;
          border-radius: 20px;

          background: #d96830;

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

        .switch[aria-pressed='false'] {
          background: #393531;
        }

        .switch[aria-pressed='false'] span {
          margin-left: 0;
        }

        .profile-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 12px 23px;

          border-top: 1px solid var(--border);

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

          background: #76b486;

          box-shadow:
            0 0 8px
            rgba(118,180,134,.5);
        }

        .profile-footer button {
          border: 0;

          color: #d79a72;

          background: transparent;

          font-size: 10px;
        }

        .profile-footer button span {
          margin-left: 6px;
        }

        /* =====================================================
           SECTION HEADINGS
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

          font:
            600 15px
            'Space Grotesk';

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

          padding: 7px 9px;

          border: 1px solid var(--border);
          border-radius: 7px;

          color: #aaa29b;

          font-size: 9px;
          letter-spacing: .6px;
        }

        /* =====================================================
           STAT CARDS
        ===================================================== */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 13px;

          margin-bottom: 24px;
        }

        .stat-card {
          min-height: 155px;

          padding:
            16px 16px 12px;

          overflow: hidden;

          transition:
            transform .2s,
            border-color .2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);

          border-color:
            rgba(226,109,50,.18);
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

          width: 30px;
          height: 30px;

          border-radius: 9px;

          font-size: 16px;
        }

        .orange {
          color: #f39a5c;
          background: rgba(226,109,50,.11);
        }

        .amber {
          color: #ddb06a;
          background: rgba(212,154,82,.11);
        }

        .green {
          color: #91bd98;
          background: rgba(131,173,139,.10);
        }

        .purple {
          color: #b79bcd;
          background: rgba(169,138,195,.10);
        }

        .trend {
          color: #8fc49a;
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
          font:
            600 25px
            'Space Grotesk';

          letter-spacing: -.8px;
        }

        .stat-total {
          color: #77716b;

          font:
            400 13px
            'DM Sans';
        }

        .mini-chart {
          height: 28px;

          margin:
            3px -2px 0;
        }

        .mini-chart svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .mini-chart path {
          fill: none;

          stroke:
            #e4773b;

          stroke-width: 2;

          vector-effect:
            non-scaling-stroke;
        }

        .chart-amber path {
          stroke: #d4a05b;
        }

        .chart-green path {
          stroke: #82b58b;
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

          background:
            linear-gradient(
              90deg,
              #a94620,
              #ee9957
            );
        }

        .progress-caption {
          display: flex;
          justify-content: space-between;

          margin-top: 7px;

          color: #77716b;

          font-size: 9px;
        }

        .progress-caption strong {
          color: #c88c63;
          font-weight: 500;
        }

        /* =====================================================
           LOWER
        ===================================================== */

        .lower-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 1.65fr)
            minmax(280px, 1fr);

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
          border: 1px solid var(--border);
          border-radius: 7px;

          background: rgba(255,255,255,.02);

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

          background: #e16e32;
        }

        .chart-legend span + span i {
          background: #d5a05d;
        }

        /* =====================================================
           CHART
        ===================================================== */

        .activity-chart {
          display: flex;
          gap: 10px;

          height: 235px;

          padding-top: 13px;
        }

        .y-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          padding-bottom: 22px;

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

          inset: 0 0 22px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-lines i {
          border-top:
            1px dashed
            rgba(255,255,255,.055);
        }

        .activity-svg {
          position: absolute;

          inset: 0 0 22px;

          width: 100%;
          height: calc(100% - 22px);

          overflow: visible;
        }

        .activity-svg .area {
          fill: url(#fallArea);
        }

        .line-views,
        .line-clicks {
          fill: none;

          stroke-width: 2;

          vector-effect:
            non-scaling-stroke;
        }

        .line-views {
          stroke: url(#fallLine);
        }

        .line-clicks {
          stroke: #d3a15e;

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

        /* =====================================================
           QUICK ACTIONS
        ===================================================== */

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

          padding: 12px 0;

          border: 0;
          border-bottom:
            1px solid var(--border);

          background: transparent;

          color: #eee;

          text-align: left;
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
          color: #e99556;
        }

        .tip-box {
          display: flex;
          gap: 10px;

          margin-top: 16px;

          padding: 12px;

          border:
            1px solid
            rgba(226,109,50,.14);

          border-radius: 10px;

          background:
            rgba(226,109,50,.045);
        }

        .tip-box > span {
          font-size: 15px;
        }

        .tip-box strong {
          color: #ddb08e;
          font-size: 10px;
        }

        .tip-box p {
          margin: 5px 0 0;

          color: #8e8176;

          font-size: 9px;
          line-height: 1.5;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          display: flex;
          align-items: center;
          gap: 22px;

          margin-top: 25px;

          padding:
            15px 1px 5px;

          color: #5f5a55;

          font-size: 9px;
        }

        .footer span:nth-child(2) {
          margin: 0 auto;
        }

        .footer b {
          color: #d8662e;
        }

        .footer a {
          color: #8b8178;
          text-decoration: none;
        }

        .footer a:hover {
          color: #d28b5f;
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
            padding:
              30px 25px 20px;
          }

          .topbar {
            padding: 0 25px;
          }

          .stats-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (max-width: 850px) {
          .lower-grid {
            grid-template-columns: 1fr;
          }

          .profile-info {
            flex-wrap: wrap;
          }

          .profile-controls {
            margin-left: auto;
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            width: 66px;
            flex-basis: 66px;

            padding:
              22px 8px;

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
            padding:
              25px 17px;
          }

          .season-tag {
            display: none;
          }
        }

        @media (max-width: 600px) {
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
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

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
            padding:
              0 13px 15px;

            gap: 10px;
          }

          .profile-controls {
            width: 100%;

            justify-content: flex-end;

            padding-top: 0;
          }

          .profile-footer {
            padding:
              11px 13px;
          }

          .footer {
            flex-wrap: wrap;
            gap: 10px;
          }

          .footer span:nth-child(2) {
            margin: 0;
            order: 3;
            width: 100%;
          }

          .view-button {
            padding: 8px 9px;
          }

          .view-button span {
            display: none;
          }
        }

        @media (max-width: 420px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .period-label {
            display: none;
          }

          .profile-copy p {
            max-width: 220px;
          }

          .top-actions {
            gap: 7px;
          }

          .breadcrumbs span {
            display: none;
          }
        }
      `}</style>
    </main>
  )
}
