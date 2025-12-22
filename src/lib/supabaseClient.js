import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('REACT_APP_SUPABASE_URL =>', supabaseUrl)
console.log(
  'REACT_APP_SUPABASE_ANON_KEY =>',
  supabaseAnonKey ? 'LOADED' : 'MISSING'
)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
