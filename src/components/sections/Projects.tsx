'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/data'
import AnimateIn from '@/components/ui/AnimateIn'
import TiltCard from '@/components/ui/TiltCard'
import RevealText from '@/components/ui/RevealText'
import ParallaxLayer from '@/components/ui/ParallaxLayer'
import MagneticButton from '@/components/ui/MagneticButton'

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <>
      <style>{`
        .project-featured-list { margin-top: 3rem; }
        .project-item {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--b1);
          transition: background 0.3s ease;
          border-radius: 0;
          cursor: default;
        }
        .project-item:first-child { border-top: 1px solid var(--b1); }
        @media (min-width: 768px) {
          .project-item {
            grid-template-columns: 80px 1fr auto;
            align-items: start;
            gap: 2.5rem;
            padding: 2.5rem 1.5rem;
            border-radius: 16px;
            border: 1px solid transparent;
            border-bottom: 1px solid var(--b1);
            margin: 0 -1.5rem;
          }
          .project-item:hover {
            background: var(--bg-2);
            border-color: var(--b1) !important;
          }
        }
        .project-title {
          position: relative;
          display: inline-block;
        }
        .project-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width 0.25s ease;
        }
        .project-title.active::after {
          width: 100%;
        }
        .proj-number {
          font-size: clamp(2rem,5vw,3.5rem);
          font-weight: 900;
          color: rgba(255,255,255,0.06);
          letter-spacing: -0.06em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          transform-style: preserve-3d;
          perspective: 400px;
        }
        .project-item:hover .proj-number {
          color: var(--gold);
          transform: perspective(400px) rotateY(-15deg) translateX(8px) scale(1.1);
          text-shadow: 6px 0 0 rgba(212,160,39,0.2), 12px 0 0 rgba(212,160,39,0.1);
        }
        .project-small-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          margin-top: 4rem;
          border: 1px solid var(--b1);
          border-radius: 16px;
          overflow: hidden;
          background: var(--b1);
        }
        @media (min-width: 600px) {
          .project-small-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .project-small-grid { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>
      <section
        id="projects"
        style={{
          padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
          maxWidth: '1180px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
        }}
      >
        <ParallaxLayer speed={0.12}>
          <div style={{ position: 'absolute', right: '1rem', top: '2rem', fontSize: 'clamp(3rem,11vw,8rem)', color: 'rgba(212,160,39,0.05)', fontWeight: 900, letterSpacing: '-0.05em', pointerEvents: 'none' }}>WORK</div>
        </ParallaxLayer>
        <AnimateIn>
          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--t4)', fontWeight: 500, letterSpacing: '0.15em', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
            <RevealText delay={0}><span>03</span></RevealText>
          </span>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.6rem' }}>
            <RevealText delay={40}><span>SELECTED WORK</span></RevealText>
          </div>
          <h2 style={{ fontSize: 'clamp(3rem,7vw,5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--t1)', lineHeight: 1 }}>
            <RevealText direction="left" delay={0}><span style={{ color: 'var(--t1)' }}>Projects</span></RevealText>
          </h2>
          <p style={{ marginTop: '0.6rem', color: 'var(--t3)', fontSize: '0.85rem' }}>Selected work</p>
        </AnimateIn>

        <div className="project-featured-list">
          {featured.map((project, i) => (
            <AnimateIn key={project.id} delay={i * 100}>
              <TiltCard intensity={10} glare>
              <div className="project-item" onMouseEnter={() => setHoveredProject(project.id)} onMouseLeave={() => setHoveredProject(null)}>
              <div
                className="proj-number"
                style={{
                  color: hoveredProject === project.id ? 'var(--gold-dim)' : 'var(--b2)',
                  paddingTop: '0.25rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h3 className={`project-title ${hoveredProject === project.id ? 'active' : ''}`} style={{ fontSize: 'clamp(1.2rem,2.5vw,1.5rem)', fontWeight: 800, color: hoveredProject === project.id ? 'var(--gold-hi)' : 'var(--t1)', letterSpacing: '-0.02em', margin: 0 }}>
                    {project.title}
                  </h3>
                  <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: project.color, flexShrink: 0 }} />
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--t2)', lineHeight: 1.7, maxWidth: '560px', marginBottom: '1.25rem' }}>
                  {project.description}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--t3)', letterSpacing: '0.06em' }}>{project.stack.join('  ·  ')}</p>
              </div>

              <MagneticButton
                as="a"
                href={project.github}
                target="_blank"
                strength={0.2}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--surface)',
                  border: '1px solid var(--b1)',
                  color: 'var(--t3)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--b3)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--b1)'
                  e.currentTarget.style.color = 'var(--t3)'
                }}
              >
                <ArrowUpRight size={17} />
              </MagneticButton>
              </div>
              </TiltCard>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={120} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '4rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--t1)' }}>Other Projects</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--t3)' }}>{others.length} more</span>
        </AnimateIn>

        <div className="project-small-grid">
          {others.map((project, i) => (
            <AnimateIn key={project.id} delay={i * 60}>
              <TiltCard intensity={8} glare>
              <div
                style={{ background: 'var(--bg-2)', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  e.currentTarget.style.background = `radial-gradient(220px circle at ${x}px ${y}px, rgba(212,160,39,0.12), transparent 65%), var(--bg-2)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-2)'
                }}
              >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: project.color }} />
                <MagneticButton
                  as="a"
                  href={project.github}
                  target="_blank"
                  strength={0.2}
                  style={{ color: 'var(--t3)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--t3)'
                  }}
                >
                  <ArrowUpRight size={18} />
                </MagneticButton>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--t1)', marginTop: '0.75rem' }}>{project.title}</h4>
              <p style={{ fontSize: '0.78rem', color: project.color, opacity: 0.8, marginBottom: '0.625rem' }}>{project.subtitle}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--t2)', lineHeight: 1.65, flex: 1 }}>{project.description}</p>
              <p style={{ color: 'var(--t3)', fontSize: '0.72rem', marginTop: 'auto', paddingTop: '1rem' }}>{project.stack.join(' · ')}</p>
              </div>
              </TiltCard>
            </AnimateIn>
          ))}
        </div>
      </section>
    </>
  )
}
