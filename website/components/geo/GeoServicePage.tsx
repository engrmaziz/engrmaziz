import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GeoFaqList } from "@/components/geo/GeoFaqList";
import {
  getCitiesForState,
  localCopy,
  relatedServices,
  type GeoMarket,
  type GeoServiceDef,
} from "@/lib/geo";

export function GeoServicePage({
  market,
  service,
}: {
  market: GeoMarket;
  service: GeoServiceDef;
}) {
  const copy = localCopy(service, market.slug);
  const cities = getCitiesForState(market.slug);
  const related = relatedServices(service.slug, 4);

  return (
    <>
      <Section className="pt-32 pb-16 bg-base border-b border-border-default">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 text-sm mb-8">
              <Link href="/services" className="font-bold text-secondary hover:text-primary">
                Services
              </Link>
              <span className="text-secondary">/</span>
              <Link href={`/services/${market.slug}`} className="font-bold text-secondary hover:text-primary">
                {market.name}
              </Link>
            </div>
            <Badge variant="outline" className="mb-4">
              {service.category} · {market.abbreviation}
            </Badge>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary md:text-6xl">
              {copy.h1}
            </h1>
            {copy.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-lg text-secondary leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-8">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-bold" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start a {market.abbreviation} build
                </Button>
              </Link>
              <Link href={service.canonicalPath} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold">
                  {service.shortName} overview
                </Button>
              </Link>
            </div>
            <p className="text-sm text-secondary mt-6">{copy.deliveryNote}</p>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              Why {market.name} teams look for {service.primaryKeyword}
            </h2>
            <ul className="space-y-4">
              {copy.problems.map((problem) => (
                <li key={problem} className="flex gap-3 text-secondary leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">What ships</h2>
            <p className="text-secondary leading-relaxed mb-4">{service.summary}</p>
            <p className="text-secondary leading-relaxed">
              Primary keyword: <span className="text-primary font-medium">{service.primaryKeyword}</span>.
              Also targeted: {service.secondaryKeywords.join(", ")}.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-8">
            {market.name} use cases
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {copy.useCases.map((useCase) => (
              <div key={useCase.title} className="p-6 border border-border-default rounded-xl bg-elevated">
                <h3 className="text-xl font-bold text-primary mb-2">{useCase.title}</h3>
                <p className="text-secondary leading-relaxed">{useCase.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-4">
            {service.shortName} by {market.name} metro
          </h2>
          <div className="flex flex-wrap gap-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/services/${market.slug}/${city.slug}`}
                className="px-4 py-2 rounded-full border border-border-default bg-base text-sm font-medium text-primary hover:border-accent/50"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-base border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-8">Related {market.name} services</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${market.slug}/${item.slug}`}
                className="p-5 border border-border-default rounded-xl hover:border-accent/50 transition-colors"
              >
                <div className="text-xs font-mono text-accent mb-2">{item.category}</div>
                <div className="font-bold text-primary">{item[market.slug].h1}</div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container className="max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-6">
            {service.primaryKeyword} in {market.name} — FAQ
          </h2>
          <GeoFaqList faqs={copy.faqs} />
        </Container>
      </Section>

      <Section className="py-24 bg-primary text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[color:var(--color-bg-base)]">
            Build {service.primaryKeyword} for {market.name}
          </h2>
            <Link href="/hire">
              <Button size="lg" className="font-bold bg-accent text-base hover:bg-accent/90">
                Hire Musharraf
              </Button>
            </Link>
        </Container>
      </Section>
    </>
  );
}
