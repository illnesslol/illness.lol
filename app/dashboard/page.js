'use client'

import { useMemo, useState } from 'react'
import { TransitionLink } from '../../components/PageTransition'

const C = {
  bg: '#050505',
  panel: '#0a0a0a',
  panel2: '#0d0d0d',
  border: 'rgba(255,255,255,.075)',
  borderStrong: 'rgba(255,255,255,.11)',
  text: '#fff',
  muted: 'rgba(255,255,255,.52)',
  faint: 'rgba(255,255,255,.32)',
  orange: '#ff6a1a',
  orange2: '#ff8b3d',
}

function Icon({ children, className = '' }) {
  return (
    <span className={`icon ${className}`} aria-hidden="true">
      {children}
    </span>
  )
}

function NavItem({ href, icon, children, active = false, soon = false }) {
  return (
    <TransitionLink
      href={href}
      className={`nav-item ${active ? 'active' : ''}`}
    >
      <Icon>{icon}</Icon>

      <span className="nav-label">
        {children}
      </span>

      {soon && <em>SOON</em>}
    </TransitionLink>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{label}</span>
        <Icon>{icon}</Icon>
      </div>

      <strong>{value}</strong>
    </div>
  )
}

function Chart() {
  const points = useMemo(
    () => [
      0, 0, 0, 1, 1, 1, 2, 2,
      3, 2, 4, 3, 5, 4, 6, 5,
      4, 3, 4, 2, 1, 2, 1, 0,
    ],
    []
  )

  const width = 1000
  const height = 250
  const max = 7

  const coordinates = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width
    const y = height - 25 - (value / max) * 175

    return { x, y }
  })

  const path = coordinates
    .map(
      ({ x, y }, index) =>
        `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    )
    .join(' ')

  const area = `${path} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="chart-container">
      <svg
        className="chart"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="viewsGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={C.orange}
              stopOpacity=".25"
            />

            <stop
              offset="100%"
              stopColor={C.orange}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={30 + line * 44}
            y2={30 + line * 44}
            stroke="rgba(255,255,255,.045)"
            strokeWidth="1"
          />
        ))}

        <path
          d={area}
          fill="url(#viewsGradient)"
        />

        <path
          d={path}
          fill="none"
          stroke={C.orange2}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="chart-labels">
        <span>Sep 28</span>
        <span>Sep 30</span>
        <span>Oct 02</span>
        <span>Oct 04</span>
      </div>
    </div>
  )
}

function Donut() {
  return (
    <div className="device-content">
      <div className="donut">
        <div className="donut-center">
          <strong>2</strong>
          <span>views</span>
        </div>
      </div>

      <div className="device-legend">
        <div className="legend-row">
          <div className="legend-name">
            <span className="legend-dot pink" />
            Desktop
          </div>

          <strong>1 (50%)</strong>
        </div>

        <div className="legend-row">
          <div className="legend-name">
            <span className="legend-dot gold" />
            Mobile
          </div>

          <strong>1 (50%)</strong>
        </div>
      </div>
    </div>
  )
}

