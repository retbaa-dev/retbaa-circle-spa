// src/components/ErrorBoundary.jsx — Retbaa Circle
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props
      if (fallback) return fallback

      return (
        <div style={{
          padding: '32px 24px',
          textAlign: 'center',
          background: 'rgba(239,68,68,0.04)',
          border: '1px solid rgba(239,68,68,0.12)',
          borderRadius: '12px',
          margin: '16px 0',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#EF4444', marginBottom: '12px', display: 'block' }}>
            error_outline
          </span>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A3A6B', marginBottom: '6px' }}>
            Une erreur est survenue
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>
            Ce bloc n'a pas pu se charger. Rechargez la page ou contactez l'équipe si le problème persiste.
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 20px',
              background: '#1A3A6B',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
