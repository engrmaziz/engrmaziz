import type { Metadata } from "next";
import { siteMetadata } from "@/lib/seo";
import { CITIES } from "./cities";
import { MARKETS } from "./markets";
import { GEO_SERVICES } from "./services";
import type { GeoCity, GeoMarket, GeoServiceDef, StateSlug } from "./types";

export { CITIES } from "./cities";
export { MARKETS } from "./markets";
export { GEO_SERVICES } from "./services";
export type { GeoCity, GeoLocalCopy, GeoMarket, GeoServiceDef, StateSlug } from "./types";

export const STATE_SLUGS: StateSlug[] = ["california", "florida"];

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteMetadata.siteUrl}${normalized}`;
}

export function getMarket(slug: string): GeoMarket | undefined {
  if (slug === "california" || slug === "florida") {
    return MARKETS[slug];
  }
  return undefined;
}

export function getGeoService(slug: string): GeoServiceDef | undefined {
  return GEO_SERVICES.find((service) => service.slug === slug);
}

export function getCity(state: StateSlug, slug: string): GeoCity | undefined {
  return CITIES.find((city) => city.state === state && city.slug === slug);
}

export function getCitiesForState(state: StateSlug): GeoCity[] {
  return CITIES.filter((city) => city.state === state);
}

export function getStateLocationParams() {
  return STATE_SLUGS.map((state) => ({ state }));
}

export function getChildParams(state: StateSlug) {
  const services = GEO_SERVICES.map((service) => ({ slug: service.slug }));
  const cities = getCitiesForState(state).map((city) => ({ slug: city.slug }));
  return [...services, ...cities];
}

export function getAllGeoPaths() {
  const hubs = STATE_SLUGS.map((state) => `/services/${state}`);
  const children = STATE_SLUGS.flatMap((state) =>
    getChildParams(state).map((child) => `/services/${state}/${child.slug}`)
  );
  return [...hubs, ...children];
}

export function localCopy(service: GeoServiceDef, state: StateSlug) {
  return service[state];
}

export function relatedServices(currentSlug: string, limit = 4): GeoServiceDef[] {
  return GEO_SERVICES.filter((service) => service.slug !== currentSlug).slice(0, limit);
}

export function generateProfessionalServiceGraph(options: {
  path: string;
  name: string;
  description: string;
  areaName: string;
  cityName?: string;
}) {
  const pageUrl = absoluteUrl(options.path);
  const areaServed = options.cityName
    ? [
        { "@type": "State", name: options.areaName },
        { "@type": "City", name: options.cityName },
      ]
    : { "@type": "State", name: options.areaName };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: options.name,
        description: options.description,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
        isPartOf: { "@id": `${siteMetadata.siteUrl}/#website` },
        about: { "@id": `${pageUrl}#service` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${pageUrl}#service`,
        name: options.name,
        description: options.description,
        url: pageUrl,
        provider: { "@id": `${siteMetadata.siteUrl}/#person` },
        areaServed,
        availableChannel: {
          "@type": "ServiceChannel",
          serviceType: "https://schema.org/OnlineOnly",
          serviceUrl: absoluteUrl("/contact"),
        },
        serviceType: options.name,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: breadcrumbItems(options.path),
      },
    ],
  };
}

function breadcrumbItems(path: string) {
  const parts = path.split("/").filter(Boolean);
  const items: { "@type": "ListItem"; position: number; name: string; item: string }[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteMetadata.siteUrl}/` },
  ];
  let current = "";
  parts.forEach((part, index) => {
    current += `/${part}`;
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: labelForSlug(part),
      item: absoluteUrl(current),
    });
  });
  return items;
}

export function geoHubMetadata(state: StateSlug): Metadata {
  const market = MARKETS[state];
  const path = `/services/${state}`;
  return {
    title: market.metaTitle,
    description: market.metaDescription,
    keywords: [
      `custom AI call agents ${market.name}`,
      `custom AI chatbots ${market.name}`,
      `RAG agents ${market.name}`,
      `workflow automation ${market.name}`,
      `AI voice agents ${market.name}`,
      market.name,
    ],
    alternates: { canonical: path },
    openGraph: {
      title: market.metaTitle,
      description: market.metaDescription,
      url: absoluteUrl(path),
      type: "website",
    },
  };
}

export function geoChildMetadata(state: StateSlug, slug: string): Metadata {
  const service = getGeoService(slug);
  if (service) {
    const copy = service[state];
    const path = `/services/${state}/${slug}`;
    return {
      title: copy.metaTitle,
      description: copy.metaDescription,
      keywords: [service.primaryKeyword, ...service.secondaryKeywords, MARKETS[state].name],
      alternates: { canonical: path },
      openGraph: {
        title: copy.metaTitle,
        description: copy.metaDescription,
        url: absoluteUrl(path),
        type: "website",
      },
    };
  }

  const city = getCity(state, slug);
  if (city) {
    const path = `/services/${state}/${slug}`;
    return {
      title: city.metaTitle,
      description: city.metaDescription,
      keywords: [
        `custom AI call agents ${city.name}`,
        `custom AI chatbots ${city.name}`,
        `RAG agents ${city.name}`,
        `workflow automation ${city.name}`,
        city.name,
        MARKETS[state].name,
      ],
      alternates: { canonical: path },
      openGraph: {
        title: city.metaTitle,
        description: city.metaDescription,
        url: absoluteUrl(path),
        type: "website",
      },
    };
  }

  return { title: "Not found" };
}

function labelForSlug(slug: string): string {
  const market = getMarket(slug);
  if (market) return market.name;
  const service = getGeoService(slug);
  if (service) return service.shortName;
  const city = CITIES.find((entry) => entry.slug === slug);
  if (city) return city.name;
  if (slug === "services") return "Services";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
