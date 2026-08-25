import type { Metadata } from "next";
import { GeoChildRoute } from "@/components/geo/GeoRoutes";
import { geoChildMetadata, getChildParams } from "@/lib/geo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getChildParams("florida");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return geoChildMetadata("florida", params.slug);
}

export default function FloridaChildPage({ params }: { params: { slug: string } }) {
  return <GeoChildRoute state="florida" slug={params.slug} />;
}
