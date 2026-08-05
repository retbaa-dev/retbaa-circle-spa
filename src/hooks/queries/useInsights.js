// hooks/queries/useInsights.js — fetch articles Insights depuis Supabase
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

const fetchInsights = async () => {
  const { data, error } = await supabase
    .from('insights')
    .select('id, title, slug, content_type, tags, content_short, content_long, content_long_en, signal_retbaa, author, status, published_at, img, source_url, featured')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
    staleTime: 10 * 60 * 1000, // 10 min — articles changent peu souvent
  })
}
