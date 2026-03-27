import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nztclwdpnfttstnfrnde.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ev5ZJUP9doNPJTUlKY0Ceg_T8WNtXY0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
