'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActive] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0
      setReadingProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = links.map((l) => l.href.replace('#', ''))
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })

    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return
    const navHeight = 72
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
    setMenuOpen(false)
  }

  const navBg = scrolled ? 'rgba(8,11,18,0.88)' : 'transparent'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          zIndex: 1000,
          background: navBg,
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(232,160,32,0.08)'
            : '1px solid transparent',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: 'var(--gold)',
            letterSpacing: '-0.04em',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          MA
        </button>

        <div
          style={{
            display: isMobile ? 'none' : 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          {links.map(({ label, href }) => {
            const isActive = activeSection === href.replace('#', '')
            return (
              <MagneticButton
                key={href}
                onClick={() => scrollTo(href)}
                strength={0.16}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--t1)' : 'var(--t3)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '0.4rem 0.75rem',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--t1)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--t3)'
                }}
              >
                {label}
                {isActive && (
                  <span
                    style={{
                      display: 'block',
                      width: '4px',
                      height: '4px',
                      borderRadius: '999px',
                      background: 'var(--gold)',
                      margin: '3px auto 0',
                    }}
                  />
                )}
              </MagneticButton>
            )
          })}
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: isMobile ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--t2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--t1)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--t2)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <Menu size={24} />
        </button>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            width: `${readingProgress}%`,
            background: 'linear-gradient(to right, var(--gold-dim), var(--gold))',
            transition: 'width 0.1s linear',
          }}
        />
      </nav>

      {menuOpen && isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8,11,18,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 998,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--t2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--t1)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--t2)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            <X size={24} />
          </button>

          {links.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--t1)',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                cursor: 'pointer',
                transition: 'color 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gold)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--t1)'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}