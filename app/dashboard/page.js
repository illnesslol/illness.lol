'use client'

import { useMemo, useState } from 'react'
import { TransitionLink } from '../../components/PageTransition'

const C = {
  bg: '#050505',
  panel: '#0b0b0b',
  panel2: '#101010',
  line: 'rgba(255,255,255,.08)',
  text: '#fff',
  muted: 'rgba(255,255,255,.58)',
  faint: 'rgba(255,255,255,.36)',
  orange: '#ff6a1a',
  orange2: '#ff8a3d',
  orangeSoft: 'rgba(255,106,26,.11)',
}

function Icon({ children }) {
  return (
    <span className="icon" aria-hidden="true">
      {children}
    </span>
  )
}

function NavItem({ href, icon, children, active = false }) {
  return (
    <TransitionLink
      href={href}
      className={`nav-item ${active ? 'active' : ''}`}
    >
      <Icon>{icon}</Icon>
      <span>{children}</span>
    </TransitionLink>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
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

  const width = 900
  const height = 260
  const max = 7

  const path = points
    .map((value, index) => {
      const x =
        (index / (points.length - 1)) *
        width

      const y =
        height -
        28 -
        (value / max) * 190

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const area =
    `${path} L ${width} ${height} L 0 ${height} Z`

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="fallChart"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={C.orange}
              stopOpacity=".28"
            />

            <stop
              offset="100%"
              stopColor={C.orange}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            x2={width}
            y1={32 + i * 48}
            y2={32 + i * 48}
            stroke="rgba(255,255,255,.055)"
          />
        ))}

        <path
          d={area}
          fill="url(#fallChart)"
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
    <div className="donut-area">
      <div className="donut">
        <div className="donut-hole">
          2
          <br />
          <small>views</small>
        </div>
      </div>

      <div className="legend">
        <div>
          <i className="dot orange" />
          Desktop
          <b>1 (50%)</b>
        </div>

        <div>
          <i className="dot gold" />
          Mobile
          <b>1 (50%)</b>
        </div>
      </div>
    </div>
  )
}

