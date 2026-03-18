import { experience } from '@/lib/data'
import AnimateIn from '@/components/ui/AnimateIn'
import RevealText from '@/components/ui/RevealText'
import ParallaxLayer from '@/components/ui/ParallaxLayer'

export default function Experience() {
  return (
    <>
      <style>{`
        .exp-list { margin-top: 3rem; }
        .exp-entry {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          padding: 2rem 0;
          border-bottom: 1px solid var(--b1);
          position: relative;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .exp-entry::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: transparent;
          transition: background 0.2s ease;
        }
        .exp-entry:hover {
          border-color: var(--b-gold);
          background: rgba(212,160,39,0.03);
        }
        .exp-entry:hover::before {
          background: var(--gold-dim);
        }
        .exp-entry:first-child { border-top: 1px solid var(--b1); }
        @media (min-width: 768px) {
          .exp-entry {
            grid-template-columns: 200px 1fr;
            gap: 3rem;
            padding: 2.25rem 1.5rem;
            border-radius: 12px;
            border-bottom: 1px solid var(--b1);
            margin: 0 -1.5rem;
          }
          .exp-entry:hover { transform: translateX(6px); }
        }
      `}</style>
      <section
        id="experience"
        style={{
          padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)',
          maxWidth: '1180px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
        }}
      >
        <ParallaxLayer speed={0.1}>
          <div style={{ position: 'absolute', right: '1rem', top: '2rem', fontSize: 'clamp(3rem,11vw,8rem)', color: 'rgba(212,160,39,0.05)', fontWeight: 900, letterSpacing: '-0.05em', pointerEvents: 'none' }}>EXP</div>
        </ParallaxLayer>
        <AnimateIn>
          <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--t4)', fontWeight: 500, letterSpacing: '0.15em', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
            <RevealText delay={0}><span>04</span></RevealText>
          </span>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.6rem' }}>
            <RevealText delay={30}><span>CAREER PATH</span></RevealText>
          </div>
          <h2 style={{ fontSize: 'clamp(3rem,7vw,5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--t1)', lineHeight: 1 }}>
            <RevealText direction="left" delay={0}><span style={{ color: 'var(--t1)' }}>Experience</span></RevealText>
          </h2>
        </AnimateIn>

        <div className="exp-list">
          {experience.map((item, i) => (
            <AnimateIn key={item.id} delay={i * 80} className="exp-entry">
              <div>
                {item.current ? (
                  <span style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '999px', animation: 'pulse-ring 1.8s infinite' }} />
                    <span style={{ color: 'var(--gold-hi)', fontSize: '0.75rem', fontWeight: 700 }}>Currently here</span>
                  </span>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--t3)', fontVariantNumeric: 'tabular-nums', marginBottom: '0.3rem' }}>{item.period}</p>
                )}
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: item.current ? 'var(--gold-hi)' : 'var(--t2)', marginTop: item.current ? '0.3rem' : 0 }}>{item.company}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--t3)', marginTop: '0.15rem' }}>{item.location}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--t1)', margin: 0 }}>{item.title}</h3>
                    {item.subtitle ? <p style={{ fontSize: '0.82rem', color: 'var(--accent)', marginTop: '0.2rem' }}>{item.subtitle}</p> : null}
                  </div>
                </div>

                <div style={{ marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {item.bullets.map((bullet, bIndex) => (
                    <p key={bIndex} style={{ fontSize: '0.85rem', color: 'var(--t2)', lineHeight: 1.65 }}>
                      <span style={{ color: 'var(--t3)', marginRight: '0.5rem' }}>—</span>
                      {bullet}
                    </p>
                  ))}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>
    </>
  )
}
