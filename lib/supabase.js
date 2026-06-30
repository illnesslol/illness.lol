import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// server-only client — uses the service role key, bypasses RLS
// NEVER import this file in a client component
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)