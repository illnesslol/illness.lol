import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(request) {
  const cookieStore = await cookies()
  const sessionUser = cookieStore.get('session_user')

  if (!sessionUser) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const body = await request.json()

  const { error } = await supabaseAdmin
    .from('users')
    .update({ config: body })
    .eq('username', sessionUser.value)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}