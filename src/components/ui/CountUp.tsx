'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: string
  duration?: number
}

export default function CountUp({ value, duration = 1800 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const started = useRef(false)

  const numMatch = value.match(/[\d.]+/)
  const num = numMatch ? parseFloat(numMatch[0]) : 0
  const suffix = value.replace(/[\d.]+/, '')
  const isFloat = value.includes('.')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          obs.disconnect()

          const start = performance.now()
          const startVal = 0

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = startVal + (num - startVal) * eased

            setDisplay(isFloat ? current.toFixed(1) : Math.floor(current).toString())

            if (progress < 1) requestAnimationFrame(tick)
            else setDisplay(isFloat ? num.toFixed(1) : num.toString())
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [num, duration, isFloat])

  return <span ref={ref}>{display}{suffix}</span>
}
