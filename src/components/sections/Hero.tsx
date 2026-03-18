'use client'

import { useEffect, useState } from 'react'
import { personalInfo } from '@/lib/data'
import { Github, Linkedin, ChevronDown, Download, ArrowRight } from 'lucide-react'

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing')

  useEffect(() => {
    const current = personalInfo.taglines[taglineIndex]
    let t: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (displayText.length < current.length) {
        t = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 75)
      } else {
        t = setTimeout(() => setPhase('waiting'), 2200)
      }
    } else if (phase === 'waiting') {
      t = setTimeout(() => setPhase('deleting'), 400)
    } else {
      if (displayText.length > 0) {
        t = setTimeout(() => setDisplayText((p) => p.slice(0, -1)), 35)
      } else {
        setTaglineIndex((i) => (i + 1) % personalInfo.taglines.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(t)
  }, [displayText, phase, taglineIndex])

  const scrollToAbout = () => {
    const el = document.getElementById('about')
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
  }

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/frames/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
          linear-gradient(
            to bottom,
            rgba(8,11,18,0.45) 0%,
            rgba(8,11,18,0.35) 40%,
            rgba(8,11,18,0.75) 75%,
            rgba(8,11,18,1)    100%
          )
        `,
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(8,11,18,0.6) 0%, transparent 50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '820px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.32rem 1rem',
            borderRadius: '999px',
            background: 'rgba(212,160,39,0.12)',
            border: '1px solid rgba(212,160,39,0.3)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '1.75rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--gold)',
              animation: 'pulse-dot 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          />
          Open to Remote Roles
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            color: '#FFFFFF',
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          {personalInfo.name}
        </h1>

        <div
          style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.65rem)',
            color: 'var(--gold)',
            fontWeight: 600,
            minHeight: '2.2rem',
            marginTop: '0.75rem',
            letterSpacing: '-0.01em',
          }}
        >
          {displayText}
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1em',
              background: 'var(--gold)',
              marginLeft: '2px',
              verticalAlign: 'middle',
              animation: 'blink 1s step-end infinite',
            }}
          />
        </div>

        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 'clamp(0.88rem, 1.8vw, 1rem)',
            marginTop: '1.25rem',
            maxWidth: '500px',
            lineHeight: 1.7,
          }}
        >
          {personalInfo.subtitle}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.875rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={scrollToAbout}
            style={{
              background: 'var(--gold)',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              padding: '0.85rem 2rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 24px rgba(212,160,39,0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold-hi)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,160,39,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--gold)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,160,39,0.4)'
            }}
          >
            Explore My Work <ArrowRight size={16} />
          </button>

          <a
            href={personalInfo.cvPath}
            download
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '0.85rem 2rem',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.13)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Download size={16} /> Download CV
          </a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
          {[
            { href: personalInfo.github, icon: <Github size={19} />, label: 'GitHub' },
            { href: personalInfo.linkedin, icon: <Linkedin size={19} />, label: 'LinkedIn' },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                color: 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s ease',
                display: 'flex',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gold)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.3rem',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          zIndex: 2,
        }}
      >
        <span>Scroll</span>
        <ChevronDown size={14} style={{ animation: 'bounce-scroll 2s infinite' }} />
      </div>

      <style>{`
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0; }
        }
        @keyframes bounce-scroll {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(5px); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.75); }
        }
      `}</style>
    </section>
  )
}