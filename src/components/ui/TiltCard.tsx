'use client'

import type { CSSProperties, ReactNode, MouseEvent as ReactMouseEvent } from 'react'
import { useRef } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  intensity?: number
  glare?: boolean
}

export default function TiltCard({
  children,
  className,
  style,
  intensity = 12,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const targetRot = useRef({ x: 0, y: 0 })
  const currentRot = useRef({ x: 0, y: 0 })

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)

    targetRot.current = { x: -dy * intensity, y: dx * intensity }

    if (glare && glareRef.current) {
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
      glareRef.current.style.opacity = '1'
    }

    cancelAnimationFrame(rafRef.current)
    const animate = () => {
      currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.1
      currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.1

      if (card) {
        card.style.transform = `perspective(800px) rotateX(${currentRot.current.x}deg) rotateY(${currentRot.current.y}deg) scale3d(1.02, 1.02, 1.02)`
      }

      const diff =
        Math.abs(targetRot.current.x - currentRot.current.x) +
        Math.abs(targetRot.current.y - currentRot.current.y)

      if (diff > 0.01) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  const onMouseLeave = () => {
    targetRot.current = { x: 0, y: 0 }
    if (glare && glareRef.current) glareRef.current.style.opacity = '0'

    cancelAnimationFrame(rafRef.current)
    const animate = () => {
      currentRot.current.x += (0 - currentRot.current.x) * 0.08
      currentRot.current.y += (0 - currentRot.current.y) * 0.08

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(800px) rotateX(${currentRot.current.x}deg) rotateY(${currentRot.current.y}deg) scale3d(1, 1, 1)`
      }

      const diff = Math.abs(currentRot.current.x) + Math.abs(currentRot.current.y)
      if (diff > 0.01) rafRef.current = requestAnimationFrame(animate)
      else if (cardRef.current) cardRef.current.style.transform = 'none'
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'box-shadow 0.3s ease',
        position: 'relative',
        ...style,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {glare ? (
        <div
          ref={glareRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      ) : null}

      <div style={{ transform: 'translateZ(20px)', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
