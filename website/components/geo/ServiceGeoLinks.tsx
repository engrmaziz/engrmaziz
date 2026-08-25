import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { GEO_SERVICES } from "@/lib/geo";

export function ServiceGeoLinks({
  canonicalPath,
  title,
}: {
  canonicalPath: string;
  title: string;
}) {
  const match = GEO_SERVICES.find((service) => service.canonicalPath === canonicalPath);
  if (!match) return null;

  return (
    <Section className="py-16 bg-elevated border-t border-border-default">
      <Container>
        <h2 className="text-2xl font-bold text-primary mb-3">
          {title} in California and Florida
        </h2>
        <p className="text-secondary mb-6 max-w-3xl">
          Unique location pages for the same service. Use these when you are hiring for a California or Florida operation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/services/california/${match.slug}`}
            className="px-4 py-2 rounded-full border border-border-default bg-base text-sm font-bold text-primary hover:border-accent/50"
          >
            {match.shortName} in California
          </Link>
          <Link
            href={`/services/florida/${match.slug}`}
            className="px-4 py-2 rounded-full border border-border-default bg-base text-sm font-bold text-primary hover:border-accent/50"
          >
            {match.shortName} in Florida
          </Link>
        </div>
      </Container>
    </Section>
  );
}
