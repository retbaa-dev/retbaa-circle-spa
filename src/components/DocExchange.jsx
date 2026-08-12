import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lufozqtrwrmowzojxcoi.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1Zm96cXRyd3Jtb3d6b2p4Y29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTcwNjMsImV4cCI6MjA5Mjg3MzA2M30._-jdklZKN7xAc4M9A55A5qqyVml5gkXU3URe_EyM9k4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ─── Styles ─── */
const styles = {
  container: {
    background: '#FAF7F2',
    fontFamily: "'Inter', sans-serif",
    color: '#1a2744',
    padding: '0',
  },
  section: {
    marginBottom: '2.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1a2744',
    borderBottom: '2px solid #C9A84C',
    paddingBottom: '0.4rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.88rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.5rem 0.75rem',
    background: '#1a2744',
    color: '#C9A84C',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '0.55rem 0.75rem',
    borderBottom: '1px solid #e8e0d0',
    verticalAlign: 'middle',
  },
  trHover: {
    background: '#f3ede4',
  },
  btnGold: {
    background: '#C9A84C',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.35rem 0.85rem',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background 0.2s',
    whiteSpace: 'nowrap',
  },
  btnNavy: {
    background: '#1a2744',
    color: '#C9A84C',
    border: 'none',
    borderRadius: '5px',
    padding: '0.4rem 1rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background 0.2s',
  },
  btnOutline: {
    background: 'transparent',
    color: '#1a2744',
    border: '1.5px solid #1a2744',
    borderRadius: '5px',
    padding: '0.35rem 0.85rem',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
  badge: (read) => ({
    display: 'inline-block',
    padding: '0.2rem 0.55rem',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: read ? '#e8f5e9' : '#fff3cd',
    color: read ? '#2e7d32' : '#856404',
    border: `1px solid ${read ? '#a5d6a7' : '#ffc107'}`,
  }),
  form: {
    background: '#fff',
    border: '1px solid #e8e0d0',
    borderRadius: '8px',
    padding: '1.25rem',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d0c8b8',
    borderRadius: '5px',
    fontSize: '0.88rem',
    background: '#FAF7F2',
    color: '#1a2744',
    width: '100%',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#555',
    marginBottom: '0.2rem',
    display: 'block',
  },
  row: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  emptyMsg: {
    color: '#999',
    fontSize: '0.85rem',
    padding: '1rem 0',
    textAlign: 'center',
  },
  errorMsg: {
    background: '#fdecea',
    color: '#b71c1c',
    padding: '0.5rem 0.75rem',
    borderRadius: '5px',
    fontSize: '0.83rem',
  },
};

/* ─── Helpers ─── */
function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/* ─── Upload to Supabase Storage ─── */
async function uploadToStorage(file) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('partner-docs')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from('partner-docs')
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}

