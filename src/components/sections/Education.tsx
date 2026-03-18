import { certifications, education } from '@/lib/data'
import AnimateIn from '@/components/ui/AnimateIn'
import RevealText from '@/components/ui/RevealText'
import TiltCard from '@/components/ui/TiltCard'

export default function Education() {
  return (
    <>
      <style>{`
        .edu-outer {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
        @media (min-width: 860px) {
          .edu-outer { grid-template-columns: 1fr 1fr; gap: 4rem; }
          .cert-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
      <section
        id="education"
        style={{
          padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
          maxWidth: '1180px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <AnimateIn>
          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--t4)', fontWeight: 500, letterSpacing: '0.15em', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
            <RevealText delay={0}><span>05</span></RevealText>
          </span>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.6rem' }}>
            <RevealText delay={30}><span>CREDENTIALS</span></RevealText>
          </div>
          <h2 style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--t1)', lineHeight: 1.05 }}>
            <RevealText direction="left" delay={0}><span style={{ color: 'var(--t1)' }}>Education & </span></RevealText>
            <RevealText direction="left" delay={120}><span className="text-gold">Certifications</span></RevealText>
          </h2>
        </AnimateIn>

        <div className="edu-outer">
          <AnimateIn>
            <TiltCard intensity={8} glare>
            <div style={{ width: '40px', height: '3px', borderRadius: '999px', background: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--t1)', marginTop: '1.25rem' }}>{education.degree}</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--accent)', fontWeight: 600, marginTop: '0.3rem' }}>COMSATS University Islamabad</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--t3)', marginTop: '0.2rem' }}>Lahore Campus · 2017 - 2021</p>

            <div style={{ height: '1px', background: 'var(--b1)', margin: '1.5rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {education.highlights.map((point, i) => (
                <p key={i} style={{ fontSize: '0.85rem', color: 'var(--t2)', lineHeight: 1.65 }}>
                  <span style={{ color: 'var(--t3)', marginRight: '0.5rem' }}>—</span>
                  {point}
                </p>
              ))}
            </div>

            <div
              style={{
                display: 'inline-flex',
                gap: '0.5rem',
                alignItems: 'center',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                background: 'rgba(245,200,66,0.08)',
                border: '1px solid rgba(245,200,66,0.2)',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--accent-hi)',
                marginTop: '1.5rem',
              }}
            >
              <span>✦</span>
              IGNITE Award Winner 2021
            </div>
            </TiltCard>
          </AnimateIn>

          <div>
            <AnimateIn>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--t1)', marginBottom: '1rem' }}>Certifications & Licenses</h3>
            </AnimateIn>
            <div className="cert-grid">
              {certifications.map((cert, i) => {
                const cardStyle: React.CSSProperties = {
                  background: 'var(--surface)',
                  border: '1px solid var(--b1)',
                  borderRadius: '10px',
                  padding: '0.8rem 1rem',
                  transition: 'all 0.2s',
                  display: 'block',
                  textDecoration: 'none',
                }

                const body = (
                  <AnimateIn delay={i * 60}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--t1)', display: 'block', marginBottom: '0.2rem' }}>{cert.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--t3)' }}>{cert.issuer}</span>
                  </AnimateIn>
                )

                if (cert.link) {
                  return (
                    <a
                      key={cert.name}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={cardStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(232,160,32,0.2)'
                        e.currentTarget.style.background = 'rgba(232,160,32,0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--b1)'
                        e.currentTarget.style.background = 'var(--surface)'
                      }}
                    >
                      {body}
                    </a>
                  )
                }

                return (
                  <div key={cert.name} style={cardStyle}>
                    {body}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
