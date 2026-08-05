// hooks/queries/useDataroomDocs.js — fetch documents dataroom depuis Supabase
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const fetchDataroomDocs = async () => {
  const { data, error } = await supabase
    .from('dataroom_docs')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export function useDataroomDocs() {
  return useQuery({
    queryKey: ['dataroom_docs'],
    queryFn: fetchDataroomDocs,
    staleTime: 5 * 60 * 1000,
  })
}
