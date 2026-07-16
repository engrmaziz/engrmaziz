import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { ScrollProgress } from "@/components/navigation/ScrollProgress";
import { generatePersonSchema, generateWebSiteSchema, siteMetadata } from "@/lib/seo";
import { RAGXIndicator } from "@/components/rag/RAGXIndicator";
import dynamic from 'next/dynamic';

const RAGXChatAssistant = dynamic(() => import('@/components/rag/RAGXChatAssistant').then(mod => mod.RAGXChatAssistant));

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2ED" },
    { media: "(prefers-color-scheme: dark)", color: "#14140F" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://musharrafaziz.com"),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.author}`,
  },
  description: siteMetadata.description,
  keywords: [
    "AI Engineer", "Backend Engineer", "Software Architect", "RAG Pipelines", 
    "Voice AI", "Go", "Python", "System Architecture"
  ],
  authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
  applicationName: siteMetadata.author,
  creator: siteMetadata.author,
  publisher: siteMetadata.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.author,
    images: [
      {
        url: "/images/maklight.webp",
        width: 1200,
        height: 630,
        alt: "Musharraf Aziz — AI Engineer, Full-Stack Developer & Enterprise AI Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: "@engrmaziz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://musharrafaziz.com/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generatePersonSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
        />
      </head>
      <body className="font-sans min-h-screen">
        <ThemeProvider>
          <ScrollProgress />
          <AppShell navbar={<Navbar />} footer={<Footer />}>
            {children}
          </AppShell>
          <RAGXIndicator />
          <RAGXChatAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
