import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // grab the visitor's IP from request headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

    // hash the password — never store it in plain text
    const passwordHash = await bcrypt.hash(password, 10)

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        username: username.toLowerCase(),
        email,
        password_hash: passwordHash,
        ip_address: ip,
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