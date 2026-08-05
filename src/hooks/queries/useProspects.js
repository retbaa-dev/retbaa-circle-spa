// hooks/queries/useProspects.js — fetch prospects dataroom depuis Supabase
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const fetchProspects = async () => {
  const { data, error } = await supabase
    .from('dataroom_prospects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export function useProspects() {
  return useQuery({
    queryKey: ['prospects'],
    queryFn: fetchProspects,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook filtré — prospects en attente uniquement (pour AdminPage)
const fetchPendingProspects = async () => {
  const { data, error } = await supabase
    .from('dataroom_prospects')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export function usePendingProspects() {
  return useQuery({
    queryKey: ['prospects', 'pending'],
    queryFn: fetchPendingProspects,
    staleTime: 60 * 1000, // 1 min — on veut voir les nouvelles demandes vite
  })
}
