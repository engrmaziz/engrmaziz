import type { Metadata } from "next";
import { GeoHubRoute } from "@/components/geo/GeoRoutes";
import { geoHubMetadata } from "@/lib/geo";

export const metadata: Metadata = geoHubMetadata("california");

export default function CaliforniaServicesPage() {
  return <GeoHubRoute state="california" />;
}
