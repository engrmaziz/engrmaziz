import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DirectAnswer } from "@/components/seo/DirectAnswer";
import { Accordion } from "@/components/ui/Accordion";
import { siteMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hire Musharraf Aziz — Freelance AI Engineer or Full-Time",
  description:
    "Hire a senior AI engineer for remote freelance projects or full-time roles. Custom AI call agents, chatbots, RAG agents, and workflow automation for California and Florida teams.",
  keywords: [
    "hire AI engineer",
    "freelance AI engineer",
    "hire RAG developer",
    "AI engineer California",
    "AI engineer Florida",
    "remote senior AI engineer",
    "full-time AI engineer",
    "custom AI call agents freelancer",
  ],
  alternates: { canonical: "/hire" },
  openGraph: {
    title: "Hire Musharraf Aziz — Freelance or Full-Time AI Engineer",
    description:
      "Remote freelance builds and full-time hiring. Custom AI call agents, chatbots, RAG, and workflow automation for California and Florida.",
    url: `${siteMetadata.siteUrl}/hire`,
    type: "website",
  },
};

const faqs = [
  {
    id: "h1",
    title: "Are you available for freelance work right now?",
    content:
      "Yes. I take scoped freelance and contract builds: custom AI call agents, chatbots, RAG agents, and workflow automation. California and Florida companies are the primary US markets. Start with a technical brief on the contact form (intent: freelance).",
  },
  {
    id: "h2",
    title: "Are you open to full-time roles?",
    content:
      "Yes. I am available for full-time senior AI engineer / applied AI roles, remote-first with US teams. I will consider hybrid or relocation for the right company. Recruiters should use the hire page and send a role spec, not a spray-and-pray InMail.",
  },
  {
    id: "h3",
    title: "Can a Pakistan-based engineer serve California and Florida clients?",
    content:
      "Yes, as remote delivery. Live architecture sits in California morning (PT) or Florida morning (ET) overlap windows. I do not fake a US storefront. Schema lists Lahore as home location and California/Florida as area served.",
  },
  {
    id: "h4",
    title: "What should a founder send to start a freelance project?",
    content:
      "Channel (voice, chat, WhatsApp, internal), system of record (CRM, EHR, PMS), volume, language (EN/ES for Florida), and whether this is a one-off agent or a productized SaaS. I will tell you build vs buy.",
  },
];

