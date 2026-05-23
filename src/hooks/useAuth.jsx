// src/hooks/useAuth.js — Retbaa Circle
// Remplace @clerk/clerk-react — expose même API que Clerk pour compatibilité
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Mapping rôles Supabase → rôles Retbaa
// founder → founder (admin, accès total)
// ops     → active  (investisseur standard)
// partner → assistant (accès délégué)
// pending → pending (en attente de validation)
const ROLE_MAP = {
  founder: 'founder',
  ops: 'active',
  partner: 'assistant',
  pending: 'pending',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [circleAccess, setCircleAccess] = useState(true) // fail open par défaut

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, role, linked_to')
        .eq('id', userId)
        .single()
      if (!error && data) setProfile(data)
    } catch {
      // profil absent ou erreur réseau — pas bloquant
    } finally {
      setIsLoaded(true)
    }
  }

  const checkCircleAccess = async () => {
    try {
      const { data, error } = await supabase.rpc('has_app_access', { app_name: 'circle' })
      if (!error) setCircleAccess(!!data)
      // Si erreur réseau → fail open (circleAccess reste true)
    } catch {
      // Erreur réseau — fail open
    }
  }

  useEffect(() => {
    // Session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        checkCircleAccess()
      } else {
        setIsLoaded(true)
      }
    })

    // Écoute les changements d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
        checkCircleAccess()
      } else {
        setProfile(null)
        setCircleAccess(true)
        setIsLoaded(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Rôle mappé (founder / active / assistant / pending / no_access / null)
  const rawRole = profile?.role ? (ROLE_MAP[profile.role] ?? profile.role) : null
  // no_access : accès refusé par app_access — sauf founder (accès total)
  const role = (!circleAccess && rawRole !== 'founder') ? 'no_access' : rawRole

  const value = {
    user,           // user Supabase Auth (id, email, …)
    session,        // session Supabase (access_token, …)
    profile,        // ligne user_profiles (full_name, role, linked_to)
    isLoaded,
    isSignedIn: !!user,
    role,           // founder / active / assistant / pending / no_access / null
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
