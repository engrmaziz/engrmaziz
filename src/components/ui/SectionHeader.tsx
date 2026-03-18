"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
}: SectionHeaderProps) {
  const isCenter = align === 'center'
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [typedCount, setTypedCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    setTypedCount(0)
    const interval = window.setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= label.length) {
          window.clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 35)

    return () => window.clearInterval(interval)
  }, [isInView, label])

  const typedLabel = useMemo(() => label.slice(0, typedCount), [label, typedCount])

  return (
    <div ref={ref} className={isCenter ? 'text-center' : 'text-left'}>
      <p className="mb-2 min-h-[1rem] text-[0.72rem] uppercase tracking-[0.15em] text-[#1A56A8]">{typedLabel}</p>
      <h2 className="text-[1.65rem] font-bold leading-tight text-white md:text-[2.5rem]">{title}</h2>
      <div className={`mt-3 h-[3px] w-[60px] rounded-[2px] bg-[#1A56A8] ${isCenter ? 'mx-auto' : ''}`} />
      {subtitle ? (
        <p className={`mt-4 max-w-[600px] text-sm leading-7 text-[#94A3B8] sm:text-base ${isCenter ? 'mx-auto' : ''}`}>{subtitle}</p>
      ) : null}
    </div>
  )
}