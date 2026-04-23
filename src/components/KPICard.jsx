// components/KPICard.jsx
export default function KPICard({ label, value, sub, accent = false, icon }) {
  return (
    <div
      className="bg-white p-6 relative overflow-hidden"
      style={{
        border: '1px solid #e8e8e4',
        borderTop: accent ? '3px solid #1A3A6B' : '1px solid #e8e8e4',
      }}
    >
      {icon && (
        <div className="mb-3" style={{ color: '#1A3A6B', opacity: 0.4 }}>
          {icon}
        </div>
      )}
      <div
        className="font-serif font-light mb-1"
        style={{ fontSize: '38px', color: '#1A3A6B', lineHeight: 1 }}
      >
        {value}
      </div>
      <div
        className="uppercase tracking-widest mb-2"
        style={{ fontSize: '9px', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>
          {sub}
        </div>
      )}
      {/* Liseré rose décoratif */}
      <div
        style={{
          width: '28px', height: '2px',
          background: '#EFC0D4',
          marginTop: '16px'
        }}
      />
    </div>
  )
}
