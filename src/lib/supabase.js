// src/lib/supabase.js — Retbaa Circle
import { createClient } from '@supabase/supabase-js'

// Les variables VITE_* sont injectées au build time par Vercel.
// Fallback hardcodé car Vercel marque ces vars "decrypted: false"
// et ne les injecte pas dans le bundle Vite.
// La clé anon est publique par nature (sécurité assurée par RLS Supabase).
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://lufozqtrwrmowzojxcoi.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTcwNjMsImV4cCI6MjA5Mjg3MzA2M30._-jdklZKN7xAc4M9A55A5qqyVml5gkXU3URe_EyM9k4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
