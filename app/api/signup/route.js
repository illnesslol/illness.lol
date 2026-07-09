import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

// usernames nobody is allowed to claim
const RESERVED_USERNAMES = [
  'login', 'signup', 'logout', 'dashboard', 'admin', 'api',
  'terms', 'tos', 'privacy', 'pricing', 'settings', 'support', 'help',
  'about', 'contact', 'blog', 'home', 'index', 'www', 'app',
  'staff', 'root', 'system', 'null', 'undefined',
  'illness', 'me', 'you', 'user', 'users', 'account', 'accounts',
  'billing', 'checkout', 'store', 'shop', 'assets', 'static', 'public',
]

// 3+ chars, letters/numbers/underscores only
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,}$/

export async function POST(request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const cleanUsername = username.toLowerCase().trim()

    if (!USERNAME_REGEX.test(cleanUsername)) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters and can only contain letters, numbers, and underscores' },
        { status: 400 }
      )
    }

    if (RESERVED_USERNAMES.includes(cleanUsername)) {
      return NextResponse.json({ error: 'That username is reserved' }, { status: 409 })
    }

    // grab the visitor's IP from request headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

    // hash the password — never store it in plain text
    const passwordHash = await bcrypt.hash(password, 10)

    // default config every new user gets before they customize anything
    const defaultConfig = {
      displayName: cleanUsername,
      username: cleanUsername,
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
      socials: [],
      views: 0,
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        username: cleanUsername,
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        ip_address: ip,
        config: defaultConfig,
        views: 0,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
      }
      console.error(error)
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }

    return NextResponse.json({ success: true, username: data.username })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}