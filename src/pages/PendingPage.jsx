// pages/PendingPage.jsx — Écran d'attente après création de compte
import { useAuth } from '../hooks/useAuth'

export default function PendingPage() {
  const { signOut, profile } = useAuth()

  const S = {
    page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', fontFamily: 'Manrope, sans-serif', padding: '24px' },
    card: { width: '100%', maxWidth: '520px', backgroundColor: '#fff', padding: '56px 48px', boxShadow: '0 32px 80px rgba(26,58,107,0.1)', borderRadius: '4px', textAlign: 'center' },
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Logo */}
        <div style={{ fontFamily: 'Newsreader, serif', fontSize: '22px', fontWeight: 700, color: '#1A3A6B', fontStyle: 'italic', marginBottom: '32px' }}>
          Retbaa Circle
        </div>

        {/* Icône horloge */}
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239,192,212,0.15)', border: '2px solid #EFC0D4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <span className="material-symbols-outlined" style={{ color: '#EFC0D4', fontSize: '28px' }}>schedule</span>
        </div>

        <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: '26px', fontStyle: 'italic', fontWeight: 300, color: '#1A3A6B', marginBottom: '12px' }}>
          Compte créé avec succès
        </h2>

        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7, maxWidth: '360px', margin: '0 auto 28px' }}>
          Votre demande d'accès est en cours de traitement. Vous recevrez un email de confirmation dès que Massata Niang aura validé votre compte.
        </p>

        {/* Ref investisseur depuis profil Supabase */}
        {profile?.investor_ref && (
          <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(239,192,212,0.1)', border: '1px solid rgba(239,192,212,0.4)', borderRadius: '2px', marginBottom: '32px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1A3A6B', fontWeight: 700 }}>
              Réf. {profile.investor_ref}
            </span>
          </div>
        )}

        {/* Étapes */}
        <div style={{ textAlign: 'left', padding: '24px', backgroundColor: '#F9F9F9', borderRadius: '4px', marginBottom: '32px' }}>
          {[
            { icon: 'check_circle', label: 'Compte créé', done: true },
            { icon: 'schedule', label: 'Validation par Retbaa', done: false },
            { icon: 'lock_open', label: 'Accès à votre espace privé', done: false },
          ].map(({ icon, label, done }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: done ? '#10B981' : '#EFC0D4' }}>{icon}</span>
              <span style={{ fontSize: '12px', color: done ? '#1A3A6B' : '#9CA3AF', fontWeight: done ? 700 : 400 }}>{label}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '20px' }}>
          Une question ? Contactez <a href="mailto:massata@retbaa.com" style={{ color: '#EFC0D4', textDecoration: 'none' }}>massata@retbaa.com</a>
        </p>

        <button
          onClick={() => signOut()}
          style={{ background: 'none', border: '1px solid rgba(196,198,208,0.5)', padding: '10px 24px', fontSize: '10px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', cursor: 'pointer', borderRadius: '2px' }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