function Country({ flag, name, value }) {
  return (
    <div className="country-card">
      <div className="country-flag">
        {flag}
      </div>

      <div className="country-info">
        <div className="country-title">
          {name}
        </div>

        <div className="country-progress">
          <span />
        </div>
      </div>

      <div className="country-value">
        {value}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [range, setRange] = useState('7d')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="dashboard">

      {/* Background */}

      <div className="background-glow glow-1" />
      <div className="background-glow glow-2" />

      {/* Sidebar */}

      <aside className="sidebar">

        <TransitionLink href="/" className="brand">
          <img
            src="/icon.png"
            alt=""
          />

          <span>illness.lol</span>
        </TransitionLink>

        <div className="search-box">
          <span className="search-symbol">
            ⌕
          </span>

          <span>Search Halo</span>

          <kbd>Ctrl K</kbd>
        </div>

        <div className="sidebar-nav">

          <NavItem
            href="/dashboard"
            icon="▦"
            active
          >
            Overview
          </NavItem>

          <NavItem
            href="/dashboard/customize"
            icon="✣"
          >
            Customize
          </NavItem>

        </div>

        <SidebarHeading>
          Profile
        </SidebarHeading>

        <div className="sidebar-nav nested">

          <NavItem
            href="/dashboard/assets"
            icon="•"
          >
            Assets
          </NavItem>

          <NavItem
            href="/dashboard/badges"
            icon="◇"
          >
            Badges
          </NavItem>

          <NavItem
            href="/dashboard/links"
            icon="↗"
          >
            Links
          </NavItem>

          <NavItem
            href="/dashboard/projects"
            icon="▱"
          >
            Projects
          </NavItem>

          <NavItem
            href="/dashboard/widgets"
            icon="⊞"
          >
            Widgets
          </NavItem>

          <NavItem
            href="/dashboard/sections"
            icon="≡"
          >
            Section Builder
          </NavItem>

        </div>

        <SidebarHeading premium>
          Premium
        </SidebarHeading>

        <div className="sidebar-nav nested">

          <NavItem
            href="/dashboard/premium/customize"
            icon="•"
          >
            Customize
          </NavItem>

          <NavItem
            href="/dashboard/premium/backgrounds"
            icon="•"
          >
            Backgrounds
          </NavItem>

          <NavItem
            href="/dashboard/premium/metadata"
            icon="•"
          >
            Metadata
          </NavItem>

        </div>

        <div className="sidebar-nav">

          <NavItem
            href="/dashboard/templates"
            icon="▤"
          >
            Templates
          </NavItem>

          <NavItem
            href="/dashboard/image-host"
            icon="▣"
            soon
          >
            Image Host
          </NavItem>

        </div>

        <SidebarHeading>
          Account
        </SidebarHeading>

        <div className="sidebar-nav nested">

          <NavItem
            href="/dashboard/settings"
            icon="•"
          >
            Settings
          </NavItem>

          <NavItem
            href="/dashboard/domains"
            icon="•"
          >
            Domains
          </NavItem>

        </div>

        <div className="sidebar-bottom">

          <TransitionLink
            href="/gun"
            className="share-card"
          >
            <div className="share-icon">
              ✣
            </div>

            <div className="share-text">
              <small>Profile</small>
              <strong>Share your profile</strong>
            </div>

            <span className="share-arrow">
              ↗
            </span>
          </TransitionLink>

          <div className="signed-in">

            <div className="avatar">
              🍂
            </div>

            <div className="signed-text">
              <small>Signed in as</small>
              <strong>gun</strong>
            </div>

            <TransitionLink
              href="/dashboard/settings"
              className="settings-icon"
            >
              ⚙
            </TransitionLink>

          </div>

        </div>

      </aside>

      {/* Main */}

      <section className="main">

        {/* Topbar */}

        <header className="topbar">

          <div className="breadcrumbs">
            <span>Dashboard</span>
            <b>›</b>
            <strong>Overview</strong>
          </div>

          <div className="top-actions">

            <TransitionLink
              href="/gun"
              className="live-preview"
            >
              <span className="live-dot" />
              Live preview
            </TransitionLink>

            <button
              className="top-button"
              type="button"
            >
              ♟
            </button>

            <button
              className="top-button"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ⚙
            </button>

            {menuOpen && (
              <div className="quick-menu">

                <TransitionLink href="/dashboard/settings">
                  Settings
                </TransitionLink>

                <TransitionLink href="/logout">
                  Log out
                </TransitionLink>

              </div>
            )}

          </div>

        </header>

        {/* Heading */}

        <section className="page-heading">

          <h1>Welcome back</h1>

          <p>
            Here is a quick look at your illness.lol page.
          </p>

        </section>

        {/* Stats */}

        <section className="stats-grid">

          <StatCard
            label="Username"
            value="gun"
            icon="◎"
          />

          <StatCard
            label="Aliases"
            value="0"
            icon="♟"
          />

          <StatCard
            label="UID"
            value="58"
            icon="#"
          />

          <StatCard
            label="Profile views"
            value="59"
            icon="◉"
          />

        </section>

        {/* Analytics */}

        <section className="analytics-grid">

          {/* Views */}

          <div className="panel views-panel">

            <div className="panel-header">

              <div>
                <h2>Views</h2>

                <p>
                  Your profile activity over the selected range.
                  <b> 2 total.</b>
                </p>
              </div>

              <div className="range-controls">

                <button className="metric-button">
                  ◉ &nbsp; Views⌄
                </button>

                {['3d', '7d', '30d', '90d'].map(
                  (item) => (
                    <button
                      key={item}
                      className={
                        range === item
                          ? 'range-button active'
                          : 'range-button'
                      }
                      onClick={() => setRange(item)}
                    >
                      {item}
                    </button>
                  )
                )}

              </div>

            </div>

            <Chart />

          </div>

          {/* Devices */}

          <div className="panel devices-panel">

            <div className="panel-header">
              <div>
                <h2>Devices</h2>

                <p>
                  How visitors break down by device type.
                </p>
              </div>
            </div>

            <Donut />

          </div>

        </section>

        {/* Countries */}

        <section className="panel countries-panel">

          <div className="countries-header">

            <div>
              <h2>Top countries</h2>

              <p>
                Where your visitors are coming from in the selected range.
              </p>
            </div>

            <button className="globe-button">
              ◎ &nbsp; Show globe
            </button>

          </div>

          <div className="country-grid">

            <Country
              flag="🇩🇰"
              name="Denmark"
              value="1 (50%)"
            />

            <Country
              flag="🇬🇧"
              name="United Kingdom"
              value="1 (50%)"
            />

          </div>

        </section>

      </section>

      <style jsx global>{`

        /* =====================================================
           RESET
        ===================================================== */

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: #050505;
          color: #fff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        body {
          overflow-x: hidden;
        }

        button,
        input {
          font: inherit;
        }

        button {
          color: inherit;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .dashboard {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 52% -10%,
              rgba(255,106,26,.065),
              transparent 30%
            ),
            #050505;

          position: relative;
          isolation: isolate;
        }

        .background-glow {
          position: fixed;
          pointer-events: none;
          z-index: -1;
          border-radius: 50%;
          filter: blur(70px);
        }

        .glow-1 {
          width: 700px;
          height: 400px;
          top: -300px;
          left: 43%;
          background: rgba(255,106,26,.1);
        }

        .glow-2 {
          width: 500px;
          height: 500px;
          right: -350px;
          top: 25%;
          background: rgba(255,106,26,.035);
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: 228px;
          z-index: 20;

          display: flex;
          flex-direction: column;

          padding: 18px 9px 12px;

          background:
            rgba(7,7,7,.97);

          border-right:
            1px solid
            rgba(255,255,255,.075);

          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.08);
          border-radius: 99px;
        }

        .brand {
          height: 39px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 0 8px;

          margin-bottom: 17px;

          font-size: 16px;
          font-weight: 650;
          letter-spacing: -.3px;
        }

        .brand img {
          width: 29px;
          height: 29px;
          object-fit: contain;

          filter:
            drop-shadow(
              0 0 9px
              rgba(255,106,26,.3)
            );
        }

        /* SEARCH */

        .search-box {
          height: 35px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding: 0 9px;

          border-radius: 9px;

          border:
            1px solid
            rgba(255,255,255,.075);

          background: #0b0b0b;

          color:
            rgba(255,255,255,.42);

          font-size: 11px;

          margin-bottom: 12px;
        }

        .search-symbol {
          font-size: 17px;
          line-height: 1;
        }

        .search-box kbd {
          margin-left: auto;

          border:
            1px solid
            rgba(255,255,255,.075);

          background: #111;

          border-radius: 5px;

          padding: 3px 5px;

          color:
            rgba(255,255,255,.28);

          font-size: 8px;
        }

        /* NAV */

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .nav-item {
          height: 31px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 0 10px;

          border-radius: 8px;

          color:
            rgba(255,255,255,.58);

          font-size: 12px;

          transition:
            color .16s ease,
            background .16s ease,
            transform .16s ease;
        }

        .nav-item:hover {
          color: #fff;

          background:
            rgba(255,106,26,.055);

          transform: translateX(1px);
        }

        .nav-item.active {
          color: #ff8a3d;

          background:
            rgba(255,106,26,.09);

          border:
            1px solid
            rgba(255,106,26,.18);
        }

        .nav-item .icon {
          width: 15px;
          flex: 0 0 15px;

          display: inline-flex;
          justify-content: center;

          color:
            rgba(255,255,255,.32);

          font-size: 12px;
        }

        .nav-item.active .icon {
          color: #ff6a1a;
        }

        .nav-label {
          white-space: nowrap;
        }

        .nav-item em {
          margin-left: auto;

          color:
            rgba(255,255,255,.25);

          font-style: normal;

          font-size: 7px;
          font-weight: 600;
        }

        .nested {
          margin-left: 17px;

          padding-left: 7px;

          border-left:
            1px solid
            rgba(255,255,255,.075);
        }

        /* HEADINGS */

        .sidebar-heading {
          height: 34px;

          display: flex;
          align-items: end;

          padding: 0 11px 6px;

          margin-top: 9px;

          color:
            rgba(255,255,255,.36);

          font-size: 10px;
        }

        .sidebar-heading .caret {
          margin-left: auto;
          font-size: 9px;
        }

        .sidebar-heading.premium {
          color:
            rgba(255,255,255,.4);
        }

        /* SIDEBAR BOTTOM */

        .sidebar-bottom {
          margin-top: auto;
          padding-top: 14px;
        }

        .share-card {
          min-height: 51px;

          display: flex;
          align-items: center;

          gap: 8px;

          padding: 8px 9px;

          border:
            1px solid
            rgba(255,255,255,.075);

          border-radius: 12px;

          background: #0d0d0d;

          transition:
            border-color .18s ease,
            background .18s ease;
        }

        .share-card:hover {
          border-color:
            rgba(255,106,26,.2);

          background: #101010;
        }

        .share-icon {
          width: 29px;
          height: 29px;

          display: grid;
          place-items: center;

          flex: 0 0 29px;

          border-radius: 8px;

          background: #151515;

          color:
            rgba(255,255,255,.55);
        }

        .share-text {
          min-width: 0;

          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .share-text small,
        .signed-text small {
          color:
            rgba(255,255,255,.28);

          font-size: 8px;
        }

        .share-text strong,
        .signed-text strong {
          color:
            rgba(255,255,255,.75);

          font-size: 10px;
          font-weight: 600;
        }

        .share-arrow {
          margin-left: auto;
          color:
            rgba(255,255,255,.3);
        }

        .signed-in {
          display: flex;
          align-items: center;

          gap: 8px;

          padding: 11px 6px 0;
        }

        .avatar {
          width: 28px;
          height: 28px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #3a210d,
              #14100b
            );

          border:
            1px solid
            rgba(255,106,26,.18);

          font-size: 13px;
        }

        .signed-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .settings-icon {
          margin-left: auto;

          color:
            rgba(255,255,255,.3);

          font-size: 12px;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main {
          min-height: 100vh;

          margin-left: 228px;

          width: calc(100% - 228px);

          padding: 0 23px 34px;

          position: relative;
        }

        /* TOPBAR */

        .topbar {
          height: 57px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid
            rgba(255,255,255,.035);
        }

        .breadcrumbs {
          display: flex;
          align-items: center;

          gap: 9px;

          color:
            rgba(255,255,255,.29);

          font-size: 10px;
        }

        .breadcrumbs b {
          color:
            rgba(255,255,255,.17);

          font-weight: 400;
        }

        .breadcrumbs strong {
          color:
            rgba(255,255,255,.5);

          font-weight: 500;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 7px;

          position: relative;
        }

        .live-preview,
        .top-button {
          height: 34px;

          border:
            1px solid
            rgba(255,255,255,.075);

          background: #0b0b0b;

          border-radius: 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition:
            background .18s ease,
            border-color .18s ease;
        }

        .live-preview {
          padding: 0 13px;

          gap: 6px;

          color:
            rgba(255,255,255,.78);

          font-size: 11px;
        }

        .live-preview:hover {
          border-color:
            rgba(255,106,26,.25);

          background:
            rgba(255,106,26,.05);
        }

        .live-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          border:
            1px solid
            rgba(255,255,255,.75);

          box-shadow:
            0 0 5px
            rgba(255,255,255,.35);
        }

        .top-button {
          width: 34px;

          color:
            rgba(255,255,255,.6);
        }

        .top-button:hover {
          background: #111;
          color: #fff;
        }

        .quick-menu {
          position: absolute;

          right: 0;
          top: 42px;

          width: 140px;

          padding: 5px;

          background: #111;

          border:
            1px solid
            rgba(255,255,255,.09);

          border-radius: 10px;

          box-shadow:
            0 20px 50px
            rgba(0,0,0,.65);

          z-index: 100;
        }

        .quick-menu a {
          display: block;

          padding: 9px 10px;

          border-radius: 7px;

          color:
            rgba(255,255,255,.6);

          font-size: 11px;
        }

        .quick-menu a:hover {
          color: #fff;

          background:
            rgba(255,106,26,.08);
        }

        /* HEADING */

        .page-heading {
          padding: 26px 0 18px;
        }

        .page-heading h1 {
          margin: 0;

          font-family:
            "Space Grotesk",
            Inter,
            sans-serif;

          font-size: 23px;
          line-height: 1.2;

          font-weight: 650;

          letter-spacing: -.65px;
        }

        .page-heading p {
          margin: 6px 0 0;

          color:
            rgba(255,255,255,.31);

          font-size: 11px;
        }

        /* =====================================================
           STATS
        ===================================================== */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 9px;
        }

        .stat-card {
          height: 104px;

          padding: 17px 19px;

          border:
            1px solid
            rgba(255,255,255,.075);

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              #0b0b0b,
              #080808
            );

          transition:
            transform .18s ease,
            border-color .18s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);

          border-color:
            rgba(255,106,26,.18);
        }

        .stat-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          color:
            rgba(255,255,255,.32);

          font-size: 10px;

          margin-bottom: 17px;
        }

        .stat-card-top .icon {
          font-size: 12px;
        }

        .stat-card strong {
          font-family:
            "Space Grotesk",
            Inter,
            sans-serif;

          font-size: 23px;

          line-height: 1;

          font-weight: 600;

          letter-spacing: -.4px;
        }

        /* =====================================================
           ANALYTICS GRID
        ===================================================== */

        .analytics-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 3fr)
            minmax(290px, .9fr);

          gap: 13px;

          margin-top: 16px;
        }

        .panel {
          border:
            1px solid
            rgba(255,255,255,.075);

          border-radius: 18px;

          background:
            rgba(8,8,8,.93);

          overflow: hidden;
        }

        .views-panel,
        .devices-panel {
          min-height: 389px;
        }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 15px;

          padding: 23px 21px 0;
        }

        .panel-header h2,
        .countries-header h2 {
          margin: 0 0 6px;

          font-family:
            "Space Grotesk",
            Inter,
            sans-serif;

          font-size: 14px;

          line-height: 1.2;

          font-weight: 600;
        }

        .panel-header p,
        .countries-header p {
          margin: 0;

          color:
            rgba(255,255,255,.29);

          font-size: 10px;

          line-height: 1.5;
        }

        .panel-header p b {
          color:
            rgba(255,255,255,.48);

          font-weight: 500;
        }

        /* =====================================================
           RANGE
        ===================================================== */

        .range-controls {
          display: flex;
          align-items: center;

          height: 32px;

          padding: 3px;

          border:
            1px solid
            rgba(255,255,255,.075);

          border-radius: 17px;

          background: #0c0c0c;

          flex-shrink: 0;
        }

        .range-controls button {
          height: 24px;

          border: 0;

          background: transparent;

          border-radius: 13px;

          padding: 0 8px;

          color:
            rgba(255,255,255,.28);

          font-size: 9px;

          cursor: pointer;
        }

        .range-controls .metric-button {
          padding: 0 10px;

          color:
            rgba(255,255,255,.52);

          border-right:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 12px;
        }

        .range-controls .range-button.active {
          color: #ff8a3d;

          background:
            rgba(255,106,26,.1);

          border:
            1px solid
            rgba(255,106,26,.25);
        }

        /* =====================================================
           CHART
        ===================================================== */

        .chart-container {
          height: 292px;

          padding: 27px 20px 13px;
        }

        .chart {
          display: block;

          width: 100%;

          height: 247px;
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;

          padding: 0 7px;

          color:
            rgba(255,255,255,.28);

          font-size: 9px;
        }

        /* =====================================================
           DEVICES
        ===================================================== */

        .device-content {
          height: 300px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          padding-top: 4px;
        }

        .donut {
          width: 122px;
          height: 122px;

          border-radius: 50%;

          background:
            conic-gradient(
              #ee8bb1 0deg 180deg,
              #ffb34d 180deg 360deg
            );

          display: grid;
          place-items: center;
        }

        .donut-center {
          width: 84px;
          height: 84px;

          border-radius: 50%;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          background: #090909;

          box-shadow:
            inset 0 0 0 1px
            rgba(255,255,255,.025);
        }

        .donut-center strong {
          font-family:
            "Space Grotesk",
            Inter,
            sans-serif;

          font-size: 17px;
          line-height: 1;
        }

        .donut-center span {
          margin-top: 3px;

          color:
            rgba(255,255,255,.32);

          font-size: 8px;
        }

        .device-legend {
          width: 155px;

          display: flex;
          flex-direction: column;

          gap: 10px;

          margin-top: 24px;
        }

        .legend-row {
          display: flex;
          justify-content: space-between;
          align-items: center;

          font-size: 10px;

          color:
            rgba(255,255,255,.5);
        }

        .legend-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-row strong {
          font-weight: 500;

          color:
            rgba(255,255,255,.5);
        }

        .legend-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;
        }

        .legend-dot.pink {
          background: #ee8bb1;
        }

        .legend-dot.gold {
          background: #ffb34d;
        }

        /* =====================================================
           COUNTRIES
        ===================================================== */

        .countries-panel {
          margin-top: 16px;

          padding-bottom: 20px;
        }

        .countries-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 22px 21px 17px;
        }

        .globe-button {
          height: 32px;

          padding: 0 13px;

          border-radius: 17px;

          border:
            1px solid
            rgba(255,106,26,.35);

          background:
            rgba(255,106,26,.06);

          color: #ff8a3d;

          font-size: 9px;

          cursor: pointer;

          transition:
            background .18s ease;
        }

        .globe-button:hover {
          background:
            rgba(255,106,26,.1);
        }

        .country-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 10px;

          padding: 0 21px;
        }

        .country-card {
          min-height: 52px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 9px 11px;

          border:
            1px solid
            rgba(255,255,255,.065);

          background: #101010;

          border-radius: 12px;
        }

        .country-flag {
          font-size: 18px;

          line-height: 1;
        }

        .country-info {
          flex: 1;
          min-width: 0;
        }

        .country-title {
          color:
            rgba(255,255,255,.72);

          font-size: 10px;

          font-weight: 600;
        }

        .country-progress {
          height: 4px;

          margin-top: 7px;

          border-radius: 99px;

          background:
            rgba(255,255,255,.045);

          overflow: hidden;
        }

        .country-progress span {
          display: block;

          width: 70%;
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #ff6a1a,
              #ff8a3d
            );
        }

        .country-value {
          color:
            rgba(255,255,255,.43);

          font-size: 9px;

          white-space: nowrap;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1150px) {

          .sidebar {
            width: 210px;
          }

          .main {
            margin-left: 210px;
            width: calc(100% - 210px);
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .devices-panel {
            min-height: 330px;
          }

          .device-content {
            height: 255px;
          }

        }

        @media (max-width: 850px) {

          .sidebar {
            position: relative;

            width: 100%;
            height: auto;

            padding: 13px 14px;

            border-right: 0;

            border-bottom:
              1px solid
              rgba(255,255,255,.075);
          }

          .brand {
            margin: 0;
          }

          .search-box,
          .sidebar-nav,
          .sidebar-heading,
          .sidebar-bottom {
            display: none;
          }

          .main {
            margin-left: 0;

            width: 100%;

            padding:
              0 14px 30px;
          }

          .topbar {
            height: 55px;
          }

          .stats-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        @media (max-width: 600px) {

          .page-heading {
            padding-top: 21px;
          }

          .page-heading h1 {
            font-size: 21px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .panel-header {
            display: block;
          }

          .range-controls {
            width: max-content;
            margin-top: 15px;
          }

          .country-grid {
            grid-template-columns: 1fr;
          }

          .countries-header {
            align-items: flex-start;
            gap: 12px;
          }

          .live-preview {
            display: none;
          }

          .chart-container {
            padding-left: 10px;
            padding-right: 10px;
          }

        }

        @media (max-width: 430px) {

          .main {
            padding-left: 10px;
            padding-right: 10px;
          }

          .top-actions {
            gap: 4px;
          }

          .top-button {
            width: 31px;
            height: 31px;
          }

          .page-heading p {
            font-size: 10px;
          }

          .panel {
            border-radius: 15px;
          }

          .panel-header,
          .countries-header {
            padding-left: 16px;
            padding-right: 16px;
          }

          .country-grid {
            padding-left: 16px;
            padding-right: 16px;
          }

        }

      `}</style>
    </main>
  )
}

function SidebarHeading({ children, premium = false }) {
  return (
    <div
      className={`sidebar-heading ${
        premium ? 'premium' : ''
      }`}
    >
      <span>
        {premium ? '♛ ' : ''}
        {children}
      </span>

      <span className="caret">
        ⌃
      </span>
    </div>
  )
}