function Country({ flag, name, value }) {
  return (
    <div className="country">
      <span className="flag">
        {flag}
      </span>

      <div style={{ flex: 1 }}>
        <div className="country-name">
          {name}
        </div>

        <div className="country-bar" />
      </div>

      <span className="country-value">
        {value}
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const [range, setRange] = useState('7d')
  const [menuOpen, setMenuOpen] =
    useState(false)

  return (
    <main className="dashboard-shell">

      {/* FALL ATMOSPHERE */}

      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="leaf leaf-a">
        🍂
      </div>

      <div className="leaf leaf-b">
        🍁
      </div>

      <div className="leaf leaf-c">
        🍂
      </div>

      {/* SIDEBAR */}

      <aside className="sidebar">

        <TransitionLink
          href="/"
          className="brand"
        >
          <img
            src="/icon.png"
            alt=""
          />

          <span>
            illness.lol
          </span>
        </TransitionLink>

        <div className="search">
          <span className="search-icon">
            ⌕
          </span>

          <span>
            Search Halo
          </span>

          <kbd>
            Ctrl K
          </kbd>
        </div>

        <div className="nav-section">

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

        <div className="nav-heading">
          <span>
            Profile
          </span>

          <span>
            ⌃
          </span>
        </div>

        <div className="nav-section nested">

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

        <div className="nav-heading premium">
          <span>♛ Premium</span>
          <small>▣</small>
        </div>

        <div className="nav-section nested">

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

        <div className="nav-section">

          <NavItem
            href="/dashboard/templates"
            icon="▤"
          >
            Templates
          </NavItem>

          <NavItem
            href="/dashboard/image-host"
            icon="▣"
          >
            Image Host

            <em>
              SOON
            </em>
          </NavItem>

        </div>

        <div className="nav-heading">
          <span>
            Account
          </span>

          <span>
            ⌃
          </span>
        </div>

        <div className="nav-section nested">

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

        <div className="share-card">

          <div className="share-icon">
            ✣
          </div>

          <div>
            <small>
              Profile
            </small>

            <strong>
              Share your profile
            </strong>
          </div>

          <span>
            ↗
          </span>

        </div>

        <div className="signed-in">

          <span className="mini-avatar">
            🍂
          </span>

          <div>
            <small>
              Signed in as
            </small>

            <strong>
              gun
            </strong>
          </div>

          <span>
            ⚙
          </span>

        </div>

      </aside>

      {/* CONTENT */}

      <section className="content">

        {/* TOP BAR */}

        <header className="topbar">

          <div className="crumb">
            Dashboard
            <span>›</span>
            <b>
              Overview
            </b>
          </div>

          <div className="top-actions">

            <TransitionLink
              href="/gun"
              className="preview"
            >
              ◉ &nbsp;Live preview
            </TransitionLink>

            <button>
              ♟
            </button>

            <button
              onClick={() =>
                setMenuOpen(
                  value => !value
                )
              }
            >
              ⚙
            </button>

            {menuOpen && (
              <div className="quick-menu">

                <TransitionLink
                  href="/dashboard/settings"
                >
                  Settings
                </TransitionLink>

                <TransitionLink
                  href="/logout"
                >
                  Log out
                </TransitionLink>

              </div>
            )}

          </div>

        </header>

        {/* HEADER */}

        <div className="heading">

          <div>

            <h1>
              Welcome back
            </h1>

            <p>
              Here is a quick look at
              your illness.lol page.
            </p>

          </div>

        </div>

        {/* STAT CARDS */}

        <div className="stats">

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

        </div>

        {/* MAIN GRID */}

        <div className="main-grid">

          {/* VIEWS */}

          <section className="panel views-panel">

            <div className="panel-head">

              <div>

                <h2>
                  Views
                </h2>

                <p>
                  Your profile activity
                  over the selected range.
                  {' '}
                  <b>
                    2 total.
                  </b>
                </p>

              </div>

              <div className="controls">

                <button className="metric">
                  ◉ &nbsp; Views⌄
                </button>

                {[
                  '3d',
                  '7d',
                  '30d',
                  '90d',
                ].map(value => (

                  <button
                    key={value}
                    className={
                      range === value
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setRange(value)
                    }
                  >
                    {value}
                  </button>

                ))}

              </div>

            </div>

            <Chart />

          </section>

          {/* DEVICES */}

          <section className="panel devices-panel">

            <div className="panel-head">

              <div>

                <h2>
                  Devices
                </h2>

                <p>
                  How visitors break
                  down by device type.
                </p>

              </div>

            </div>

            <Donut />

          </section>

        </div>

        {/* COUNTRIES */}

        <section className="panel countries-panel">

          <div className="countries-head">

            <div>

              <h2>
                Top countries
              </h2>

              <p>
                Where your visitors are
                coming from in the selected
                range.
              </p>

            </div>

            <button className="globe">
              ◎ &nbsp; Show globe
            </button>

          </div>

          <div className="countries">

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

      {/* STYLES */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          background: #050505;
          color: #fff;
          font-family:
            Inter,
            system-ui,
            sans-serif;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font: inherit;
          color: inherit;
        }

        /* =========================
           PAGE
        ========================= */

        .dashboard-shell {
          min-height: 100vh;
          background: #050505;
          position: relative;
          overflow: hidden;
        }

        /* =========================
           FALL BACKGROUND
        ========================= */

        .ambient {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(30px);
          z-index: 0;
        }

        .ambient-one {
          width: 800px;
          height: 500px;
          top: -300px;
          left: 35%;

          background:
            radial-gradient(
              circle,
              rgba(255,106,26,.13),
              transparent 68%
            );
        }

        .ambient-two {
          width: 600px;
          height: 600px;
          right: -300px;
          top: 25%;

          background:
            radial-gradient(
              circle,
              rgba(186,88,18,.07),
              transparent 70%
            );
        }

        /* =========================
           FALLING LEAVES
        ========================= */

        .leaf {
          position: fixed;
          z-index: 1;
          pointer-events: none;

          opacity: .22;

          font-size: 24px;

          filter:
            drop-shadow(
              0 0 8px
              rgba(255,106,26,.25)
            );

          animation:
            fall 12s linear infinite;
        }

        .leaf-a {
          left: 28%;
          top: -40px;
        }

        .leaf-b {
          left: 70%;
          top: -70px;
          animation-delay: 4s;
        }

        .leaf-c {
          left: 87%;
          top: -90px;
          animation-delay: 8s;
        }

        @keyframes fall {

          to {
            transform:
              translate3d(
                -80px,
                110vh,
                0
              )
              rotate(260deg);
          }

        }

        /* =========================
           SIDEBAR
        ========================= */

        .sidebar {
          position: fixed;
          z-index: 5;

          inset: 0 auto 0 0;

          width: 247px;

          background:
            rgba(7,7,7,.96);

          border-right:
            1px solid
            rgba(255,255,255,.08);

          padding:
            20px 10px 12px;

          display: flex;
          flex-direction: column;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          padding:
            0 9px 24px;

          font-family:
            'Space Grotesk',
            Inter,
            sans-serif;

          font-size: 21px;
          font-weight: 600;
        }

        .brand img {
          width: 29px;
          height: 29px;

          filter:
            drop-shadow(
              0 0 10px
              rgba(255,106,26,.35)
            );
        }

        /* SEARCH */

        .search {
          height: 45px;

          border:
            1px solid
            rgba(255,255,255,.08);

          background: #0b0b0b;

          border-radius: 12px;

          padding:
            0 12px;

          display: flex;
          align-items: center;

          gap: 9px;

          color:
            rgba(255,255,255,.58);

          font-size: 13px;

          margin-bottom: 15px;
        }

        .search-icon {
          font-size: 20px;
        }

        .search kbd {
          margin-left: auto;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 7px;

          padding:
            3px 6px;

          color:
            rgba(255,255,255,.36);

          font-size: 10px;
        }

        /* NAV */

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item {
          height: 38px;

          border-radius: 10px;

          display: flex;
          align-items: center;

          gap: 11px;

          padding:
            0 12px;

          color:
            rgba(255,255,255,.7);

          font-size: 13px;

          transition:
            background .2s ease,
            color .2s ease,
            transform .2s ease;
        }

        .nav-item:hover {
          background:
            rgba(255,106,26,.07);

          color: #fff;

          transform:
            translateX(2px);
        }

        .nav-item.active {
          color: #ff8a3d;

          background:
            rgba(255,106,26,.11);

          border:
            1px solid
            rgba(255,106,26,.28);
        }

        .icon {
          width: 17px;
          text-align: center;

          color:
            rgba(255,255,255,.36);

          font-size: 14px;
        }

        .nav-item.active .icon {
          color: #ff6a1a;
        }

        .nav-heading {
          display: flex;
          align-items: center;

          gap: 6px;

          padding:
            17px 13px 7px;

          color:
            rgba(255,255,255,.58);

          font-size: 12px;
        }

        .nav-heading > span:last-child {
          margin-left: auto;
        }

        .nav-heading.premium {
          gap: 8px;
        }

        .nav-heading.premium small {
          margin-left: auto;
        }

        .nested {
          border-left:
            1px solid
            rgba(255,255,255,.08);

          margin-left: 18px;

          padding-left: 7px;
        }

        .nav-item em {
          margin-left: auto;

          font-size: 7px;

          color:
            rgba(255,255,255,.36);

          font-style: normal;
        }

        /* SHARE CARD */

        .share-card {
          margin-top: auto;

          padding: 11px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 13px;

          background: #0d0d0d;

          display: flex;
          align-items: center;

          gap: 9px;
        }

        .share-card .share-icon {
          width: 31px;
          height: 31px;

          border-radius: 9px;

          background: #151515;

          display: grid;
          place-items: center;
        }

        .share-card div:nth-child(2) {
          display: flex;
          flex-direction: column;

          gap: 3px;
        }

        .share-card small,
        .signed-in small {
          font-size: 10px;

          color:
            rgba(255,255,255,.36);
        }

        .share-card strong,
        .signed-in strong {
          font-size: 12px;
        }

        .share-card > span {
          margin-left: auto;

          color:
            rgba(255,255,255,.36);
        }

        /* SIGNED IN */

        .signed-in {
          display: flex;
          align-items: center;

          gap: 9px;

          padding:
            12px 8px 0;
        }

        .signed-in > div {
          display: flex;
          flex-direction: column;

          gap: 3px;
        }

        .signed-in > span:last-child {
          margin-left: auto;

          color:
            rgba(255,255,255,.36);
        }

        .mini-avatar {
          width: 29px;
          height: 29px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background:
            linear-gradient(
              135deg,
              #39200c,
              #15100a
            );

          border:
            1px solid
            rgba(255,106,26,.18);
        }

        /* =========================
           CONTENT
        ========================= */

        .content {
          position: relative;
          z-index: 2;

          margin-left: 247px;

          padding:
            0 24px 40px;

          max-width: 1800px;
        }

        /* TOP BAR */

        .topbar {
          height: 70px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid
            rgba(255,255,255,.025);
        }

        .crumb {
          font-size: 12px;

          color:
            rgba(255,255,255,.36);
        }

        .crumb span {
          padding:
            0 9px;
        }

        .crumb b {
          color:
            rgba(255,255,255,.58);

          font-weight: 500;
        }

        .top-actions {
          position: relative;

          display: flex;
          align-items: center;

          gap: 8px;
        }

        .top-actions button,
        .preview {
          height: 36px;

          border-radius: 20px;

          border:
            1px solid
            rgba(255,255,255,.08);

          background: #0c0c0c;

          padding:
            0 12px;

          display: grid;
          place-items: center;

          cursor: pointer;
        }

        .preview {
          color: #ff8a3d;

          border-color:
            rgba(255,106,26,.35);

          padding:
            0 17px;

          font-size: 12px;
        }

        .quick-menu {
          position: absolute;

          right: 0;
          top: 44px;

          background: #111;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 12px;

          padding: 6px;

          width: 130px;

          box-shadow:
            0 15px 40px #000;

          z-index: 20;
        }

        .quick-menu a {
          display: block;

          padding: 8px;

          border-radius: 7px;

          font-size: 12px;

          color:
            rgba(255,255,255,.58);
        }

        .quick-menu a:hover {
          background:
            rgba(255,106,26,.08);

          color: #fff;
        }

        /* HEADING */

        .heading {
          padding:
            27px 0 19px;
        }

        .heading h1 {
          font-family:
            'Space Grotesk',
            Inter,
            sans-serif;

          font-size: 25px;

          margin:
            0 0 5px;

          letter-spacing: -.6px;

          font-weight: 600;
        }

        .heading p,
        .panel p {
          margin: 0;

          color:
            rgba(255,255,255,.36);

          font-size: 12px;
        }

        /* =========================
           STATS
        ========================= */

        .stats {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 10px;
        }

        .stat-card {
          height: 111px;

          border:
            1px solid
            rgba(255,255,255,.08);

          background:
            linear-gradient(
              135deg,
              #0b0b0b,
              #090909
            );

          border-radius: 20px;

          padding: 20px;

          transition:
            border-color .2s ease,
            transform .2s ease,
            box-shadow .2s ease;
        }

        .stat-card:hover {
          transform:
            translateY(-2px);

          border-color:
            rgba(255,106,26,.18);

          box-shadow:
            0 12px 35px
            rgba(0,0,0,.3);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;

          color:
            rgba(255,255,255,.36);

          font-size: 12px;

          margin-bottom: 20px;
        }

        .stat-card strong {
          font-family:
            'Space Grotesk',
            Inter,
            sans-serif;

          font-size: 25px;

          font-weight: 600;
        }

        /* =========================
           PANELS
        ========================= */

        .main-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 3fr)
            minmax(300px, 1fr);

          gap: 14px;

          margin-top: 18px;
        }

        .panel {
          border:
            1px solid
            rgba(255,255,255,.08);

          background:
            rgba(8,8,8,.9);

          border-radius: 20px;

          overflow: hidden;
        }

        .views-panel {
          min-height: 420px;
        }

        .devices-panel {
          min-height: 420px;
        }

        .panel-head {
          display: flex;

          justify-content: space-between;

          gap: 15px;

          padding:
            25px 23px 0;
        }

        .panel h2 {
          font-family:
            'Space Grotesk',
            Inter,
            sans-serif;

          font-size: 15px;

          margin:
            0 0 7px;

          font-weight: 600;
        }

        .panel-head p b {
          color:
            rgba(255,255,255,.58);

          font-weight: 500;
        }

        /* =========================
           CHART CONTROLS
        ========================= */

        .controls {
          display: flex;
          align-items: center;

          gap: 2px;

          background: #0c0c0c;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 19px;

          padding: 3px;

          height: 36px;
        }

        .controls button {
          border: 0;

          background: transparent;

          border-radius: 14px;

          padding:
            6px 9px;

          color:
            rgba(255,255,255,.36);

          font-size: 11px;

          cursor: pointer;
        }

        .controls button.selected {
          background:
            rgba(255,106,26,.11);

          border:
            1px solid
            rgba(255,106,26,.3);

          color: #ff8a3d;
        }

        .controls .metric {
          border-right:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 14px;

          color:
            rgba(255,255,255,.58);
        }

        /* =========================
           CHART
        ========================= */

        .chart-wrap {
          height: 310px;

          padding:
            30px 22px 14px;
        }

        .chart-wrap svg {
          width: 100%;
          height: 245px;
        }

        .chart-labels {
          display: flex;

          justify-content: space-between;

          color:
            rgba(255,255,255,.36);

          font-size: 10px;

          padding:
            0 8px;
        }

        /* =========================
           DONUT
        ========================= */

        .donut-area {
          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          height: 330px;
        }

        .donut {
          width: 130px;
          height: 130px;

          border-radius: 50%;

          background:
            conic-gradient(
              #f18eb3 0 50%,
              #ffb14a 50% 100%
            );

          display: grid;
          place-items: center;

          box-shadow:
            0 0 35px
            rgba(255,106,26,.05);
        }

        .donut-hole {
          width: 92px;
          height: 92px;

          border-radius: 50%;

          background: #090909;

          display: grid;
          place-items: center;

          align-content: center;

          text-align: center;

          font-family:
            'Space Grotesk';

          font-size: 20px;

          font-weight: 600;
        }

        .donut-hole small {
          font-family: Inter;

          font-size: 9px;

          font-weight: 400;

          color:
            rgba(255,255,255,.36);
        }

        .legend {
          margin-top: 28px;

          display: flex;
          flex-direction: column;

          gap: 11px;

          width: 170px;

          color:
            rgba(255,255,255,.58);

          font-size: 11px;
        }

        .legend div {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        .legend b {
          margin-left: auto;

          color:
            rgba(255,255,255,.58);

          font-weight: 500;
        }

        .dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          display: inline-block;
        }

        .dot.orange {
          background: #f18eb3;
        }

        .dot.gold {
          background: #ffb14a;
        }

        /* =========================
           COUNTRIES
        ========================= */

        .countries-panel {
          margin-top: 18px;

          padding-bottom: 22px;
        }

        .countries-head {
          display: flex;

          justify-content: space-between;
          align-items: center;

          padding: 23px;
        }

        .globe {
          border:
            1px solid
            rgba(255,106,26,.35);

          background:
            rgba(255,106,26,.08);

          color: #ff8a3d;

          border-radius: 18px;

          padding:
            8px 13px;

          font-size: 11px;

          cursor: pointer;
        }

        .countries {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;

          padding:
            0 23px;
        }

        .country {
          border:
            1px solid
            rgba(255,255,255,.07);

          background: #101010;

          border-radius: 14px;

          padding: 11px;

          display: flex;
          align-items: center;

          gap: 10px;
        }

        .country .flag {
          font-size: 22px;
        }

        .country-name {
          font-size: 12px;
          font-weight: 600;
        }

        .country-bar {
          height: 5px;

          border-radius: 99px;

          background:
            linear-gradient(
              90deg,
              #ff6a1a,
              #ff8a3d
            );

          margin-top: 8px;

          width: 70%;
        }

        .country-value {
          margin-left: auto;

          color:
            rgba(255,255,255,.58);

          font-size: 11px;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1050px) {

          .sidebar {
            width: 215px;
          }

          .content {
            margin-left: 215px;
          }

          .main-grid {
            grid-template-columns: 1fr;
          }

          .devices-panel {
            min-height: 300px;
          }

          .donut-area {
            height: 260px;
          }

        }

        @media (max-width: 800px) {

          .sidebar {
            position: relative;

            width: 100%;
            height: auto;

            border-right: 0;

            border-bottom:
              1px solid
              rgba(255,255,255,.08);

            padding-bottom: 15px;
          }

          .sidebar .nav-section,
          .sidebar .nav-heading,
          .sidebar .search,
          .share-card,
          .signed-in {
            display: none;
          }

          .brand {
            padding-bottom: 0;
          }

          .content {
            margin-left: 0;

            padding:
              0 14px 30px;
          }

          .topbar {
            height: 62px;
          }

          .stats {
            grid-template-columns:
              1fr 1fr;
          }

          .countries {
            grid-template-columns: 1fr;
          }

          .top-actions .preview {
            display: none;
          }

        }

        @media (max-width: 520px) {

          .stats {
            grid-template-columns: 1fr;
          }

          .panel-head {
            display: block;
          }

          .controls {
            margin-top: 16px;

            width: max-content;
          }

          .views-panel,
          .devices-panel {
            min-height: 360px;
          }

          .heading {
            padding-top: 22px;
          }

          .chart-wrap {
            padding-left: 10px;
            padding-right: 10px;
          }

          .country-bar {
            width: 55%;
          }

        }

      `}</style>

    </main>
  )
}
