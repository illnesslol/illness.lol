import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const cookieStore = await cookies()
  const sessionUser = cookieStore.get('session_user')

  if (!sessionUser) {
    return NextResponse.json({ loggedIn: false })
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('username, config, views')
    .eq('username', sessionUser.value)
    .single()

  if (error || !user) {
    return NextResponse.json({ loggedIn: false })
  }

  return NextResponse.json({
    loggedIn: true,
    username: user.username,
    config: user.config,
    views: user.views,
  })
}