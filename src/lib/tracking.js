import { supabase } from './supabase'

export async function trackDocView({ docId, docTitle, viewerEmail, isProspect }) {
  await supabase.from('dataroom_doc_views').insert({
    doc_id: docId,
    doc_title: docTitle,
    viewer_email: viewerEmail || null,
    is_prospect: isProspect || false,
  })
}

export async function trackDocClose({ docId, viewerEmail, durationSeconds }) {
  // Update la dernière vue de ce doc par cet email
  await supabase
    .from('dataroom_doc_views')
    .update({ duration_seconds: durationSeconds })
    .eq('doc_id', docId)
    .eq('viewer_email', viewerEmail || '')
    .order('viewed_at', { ascending: false })
    .limit(1)
}
