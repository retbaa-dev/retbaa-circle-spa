// components/DocumentCard.jsx
import { useTranslation } from 'react-i18next'
import { FileText, Download, PenLine, Upload, CheckCircle, Clock } from 'lucide-react'

const statusConfig = {
  sign: { label: 'À signer', color: '#1A3A6B', bg: 'rgba(26,58,107,0.08)', icon: <PenLine size={11} /> },
  pending: { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: <Clock size={11} /> },
  validated: { label: 'Validé', color: '#10B981', bg: 'rgba(16,185,129,0.08)', icon: <CheckCircle size={11} /> },
  upload: { label: 'À fournir', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', icon: <Upload size={11} /> },
}

export default function DocumentCard({ title, type, date, status = 'validated', onAction }) {
  const { t } = useTranslation()
  const cfg = statusConfig[status]

  return (
    <div
      className="bg-white flex items-center justify-between px-5 py-4 transition-all duration-150 hover:shadow-sm"
      style={{ border: '1px solid #e8e8e4', borderLeft: `3px solid ${cfg.color}` }}
    >
      <div className="flex items-center gap-4">
        <div style={{ color: '#1A3A6B', opacity: 0.5 }}>
          <FileText size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#111', fontFamily: 'DM Sans, sans-serif' }}>
            {title}
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'DM Sans, sans-serif', marginTop: '2px' }}>
            {type} · {date}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Badge statut */}
        <span
          className="flex items-center gap-1 px-2 py-1 rounded-sm uppercase tracking-wider"
          style={{
            fontSize: '9px',
            color: cfg.color,
            backgroundColor: cfg.bg,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
          }}
        >
          {cfg.icon} {cfg.label}
        </span>

        {/* Action */}
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider transition-all duration-150"
          style={{
            fontSize: '10px',
            fontFamily: 'DM Sans, sans-serif',
            color: status === 'sign' ? '#fff' : '#1A3A6B',
            backgroundColor: status === 'sign' ? '#1A3A6B' : 'transparent',
            border: `1px solid ${status === 'sign' ? '#1A3A6B' : '#e8e8e4'}`,
            letterSpacing: '1px',
          }}
        >
          {status === 'sign' && <PenLine size={11} />}
          {status === 'validated' && <Download size={11} />}
          {status === 'upload' && <Upload size={11} />}
          {status === 'sign' ? t('dashboard.sign') : status === 'upload' ? t('dashboard.upload') : t('dashboard.download')}
        </button>
      </div>
    </div>
  )
}
