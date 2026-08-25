export type StateSlug = "california" | "florida";

export type GeoFaq = {
  q: string;
  a: string;
};

export type GeoUseCase = {
  title: string;
  body: string;
};

export type GeoLocalCopy = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  problems: string[];
  useCases: GeoUseCase[];
  deliveryNote: string;
  faqs: GeoFaq[];
};

export type GeoServiceDef = {
  slug: string;
  canonicalPath: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  shortName: string;
  summary: string;
  california: GeoLocalCopy;
  florida: GeoLocalCopy;
};

export type GeoCity = {
  slug: string;
  name: string;
  state: StateSlug;
  metro: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  industries: string[];
  demand: { serviceSlug: string; why: string }[];
  faqs: GeoFaq[];
};

export type GeoMarket = {
  slug: StateSlug;
  name: string;
  abbreviation: "CA" | "FL";
  timezone: string;
  overlap: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  industries: { name: string; angle: string }[];
  cities: string[];
  searchIntents: { query: string; intent: string; page: string }[];
  faqs: GeoFaq[];
};
