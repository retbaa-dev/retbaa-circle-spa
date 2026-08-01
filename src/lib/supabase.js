// src/lib/supabase.js — Retbaa Circle
import { createClient } from '@supabase/supabase-js'

// Les variables VITE_* sont injectées au build time par Vercel.
// Ne jamais laisser de clés en dur ici — configurer dans :
// Vercel → Settings → Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Retbaa Circle] Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes.\n' +
    'Configurez-les dans Vercel → Settings → Environment Variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
