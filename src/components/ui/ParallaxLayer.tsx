'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  className?: string
  style?: CSSProperties
}

export default function ParallaxLayer({
  children,
  speed = -0.15,
  className,
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.parentElement?.getBoundingClientRect()
        if (!rect) return
        const center = rect.top + rect.height / 2 - window.innerHeight / 2
        el.style.transform = `translateY(${center * speed}px)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  )
}
