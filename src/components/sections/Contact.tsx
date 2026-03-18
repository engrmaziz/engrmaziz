'use client'

import { useState } from 'react'
import { personalInfo } from '@/lib/data'
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Github,
  Linkedin,
  Send,
  CheckCircle,
} from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const mailto =
      `mailto:${personalInfo.email}` +
      `?subject=${encodeURIComponent(form.subject || 'Portfolio Contact')}` +
      `&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`

    setTimeout(() => {
      window.location.href = mailto
      setLoading(false)
      setSent(true)
    }, 600)
  }

  return (
    <>
      <style>{`
        .contact-wrap {
          padding: clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem);
          max-width: 1180px;
          margin: 0 auto;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }
        @media (min-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;
          }
        }
        .c-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          color: var(--t1);
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 0.875rem;
          font-family: inherit;
          box-sizing: border-box;
          resize: vertical;
        }
        .c-input:focus {
          border-color: var(--gold-dim);
          box-shadow: 0 0 0 3px rgba(212,160,39,0.1);
        }
        .c-input::placeholder {
          color: var(--t3);
        }
        .contact-email {
          display: block;
          font-size: clamp(1rem,2.5vw,1.9rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--t1);
          text-decoration: none;
          transition: color 0.2s ease;
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 1rem 0 2rem;
        }
        .contact-email:hover {
          color: transparent;
          background: linear-gradient(90deg, var(--t1) 0%, var(--gold-hi) 50%, var(--t1) 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          margin-bottom: 0.625rem;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .contact-item:hover {
          border-color: rgba(212,160,39,0.2);
          background: rgba(212,160,39,0.04);
        }
        .contact-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(212,160,39,0.1);
          border: 1px solid rgba(212,160,39,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          flex-shrink: 0;
        }
      `}</style>

      <section id="contact" style={{ background: 'rgba(8,11,18,0.7)' }}>
        <div className="contact-wrap">
          <p
            style={{
              fontSize: '0.67rem',
              color: 'var(--t4)',
              fontWeight: 500,
              letterSpacing: '0.15em',
              marginBottom: '0.35rem',
            }}
          >
            06
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
            Get In Touch
          </p>

          <h2
            style={{
              fontSize: 'clamp(2.2rem,5vw,3.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: 'var(--t1)' }}>Let&apos;s </span>
            <span className="text-gold">Connect</span>
          </h2>

          <div className="contact-grid">
            <div>
              <p
                style={{
                  color: 'var(--t2)',
                  fontSize: '0.97rem',
                  lineHeight: 1.8,
                  marginBottom: '0.5rem',
                }}
              >
                Open to AI Engineering roles and high-impact technical collaborations. Let&apos;s build
                something great.
              </p>

              <a href={`mailto:${personalInfo.email}`} className="contact-email">
                {personalInfo.email}
              </a>

              <a href={`mailto:${personalInfo.email}`} className="contact-item">
                <div className="contact-icon">
                  <Mail size={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--t3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.1rem',
                    }}
                  >
                    Email
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--t1)', fontWeight: 500 }}>
                    Write via email ↗
                  </div>
                </div>
              </a>

              <a href={`tel:${personalInfo.phone}`} className="contact-item">
                <div
                  className="contact-icon"
                >
                  <Phone size={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--t3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.1rem',
                    }}
                  >
                    Phone
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--t1)', fontWeight: 500 }}>
                    {personalInfo.phone}
                  </div>
                </div>
              </a>

              <a
                href={personalInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <div
                  className="contact-icon"
                  style={{
                    background: 'rgba(0,212,200,0.1)',
                    borderColor: 'rgba(0,212,200,0.15)',
                    color: 'var(--teal)',
                  }}
                >
                  <MessageCircle size={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--t3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.1rem',
                    }}
                  >
                    WhatsApp
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--t1)', fontWeight: 500 }}>
                    Chat on WhatsApp ↗
                  </div>
                </div>
              </a>

              <div className="contact-item" style={{ cursor: 'default' }}>
                <div
                  className="contact-icon"
                  style={{
                    background: 'rgba(124,109,237,0.1)',
                    borderColor: 'rgba(124,109,237,0.15)',
                    color: 'var(--violet)',
                  }}
                >
                  <MapPin size={16} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--t3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '0.1rem',
                    }}
                  >
                    Location
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--t1)', fontWeight: 500 }}>
                    Kasur, Pakistan - Open to Remote
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                {[
                  { href: personalInfo.github, label: 'GitHub', icon: <Github size={15} /> },
                  { href: personalInfo.linkedin, label: 'LinkedIn', icon: <Linkedin size={15} /> },
                ].map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1.1rem',
                      borderRadius: '9px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--t2)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--t1)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--t2)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                  >
                    {icon} {label}
                  </a>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(20,25,34,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem,3vw,2rem)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, var(--gold), var(--teal), transparent)',
                borderRadius: '999px',
                marginBottom: '1.75rem',
              }} />
              {sent ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <CheckCircle size={52} style={{ color: 'var(--teal)' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--t1)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--t2)', fontSize: '0.92rem' }}>Thanks! I&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => {
                      setSent(false)
                      setForm({ name: '', email: '', subject: '', message: '' })
                    }}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '9px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--t2)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.875rem' }}>
                    <input
                      className="c-input"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                    <input
                      className="c-input"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <input
                    className="c-input"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  />
                  <textarea
                    className="c-input"
                    placeholder="Your message..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    style={{ marginBottom: '1.25rem' }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.95rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: loading ? 'rgba(212,160,39,0.5)' : 'var(--gold)',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 20px rgba(212,160,39,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = 'var(--gold-hi)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,160,39,0.45)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = loading ? 'rgba(212,160,39,0.5)' : 'var(--gold)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,160,39,0.3)'
                    }}
                  >
                    <Send size={16} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
