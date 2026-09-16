import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { ScrollProgress } from "@/components/navigation/ScrollProgress";
import { SiteAtmosphere } from "@/components/fx/SiteAtmosphere";
import { generateSiteGraph, siteMetadata } from "@/lib/seo";
import { RAGXIndicator } from "@/components/rag/RAGXIndicator";
import dynamic from "next/dynamic";

const RAGXChatAssistant = dynamic(() =>
  import("@/components/rag/RAGXChatAssistant").then((mod) => mod.RAGXChatAssistant)
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F6FB" },
    { media: "(prefers-color-scheme: dark)", color: "#06090F" },
  ],
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.author}`,
  },
  description: siteMetadata.description,
  keywords: [
    "hire AI engineer",
    "freelance AI engineer",
    "remote senior AI engineer",
    "custom AI call agents",
    "custom AI chatbots",
    "RAG agents",
    "workflow automation",
    "AI voice agents",
    "AI Engineer California",
    "AI Engineer Florida",
    "RAG Pipelines",
    "LLM Systems",
  ],
  authors: [{ name: siteMetadata.author, url: siteMetadata.siteUrl }],
  applicationName: siteMetadata.author,
  creator: siteMetadata.author,
  publisher: siteMetadata.author,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-light.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
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
    types: {
      "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
      "text/plain": `${siteMetadata.siteUrl}/llms.txt`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSiteGraph()) }}
        />
      </head>
      <body className="font-sans min-h-screen">
        <ThemeProvider>
          <SiteAtmosphere />
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
