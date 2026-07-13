import React, { useState, useEffect } from 'react'
import { supabase } from '../api/supabaseClient'

export default function InsightsPage() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError(null)

      // Schéma réel de la table insights :
      //   id uuid, slug text, tag text, title text, subtitle text,
      //   status text ('published'|'draft'), published_at timestamptz,
      //   date text, author text, source text, source_url text,
      //   summary text, img text, content_md text, featured boolean,
      //   category text, created_at timestamptz
      const { data, error } = await supabase
        .from('insights')
        .select('id, slug, tag, title, subtitle, date, author, source, source_url, summary, img, content_md, featured, category, status, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) {
        throw error
      }

      const mapped = data.map(a => ({
        id: a.slug || a.id,
        tag: a.tag || a.category || 'Veille Marché',
        title: a.title,
        subtitle: a.subtitle || '',
        date: a.date || (a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''),
        author: a.author || 'Kemia',
        source: a.source || '',
        sourceUrl: a.source_url || null,
        summary: a.summary || '',
        img: a.img || null,
        content: a.content_md || '',
        category: a.category || a.tag || 'Veille Marché',
        featured: a.featured || false,
      }))

      setInsights(mapped)
    } catch (err) {
      console.error('Erreur lors du chargement des insights:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div className="insights-container">
      <h1>Insights</h1>
      <div className="insights-grid">
        {insights.map(insight => (
          <div key={insight.id} className="insight-card">
            <h2>{insight.title}</h2>
            <p>{insight.subtitle}</p>
            <p>{insight.date}</p>
            <p>{insight.source}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
