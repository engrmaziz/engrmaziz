'use client'

import { Github } from 'lucide-react'
import { personalInfo } from '@/lib/data'

const links = ['About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact']

export default function Footer() {
  const scrollToSection = (section: string) => {
    const el = document.getElementById(section.toLowerCase())
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--b1)', padding: '2.5rem clamp(1.5rem,5vw,4rem)' }}>
      <style>{`
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          max-width: 1180px;
          margin: 0 auto;
          padding: 2rem clamp(1.5rem,5vw,4rem);
        }
        .footer-nav {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .footer-copy {
          font-size: 0.78rem;
          color: var(--t3);
        }
        @media (max-width: 640px) {
          .footer-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .footer-nav {
            justify-content: center;
          }
          .footer-copy {
            text-align: center;
          }
        }
      `}</style>
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em' }}>MA</span>
          <span style={{ color: 'var(--t3)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>· Musharraf Aziz</span>
        </div>

        <div className="footer-nav">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              style={{ fontSize: '0.78rem', color: 'var(--t3)', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--t1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--t3)'
              }}
            >
              {link}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="footer-copy">© 2025</span>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--t3)', display: 'inline-flex', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--t1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--t3)'
            }}
          >
            <Github size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
