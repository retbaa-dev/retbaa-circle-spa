// pages/LoginPage.jsx — Retbaa Circle
// Délègue l'auth à auth.retbaa.com (Retbaa OS — One Brain)

export default function LoginPage() {
  const redirectUrl = encodeURIComponent('https://circle.retbaa.com')
  
  // Redirect immédiat vers le service auth centralisé
  if (typeof window !== 'undefined') {
    window.location.href = `https://auth.retbaa.com/login?redirect=https://circle.retbaa.com`
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F9F9F9', fontFamily: 'Manrope, sans-serif',
    }}>
      <p style={{
        fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontSize: '18px', color: '#1A3A6B', opacity: 0.5,
      }}>
        Redirection…
      </p>
    </div>
  )
}
