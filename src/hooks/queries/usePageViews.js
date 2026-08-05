// hooks/queries/usePageViews.js — fetch analytics page_views depuis Supabase
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const fetchPageViews = async () => {
  const { data, error } = await supabase
    .from('page_views')
    .select('investor, page, type, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export function usePageViews() {
  return useQuery({
    queryKey: ['page_views'],
    queryFn: fetchPageViews,
    staleTime: 2 * 60 * 1000, // 2 min — données plus fraîches pour analytics
  })
}
