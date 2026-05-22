// utils/tracker.js — Retbaa Circle Analytics
// Remplace fetch /api/track par supabase.from('page_views').insert()
import { supabase } from '../lib/supabase'

export function track(investor, page, extra = {}) {
  try {
    supabase
      .from('page_views')
      .insert({
        investor,
        page,
        type: 'pageview',
        ua: navigator.userAgent,
        ...extra,
      })
      .then(() => {})
  } catch {
    // silencieux — le tracking ne doit jamais bloquer l'UX
  }
}

// Pour les podcasts : on stocke l'épisode dans `page` (format "episode_title")
// avec type = 'podcast_play' — récupérable dans AnalyticsPage via filtrage sur type
export function trackPodcast(investor, episode) {
  try {
    supabase
      .from('page_views')
      .insert({
        investor,
        page: episode,          // nom de l'épisode
        type: 'podcast_play',
        ua: navigator.userAgent,
      })
      .then(() => {})
  } catch {
    // silencieux
  }
}
