// utils/tracker.js — Retbaa Circle Analytics
const ENDPOINT = '/api/track'

export function track(investor, page, extra = {}) {
  try {
    const payload = {
      investor,
      page,
      type: 'pageview',
      ua: navigator.userAgent,
      ...extra,
    }
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {}) // silencieux
  } catch {}
}

export function trackPodcast(investor, episode) {
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investor, type: 'podcast_play', episode, page: 'podcast' }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}
