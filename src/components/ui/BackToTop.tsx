'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        background: 'var(--surface-2)',
        border: '1px solid var(--b-gold)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.background = 'rgba(212,160,39,0.1)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,160,39,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = visible ? 'translateY(0)' : 'translateY(12px)'
        e.currentTarget.style.background = 'var(--surface-2)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      <ArrowUp size={17} color="var(--gold)" />
    </button>
  )
}
