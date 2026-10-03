'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase-client'

export const LINK_LIMIT = 10

const EMPTY = {
  views: 0,
  clicks: 0,
  visitors: 0,
  activeLinks: 0,
  prev: { views: 0, clicks: 0, visitors: 0 },
  daily: [],
}

export const fmt = (n) => Number(n || 0).toLocaleString()

export function trend(cur, prev) {
  if (!prev) return cur > 0 ? '↗ New' : '— 0%'
  const pct = ((cur - prev) / prev) * 100
  return `${pct >= 0 ? '↗' : '↘'} ${Math.abs(pct).toFixed(1)}%`
}

function smoothPath(values, w, h, max) {
  const n = values.length
  if (n < 2) return `M0 ${h} L${w} ${h}`
  const pts = values.map((v, i) => [(i * w) / (n - 1), h - (v / max) * h])
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < n; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`
  }
  return d
}

export function useDashboardData(days = 7) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [profilePublic, setPublic] = useState(true)
  const [greeting, setGreeting] = useState('Welcome')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening')
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (cancelled) return

      if (!user) {
        window.location.replace('/login')
        return
      }

      setUser(user)

      const [p, s] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.rpc('dashboard_stats', { days }),
      ])

      if (cancelled) return

      if (p.error) console.error('Profile load failed:', p.error)
      if (p.data) {
        setProfile(p.data)
        setPublic(p.data.is_public !== false)
      }

      if (s.error) {
        console.error('Stats load failed:', s.error)
      } else if (s.data) {
        const d = s.data
        setStats({
          views: d.views,
          clicks: d.clicks,
          visitors: d.visitors,
          activeLinks: d.active_links,
          prev: {
            views: d.prev_views,
            clicks: d.prev_clicks,
            visitors: d.prev_visitors,
          },
          daily: d.daily || [],
        })
      }

      setLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [days])

  // Accepts a value or an updater function, like a normal useState setter
  async function setProfilePublic(next) {
    const value = typeof next === 'function' ? next(profilePublic) : next
    setPublic(value)

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ is_public: value })
      .eq('id', user.id)

    if (error) {
      console.error('Could not update visibility:', error)
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
    initial: (username[0] || '?').toUpperCase(),
    bio: profile?.bio,
    greeting,
    stats,
    profilePublic,
    setProfilePublic,
  }
}

/* Small trend line inside a stat card */
export function Spark({ values, className = '' }) {
  const v = values.length > 1 ? values : [0, 0]

  return (
    <div className={`mini-chart ${className}`}>
      <svg viewBox="0 0 220 38" preserveAspectRatio="none">
        <path d={smoothPath(v, 220, 36, Math.max(...v, 1))} />
      </svg>
    </div>
  )
}

/* Big views + clicks chart. Uses the existing .activity-chart styles */
export function ActivityChart({ daily }) {
  const views = daily.map((d) => d.views)
  const clicks = daily.map((d) => d.clicks)
  const max = Math.max(...views, ...clicks, 0)
  const top = Math.max(5, Math.ceil(max / 5) * 5)

  const yLabels = [5, 4, 3, 2, 1, 0].map((i) => Math.round((top * i) / 5))
  const xLabels = daily.map((d) =>
    new Date(`${d.day}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
    })
  )

  const viewsLine = smoothPath(views.length > 1 ? views : [0, 0], 600, 190, top)
  const clicksLine = smoothPath(clicks.length > 1 ? clicks : [0, 0], 600, 190, top)

  return (
    <div className="activity-chart">
      <div className="y-labels">
        {yLabels.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </div>

      <div className="plot">
        <div className="grid-lines">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <svg
          viewBox="0 0 600 190"
          preserveAspectRatio="none"
          className="activity-svg"
        >
          <defs>
            <linearGradient id="areaOrange" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff7a2e" stopOpacity=".24" />
              <stop offset="100%" stopColor="#ff7a2e" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path className="area" d={`${viewsLine} L600 190 L0 190 Z`} />
          <path className="line-views" d={viewsLine} />
          <path className="line-clicks" d={clicksLine} />
        </svg>

        <div className="x-labels">
          {xLabels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}