export default function HirePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteMetadata.siteUrl}/hire#webpage`,
        url: `${siteMetadata.siteUrl}/hire`,
        name: "Hire Musharraf Aziz — Freelance or Full-Time",
        description: metadata.description,
        isPartOf: { "@id": `${siteMetadata.siteUrl}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
        about: { "@id": `${siteMetadata.siteUrl}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteMetadata.siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Hire", item: `${siteMetadata.siteUrl}/hire` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section className="border-b border-border-default bg-base pb-12 pt-32">
        <Container>
          <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            <span className="h-px w-6 bg-accent/70" aria-hidden />
            Freelance · Contract · Full-time
          </p>
          <h1 className="mb-6 max-w-4xl font-display text-4xl font-bold leading-tight text-primary md:text-6xl">
            Hire a senior AI engineer for custom call agents, chatbots, RAG, and automation
          </h1>
          <DirectAnswer title="For founders and hiring managers">
            Musharraf Aziz is a senior AI engineer available for remote freelance projects and for full-time roles. He
            builds custom AI call agents, custom AI chatbots, RAG agents, and workflow automation for California and
            Florida companies. Delivery is remote from Lahore with Pacific and Eastern overlap—not a fake US office.
          </DirectAnswer>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/contact?intent=freelance">
              <Button size="lg" className="font-bold">
                Start a freelance project <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#full-time">
              <Button variant="outline" size="lg" className="font-bold">
                Full-time hiring
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-2xl border border-border-default bg-base p-8 hud-corners">
            <Briefcase className="w-8 h-8 text-accent mb-4" />
            <h2 className="text-3xl font-bold text-primary mb-4">Freelance and contract</h2>
            <p className="text-secondary leading-relaxed mb-4">
              This is the default path for California clinics, Florida home-services operators, Bay Area SaaS teams, and
              Miami hospitality groups that need a system shipped—not a staff seat filled. You keep the numbers, the
              cloud, and the data. I design, build, eval, and hand off.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Custom AI call agents (inbound/outbound, bilingual when scoped)",
                "Custom AI chatbots with RAG and booking actions",
                "Production RAG agents with citations and ACLs",
                "Workflow automation into CRM, PMS, or dispatch",
                "Architecture reviews when a local agency install failed",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-secondary">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/contact?intent=freelance" className="text-accent font-bold hover:underline">
              Send a project brief →
            </Link>
          </div>
          <div id="full-time" className="scroll-mt-32 rounded-2xl border border-border-default bg-base p-8 hud-corners">
            <Building2 className="w-8 h-8 text-accent mb-4" />
            <h2 className="text-3xl font-bold text-primary mb-4">Full-time hiring</h2>
            <p className="text-secondary leading-relaxed mb-4">
              I am open to senior applied AI / LLM systems roles on US teams. Remote-first is the fit. I will discuss
              hybrid or relocation when the product, team, and immigration path are real—not when a JD says “AI magician
              with 15 years of GPT-5.”
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Title band: Senior AI Engineer, Applied AI, LLM / RAG platform",
                "Markets: California, Florida, and other US remote-friendly orgs",
                "Stack: Python, LangGraph/LlamaIndex, voice/telephony, Next.js",
                "What to send: JD, comp band, visa/remote policy, team size",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-secondary">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/contact?intent=full-time" className="text-accent font-bold hover:underline">
              Recruiting inquiry →
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base border-b border-border-default">
        <Container className="max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-4">Understanding how US companies hire this work</h2>
          <p className="text-secondary leading-relaxed mb-4">
            Search demand splits in two. Founders type “custom AI call agents California” or “RAG chatbot Miami” because
            they need a builder. Recruiters type “hire senior AI engineer remote” because they need a seat. This page
            exists so both intents land on one honest entity: a named engineer, production systems, California and
            Florida as served markets, freelance and full-time both open.
          </p>
          <h2 className="text-3xl font-bold text-primary mb-4 mt-12">The engineering framework I actually ship</h2>
          <p className="text-secondary leading-relaxed mb-4">
            Agents fail when they cannot see the system of record, when retrieval has no evals, or when voice has no
            overflow. Freelance scopes start with channel, corpus, tools, and audit trail. Full-time conversations start
            with whether your team wants a demo theater or a production owner. I have shipped production RAG at 1,000+
            daily interactions, ops automation, and telephony-adjacent agents—those are the proof points, not a list of model logos.
          </p>
          <h2 className="text-3xl font-bold text-primary mb-4 mt-12">Checklist before you reach out</h2>
          <ul className="space-y-3 text-secondary">
            <li>1. Decide freelance project vs full-time seat. Do not mix them in one email without saying so.</li>
            <li>2. Name the state and timezone you operate in (California PT / Florida ET preferred overlap).</li>
            <li>3. Link the service page that matches: call agents, chatbots, RAG, or workflow automation.</li>
            <li>4. If full-time: include remote policy and whether you sponsor or already expect Pakistan-based remote.</li>
          </ul>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/services/california" className="px-4 py-2 rounded-full border border-border-default text-sm font-medium hover:border-accent/50">
              California services
            </Link>
            <Link href="/services/florida" className="px-4 py-2 rounded-full border border-border-default text-sm font-medium hover:border-accent/50">
              Florida services
            </Link>
            <Link href="/about" className="px-4 py-2 rounded-full border border-border-default text-sm font-medium hover:border-accent/50">
              Experience
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated">
        <Container className="max-w-3xl">
          <h2 className="text-3xl font-bold text-primary mb-6">Hiring FAQ</h2>
          <Accordion items={faqs} allowMultiple />
        </Container>
      </Section>
    </>
  );
}
