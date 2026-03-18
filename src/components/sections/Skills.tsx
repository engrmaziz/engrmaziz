'use client'

import type { ReactNode } from 'react'
import { skills } from '@/lib/data'
import { Brain, Monitor, Server, Database, Cloud, Cpu } from 'lucide-react'

const iconMap: Record<string, ReactNode> = {
  Brain: <Brain size={16} />,
  Monitor: <Monitor size={16} />,
  Server: <Server size={16} />,
  Database: <Database size={16} />,
  Cloud: <Cloud size={16} />,
  Cpu: <Cpu size={16} />,
}

const techLogos: Record<string, string> = {
  // AI / Machine Learning
  'Gemini 2.5 Flash': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  'Groq LPU': 'https://www.groq.com/wp-content/uploads/2024/03/Groq_Final_Logo_Gold%E2%94%80_1500px-1-300x300.png',
  'Llama 3.3 70B': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/meta/meta-original.svg',
  PyTorch: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg',
  LSTM: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
  GAN: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
  RAG: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  'Prompt Engineering': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg',
  'Multimodal AI': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
  'AI Agents': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'LLM Integration': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',

  // Frontend
  'Next.js 15': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
  HTML5: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
  CSS3: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
  'Framer Motion': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
  'Responsive UI': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',

  // Backend
  FastAPI: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'REST APIs': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  'Streaming APIs': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
  'Middleware Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
  'Server-Side Rendering': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',

  // Database & Auth
  PostgreSQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  Supabase: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
  Redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
  SQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  'Row-Level Security': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
  'Multi-tenancy': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  'Data Modeling': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',

  // DevOps & Cloud
  Vercel: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
  'Railway.app': 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/railway.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  GitHub: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  'CI/CD': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
  Linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',

  // Systems & IoT
  'IT Infrastructure': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
  'GPON / Fiber Networks': 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/netlify.svg',
  LoRaWAN: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/raspberrypi.svg',
  'IoT Sensors': 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/arduino.svg',
  'Huawei NMS': 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/huawei.svg',
  'Electrical Systems': 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/linux.svg',
  SCADA: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
}

function hexToRgb(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function Skills() {
  return (
    <>
      <style>{`
        .skills-section {
          padding: clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);
          max-width: 1180px;
          margin: 0 auto;
        }
        .skills-table {
          margin-top: 2.5rem;
          width: 100%;
        }
        .skill-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.875rem;
          padding: 1.5rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-left: 2px solid transparent;
          transition: all 0.25s ease;
          border-radius: 0 12px 12px 0;
          cursor: default;
        }
        .skill-row:last-child {
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .skill-row:hover {
          background: rgba(255,255,255,0.025);
          border-left-color: var(--gold);
          padding-left: 1.75rem;
        }
        @media (min-width: 700px) {
          .skill-row {
            grid-template-columns: 200px 1fr;
            align-items: center;
            gap: 2rem;
          }
        }
        .skill-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.28rem 0.72rem;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 500;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--t2);
          transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1);
          cursor: default;
          user-select: none;
        }
      `}</style>

      <section id="skills" style={{ background: 'rgba(8,11,18,0.6)' }}>
        <div className="skills-section">
          <p
            style={{
              fontSize: '0.67rem',
              color: 'var(--t4)',
              fontWeight: 500,
              letterSpacing: '0.15em',
              marginBottom: '0.35rem',
            }}
          >
            02
          </p>
          <p
            style={{
              fontSize: '0.72rem',
              color: 'var(--gold)',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            What I Use
          </p>

          <h2
            style={{
              fontSize: 'clamp(2.2rem,5vw,3.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: 'var(--t1)' }}>Technical </span>
            <span className="text-gold">Skills</span>
          </h2>

          <div className="skills-table">
            {skills.map((skill) => (
              <div key={skill.category} className="skill-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: `rgba(${hexToRgb(skill.color)},0.1)`,
                      border: `1px solid rgba(${hexToRgb(skill.color)},0.2)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: skill.color,
                      flexShrink: 0,
                    }}
                  >
                    {iconMap[skill.icon] ?? <Cpu size={16} />}
                  </div>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--t1)',
                      lineHeight: 1.2,
                    }}
                  >
                    {skill.category}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {skill.items.map((item) => {
                    const logoUrl = techLogos[item]
                    return (
                      <span
                        key={item}
                        className="skill-tag"
                        onMouseEnter={(e) => {
                          const el = e.currentTarget
                          el.style.transform = 'translateY(-3px) scale(1.05)'
                          el.style.borderColor = `rgba(${hexToRgb(skill.color)},0.5)`
                          el.style.color = skill.color
                          el.style.background = `rgba(${hexToRgb(skill.color)},0.1)`
                          el.style.boxShadow = `0 4px 12px rgba(${hexToRgb(skill.color)},0.15)`
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget
                          el.style.transform = 'translateY(0) scale(1)'
                          el.style.borderColor = 'rgba(255,255,255,0.08)'
                          el.style.color = 'var(--t2)'
                          el.style.background = 'rgba(255,255,255,0.04)'
                          el.style.boxShadow = 'none'
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: logoUrl ? '0.4rem' : '0',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.76rem',
                          fontWeight: 500,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--t2)',
                          cursor: 'default',
                          userSelect: 'none',
                          transition: 'all 0.2s cubic-bezier(0.34,1.4,0.64,1)',
                        }}
                      >
                        {logoUrl && (
                          <img
                            src={logoUrl}
                            alt={item}
                            width={14}
                            height={14}
                            style={{
                              width: '14px',
                              height: '14px',
                              objectFit: 'contain',
                              flexShrink: 0,
                              filter: [
                                'GitHub', 'Next.js 15', 'Docker', 'Git', 'Linux',
                                'Vercel', 'Railway.app', 'Electrical Systems', 'SCADA',
                                'IT Infrastructure', 'LoRaWAN', 'CI/CD'
                              ].includes(item)
                                ? 'invert(1)'
                                : 'none',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )}
                        {item}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
