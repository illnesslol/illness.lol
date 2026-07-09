import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export default async function PublicProfilePage({ params }) {
  const { username } = await params

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('username, config, views')
    .eq('username', username.toLowerCase())
    .single()

  if (error || !user) {
    notFound()
  }

  // increment view count (fire and forget, don't block the page)
  supabaseAdmin
    .from('users')
    .update({ views: (user.views || 0) + 1 })
    .eq('username', user.username)
    .then(() => {})

  const cfg = user.config || {}
  const accent = cfg.accent || '#8b5cf6'
  const accent2 = cfg.accent2 || '#3b82f6'
  const bgColor = cfg.bgColor || '#06060f'
  const pageBg = cfg.gradientBg
    ? `radial-gradient(120% 90% at 50% 0%, ${accent}22, transparent 60%), ${bgColor}`
    : bgColor

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBg,
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        borderRadius: '18px',
        padding: '32px 24px',
        textAlign: 'center',
        background: `rgba(12,12,22,${(cfg.cardOpacity ?? 82) / 100})`,
        backdropFilter: `blur(${cfg.blur ?? 16}px)`,
        border: '0.5px solid rgba(255,255,255,0.12)',
        boxShadow: cfg.glow ? `0 0 60px ${accent}44` : '0 20px 50px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '76px', height: '76px', borderRadius: '50%', margin: '0 auto 14px',
          background: cfg.avatar ? `center/cover url(${cfg.avatar})` : `linear-gradient(135deg, ${accent}, ${accent2})`,
          border: `2px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 700,
        }}>
          {!cfg.avatar && (cfg.displayName?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase())}
        </div>

        <div style={{ fontSize: '18px', fontWeight: 700 }}>{cfg.displayName || user.username}</div>
        {cfg.location && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>📍 {cfg.location}</div>}
        <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', lineHeight: 1.5 }}>
          {cfg.bio || ''}
        </div>

        {cfg.socials && cfg.socials.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cfg.socials.filter(s => s.url).map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                width: '30px', height: '30px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, textDecoration: 'none',
                background: cfg.monochromeIcons ? 'rgba(255,255,255,0.08)' : `${accent}33`,
                color: cfg.monochromeIcons ? 'rgba(255,255,255,0.8)' : accent,
                border: '0.5px solid rgba(255,255,255,0.12)',
              }}>
                {s.type.charAt(0)}
              </a>
            ))}
          </div>
        )}

        <div style={{ marginTop: '18px', fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
          {(user.views || 0).toLocaleString()} views
        </div>
      </div>
    </div>
  )
}