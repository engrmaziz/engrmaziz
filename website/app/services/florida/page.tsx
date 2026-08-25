import type { Metadata } from "next";
import { GeoHubRoute } from "@/components/geo/GeoRoutes";
import { geoHubMetadata } from "@/lib/geo";

export const metadata: Metadata = geoHubMetadata("florida");

export default function FloridaServicesPage() {
  return <GeoHubRoute state="florida" />;
}
