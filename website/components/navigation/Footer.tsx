import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BackToTop } from "@/components/navigation/BackToTop";
import { BrandLogo } from "@/components/common/BrandLogo";

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
  ]
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-base border-t border-border-default pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Status Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link 
              href="/" 
              className="group flex items-center gap-2 w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              <BrandLogo size="lg" className="transition-transform duration-300 group-hover:scale-[1.02]" />
            </Link>
            
            <p className="text-secondary leading-relaxed max-w-sm">
              Custom AI call agents, chatbots, RAG agents, and workflow automation for California and Florida teams. Remote freelance builds and full-time hiring.
            </p>

            <div className="flex items-center gap-3 mt-2 px-4 py-2 bg-elevated border border-border-default rounded-full w-fit">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-primary">Available for new projects</span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-primary">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.Navigation.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-secondary hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-primary">Services</h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.Services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-secondary hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-primary">Locations</h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.Locations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-secondary hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-primary">Socials</h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.Socials.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-secondary hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border-default gap-4">
          <p className="text-secondary text-sm">
            © {currentYear} Musharraf Aziz. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-secondary hover:text-primary transition-colors text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-secondary hover:text-primary transition-colors text-sm">Terms of Service</Link>
          </div>
        </div>
      </Container>
      <BackToTop />
    </footer>
  );
}
