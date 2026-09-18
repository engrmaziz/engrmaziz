import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BackToTop } from "@/components/navigation/BackToTop";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Marquee } from "@/components/ui/Marquee";
import { XclerLink } from "@/components/common/XclerLink";

const FOOTER_LINKS = {
  Navigation: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Hire", href: "/hire" },
    { name: "Entity facts", href: "/entity" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Sitemap", href: "/sitemap" },
  ],
  Services: [
    { name: "Custom AI Call Agents", href: "/services/ai-agents/ai-call-agents" },
    { name: "Custom AI Chatbots", href: "/services/ai-agents/chatbots" },
    { name: "RAG Agents", href: "/services/ai-engineering/rag-development" },
    { name: "Workflow Automation", href: "/services/technical-consulting/workflow-automation" },
  ],
  Locations: [
    { name: "California", href: "/services/california" },
    { name: "Los Angeles", href: "/services/california/los-angeles" },
    { name: "San Francisco", href: "/services/california/san-francisco" },
    { name: "Florida", href: "/services/florida" },
    { name: "Miami", href: "/services/florida/miami" },
    { name: "Orlando", href: "/services/florida/orlando" },
  ],
  Socials: [
    { name: "GitHub", href: "https://github.com/engrmaziz" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/musharrafazizq/" },
    { name: "Email", href: "mailto:io@maziz.me" },
  ],
};

const MARQUEE = [
  "Custom AI Call Agents",
  "RAG Pipelines",
  "Voice Agents",
  "LangGraph",
  "FastAPI",
  "pgvector",
  "California",
  "Florida",
  "Cygnus",
  "Bano Qabil",
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-8 w-full overflow-hidden border-t border-border-default bg-base pt-10">
      <div className="mb-10 border-y border-border-default/70 py-3">
        <Marquee>
          {MARQUEE.map((item) => (
            <span key={item} className="font-mono text-xs uppercase tracking-[0.28em] text-secondary">
              {item} <span className="mx-6 text-accent">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Container>
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link
              href="/"
              className="group flex w-fit items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <BrandLogo size="lg" className="transition-transform duration-300 group-hover:scale-[1.02]" />
            </Link>
            <p className="max-w-sm leading-relaxed text-secondary">
              Custom AI call agents, chatbots, RAG agents, and workflow automation for California and Florida teams. Remote freelance builds and full-time hiring.
            </p>
            <div className="mt-2 flex w-fit items-center gap-3 rounded-full border border-border-default bg-elevated px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>
              <span className="text-sm font-medium text-primary">Available for new projects</span>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{group}</h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-secondary transition-colors hover:text-accent"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-default py-8 md:flex-row">
          <p className="text-sm text-secondary">© {currentYear} Musharraf Aziz. All rights reserved.</p>
          <p className="text-sm text-secondary">
            Developed by <XclerLink>Xcler</XclerLink>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-secondary transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-secondary transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
      <BackToTop />
    </footer>
  );
}
