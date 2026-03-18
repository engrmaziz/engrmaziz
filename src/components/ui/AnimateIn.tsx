'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimateInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'fade'
  className?: string
  style?: React.CSSProperties
}

export default function AnimateIn({
  children,
  delay = 0,
  direction = 'up',
  className,
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const transforms = {
    up: { from: 'translateY(32px)', to: 'translateY(0)' },
    left: { from: 'translateX(-24px)', to: 'translateX(0)' },
    fade: { from: 'translateY(0)', to: 'translateY(0)' },
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? transforms[direction].to : transforms[direction].from,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
