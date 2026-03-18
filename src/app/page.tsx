'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import Footer from '@/components/ui/Footer'
import BackToTop from '@/components/ui/BackToTop'
import CustomCursor from '@/components/ui/CustomCursor'

const GeminiBg = dynamic(() => import('@/components/canvas/GeminiBg'), { ssr: false })
const TechMarquee = dynamic(() => import('@/components/ui/TechMarquee'), { ssr: false })
const About = dynamic(() => import('@/components/sections/About'))
const Skills = dynamic(() => import('@/components/sections/Skills'))
const Projects = dynamic(() => import('@/components/sections/Projects'))
const Experience = dynamic(() => import('@/components/sections/Experience'))
const Education = dynamic(() => import('@/components/sections/Education'))
const Publication = dynamic(() => import('@/components/sections/Publication'))
const Contact = dynamic(() => import('@/components/sections/Contact'))

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.4s ease',
        background: 'var(--bg)',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <GeminiBg />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg)',
          zIndex: 99997,
          transform: ready ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.85s cubic-bezier(0.76,0,0.24,1)',
          pointerEvents: 'none',
        }}
      />

      <div className="ambient-tl" />
      <div className="ambient-br" />

      <CustomCursor />

      <Navbar />

      <Hero />

      <TechMarquee />

      <main style={{ position: 'relative', zIndex: 10, background: 'var(--bg)' }}>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Publication />
        <Contact />
        <Footer />
      </main>

      <BackToTop />
    </div>
  )
}
