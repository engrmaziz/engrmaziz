'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface RevealTextProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left'
}

export default function RevealText({
  children,
  delay = 0,
  direction = 'up',
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShow(true), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  const clipFrom = direction === 'up' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)'

  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'inline-block' }}>
      <div
        style={{
          clipPath: show ? 'inset(0% 0% 0% 0%)' : clipFrom,
          transform: show ? 'translateY(0)' : 'translateY(20px)',
          opacity: show ? 1 : 0,
          transition: `clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.4s ease ${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
