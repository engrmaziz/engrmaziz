'use client'

import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import { useRef } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  download?: boolean
  ariaLabel?: string
  onMouseEnter?: MouseEventHandler<HTMLElement>
  onMouseLeave?: MouseEventHandler<HTMLElement>
  strength?: number
  as?: 'button' | 'a' | 'div'
}

export default function MagneticButton({
  children,
  className,
  style,
  onClick,
  href,
  target,
  rel,
  download,
  ariaLabel,
  onMouseEnter: onMouseEnterProp,
  onMouseLeave: onMouseLeaveProp,
  strength = 0.35,
  as: Tag = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const rafRef = useRef<number>(0)
  const pos = useRef({ x: 0, y: 0 })

  const onMouseMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    pos.current = { x: dx, y: dy }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (el) el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
    })
  }

  const onMouseEnter: MouseEventHandler<HTMLElement> = (e) => {
    if (window.innerWidth < 1024) return
    document.addEventListener('mousemove', onMouseMove)
    onMouseEnterProp?.(e)
  }

  const onMouseLeave: MouseEventHandler<HTMLElement> = (e) => {
    document.removeEventListener('mousemove', onMouseMove)
    cancelAnimationFrame(rafRef.current)
    onMouseLeaveProp?.(e)

    const springBack = () => {
      pos.current.x *= 0.75
      pos.current.y *= 0.75
      if (ref.current) {
        ref.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
      }

      if (Math.abs(pos.current.x) + Math.abs(pos.current.y) > 0.1) {
        rafRef.current = requestAnimationFrame(springBack)
      } else if (ref.current) {
        ref.current.style.transform = 'translate(0,0)'
      }
    }

    rafRef.current = requestAnimationFrame(springBack)
  }

  const commonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow 0.2s ease',
    willChange: 'transform',
    ...style,
  }

  if (Tag === 'a') {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={className}
        style={commonStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        download={download}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    )
  }

  if (Tag === 'div') {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={className}
        style={commonStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      style={commonStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
