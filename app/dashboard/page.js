'use client'

import { useEffect, useRef, useState } from 'react'

/* =========================================================
   FALL DASHBOARD
========================================================= */

const COLORS = {
  bg: '#050505',
  surface: '#0a0a0a',
  surface2: '#0d0d0d',
  orange: '#ff6a1a',
  orangeBright: '#ff914d',
  orangeSoft: 'rgba(255,106,26,.12)',
  orangeGlow: 'rgba(255,106,26,.18)',
  border: 'rgba(255,255,255,.08)',
  borderOrange: 'rgba(255,106,26,.35)',
  white: '#ffffff',
  muted: 'rgba(255,255,255,.65)',
  faint: 'rgba(255,255,255,.38)',
}

/* =========================================================
   ICON
========================================================= */

function Icon({ type, size = 16, color = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),

    wand: (
      <>
        <path d="m15 4 5 5" />
        <path d="m13 6 5 5" />
        <path d="m3 21 10-10" />
        <path d="m5 7 .5 1.5L7 9l-1.5.5L5 11l-.5-1.5L3 9l1.5-.5L5 7Z" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c.8-3.2 3.1-5 7-5s6.2 1.8 7 5" />
      </>
    ),

    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 16-5-5L5 20" />
      </>
    ),

    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </>
    ),

    folder: (
      <>
        <path d="M3 7h7l2 2h9v10H3z" />
      </>
    ),

    crown: (
      <>
        <path d="m4 7 4 4 4-7 4 7 4-4-2 11H6L4 7Z" />
      </>
    ),

    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.5v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6.4v-2.5h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1h2.5v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),

    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c.5-3.5 2.5-5 6-5s5.5 1.5 6 5" />
        <path d="M16 5.5a3 3 0 0 1 0 5.5" />
        <path d="M18 15c1.8.8 2.8 2.2 3 5" />
      </>
    ),

    hash: (
      <>
        <path d="M10 3 8 21" />
        <path d="m16 3-2 18" />
        <path d="M4 9h17" />
        <path d="M3 15h17" />
      </>
    ),

    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21" />
        <path d="M12 3c-2.5 2.5-3.5 5.5-3.5 9S9.5 18.5 12 21" />
      </>
    ),

    chevron: (
      <path d="m7 10 5 5 5-5" />
    ),

    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),

    support: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 15c1.5 1 6.5 1 8 0" />
        <path d="M9 10h.01M15 10h.01" />
      </>
    ),
  }

  return <svg {...common}>{paths[type]}</svg>
}

/* =========================================================
   FALLING LEAVES
========================================================= */

function drawLeaf(ctx, size, color, opacity) {
  ctx.globalAlpha = opacity
  ctx.fillStyle = color

  ctx.beginPath()

  ctx.moveTo(0, -size)

  ctx.bezierCurveTo(
    size * 0.95,
    -size * 0.45,
    size * 0.7,
    size * 0.65,
    0,
    size
  )

  ctx.bezierCurveTo(
    -size * 0.7,
    size * 0.65,
    -size * 0.95,
    -size * 0.45,
    0,
    -size
  )

  ctx.fill()

  ctx.globalAlpha = opacity * 0.8
  ctx.strokeStyle = 'rgba(0,0,0,.7)'
  ctx.lineWidth = 0.8

  ctx.beginPath()
  ctx.moveTo(0, -size * 0.85)
  ctx.lineTo(0, size * 1.1)
  ctx.stroke()

  ctx.globalAlpha = 1
}

/* =========================================================
   LEAF CANVAS
========================================================= */

