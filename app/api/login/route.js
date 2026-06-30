import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // identifier can be username or email
    const isEmail = identifier.includes('@')
    const column = isEmail ? 'email' : 'username'
    const value = isEmail ? identifier.toLowerCase() : identifier.toLowerCase()

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, username, email, password_hash')
      .eq(column, value)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid username/email or password' }, { status: 401 })
    }

    // set a simple session cookie with the username
    const response = NextResponse.json({ success: true, username: user.username })
    response.cookies.set('session_user', user.username, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}