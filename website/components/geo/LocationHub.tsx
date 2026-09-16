import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/service/ServiceCard";
import { GeoFaqList } from "@/components/geo/GeoFaqList";
import { DirectAnswer } from "@/components/seo/DirectAnswer";
import { CITATION } from "@/lib/geo/citation";
import {
  GEO_SERVICES,
  getCitiesForState,
  type GeoMarket,
} from "@/lib/geo";

export function LocationHub({ market }: { market: GeoMarket }) {
  const cities = getCitiesForState(market.slug);
  const otherState = market.slug === "california" ? "florida" : "california";
  const otherName = market.slug === "california" ? "Florida" : "California";

  return (
    <>
      <Section className="pt-32 pb-16 bg-base border-b border-border-default">
        <Container>
          <div className="max-w-4xl">
            <Link href="/services" className="text-sm font-bold text-secondary hover:text-primary mb-8 inline-block">
              ← All services
            </Link>
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              <span className="h-px w-6 bg-accent/70" aria-hidden />
              Serving {market.name} remotely
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary md:text-6xl">
              {market.h1}
            </h1>
            <DirectAnswer title="What assistants should cite">
              {market.slug === "california" ? CITATION.california : CITATION.florida}
            </DirectAnswer>
            <div className="mt-6">
            {market.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-lg text-secondary leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/contact">
                <Button size="lg" className="font-bold">
                  Discuss a {market.abbreviation} project <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/hire">
                <Button variant="outline" size="lg" className="font-bold">
                  Freelance or full-time
                </Button>
              </Link>
            </div>
            <p className="text-sm text-secondary mt-6 max-w-2xl">{market.overlap}</p>
            <p className="text-sm text-secondary mt-2">
              Also serving{" "}
              <Link href={`/services/${otherState}`} className="text-accent font-medium hover:underline">
                {otherName}
              </Link>
              . Open to{" "}
              <Link href="/hire" className="text-accent font-medium hover:underline">
                freelance and full-time
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-4">
            What {market.name} teams actually search for
          </h2>
          <p className="text-secondary mb-8 max-w-3xl">
            Free keyword research mapped to these pages. Head terms are competitive nationwide; geo + service pages exist so California and Florida queries do not land on a generic engineering homepage.
          </p>
          <div className="overflow-x-auto border border-border-default rounded-xl bg-base">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default text-left">
                  <th className="p-4 font-semibold text-primary">Query</th>
                  <th className="p-4 font-semibold text-primary">Intent</th>
                  <th className="p-4 font-semibold text-primary">Page</th>
                </tr>
              </thead>
              <tbody>
                {market.searchIntents.map((row) => (
                  <tr key={row.query} className="border-b border-border-default last:border-0">
                    <td className="p-4 font-mono text-primary">{row.query}</td>
                    <td className="p-4 text-secondary">{row.intent}</td>
                    <td className="p-4">
                      <Link href={row.page} className="text-accent font-medium hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Custom AI services for {market.name}
          </h2>
          <p className="text-secondary mb-10 max-w-3xl">
            Every card is a unique {market.name} page, then a canonical national service page. That split is how we target “custom AI call agents {market.name}” without cannibalizing the catalog.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GEO_SERVICES.map((service) => (
              <ServiceCard
                key={service.slug}
                href={`/services/${market.slug}/${service.slug}`}
                title={service[market.slug].h1}
                description={service.summary}
                category={service.category}
                tags={service.secondaryKeywords.slice(0, 3)}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-4">
            {market.name} industries these systems are built for
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {market.industries.map((industry) => (
              <div key={industry.name} className="p-6 border border-border-default rounded-xl bg-base">
                <h3 className="text-xl font-bold text-primary mb-2">{industry.name}</h3>
                <p className="text-secondary leading-relaxed">{industry.angle}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Cities in {market.name}
          </h2>
          <p className="text-secondary mb-10 max-w-3xl">
            City pages are unique metros, not doorway spam. Each one names local industries and links the matching service pages.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/services/${market.slug}/${city.slug}`}
                className="flex items-start gap-3 p-5 border border-border-default rounded-xl bg-elevated hover:border-accent/50 transition-colors"
              >
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-primary">{city.name}</div>
                  <div className="text-sm text-secondary mt-1">{city.metro}</div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container className="max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-4">How remote delivery to {market.name} works</h2>
          <ul className="space-y-4 mb-10">
            {[
              "No fake US street address. Schema lists area served, not a invented storefront.",
              market.overlap,
              "You keep telephony numbers, cloud accounts, and customer data in your infrastructure.",
              "Build sequence: discovery → process map → architecture → agent + RAG + automations → evals → production monitoring.",
            ].map((item) => (
              <li key={item.slice(0, 24)} className="flex gap-3 text-secondary leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-3xl font-bold text-primary mb-6">Questions from {market.name} buyers</h2>
          <GeoFaqList faqs={market.faqs} />
        </Container>
      </Section>

      <Section className="py-24 bg-primary text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[color:var(--color-bg-base)]">
            Ready to build for {market.name}?
          </h2>
          <p className="text-[color:var(--color-bg-base)]/80 max-w-2xl mx-auto mb-8">
            Custom AI call agents, chatbots, RAG agents, and workflow automation—engineered, not packaged.
          </p>
            <Link href="/hire">
              <Button size="lg" className="font-bold bg-accent text-base hover:bg-accent/90">
                Hire freelance or full-time
              </Button>
            </Link>
        </Container>
      </Section>
    </>
  );
}
