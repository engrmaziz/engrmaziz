'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024 && !('ontouchstart' in window))
  }, [])

  useEffect(() => {
    // Disable entirely on touch/mobile devices
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return

    document.body.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onClick = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 300)
    }

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)

    const interactiveElements = Array.from(
      document.querySelectorAll('a, button, [role="button"], input, textarea, select, label')
    )

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }

      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!isDesktop) return null

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--gold)',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
          transition: 'transform 0.05s, width 0.2s, height 0.2s',
          willChange: 'transform',
        }}
      />

      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovered ? '48px' : '40px',
          height: hovered ? '48px' : '40px',
          borderRadius: '50%',
          border: `1.5px solid ${hovered ? 'rgba(212,160,39,0.7)' : 'rgba(212,160,39,0.35)'}`,
          background: hovered ? 'rgba(212,160,39,0.06)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          transition:
            'width 0.25s ease, height 0.25s ease, border-color 0.25s, background 0.25s, transform 0.18s ease',
          willChange: 'transform',
          transform: clicked ? 'scale(0.85)' : 'scale(1)',
        }}
      />
    </>
  )
}
