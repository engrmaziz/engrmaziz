import { notFound } from "next/navigation";
import { CityPage } from "@/components/geo/CityPage";
import { GeoServicePage } from "@/components/geo/GeoServicePage";
import { LocationHub } from "@/components/geo/LocationHub";
import {
  generateProfessionalServiceGraph,
  getCity,
  getGeoService,
  getMarket,
  localCopy,
  type StateSlug,
} from "@/lib/geo";

export function GeoHubRoute({ state }: { state: StateSlug }) {
  const market = getMarket(state);
  if (!market) notFound();

  const jsonLd = generateProfessionalServiceGraph({
    path: `/services/${state}`,
    name: market.h1,
    description: market.metaDescription,
    areaName: market.name,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocationHub market={market} />
    </>
  );
}

export function GeoChildRoute({ state, slug }: { state: StateSlug; slug: string }) {
  const market = getMarket(state);
  if (!market) notFound();

  const service = getGeoService(slug);
  if (service) {
    const copy = localCopy(service, state);
    const jsonLd = generateProfessionalServiceGraph({
      path: `/services/${state}/${slug}`,
      name: copy.h1,
      description: copy.metaDescription,
      areaName: market.name,
    });
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <GeoServicePage market={market} service={service} />
      </>
    );
  }

  const city = getCity(state, slug);
  if (city) {
    const jsonLd = generateProfessionalServiceGraph({
      path: `/services/${state}/${slug}`,
      name: city.h1,
      description: city.metaDescription,
      areaName: market.name,
      cityName: city.name,
    });
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <CityPage market={market} city={city} />
      </>
    );
  }

  notFound();
}
