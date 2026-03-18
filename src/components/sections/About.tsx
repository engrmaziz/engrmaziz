'use client'

import type { MouseEvent } from 'react'
import { personalInfo } from '@/lib/data'
import { MapPin, Mail, Phone, Globe } from 'lucide-react'
import TiltCard from '@/components/ui/TiltCard'
import CountUp from '@/components/ui/CountUp'
import RevealText from '@/components/ui/RevealText'
import ParallaxLayer from '@/components/ui/ParallaxLayer'

const onCellMouseMove = (e: MouseEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1)
  const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1)
  e.currentTarget.style.setProperty('--mx', `${x}%`)
  e.currentTarget.style.setProperty('--my', `${y}%`)
}

export default function About() {
  const cleanBio = personalInfo.bio
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <>
      <style>{`
        /* -- Outer wrapper -- */
        .about-section {
          padding: clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }

        /* -- Heading -- */
        .about-heading {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 3rem;
        }

        /* -- Main two-column layout -- */
        .about-main {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: var(--b1);
          border: 1px solid var(--b1);
          border-radius: 20px;
          overflow: hidden;
        }
        @media (min-width: 860px) {
          .about-main {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* -- Stats row - always 2x2 -- */
        .about-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--b1);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 1px;
          border: 1px solid var(--b1);
        }

        /* -- Info row - 2 cols on md+ -- */
        .about-info {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: var(--b1);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 1px;
          border: 1px solid var(--b1);
        }
        @media (min-width: 600px) {
          .about-info {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* -- Status bar -- */
        .about-status {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem 1.75rem;
          background: var(--bg-2);
          border: 1px solid var(--b1);
          border-radius: 20px;
          margin-top: 1px;
        }
        @media (max-width: 600px) {
          .about-status-item {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .about-status-item:last-child {
            border-bottom: none;
          }
        }

        /* -- Shared cell -- */
        .about-cell {
          background: var(--bg-2);
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }
        .about-cell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--mx, 50%) var(--my, 50%),
            rgba(212,160,39,0.07) 0%,
            transparent 65%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .about-cell:hover::before { opacity: 1; }
        .about-cell:hover { background: var(--bg-3, #101520); }

        /* -- Stat cell specifically -- */
        .stat-cell {
          background: var(--bg-2);
          padding: 2rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: background 0.3s;
        }
        .stat-cell:hover { background: var(--bg-3, #101520); }

        /* -- Pulse dot -- */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>

      <section
        id="about"
        style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%)' }}
      >
        <div className="about-section">
          <div style={{
            fontSize: '0.68rem', color: 'var(--t4)',
            fontWeight: 500, letterSpacing: '0.15em',
            marginBottom: '0.4rem',
          }}><RevealText delay={0}><span>01</span></RevealText></div>
          <div style={{
            fontSize: '0.72rem', color: 'var(--gold)',
            fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', marginBottom: '0.6rem',
          }}><RevealText delay={40}><span>About</span></RevealText></div>

          <h2 className="about-heading">
            <RevealText direction="left" delay={0}>
              <span style={{ color: 'var(--t1)' }}>Who I </span>
            </RevealText>
            <RevealText direction="left" delay={120}>
              <span className="text-gold">Am</span>
            </RevealText>
          </h2>

          <div className="about-main">
            <div
              className="about-cell"
              onMouseMove={onCellMouseMove}
            >
              <p style={{
                fontSize: '0.68rem', color: 'var(--t3)',
                fontWeight: 600, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '1rem',
              }}>Who I Am</p>
              <p style={{
                color: 'var(--t2)',
                fontSize: '0.97rem',
                lineHeight: 1.85,
                margin: 0,
              }}>
                {cleanBio}
              </p>
            </div>

            <div
              className="about-cell"
              onMouseMove={onCellMouseMove}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <p style={{
                fontSize: '0.68rem', color: 'var(--t3)',
                fontWeight: 600, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>Contact</p>

              {[
                { icon: <MapPin size={15} />, text: 'Kasur, Pakistan - Open to Remote' },
                { icon: <Mail size={15} />, text: personalInfo.email,
                  href: `mailto:${personalInfo.email}` },
                { icon: <Phone size={15} />, text: personalInfo.phone },
                { icon: <Globe size={15} />, text: 'PEC Registered Engineer' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.875rem',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--b1)',
                  borderRadius: '10px',
                }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {item.href
                    ? <a href={item.href} style={{
                        color: 'var(--t2)', fontSize: '0.85rem',
                        transition: 'color 0.2s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
                      >{item.text}</a>
                    : <span style={{ color: 'var(--t2)', fontSize: '0.85rem' }}>
                        {item.text}
                      </span>
                  }
                </div>
              ))}
            </div>
          </div>

          <div className="about-stats">
            {personalInfo.stats.map((stat, i) => (
              <TiltCard key={i} className="stat-cell" intensity={8} glare>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <ParallaxLayer speed={-0.08} style={{ position: 'absolute', top: 0, right: 0 }}>
                    <div style={{
                      position: 'absolute', top: '-20px', right: '-20px',
                      width: '80px', height: '80px', borderRadius: '50%',
                      background: 'rgba(212,160,39,0.12)',
                      filter: 'blur(20px)', pointerEvents: 'none',
                    }} />
                  </ParallaxLayer>
                  <div style={{
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 900, lineHeight: 1,
                    background: 'linear-gradient(135deg, var(--gold-hi), var(--gold))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    <CountUp
                      value={stat.value}
                      duration={i === 0 ? 1400 : i === 1 ? 1600 : i === 2 ? 1000 : 2000}
                    />
                  </div>
                  <div style={{
                    color: 'var(--t3)', fontSize: '0.72rem',
                    fontWeight: 500, marginTop: '0.5rem',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                  }}>
                    {stat.label}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="about-info">
            <div
              className="about-cell"
              onMouseMove={onCellMouseMove}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                gap: '0.5rem', marginBottom: '0.5rem',
              }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--gold)',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.7rem', color: 'var(--gold)',
                  fontWeight: 600, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>Available Now</span>
              </div>
              <p style={{
                fontSize: '0.92rem', fontWeight: 700,
                color: 'var(--t1)', marginBottom: '0.2rem',
              }}>AI Engineering Roles</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--t3)' }}>
                Open to remote / relocation
              </p>
            </div>

            <div
              className="about-cell"
              onMouseMove={onCellMouseMove}
            >
              <p style={{
                fontSize: '0.68rem', color: 'var(--t3)',
                fontWeight: 600, letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '0.875rem',
              }}>Quick Stack</p>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
              }}>
                {['Next.js 15', 'Python', 'Gemini AI', 'FastAPI',
                  'PyTorch', 'TypeScript', 'Supabase', 'Groq'].map(tech => (
                  <span key={tech} style={{
                    fontSize: '0.75rem', fontWeight: 500,
                    padding: '0.25rem 0.65rem', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--b1)',
                    color: 'var(--t2)',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--b-gold)'
                      e.currentTarget.style.color = 'var(--gold)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--b1)'
                      e.currentTarget.style.color = 'var(--t2)'
                    }}
                  >{tech}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            gap: '0',
            marginTop: '1px',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.015)',
          }}>
            {[
              {
                label: 'Currently working at',
                value: 'Allama Iqbal Hospital',
                valueColor: 'var(--gold)',
              },
              {
                label: 'Actively building',
                value: 'LLM + Next.js projects',
                valueColor: 'var(--teal)',
              },
              {
                label: 'PEC License',
                value: 'ELECT/91660',
                valueColor: 'var(--t1)',
              },
            ].map((item, i, arr) => (
              <div
                key={i}
                className="about-status-item"
                style={{
                  flex: '1 1 180px',
                  padding: '1.1rem 1.5rem',
                  borderRight: i < arr.length - 1
                    ? '1px solid rgba(255,255,255,0.05)'
                    : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                }}
              >
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--t3)',
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: item.valueColor,
                  lineHeight: 1.3,
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
