// src/lib/supabase.js — Retbaa Circle
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lufozqtrwrmowzojxcoi.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTcwNjMsImV4cCI6MjA5Mjg3MzA2M30._-jdklZKN7xAc4M9A55A5qqyVml5gkXU3URe_EyM9k4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// cache-bust: 202607130917