/* ═══════════════════════════════════════
   DocExchange — Composant principal
═══════════════════════════════════════ */
export default function DocExchange({ partnerEmail, institutionName, isAdmin = false }) {
  const [retbaaDocs, setRetbaaDocs] = useState([]);
  const [partnerDocs, setPartnerDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin send form
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendForm, setSendForm] = useState({ file_name: '', description: '', file_url: '' });
  const [sendFile, setSendFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  // Partner share form
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareForm, setShareForm] = useState({ file_name: '', description: '', file_url: '' });
  const [shareFile, setShareFile] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState(null);

  const sendFileRef = useRef();
  const shareFileRef = useRef();

  /* ── Fetch ── */
  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: rDocs, error: e1 } = await supabase
        .from('partner_documents')
        .select('*')
        .eq('partner_email', partnerEmail)
        .eq('direction', 'retbaa_to_partner')
        .order('created_at', { ascending: false });
      if (e1) throw e1;

      const { data: pDocs, error: e2 } = await supabase
        .from('partner_documents')
        .select('*')
        .eq('partner_email', partnerEmail)
        .eq('direction', 'partner_to_retbaa')
        .order('created_at', { ascending: false });
      if (e2) throw e2;

      setRetbaaDocs(rDocs || []);
      setPartnerDocs(pDocs || []);
    } catch (err) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partnerEmail) fetchDocs();
  }, [partnerEmail]);

  /* ── Mark downloaded ── */
  const markDownloaded = async (id) => {
    await supabase
      .from('partner_documents')
      .update({ downloaded_at: new Date().toISOString() })
      .eq('id', id);
  };

  /* ── Admin: send doc ── */
  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError(null);
    try {
      let fileUrl = sendForm.file_url;
      let fileName = sendForm.file_name;
      let fileSize = null;
      let mimeType = null;

      if (sendFile) {
        fileUrl = await uploadToStorage(sendFile);
        fileName = fileName || sendFile.name;
        fileSize = sendFile.size;
        mimeType = sendFile.type;
      }

      if (!fileUrl) throw new Error('Veuillez fournir un fichier ou une URL.');
      if (!fileName) throw new Error('Le nom du fichier est requis.');

      const { error } = await supabase.from('partner_documents').insert({
        partner_email: partnerEmail,
        institution_name: institutionName,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        mime_type: mimeType,
        direction: 'retbaa_to_partner',
        description: sendForm.description,
        uploaded_by: 'retbaa-admin',
      });
      if (error) throw error;

      setSendForm({ file_name: '', description: '', file_url: '' });
      setSendFile(null);
      if (sendFileRef.current) sendFileRef.current.value = '';
      setShowSendForm(false);
      fetchDocs();
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  };

  /* ── Partner: share doc ── */
  const handleShare = async (e) => {
    e.preventDefault();
    setSharing(true);
    setShareError(null);
    try {
      let fileUrl = shareForm.file_url;
      let fileName = shareForm.file_name;
      let fileSize = null;
      let mimeType = null;

      if (shareFile) {
        fileUrl = await uploadToStorage(shareFile);
        fileName = fileName || shareFile.name;
        fileSize = shareFile.size;
        mimeType = shareFile.type;
      }

      if (!fileUrl) throw new Error('Veuillez fournir un fichier ou une URL.');
      if (!fileName) throw new Error('Le nom du document est requis.');

      const { error } = await supabase.from('partner_documents').insert({
        partner_email: partnerEmail,
        institution_name: institutionName,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        mime_type: mimeType,
        direction: 'partner_to_retbaa',
        description: shareForm.description,
        uploaded_by: partnerEmail,
      });
      if (error) throw error;

      setShareForm({ file_name: '', description: '', file_url: '' });
      setShareFile(null);
      if (shareFileRef.current) shareFileRef.current.value = '';
      setShowShareForm(false);
      fetchDocs();
    } catch (err) {
      setShareError(err.message);
    } finally {
      setSharing(false);
    }
  };

  /* ── Render ── */
  if (loading) {
    return (
      <div style={{ ...styles.container, padding: '2rem', textAlign: 'center', color: '#999' }}>
        Chargement des documents…
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {error && <div style={styles.errorMsg}>⚠ {error}</div>}

      {/* ═══ SECTION 1 — Retbaa → Partenaire ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>📂</span> Documents Retbaa pour vous
          {isAdmin && (
            <button
              style={{ ...styles.btnNavy, marginLeft: 'auto', fontSize: '0.8rem' }}
              onClick={() => setShowSendForm((v) => !v)}
            >
              {showSendForm ? '✕ Annuler' : '+ Envoyer un document'}
            </button>
          )}
        </div>

        {/* Admin send form */}
        {isAdmin && showSendForm && (
          <form style={styles.form} onSubmit={handleSend}>
            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Nom du fichier *</label>
                <input
                  style={styles.input}
                  value={sendForm.file_name}
                  onChange={(e) => setSendForm((f) => ({ ...f, file_name: e.target.value }))}
                  placeholder="Ex : Rapport Q2 2026.pdf"
                />
              </div>
            </div>
            <div>
              <label style={styles.label}>Description</label>
              <input
                style={styles.input}
                value={sendForm.description}
                onChange={(e) => setSendForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Courte description du document"
              />
            </div>
            <div>
              <label style={styles.label}>Fichier (upload)</label>
              <input
                ref={sendFileRef}
                type="file"
                style={styles.input}
                onChange={(e) => setSendFile(e.target.files[0] || null)}
              />
            </div>
            <div>
              <label style={styles.label}>— ou — URL externe</label>
              <input
                style={styles.input}
                value={sendForm.file_url}
                onChange={(e) => setSendForm((f) => ({ ...f, file_url: e.target.value }))}
                placeholder="https://..."
                disabled={!!sendFile}
              />
            </div>
            {sendError && <div style={styles.errorMsg}>{sendError}</div>}
            <div style={styles.row}>
              <button style={styles.btnGold} type="submit" disabled={sending}>
                {sending ? 'Envoi…' : '📤 Envoyer'}
              </button>
              <button
                style={styles.btnOutline}
                type="button"
                onClick={() => { setShowSendForm(false); setSendError(null); }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {retbaaDocs.length === 0 ? (
          <p style={styles.emptyMsg}>Aucun document disponible pour le moment.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom du fichier</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Taille</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {retbaaDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td style={styles.td}>📄 {doc.file_name}</td>
                    <td style={styles.td}>{doc.description || '—'}</td>
                    <td style={styles.td}>{fmtDate(doc.created_at)}</td>
                    <td style={styles.td}>{fmtSize(doc.file_size)}</td>
                    <td style={styles.td}>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none' }}
                        onClick={() => markDownloaded(doc.id)}
                      >
                        <button style={styles.btnGold}>Télécharger ↗</button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══ SECTION 2 — Partenaire → Retbaa ═══ */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>📤</span> Vos documents partagés
          <button
            style={{ ...styles.btnNavy, marginLeft: 'auto', fontSize: '0.8rem' }}
            onClick={() => setShowShareForm((v) => !v)}
          >
            {showShareForm ? '✕ Annuler' : '+ Partager un document'}
          </button>
        </div>

        {/* Share form */}
        {showShareForm && (
          <form style={styles.form} onSubmit={handleShare}>
            <div>
              <label style={styles.label}>Nom du document *</label>
              <input
                style={styles.input}
                value={shareForm.file_name}
                onChange={(e) => setShareForm((f) => ({ ...f, file_name: e.target.value }))}
                placeholder="Ex : Attestation fiscale 2025.pdf"
              />
            </div>
            <div>
              <label style={styles.label}>Description</label>
              <input
                style={styles.input}
                value={shareForm.description}
                onChange={(e) => setShareForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Courte description"
              />
            </div>
            <div>
              <label style={styles.label}>Fichier (upload)</label>
              <input
                ref={shareFileRef}
                type="file"
                style={styles.input}
                onChange={(e) => setShareFile(e.target.files[0] || null)}
              />
            </div>
            <div>
              <label style={styles.label}>— ou — URL externe</label>
              <input
                style={styles.input}
                value={shareForm.file_url}
                onChange={(e) => setShareForm((f) => ({ ...f, file_url: e.target.value }))}
                placeholder="https://..."
                disabled={!!shareFile}
              />
            </div>
            {shareError && <div style={styles.errorMsg}>{shareError}</div>}
            <div style={styles.row}>
              <button style={styles.btnGold} type="submit" disabled={sharing}>
                {sharing ? 'Envoi…' : '📎 Partager'}
              </button>
              <button
                style={styles.btnOutline}
                type="button"
                onClick={() => { setShowShareForm(false); setShareError(null); }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {partnerDocs.length === 0 ? (
          <p style={styles.emptyMsg}>Vous n'avez encore partagé aucun document.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom du fichier</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {partnerDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td style={styles.td}>
                      <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ color: '#1a2744', textDecoration: 'none' }}>
                        📎 {doc.file_name}
                      </a>
                    </td>
                    <td style={styles.td}>{doc.description || '—'}</td>
                    <td style={styles.td}>{fmtDate(doc.created_at)}</td>
                    <td style={styles.td}>
                      <span style={styles.badge(!!doc.downloaded_at)}>
                        {doc.downloaded_at ? '✓ Lu' : '● Non lu'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
