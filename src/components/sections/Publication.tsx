import { BookOpen, ExternalLink, Quote } from 'lucide-react'
import { publication } from '@/lib/data'
import TiltCard from '@/components/ui/TiltCard'
import RevealText from '@/components/ui/RevealText'
import MagneticButton from '@/components/ui/MagneticButton'

const renderAuthors = (authors: string) => {
  const target = 'Aziz M.'
  if (!authors.includes(target)) return authors
  const [before, after] = authors.split(target)

  return (
    <>
      {before}
      <span style={{ fontWeight: 700, color: '#94A3B8' }}>{target}</span>
      {after}
    </>
  )
}

export default function Publication() {
  return (
    <section
      id="publication"
      style={{
        padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
        maxWidth: '1180px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.6rem', textAlign: 'center' }}>
        <RevealText delay={30}><span>RESEARCH</span></RevealText>
      </div>
      <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#F8FAFC', lineHeight: 1.15, letterSpacing: '-0.02em', textAlign: 'center' }}>
        <RevealText direction="left" delay={0}><span style={{ color: '#F8FAFC' }}>Publication</span></RevealText>
      </h2>
      <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg, var(--accent), var(--accent-hi))', borderRadius: '999px', margin: '1rem auto 0' }} />

      <div style={{ maxWidth: '860px', margin: '3rem auto 0' }}>
        <TiltCard intensity={8} glare>
        <div
          style={{
            background: '#0D1520',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px',
            padding: '2.75rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(232,160,32,0.35)'
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(232,160,32,0.15), 0 20px 60px rgba(0,0,0,0.4)'
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span style={{ position: 'absolute', top: '1.5rem', right: '2rem', pointerEvents: 'none' }}>
            <Quote size={80} color="rgba(232,160,32,0.06)" />
          </span>

          <div className="flex flex-wrap items-center justify-between gap-3" style={{ marginBottom: '2rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(232,160,32,0.12)',
                border: '1px solid rgba(232,160,32,0.25)',
              }}
            >
              <BookOpen size={14} color="var(--accent-hi)" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent-hi)' }}>PEER-REVIEWED RESEARCH</span>
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>
                IF 3.125
              </span>
              <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.25)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-hi)' }}>
                2022
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.55, marginBottom: '1.25rem', maxWidth: '680px', position: 'relative', zIndex: 1 }}>
            {publication.title}
          </h3>

          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem' }}>{renderAuthors(publication.authors)}</p>
          <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
            <span style={{ fontStyle: 'italic', color: '#94A3B8' }}>{publication.journal}</span>
            {' | DOI '}
            {publication.doi}
          </p>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2rem 0' }} />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Published in <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>MDPI Sustainability</span> with an impact factor of{' '}
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>3.125</span>
            </p>

            <MagneticButton
              as="a"
              href={publication.link}
              target="_blank"
              strength={0.22}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.4rem',
                borderRadius: '10px',
                background: 'rgba(232,160,32,0.15)',
                border: '1px solid rgba(232,160,32,0.35)',
                color: 'var(--accent-hi)',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232,160,32,0.25)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,160,32,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(232,160,32,0.15)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <ExternalLink size={15} />
              Read Paper
            </MagneticButton>
          </div>
        </div>
        </TiltCard>
      </div>
    </section>
  )
}