function FallingLeaves() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const colors = [
      '#ff6a1a',
      '#ff8a3d',
      '#d94d0b',
      '#a9360b',
      '#f08a42',
      '#8c2d0a',
    ]

    const createLeaf = () => ({
      x: Math.random() * window.innerWidth,
      y: -40 - Math.random() * window.innerHeight,
      size: Math.random() * 5 + 7,
      speed: Math.random() * 0.55 + 0.35,
      swayAmp: Math.random() * 35 + 15,
      swaySpeed: Math.random() * 0.012 + 0.006,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015,
      opacity: Math.random() * 0.25 + 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
      baseX: 0,
    })

    const leaves = Array.from(
      { length: 24 },
      createLeaf
    )

    leaves.forEach(leaf => {
      leaf.baseX = leaf.x
    })

    let frame
    let tick = 0

    const animate = () => {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      )

      tick++

      leaves.forEach(leaf => {
        leaf.y += leaf.speed
        leaf.rotation += leaf.spin

        const sway =
          Math.sin(
            tick * leaf.swaySpeed + leaf.phase
          ) * leaf.swayAmp

        const x = leaf.baseX + sway

        if (leaf.y > canvas.height + 50) {
          leaf.y = -40
          leaf.baseX =
            Math.random() * window.innerWidth
        }

        ctx.save()

        ctx.translate(x, leaf.y)

        ctx.rotate(
          leaf.rotation +
            Math.sin(
              tick * leaf.swaySpeed +
                leaf.phase
            ) *
              0.45
        )

        drawLeaf(
          ctx,
          leaf.size,
          leaf.color,
          leaf.opacity
        )

        ctx.restore()
      })

      frame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener(
        'resize',
        resize
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fall-leaves"
    />
  )
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon,
  label,
  active = false,
  locked = false,
}) {
  return (
    <div
      className={`sidebar-item ${
        active ? 'active' : ''
      }`}
    >
      <Icon
        type={icon}
        size={16}
      />

      <span>{label}</span>

      {locked && (
        <Icon
          type="lock"
          size={12}
          color="rgba(255,255,255,.35)"
        />
      )}
    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>

        <Icon
          type={icon}
          size={15}
          color="rgba(255,255,255,.35)"
        />
      </div>

      <div className="stat-value">
        {value}
      </div>
    </div>
  )
}

/* =========================================================
   GRAPH
========================================================= */

function ViewsChart() {
  return (
    <div className="chart">
      <div className="chart-grid">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="grid-line"
            style={{
              top: `${i * 25}%`,
            }}
          >
            <span>
              {4 - i}
            </span>
          </div>
        ))}
      </div>

      <svg
        className="chart-svg"
        viewBox="0 0 900 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="fallChartGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ff6a1a"
              stopOpacity=".32"
            />

            <stop
              offset="100%"
              stopColor="#ff6a1a"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          d="
            M0 275
            L120 275
            C160 275 170 275 205 235
            C230 205 250 205 285 205
            L430 205
            C465 205 475 205 510 235
            C545 265 565 275 605 275
            L900 275
            L900 300
            L0 300
            Z
          "
          fill="url(#fallChartGradient)"
        />

        <path
          d="
            M0 275
            L120 275
            C160 275 170 275 205 235
            C230 205 250 205 285 205
            L430 205
            C465 205 475 205 510 235
            C545 265 565 275 605 275
            L900 275
          "
          fill="none"
          stroke="#ff6a1a"
          strokeWidth="2"
        />
      </svg>

      <div className="chart-dates">
        <span>Sep 28</span>
        <span>Sep 29</span>
        <span>Sep 30</span>
        <span>Oct 01</span>
        <span>Oct 02</span>
        <span>Oct 03</span>
        <span>Oct 04</span>
      </div>
    </div>
  )
}

/* =========================================================
   DEVICE DONUT
========================================================= */

