import type { Metadata } from "next";
import { GeoChildRoute } from "@/components/geo/GeoRoutes";
import { geoChildMetadata, getChildParams } from "@/lib/geo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getChildParams("california");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return geoChildMetadata("california", params.slug);
}

export default function CaliforniaChildPage({ params }: { params: { slug: string } }) {
  return <GeoChildRoute state="california" slug={params.slug} />;
}
