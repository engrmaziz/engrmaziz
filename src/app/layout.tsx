import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://engrmaziz.github.io'),
  alternates: {
    canonical: '/',
  },
  title: 'Musharraf Aziz — AI Engineer & Full-Stack Developer',
  description:
    'Portfolio of Musharraf Aziz — AI Engineer specializing in LLM systems, ' +
    'multimodal AI, Gemini, Groq, PyTorch, and Next.js web development. ' +
    'Based in Pakistan, open to remote.',
  keywords: [
    'AI Engineer', 'Full-Stack Developer', 'Next.js', 'LLM', 'Gemini AI',
    'Groq', 'PyTorch', 'FastAPI', 'TypeScript', 'Musharraf Aziz',
    'Machine Learning', 'Multimodal AI', 'Pakistan',
  ],
  authors: [{ name: 'Musharraf Aziz' }],
  creator: 'Musharraf Aziz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Musharraf Aziz — AI Engineer & Full-Stack Developer',
    description:
      'Building production-grade AI systems and modern web applications.',
    siteName: 'Musharraf Aziz Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Musharraf Aziz — AI Engineer & Full-Stack Developer',
    description: 'Building production-grade AI systems and modern web apps.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
