import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/service/ServiceCard";
import { GeoFaqList } from "@/components/geo/GeoFaqList";
import { GEO_SERVICES, type GeoCity, type GeoMarket } from "@/lib/geo";

export function CityPage({ market, city }: { market: GeoMarket; city: GeoCity }) {
  return (
    <>
      <Section className="pt-32 pb-16 bg-base border-b border-border-default">
        <Container>
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 text-sm mb-8">
              <Link href={`/services/${market.slug}`} className="font-bold text-secondary hover:text-primary">
                ← {market.name} services
              </Link>
            </div>
            <Badge variant="outline" className="mb-4">
              {city.metro}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
              {city.h1}
            </h1>
            {city.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-lg text-secondary leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
            <Link href="/contact">
              <Button size="lg" className="font-bold mt-4">
                Talk about a {city.name} build <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-6">
            {city.name} industries
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {city.industries.map((industry) => (
              <li key={industry} className="flex gap-3 text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                {industry}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section className="py-16 bg-base border-b border-border-default">
        <Container>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Highest-intent services in {city.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {city.demand.map((item) => {
              const service = GEO_SERVICES.find((entry) => entry.slug === item.serviceSlug);
              if (!service) return null;
              return (
                <div key={item.serviceSlug} className="p-6 border border-border-default rounded-xl bg-elevated">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    <Link href={`/services/${market.slug}/${service.slug}`} className="hover:text-accent">
                      {service.shortName}
                    </Link>
                  </h3>
                  <p className="text-secondary leading-relaxed">{item.why}</p>
                </div>
              );
            })}
          </div>
          <h2 className="text-3xl font-bold text-primary mb-8">Full {city.name} catalog</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GEO_SERVICES.map((service) => (
              <ServiceCard
                key={service.slug}
                href={`/services/${market.slug}/${service.slug}`}
                title={service.shortName}
                description={`${service.primaryKeyword} for ${city.name}, ${market.name}. ${service.summary}`}
                category={service.category}
                tags={[city.name, market.abbreviation]}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16 bg-elevated border-b border-border-default">
        <Container className="max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-6">{city.name} FAQ</h2>
          <GeoFaqList faqs={city.faqs} />
          <p className="text-sm text-secondary mt-8">{market.overlap}</p>
        </Container>
      </Section>

      <Section className="py-24 bg-primary text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[color:var(--color-bg-base)]">
            Custom AI systems for {city.name}
          </h2>
          <Link href="/contact">
            <Button size="lg" className="font-bold bg-accent text-base hover:bg-accent/90">
              Contact
            </Button>
          </Link>
        </Container>
      </Section>
    </>
  );
}
