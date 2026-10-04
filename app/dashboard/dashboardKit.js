'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase-client'

export const LINK_LIMIT = 10

const EMPTY = {
  views: 0,
  clicks: 0,
  visitors: 0,
  activeLinks: 0,
  prev: {
    views: 0,
    clicks: 0,
    visitors: 0,
  },
  daily: [],
}

export const fmt = (n) =>
  Number(n || 0).toLocaleString()

export function trend(cur, prev) {
  if (!prev) {
    return cur > 0 ? '↗ New' : '— 0%'
  }

  const pct = ((cur - prev) / prev) * 100

  return `${pct >= 0 ? '↗' : '↘'} ${Math.abs(pct).toFixed(1)}%`
}

/* -------------------------------------------------------
   SMOOTH SVG PATH
------------------------------------------------------- */

export function smoothPath(values, width, height, max) {
  const clean = values.map((v) => Number(v || 0))
  const n = clean.length

  if (n === 0) {
    return `M0 ${height} L${width} ${height}`
  }

  if (n === 1) {
    return `M0 ${height} L${width} ${height}`
  }

  const safeMax = Math.max(Number(max || 0), 1)

  const points = clean.map((value, index) => {
    const x = (index * width) / (n - 1)
    const y = height - (value / safeMax) * height

    return [x, y]
  })

  let path = `M${points[0][0]} ${points[0][1]}`

  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]

    const midpoint = (x0 + x1) / 2

    path += ` C${midpoint} ${y0} ${midpoint} ${y1} ${x1} ${y1}`
  }

  return path
}

/* -------------------------------------------------------
   DASHBOARD DATA
------------------------------------------------------- */

export function useDashboardData(days = 7) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(EMPTY)
  const [loading, setLoading] = useState(true)

  const [profilePublic, setPublic] = useState(true)

  const [greeting, setGreeting] = useState('Welcome')

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour < 12) {
      setGreeting('Good morning')
    } else if (hour < 18) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (!user) {
        window.location.replace('/login')
        return
      }

      setUser(user)

      const [profileResponse, statsResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),

        supabase.rpc('dashboard_stats', {
          days,
        }),
      ])

      if (cancelled) return

      if (profileResponse.error) {
        console.error(
          'Profile load failed:',
          profileResponse.error
        )
      }

      if (profileResponse.data) {
        setProfile(profileResponse.data)

        setPublic(
          profileResponse.data.is_public !== false
        )
      }

      if (statsResponse.error) {
        console.error(
          'Stats load failed:',
          statsResponse.error
        )
      } else if (statsResponse.data) {
        const data = statsResponse.data

        setStats({
          views: Number(data.views || 0),
          clicks: Number(data.clicks || 0),
          visitors: Number(data.visitors || 0),
          activeLinks: Number(data.active_links || 0),

          prev: {
            views: Number(data.prev_views || 0),
            clicks: Number(data.prev_clicks || 0),
            visitors: Number(data.prev_visitors || 0),
          },

          daily: Array.isArray(data.daily)
            ? data.daily
            : [],
        })
      }

      setLoading(false)
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [days])

  async function setProfilePublic(next) {
    const value =
      typeof next === 'function'
        ? next(profilePublic)
        : next

    setPublic(value)

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        is_public: value,
      })
      .eq('id', user.id)

    if (error) {
      console.error(
        'Could not update visibility:',
        error
      )

      setPublic(!value)
    }
  }

  const username =
    profile?.username ||
    user?.user_metadata?.username ||
    user?.email?.split('@')[0] ||
    (loading ? '…' : 'you')

  return {
    loading,

    username,

    initial: (username?.[0] || '?').toUpperCase(),

    bio: profile?.bio,

    greeting,

    stats,

    profilePublic,

    setProfilePublic,
  }
}

/* -------------------------------------------------------
   SPARKLINE
------------------------------------------------------- */

export function Spark({
  values = [],
  className = '',
}) {
  const safeValues =
    values.length > 1
      ? values
      : [0, 0]

  const max = Math.max(
    ...safeValues,
    1
  )

  const path = smoothPath(
    safeValues,
    220,
    38,
    max
  )

  return (
    <div
      className={`mini-chart ${className}`}
    >
      <svg
        viewBox="0 0 220 38"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </div>
  )
}

/* -------------------------------------------------------
   ACTIVITY CHART
------------------------------------------------------- */

export function ActivityChart({
  daily = [],
}) {
  const views = daily.map((item) =>
    Number(item.views || 0)
  )

  const clicks = daily.map((item) =>
    Number(item.clicks || 0)
  )

  const rawMax = Math.max(
    ...views,
    ...clicks,
    0
  )

  const top =
    rawMax <= 5
      ? 5
      : Math.ceil(rawMax / 5) * 5

  const yLabels = [
    top,
    Math.round(top * 0.8),
    Math.round(top * 0.6),
    Math.round(top * 0.4),
    Math.round(top * 0.2),
    0,
  ]

  const xLabels = daily.map((item) => {
    if (!item?.day) return ''

    const date = new Date(
      `${item.day}T00:00:00`
    )

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
      }
    )
  })

  const viewPath = smoothPath(
    views.length > 1
      ? views
      : [0, 0],
    700,
    220,
    top
  )

  const clickPath = smoothPath(
    clicks.length > 1
      ? clicks
      : [0, 0],
    700,
    220,
    top
  )

  const areaPath =
    `${viewPath} L700 220 L0 220 Z`

  return (
    <div className="activity-chart">
      <div className="y-labels">
        {yLabels.map((value, index) => (
          <span key={index}>
            {value}
          </span>
        ))}
      </div>

      <div className="plot">
        <div className="grid-lines">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <i key={index} />
          ))}
        </div>

        <svg
          viewBox="0 0 700 220"
          preserveAspectRatio="none"
          className="activity-svg"
          aria-label="Profile activity chart"
        >
          <defs>
            <linearGradient
              id="fallArea"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#d96b32"
                stopOpacity=".28"
              />

              <stop
                offset="55%"
                stopColor="#b64d24"
                stopOpacity=".08"
              />

              <stop
                offset="100%"
                stopColor="#8b3519"
                stopOpacity="0"
              />
            </linearGradient>

            <linearGradient
              id="fallLine"
              x1="0"
              x2="1"
            >
              <stop
                offset="0%"
                stopColor="#e17a3d"
              />

              <stop
                offset="100%"
                stopColor="#f0a35b"
              />
            </linearGradient>
          </defs>

          <path
            className="area"
            d={areaPath}
          />

          <path
            className="line-views"
            d={viewPath}
          />

          <path
            className="line-clicks"
            d={clickPath}
          />
        </svg>

        <div className="x-labels">
          {xLabels.map((label, index) => (
            <span key={index}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