function DeviceChart() {
  return (
    <div className="device-chart">
      <div className="donut">
        <div className="donut-hole" />
      </div>

      <div className="device-list">
        <div className="device-row">
          <div>
            <span className="device-dot desktop" />
            Desktop
          </div>

          <strong>1 (50%)</strong>
        </div>

        <div className="device-row">
          <div>
            <span className="device-dot mobile" />
            Mobile
          </div>

          <strong>1 (50%)</strong>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   COUNTRY
========================================================= */

function CountryRow({
  flag,
  country,
}) {
  return (
    <div className="country-card">
      <div className="country-info">
        <span className="flag">
          {flag}
        </span>

        <strong>
          {country}
        </strong>
      </div>

      <span className="country-count">
        1 (50%)
      </span>

      <div className="country-progress">
        <div />
      </div>
    </div>
  )
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  return (
    <main className="dashboard-page">
      <FallingLeaves />

      {/* ATMOSPHERE */}

      <div className="ambient ambient-top" />
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <div className="dot-grid" />
      <div className="vignette" />

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? 'mobile-open' : ''
        }`}
      >
        {/* BRAND */}

        <div className="brand">
          <div className="brand-icon">
            🍂
          </div>

          <span>halo.rip</span>
        </div>

        {/* SEARCH */}

        <div className="search">
          <Icon
            type="search"
            size={15}
            color="rgba(255,255,255,.45)"
          />

          <span>
            Search Halo
          </span>

          <kbd>
            Ctrl K
          </kbd>
        </div>

        {/* NAV */}

        <nav className="sidebar-nav">
          <SidebarItem
            icon="grid"
            label="Overview"
            active
          />

          <SidebarItem
            icon="wand"
            label="Customize"
          />

          <div className="nav-heading">
            <SidebarItem
              icon="user"
              label="Profile"
            />

            <span className="collapse">
              ▲
            </span>
          </div>

          <div className="subnav">
            <span>Assets</span>
            <span>Badges</span>
            <span>Links</span>
            <span>Projects</span>
            <span>Widgets</span>
            <span>Section Builder</span>
          </div>

          <div className="nav-heading premium-heading">
            <SidebarItem
              icon="crown"
              label="Premium"
              locked
            />

            <span className="collapse">
              ▲
            </span>
          </div>

          <div className="subnav">
            <span>Customize</span>
            <span>Backgrounds</span>
            <span>Metadata</span>
          </div>

          <SidebarItem
            icon="folder"
            label="Templates"
          />

          <div className="disabled-item">
            <Icon
              type="image"
              size={15}
            />

            <span>
              Image Host
            </span>

            <small>
              SOON
            </small>
          </div>

          <div className="nav-heading account-heading">
            <SidebarItem
              icon="settings"
              label="Account"
            />

            <span className="collapse">
              ▲
            </span>
          </div>

          <div className="subnav">
            <span>Settings</span>
            <span>Domains</span>
          </div>
        </nav>

        {/* PROFILE BOX */}

        <div className="sidebar-profile">
          <div className="profile-avatar">
            🍁
          </div>

          <div>
            <small>
              Profile
            </small>

            <strong>
              Share your profile
            </strong>
          </div>

          <span className="share-icon">
            ↗
          </span>
        </div>

        {/* USER */}

        <div className="sidebar-user">
          <div className="user-avatar">
            🌲
          </div>

          <div className="user-details">
            <small>
              Signed in as
            </small>

            <strong>
              gun
            </strong>
          </div>

          <Icon
            type="settings"
            size={14}
            color="rgba(255,255,255,.45)"
          />
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="main-content">

        {/* HEADER */}

        <header className="topbar">
          <div className="breadcrumbs">
            <span>
              Dashboard
            </span>

            <b>›</b>

            <strong>
              Overview
            </strong>
          </div>

          <div className="top-actions">
            <button className="preview">
              <Icon
                type="eye"
                size={14}
              />

              Live preview
            </button>

            <button className="circle-btn">
              <Icon
                type="bell"
                size={15}
              />
            </button>

            <button className="circle-btn">
              <Icon
                type="settings"
                size={15}
              />
            </button>

            <button
              className="mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>
          </div>
        </header>

        {/* CONTENT */}

        <div className="content">

          <div className="welcome">
            <h1>
              Welcome back
            </h1>

            <p>
              Here is a quick look at your halo.rip page.
            </p>
          </div>

          {/* STATS */}

          <div className="stats-grid">
            <StatCard
              icon="user"
              label="Username"
              value="gun"
            />

            <StatCard
              icon="users"
              label="Aliases"
              value="0"
            />

            <StatCard
              icon="hash"
              label="UID"
              value="58"
            />

            <StatCard
              icon="eye"
              label="Profile views"
              value="59"
            />
          </div>

          {/* MAIN ANALYTICS */}

          <div className="analytics-grid">

            {/* VIEWS */}

            <section className="panel views-panel">

              <div className="panel-header">
                <div>
                  <h2>
                    Views
                  </h2>

                  <p>
                    Your profile activity over the selected range. 2 total.
                  </p>
                </div>

                <div className="chart-controls">

                  <button className="select-control">
                    <Icon
                      type="eye"
                      size={13}
                    />

                    Views

                    <Icon
                      type="chevron"
                      size={12}
                    />
                  </button>

                  <div className="range-control">
                    <button>
                      3d
                    </button>

                    <button className="selected">
                      7d
                    </button>

                    <button>
                      30d
                    </button>

                    <button>
                      90d
                    </button>
                  </div>

                </div>
              </div>

              <ViewsChart />

            </section>

            {/* DEVICES */}

            <section className="panel devices-panel">

              <div className="panel-header">
                <div>
                  <h2>
                    Devices
                  </h2>

                  <p>
                    How visitors break down by device type.
                  </p>
                </div>
              </div>

              <DeviceChart />

            </section>
          </div>

          {/* COUNTRIES */}

          <section className="panel countries-panel">

            <div className="countries-header">

              <div>
                <h2>
                  Top countries
                </h2>

                <p>
                  Where your visitors are coming from in the selected range.
                </p>
              </div>

              <button className="globe-button">
                <Icon
                  type="globe"
                  size={14}
                />

                Show globe
              </button>
            </div>

            <div className="countries-grid">

              <CountryRow
                flag="🇩🇰"
                country="Denmark"
              />

              <CountryRow
                flag="🇬🇧"
                country="United Kingdom"
              />

            </div>
          </section>

        </div>
      </section>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style jsx global>{`

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: #050505;
        }

        body {
          font-family:
            'Inter',
            system-ui,
            sans-serif;
          color: #fff;
        }

        button {
          font-family: inherit;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .dashboard-page {
          min-height: 100vh;
          background:
            linear-gradient(
              180deg,
              #090909 0%,
              #060606 45%,
              #030303 100%
            );
          position: relative;
          overflow-x: hidden;
        }

        /* =====================================================
           FALL ATMOSPHERE
        ===================================================== */

        .ambient {
          position: fixed;
          pointer-events: none;
          z-index: 0;
          border-radius: 50%;
          filter: blur(35px);
        }

        .ambient-top {
          width: 900px;
          height: 600px;
          top: -420px;
          left: 50%;
          transform: translateX(-50%);
          background:
            radial-gradient(
              circle,
              rgba(255,106,26,.20),
              rgba(255,106,26,.055) 48%,
              transparent 72%
            );
        }

        .ambient-left {
          width: 700px;
          height: 700px;
          left: -500px;
          top: 35%;
          background:
            radial-gradient(
              circle,
              rgba(255,106,26,.075),
              transparent 68%
            );
        }

        .ambient-right {
          width: 700px;
          height: 700px;
          right: -500px;
          top: 50%;
          background:
            radial-gradient(
              circle,
              rgba(180,65,10,.055),
              transparent 68%
            );
        }

        .dot-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;

          background-image:
            radial-gradient(
              rgba(255,255,255,.045) 1px,
              transparent 1px
            );

          background-size: 28px 28px;

          mask-image:
            radial-gradient(
              ellipse 70% 65% at 50% 35%,
              #000 10%,
              transparent 78%
            );

          -webkit-mask-image:
            radial-gradient(
              ellipse 70% 65% at 50% 35%,
              #000 10%,
              transparent 78%
            );
        }

        .vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 8;

          background:
            radial-gradient(
              ellipse at center,
              transparent 42%,
              rgba(0,0,0,.5) 100%
            );
        }

        .fall-leaves {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9;
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          position: fixed;
          z-index: 20;
          left: 0;
          top: 0;
          bottom: 0;
          width: 242px;

          padding: 18px 9px 10px;

          background:
            rgba(7,7,7,.93);

          border-right:
            1px solid rgba(255,255,255,.07);

          display: flex;
          flex-direction: column;

          backdrop-filter:
            blur(22px);

          -webkit-backdrop-filter:
            blur(22px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;

          height: 31px;
          padding: 0 10px;
          margin-bottom: 20px;

          font-family:
            'Space Grotesk',
            sans-serif;

          font-size: 20px;
          font-weight: 700;

          letter-spacing: -.7px;
        }

        .brand-icon {
          width: 25px;
          height: 25px;

          display: grid;
          place-items: center;

          font-size: 17px;

          filter:
            drop-shadow(
              0 0 8px
              rgba(255,106,26,.45)
            );
        }

        .search {
          height: 40px;
          border-radius: 21px;

          display: flex;
          align-items: center;
          gap: 9px;

          padding: 0 12px;

          border:
            1px solid rgba(255,255,255,.08);

          background:
            rgba(255,255,255,.025);

          color:
            rgba(255,255,255,.68);

          font-size: 12px;

          margin-bottom: 12px;
        }

        .search kbd {
          margin-left: auto;

          font-size: 9px;

          padding: 3px 6px;

          border-radius: 6px;

          border:
            1px solid rgba(255,255,255,.08);

          background:
            rgba(255,255,255,.035);

          color:
            rgba(255,255,255,.42);
        }

        .sidebar-nav {
          overflow-y: auto;
          scrollbar-width: none;
          flex: 1;
        }

        .sidebar-nav::-webkit-scrollbar {
          display: none;
        }

        .sidebar-item {
          height: 36px;

          display: flex;
          align-items: center;

          gap: 12px;

          padding: 0 14px;

          margin-bottom: 2px;

          border-radius: 20px;

          color:
            rgba(255,255,255,.68);

          font-size: 12px;

          cursor: pointer;

          transition:
            background .2s ease,
            color .2s ease,
            box-shadow .2s ease;
        }

        .sidebar-item:hover {
          color: #fff;
          background:
            rgba(255,106,26,.07);
        }

        .sidebar-item.active {
          color: #ff8a4c;

          background:
            rgba(255,106,26,.12);

          border:
            1px solid rgba(255,106,26,.35);

          box-shadow:
            inset 0 0 18px
            rgba(255,106,26,.025);
        }

        .nav-heading {
          position: relative;
        }

        .nav-heading .sidebar-item {
          margin-bottom: 0;
        }

        .collapse {
          position: absolute;
          right: 16px;
          top: 10px;

          font-size: 8px;

          color:
            rgba(255,255,255,.42);
        }

        .subnav {
          margin:
            0 0 7px 19px;

          padding-left: 20px;

          border-left:
            1px solid rgba(255,255,255,.07);

          display: flex;
          flex-direction: column;
        }

        .subnav span {
          height: 31px;

          display: flex;
          align-items: center;

          color:
            rgba(255,255,255,.66);

          font-size: 12px;

          padding-left: 13px;

          cursor: pointer;

          transition: color .2s ease;
        }

        .subnav span:hover {
          color: #ff8a4c;
        }

        .premium-heading {
          margin-top: 2px;
        }

        .account-heading {
          margin-top: 3px;
        }

        .disabled-item {
          height: 36px;

          display: flex;
          align-items: center;
          gap: 12px;

          padding: 0 14px;

          color:
            rgba(255,255,255,.25);

          font-size: 12px;
        }

        .disabled-item small {
          margin-left: auto;
          font-size: 8px;
          color:
            rgba(255,255,255,.22);
        }

        .sidebar-profile {
          min-height: 54px;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 8px 10px;

          border-radius: 13px;

          border:
            1px solid rgba(255,255,255,.08);

          background:
            rgba(255,255,255,.025);

          margin-top: 7px;
        }

        .profile-avatar {
          width: 31px;
          height: 31px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background:
            linear-gradient(
              135deg,
              #3a2111,
              #ff6a1a
            );

          font-size: 15px;
        }

        .sidebar-profile div:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-profile small,
        .sidebar-user small {
          color:
            rgba(255,255,255,.35);

          font-size: 9px;
        }

        .sidebar-profile strong {
          font-size: 11px;
          font-weight: 500;
        }

        .share-icon {
          margin-left: auto;
          color:
            rgba(255,255,255,.38);
          font-size: 13px;
        }

        .sidebar-user {
          margin-top: 7px;

          min-height: 52px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 8px 10px;

          border-radius: 13px;

          background:
            rgba(255,255,255,.02);
        }

        .user-avatar {
          width: 31px;
          height: 31px;

          border-radius: 50%;

          display: grid;
          place-items: center;

          background:
            linear-gradient(
              135deg,
              #172015,
              #3f5434
            );

          font-size: 14px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .user-details strong {
          font-size: 11px;
          font-weight: 500;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main-content {
          position: relative;
          z-index: 10;

          margin-left: 242px;

          min-height: 100vh;
        }

        .topbar {
          height: 57px;

          display: flex;
          align-items: center;

          justify-content: space-between;

          padding:
            0 30px 0 22px;

          border-bottom:
            1px solid rgba(255,255,255,.045);
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 12px;

          font-size: 12px;
        }

        .breadcrumbs span {
          color:
            rgba(255,255,255,.38);
        }

        .breadcrumbs b {
          color:
            rgba(255,255,255,.25);
          font-size: 17px;
          font-weight: 400;
        }

        .breadcrumbs strong {
          font-weight: 500;
          color:
            rgba(255,255,255,.76);
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview {
          height: 36px;

          display: flex;
          align-items: center;
          gap: 8px;

          padding: 0 15px;

          border-radius: 19px;

          color:
            #ff8a4c;

          background:
            rgba(255,106,26,.08);

          border:
            1px solid rgba(255,106,26,.35);

          font-size: 11px;
          font-weight: 600;

          cursor: pointer;

          transition: .2s ease;
        }

        .preview:hover {
          background:
            rgba(255,106,26,.15);

          box-shadow:
            0 0 20px
            rgba(255,106,26,.13);
        }

        .circle-btn {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background:
            rgba(255,255,255,.025);

          border:
            1px solid rgba(255,255,255,.07);

          color:
            rgba(255,255,255,.45);

          cursor: pointer;

          transition: .2s ease;
        }

        .circle-btn:hover {
          color: #ff8a4c;
          border-color:
            rgba(255,106,26,.3);
        }

        .mobile-menu {
          display: none;
        }

        /* =====================================================
           CONTENT
        ===================================================== */

        .content {
          padding:
            27px 22px 35px;

          max-width: 1510px;
          margin: 0 auto;
        }

        .welcome {
          margin-bottom: 19px;
        }

        .welcome h1 {
          font-family:
            'Space Grotesk',
            sans-serif;

          margin: 0 0 5px;

          font-size: 22px;

          letter-spacing: -.6px;
        }

        .welcome p {
          margin: 0;

          color:
            rgba(255,255,255,.43);

          font-size: 12px;
        }

        /* =====================================================
           STATS
        ===================================================== */

        .stats-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 10px;

          margin-bottom: 19px;
        }

        .stat-card {
          min-height: 107px;

          border:
            1px solid rgba(255,255,255,.08);

          border-radius: 19px;

          padding: 19px;

          background:
            rgba(7,7,7,.78);

          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            transform .2s ease;
        }

        .stat-card:hover {
          transform: translateY(-1px);

          border-color:
            rgba(255,106,26,.22);

          box-shadow:
            0 12px 40px
            rgba(0,0,0,.25),
            0 0 25px
            rgba(255,106,26,.035);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 22px;

          color:
            rgba(255,255,255,.43);

          font-size: 11px;
        }

        .stat-value {
          font-family:
            'Space Grotesk',
            sans-serif;

          font-size: 22px;

          font-weight: 600;

          letter-spacing: -.5px;
        }

        /* =====================================================
           ANALYTICS GRID
        ===================================================== */

        .analytics-grid {
          display: grid;

          grid-template-columns:
            minmax(0, 3fr)
            minmax(310px, 1.05fr);

          gap: 13px;

          margin-bottom: 19px;
        }

        .panel {
          background:
            rgba(7,7,7,.8);

          border:
            1px solid rgba(255,255,255,.075);

          border-radius: 18px;

          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          padding: 22px 22px 0;
        }

        .panel-header h2,
        .countries-header h2 {
          margin: 0 0 6px;

          font-size: 14px;
          font-weight: 600;
        }

        .panel-header p,
        .countries-header p {
          margin: 0;

          color:
            rgba(255,255,255,.38);

          font-size: 11px;
        }

        .views-panel {
          min-height: 410px;
        }

        .chart-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .select-control {
          height: 34px;

          display: flex;
          align-items: center;
          gap: 7px;

          padding: 0 11px;

          border-radius: 18px;

          background:
            rgba(255,255,255,.025);

          border:
            1px solid rgba(255,255,255,.08);

          color:
            rgba(255,255,255,.6);

          font-size: 10px;
        }

        .range-control {
          display: flex;

          padding: 3px;

          border-radius: 18px;

          background:
            rgba(255,255,255,.025);

          border:
            1px solid rgba(255,255,255,.07);
        }

        .range-control button {
          height: 28px;

          min-width: 31px;

          border: 0;

          border-radius: 14px;

          background: transparent;

          color:
            rgba(255,255,255,.4);

          font-size: 9px;

          cursor: pointer;
        }

        .range-control button.selected {
          color:
            #ff8a4c;

          background:
            rgba(255,106,26,.12);

          border:
            1px solid rgba(255,106,26,.3);
        }

        /* =====================================================
           CHART
        ===================================================== */

        .chart {
          height: 325px;

          margin:
            9px 20px 0;

          position: relative;
        }

        .chart-grid {
          position: absolute;
          inset:
            13px 0 31px 0;
        }

        .grid-line {
          position: absolute;

          left: 39px;
          right: 0;

          border-top:
            1px solid
            rgba(255,255,255,.045);
        }

        .grid-line span {
          position: absolute;

          left: -24px;
          top: -7px;

          color:
            rgba(255,255,255,.32);

          font-size: 9px;
        }

        .chart-svg {
          position: absolute;

          left: 39px;
          right: 0;

          bottom: 28px;

          width:
            calc(100% - 39px);

          height: 245px;
        }

        .chart-dates {
          position: absolute;

          left: 39px;
          right: 0;
          bottom: 2px;

          display: flex;

          justify-content: space-between;

          color:
            rgba(255,255,255,.35);

          font-size: 9px;
        }

        /* =====================================================
           DEVICES
        ===================================================== */

        .devices-panel {
          min-height: 410px;
        }

        .device-chart {
          height: 330px;

          display: flex;
          flex-direction: column;

          align-items: center;

          padding-top: 42px;
        }

        .donut {
          width: 126px;
          height: 126px;

          border-radius: 50%;

          background:
            conic-gradient(
              #f09b67 0deg 180deg,
              #ff75ae 180deg 360deg
            );

          display: grid;
          place-items: center;

          transform:
            rotate(-90deg);

          box-shadow:
            0 0 25px
            rgba(255,106,26,.07);
        }

        .donut-hole {
          width: 90px;
          height: 90px;

          border-radius: 50%;

          background:
            #0a0a0a;
        }

        .device-list {
          width: 75%;

          margin-top: 36px;
        }

        .device-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 7px 0;

          color:
            rgba(255,255,255,.43);

          font-size: 10px;
        }

        .device-row > div {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .device-row strong {
          color:
            rgba(255,255,255,.7);

          font-size: 10px;
          font-weight: 500;
        }

        .device-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .device-dot.desktop {
          background: #f09b67;
        }

        .device-dot.mobile {
          background: #ff75ae;
        }

        /* =====================================================
           COUNTRIES
        ===================================================== */

        .countries-panel {
          padding-bottom: 22px;
        }

        .countries-header {
          display: flex;

          justify-content: space-between;
          align-items: flex-start;

          padding:
            21px 22px 18px;
        }

        .globe-button {
          height: 34px;

          display: flex;
          align-items: center;
          gap: 8px;

          padding: 0 13px;

          border-radius: 18px;

          background:
            rgba(255,106,26,.06);

          border:
            1px solid rgba(255,106,26,.28);

          color:
            #ff8a4c;

          font-size: 10px;

          cursor: pointer;
        }

        .countries-grid {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 10px;

          padding:
            0 22px;
        }

        .country-card {
          min-height: 52px;

          position: relative;

          display: flex;
          align-items: center;

          padding: 0 12px;

          border-radius: 13px;

          background:
            rgba(255,255,255,.018);

          border:
            1px solid rgba(255,255,255,.065);

          overflow: hidden;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 9px;

          font-size: 11px;
        }

        .country-info strong {
          font-weight: 600;
        }

        .flag {
          width: 28px;
          height: 22px;

          display: grid;
          place-items: center;

          font-size: 21px;
        }

        .country-count {
          margin-left: auto;

          margin-right: 3px;

          color:
            rgba(255,255,255,.55);

          font-size: 10px;

          z-index: 2;
        }

        .country-progress {
          position: absolute;

          left: 52px;
          right: 60px;
          bottom: 6px;

          height: 3px;

          border-radius: 3px;

          background:
            rgba(255,255,255,.06);
        }

        .country-progress div {
          width: 50%;
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #ff6a1a,
              #ff9b5d
            );

          box-shadow:
            0 0 8px
            rgba(255,106,26,.2);
        }

        /* =====================================================
           MOBILE OVERLAY
        ===================================================== */

        .mobile-overlay {
          display: none;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1050px) {

          .sidebar {
            width: 215px;
          }

          .main-content {
            margin-left: 215px;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .devices-panel {
            min-height: 350px;
          }

          .device-chart {
            height: 280px;
          }

          .stats-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {

          .sidebar {
            transform:
              translateX(-100%);

            transition:
              transform .25s ease;

            box-shadow:
              20px 0 60px
              rgba(0,0,0,.6);
          }

          .sidebar.mobile-open {
            transform:
              translateX(0);
          }

          .mobile-overlay {
            display: block;

            position: fixed;
            inset: 0;

            background:
              rgba(0,0,0,.55);

            backdrop-filter:
              blur(4px);

            z-index: 19;
          }

          .main-content {
            margin-left: 0;
          }

          .topbar {
            padding:
              0 14px;
          }

          .mobile-menu {
            width: 36px;
            height: 36px;

            display: grid;
            place-items: center;

            border-radius: 50%;

            border:
              1px solid rgba(255,255,255,.08);

            background:
              rgba(255,255,255,.025);

            color:
              rgba(255,255,255,.7);
          }

          .content {
            padding:
              22px 13px 30px;
          }

          .preview {
            display: none;
          }

          .circle-btn {
            display: none;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stat-card {
            min-height: 100px;
          }

          .panel-header {
            flex-direction: column;
            gap: 15px;
          }

          .chart-controls {
            width: 100%;
            justify-content: space-between;
          }

          .countries-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {

          .breadcrumbs span,
          .breadcrumbs b {
            display: none;
          }

          .breadcrumbs strong {
            font-size: 11px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 7px;
          }

          .stat-card {
            padding: 14px;
            border-radius: 15px;
          }

          .stat-top {
            margin-bottom: 17px;
          }

          .stat-value {
            font-size: 19px;
          }

          .views-panel,
          .devices-panel {
            min-height: 390px;
          }

          .chart {
            margin-left: 12px;
            margin-right: 12px;
          }

          .range-control button {
            min-width: 27px;
          }

          .select-control {
            padding: 0 8px;
          }

          .countries-header {
            gap: 15px;
          }

          .globe-button {
            white-space: nowrap;
          }
        }

      `}</style>
    </main>
  )
}
