'use client'

const items = [
  { text: 'Gemini 2.5 Flash', accent: true },
  { text: 'Next.js 15', accent: false },
  { text: 'Groq LPU', accent: true },
  { text: 'PyTorch', accent: false },
  { text: 'FastAPI', accent: false },
  { text: 'Multimodal AI', accent: true },
  { text: 'TypeScript', accent: false },
  { text: 'LSTM + GAN', accent: true },
  { text: 'Supabase', accent: false },
  { text: 'LLM Agents', accent: true },
  { text: 'RAG Systems', accent: true },
  { text: 'PostgreSQL', accent: false },
  { text: 'Prompt Engineering', accent: true },
  { text: 'Vercel', accent: false },
  { text: 'LoRaWAN', accent: false },
  { text: 'Node.js', accent: false },
]

export default function TechMarquee() {
  const allItems = [...items, ...items]

  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
        padding: '1.5rem 0',
        background: 'linear-gradient(to right, var(--bg) 0%, var(--bg-2) 50%, var(--bg) 100%)',
        borderTop: '1px solid var(--b1)',
        borderBottom: '1px solid var(--b1)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to right, var(--bg), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to left, var(--bg), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'inline-flex',
          animation: 'marquee 35s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 2rem',
              fontSize: '0.78rem',
              fontWeight: item.accent ? 600 : 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: item.accent ? 'var(--gold)' : 'var(--t3)',
              transition: 'color 0.2s',
            }}
          >
            {item.text}
            <span
              style={{
                display: 'inline-block',
                marginLeft: '2rem',
                width: i % 3 === 0 ? '5px' : '3px',
                height: i % 3 === 0 ? '5px' : '3px',
                background: i % 3 === 0 ? 'var(--gold-dim)' : 'var(--t4)',
                borderRadius: i % 3 === 0 ? '1px' : '50%',
                transform: i % 3 === 0 ? 'rotate(45deg)' : 'none',
                verticalAlign: 'middle',
              }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
